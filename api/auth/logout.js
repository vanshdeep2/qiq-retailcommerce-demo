// Ends this demo's session and the hub's, so the next visit asks for Google sign-in again.
import { HUB_URL, clearedCookie, requestOrigin } from '../../sso/session.js'

export default function handler(req, res) {
  res.setHeader('Set-Cookie', clearedCookie())
  res.setHeader('Cache-Control', 'no-store')
  return res.redirect(302, `${HUB_URL}/api/logout?return=${encodeURIComponent(`${requestOrigin(req)}/`)}`)
}
