import { NavLink } from 'react-router-dom'
import { ledgerNav } from '@/data/admin-nav'
import { cn } from '@/lib/cn'

export function AdminSubnav() {
  return (
    <nav
      className="sticky top-[var(--header-offset)] z-30 -mx-6 mt-10 overflow-x-auto border-y border-rule bg-ivory px-6 print:hidden md:mx-0 md:px-0"
      aria-label="The ledger"
    >
      <ul className="flex min-w-max gap-7 py-4 md:flex-wrap md:min-w-0 md:gap-8">
        {ledgerNav.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end={item.end ?? false}
              className={({ isActive }) =>
                cn(
                  'relative text-[11px] uppercase tracking-[0.22em] transition-opacity',
                  isActive
                    ? 'text-ink after:absolute after:-bottom-4 after:left-0 after:h-px after:w-full after:bg-ink'
                    : 'text-stone hover:opacity-70',
                )
              }
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
