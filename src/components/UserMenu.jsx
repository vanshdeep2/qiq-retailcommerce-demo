import { useEffect, useState } from 'react'
import '../styles/usermenu.css'

/** Signed-in user + sign-out. Renders nothing when SSO isn't active (e.g. `npm run dev`). */
export default function UserMenu() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'same-origin' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setUser(data?.user ?? null))
      .catch(() => {})
  }, [])

  if (!user) return null
  return (
    <a className="nav-signout" href="/api/auth/logout" title={user.email}>
      Sign out
    </a>
  )
}
