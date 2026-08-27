const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@bugzilla.local' },
    update: {},
    create: {
      email: 'admin@bugzilla.local',
      name: 'Admin User',
      passwordHash,
      role: 'admin'
    }
  })

  const dev = await prisma.user.upsert({
    where: { email: 'dev@bugzilla.local' },
    update: {},
    create: {
      email: 'dev@bugzilla.local',
      name: 'Developer User',
      passwordHash,
      role: 'developer'
    }
  })

  const project = await prisma.project.upsert({
    where: { key: 'CORE' },
    update: {},
    create: {
      name: 'Core Platform',
      key: 'CORE',
      description: 'The core Bugzilla reinterpretation platform',
      workflows: {
        create: [
          { name: 'NEW', isInitial: true, allowedTransitions: JSON.stringify(['ASSIGNED', 'RESOLVED', 'CLOSED']) },
          { name: 'ASSIGNED', allowedTransitions: JSON.stringify(['RESOLVED', 'CLOSED']) },
          { name: 'RESOLVED', allowedTransitions: JSON.stringify(['VERIFIED', 'CLOSED', 'REOPENED']) },
          { name: 'VERIFIED', allowedTransitions: JSON.stringify(['CLOSED']) },
          { name: 'CLOSED', isTerminal: true, allowedTransitions: JSON.stringify(['REOPENED']) },
          { name: 'REOPENED', allowedTransitions: JSON.stringify(['ASSIGNED', 'RESOLVED', 'CLOSED']) }
        ]
      }
    }
  })

  // Phase 7: Create Taxonomy
  const component = await prisma.component.upsert({
    where: { projectId_name: { projectId: project.id, name: 'Frontend' } },
    update: {},
    create: { projectId: project.id, name: 'Frontend', description: 'UI and React components' }
  })

  await prisma.component.upsert({
    where: { projectId_name: { projectId: project.id, name: 'Backend' } },
    update: {},
    create: { projectId: project.id, name: 'Backend', description: 'API and Database' }
  })

  const version = await prisma.version.upsert({
    where: { projectId_name: { projectId: project.id, name: 'v1.0' } },
    update: {},
    create: { projectId: project.id, name: 'v1.0' }
  })

  const milestone = await prisma.milestone.upsert({
    where: { projectId_name: { projectId: project.id, name: 'Beta Release' } },
    update: {},
    create: { projectId: project.id, name: 'Beta Release', dueDate: new Date('2026-12-31') }
  })

  await prisma.issue.upsert({
    where: { issueKey: 'CORE-1' },
    update: {},
    create: {
      issueKey: 'CORE-1',
      title: 'Initialize Next.js project with Tailwind',
      description: 'We need to set up the foundation of the project.',
      status: 'CLOSED',
      severity: 'normal',
      priority: 'high',
      reporterId: admin.id,
      assigneeId: dev.id,
      projectId: project.id,
      componentId: component.id,
      versionId: version.id,
      milestoneId: milestone.id
    }
  })

  await prisma.issue.upsert({
    where: { issueKey: 'CORE-2' },
    update: {},
    create: {
      issueKey: 'CORE-2',
      title: 'Build Issue detail view',
      description: 'The issue detail view should include a rich Markdown description and comments.',
      status: 'NEW',
      severity: 'major',
      priority: 'critical',
      reporterId: dev.id,
      projectId: project.id,
      componentId: component.id
    }
  })

  console.log('Database seeded!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
