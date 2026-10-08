import { readCookie, verifySession } from '../../sso/session.js'

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  const session = await verifySession(readCookie(req.headers.cookie))
  if (!session) return res.status(401).json({ error: 'Not signed in' })
  return res.status(200).json({ user: { email: session.email, name: session.name, picture: session.picture } })
}
