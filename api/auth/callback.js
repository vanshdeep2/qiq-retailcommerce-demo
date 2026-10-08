// GET ?token=<handoff>. The login hub sends signed-in visitors here; we swap the
// 60s handoff token for this demo's own session cookie and continue to the page they wanted.
import { hubAuthorizeUrl, requestOrigin, sessionCookie, signSession, verifyHandoff } from '../../sso/session.js'

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  const origin = requestOrigin(req)
  const handoff = await verifyHandoff(req.query.token, origin)
  if (!handoff) return res.redirect(302, hubAuthorizeUrl(`${origin}/`))

  // `next` comes from the signed token; only follow same-site paths.
  const next = typeof handoff.next === 'string' && handoff.next.startsWith('/') && !handoff.next.startsWith('//')
    ? handoff.next
    : '/'
  res.setHeader('Set-Cookie', sessionCookie(await signSession(handoff)))
  return res.redirect(302, next)
}
