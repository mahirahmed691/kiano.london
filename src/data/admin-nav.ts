export const ledgerNav: ReadonlyArray<{
  label: string
  to: string
  line: string
  end?: boolean
}> = [
  { label: 'Board', to: '/admin', line: 'The count, in one place.', end: true },
  { label: 'Cuts', to: '/admin/cuts', line: 'Remaining on the line, and the book of movements.' },
  { label: 'Prices', to: '/admin/prices', line: 'The line in sterling, VAT already in.' },
  { label: 'Accounts', to: '/admin/accounts', line: 'The journal for the accountant.' },
  { label: 'Invoices', to: '/admin/invoices', line: 'A numbered record of each cut reserved.' },
  { label: 'Members', to: '/admin/members', line: 'Those who keep an account.' },
  { label: 'The list', to: '/admin/list', line: 'Confirmed, and those still held.' },
  { label: 'The field', to: '/admin/field', line: 'Other houses of the column, with their marks.' },
  { label: 'The diary', to: '/admin/diary', line: 'Letters held. Not a booking calendar.' },
  { label: 'The line', to: '/admin/line', line: 'What is finished, what is wired, what is next.' },
] as const
