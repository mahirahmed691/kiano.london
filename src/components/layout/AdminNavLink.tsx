import { useUser } from '@clerk/react'
import { NavLink } from 'react-router-dom'
import { isAdminUser } from '@/lib/admin'
import { clerkEnabled } from '@/lib/clerk'
import { cn } from '@/lib/cn'

type Props = {
  className?: string
  onClick?: () => void
}

function AdminNavLinkInner({ className, onClick }: Props) {
  const { user, isSignedIn } = useUser()
  if (!isSignedIn) return null
  if (!isAdminUser(user)) return null

  return (
    <NavLink
      to="/admin"
      onClick={onClick}
      className={({ isActive }) => cn(className, isActive ? 'opacity-100' : undefined)}
    >
      The ledger
    </NavLink>
  )
}

export function AdminNavLink(props: Props) {
  if (!clerkEnabled) return null
  return <AdminNavLinkInner {...props} />
}
