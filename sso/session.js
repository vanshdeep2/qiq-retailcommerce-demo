// QiQ demo SSO, demo side. Sign-in itself happens at the shared login hub
// (QIQ Demo Login → https://qiq-demo-login.vercel.app); this demo only checks its own
// session cookie and accepts the hub's short-lived handoff token.
// Uses only `jose` so it runs in both the Edge (middleware) and Node (functions) runtimes.
import { SignJWT, jwtVerify } from 'jose'

export const HUB_URL = process.env.SSO_HUB_URL || 'https://qiq-demo-login.vercel.app'
export const COOKIE_NAME = 'qiq_demo_session'
export const SESSION_HOURS = Number(process.env.SSO_SESSION_HOURS || 24)

function secretKey() {
  const secret = process.env.SSO_JWT_SECRET
  if (!secret) throw new Error('SSO_JWT_SECRET is not set')
  return new TextEncoder().encode(secret)
}

export async function signSession(user) {
  return new SignJWT({ email: user.email, name: user.name ?? null, picture: user.picture ?? null, typ: 'demo' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_HOURS}h`)
    .sign(secretKey())
}

export async function verifySession(token) {
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, secretKey(), { algorithms: ['HS256'] })
    return payload.typ === 'demo' ? payload : null
  } catch {
    return null
  }
}

/** The hub's 60s token, only valid for this demo's origin. */
export async function verifyHandoff(token, origin) {
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, secretKey(), { algorithms: ['HS256'], audience: origin })
    return payload.typ === 'handoff' ? payload : null
  } catch {
    return null
  }
}

/** Where to send a signed-out visitor so the hub can sign them in and bring them back. */
export function hubAuthorizeUrl(returnUrl) {
  return `${HUB_URL}/api/authorize?return=${encodeURIComponent(returnUrl)}`
}

export function readCookie(cookieHeader, name = COOKIE_NAME) {
  if (!cookieHeader) return null
  for (const part of cookieHeader.split(';')) {
    const [k, ...v] = part.trim().split('=')
    if (k === name) return decodeURIComponent(v.join('='))
  }
  return null
}

export function sessionCookie(token) {
  return `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${SESSION_HOURS * 3600}`
}

export function clearedCookie() {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`
}

/** This request's public origin, e.g. https://apex-qiq-demo.vercel.app */
export function requestOrigin(req) {
  const host = req.headers['x-forwarded-host'] || req.headers.host
  const proto = req.headers['x-forwarded-proto'] || 'https'
  return `${proto}://${host}`
}
