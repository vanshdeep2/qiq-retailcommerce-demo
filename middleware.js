// Vercel Routing Middleware: every page, bundle and data file requires a valid
// session cookie. Signed-out page visits go to the shared QiQ login hub; other
// requests get a 401. Only /api/auth/* (callback, me, logout) is public.
import { next } from '@vercel/functions'
import { hubAuthorizeUrl, readCookie, verifySession } from './sso/session.js'

export const config = {
  matcher: ['/((?!api/auth/|favicon.svg).*)'],
}

export default async function middleware(request) {
  const session = await verifySession(readCookie(request.headers.get('cookie')))
  if (session) return next()

  const accept = request.headers.get('accept') || ''
  if (request.method === 'GET' && accept.includes('text/html')) {
    return Response.redirect(hubAuthorizeUrl(request.url), 302)
  }
  return new Response('Unauthorized', { status: 401 })
}
