import crypto from "crypto"

const GITHUB_API = "https://api.github.com"

export class GithubApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

async function githubFetch(path: string, token: string, init: RequestInit = {}) {
  const res = await fetch(`${GITHUB_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
  })

  if (!res.ok) {
    const body = await res.text().catch(() => "")
    throw new GithubApiError(`GitHub API ${path} failed: ${res.status} ${body}`, res.status)
  }

  if (res.status === 204) return null
  return res.json()
}

export function getWebhookUrl() {
  const base = process.env.NEXTAUTH_URL || process.env.APP_URL
  if (!base) {
    throw new Error("NEXTAUTH_URL or APP_URL must be set to register GitHub webhooks")
  }
  return `${base.replace(/\/$/, "")}/api/webhooks/github`
}

export async function getRepo(token: string, owner: string, repo: string) {
  return githubFetch(`/repos/${owner}/${repo}`, token)
}

export async function getAuthenticatedGithubUser(token: string) {
  return githubFetch(`/user`, token)
}

export async function createWebhook(token: string, owner: string, repo: string, secret: string) {
  return githubFetch(`/repos/${owner}/${repo}/hooks`, token, {
    method: "POST",
    body: JSON.stringify({
      name: "web",
      active: true,
      events: ["issues", "issue_comment"],
      config: {
        url: getWebhookUrl(),
        content_type: "json",
        secret,
      },
    }),
  })
}

export async function deleteWebhook(token: string, owner: string, repo: string, hookId: string) {
  try {
    await githubFetch(`/repos/${owner}/${repo}/hooks/${hookId}`, token, { method: "DELETE" })
  } catch (err) {
    if (err instanceof GithubApiError && (err.status === 404 || err.status === 403)) return
    throw err
  }
}

export async function createGithubIssue(token: string, owner: string, repo: string, title: string, body: string) {
  return githubFetch(`/repos/${owner}/${repo}/issues`, token, {
    method: "POST",
    body: JSON.stringify({ title, body }),
  })
}

export async function createGithubIssueComment(token: string, owner: string, repo: string, issueNumber: number, body: string) {
  return githubFetch(`/repos/${owner}/${repo}/issues/${issueNumber}/comments`, token, {
    method: "POST",
    body: JSON.stringify({ body }),
  })
}

export async function setGithubIssueState(token: string, owner: string, repo: string, issueNumber: number, state: "open" | "closed") {
  return githubFetch(`/repos/${owner}/${repo}/issues/${issueNumber}`, token, {
    method: "PATCH",
    body: JSON.stringify({ state }),
  })
}

export function verifyWebhookSignature(payload: string, signatureHeader: string | null, secret: string) {
  if (!signatureHeader) return false
  const expected = "sha256=" + crypto.createHmac("sha256", secret).update(payload).digest("hex")
  const a = Buffer.from(expected)
  const b = Buffer.from(signatureHeader)
  if (a.length !== b.length) return false
  return crypto.timingSafeEqual(a, b)
}
