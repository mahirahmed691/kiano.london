export const ledgerNav: ReadonlyArray<{
  label: string
  to: string
  line: string
  end?: boolean
}> = [
  { label: 'Board', to: '/admin', line: 'The count, in one place.', end: true },
  { label: 'Figures', to: '/admin/figures', line: 'The till: months, the weeks, the line.' },
  { label: 'Cuts', to: '/admin/cuts', line: 'Remaining on the line, and the book of movements. Print the line.' },
  { label: 'Prices', to: '/admin/prices', line: 'The line in sterling, VAT already in. Print the catalogue.' },
  { label: 'Accounts', to: '/admin/accounts', line: 'The journal for the accountant. Print the book.' },
  { label: 'Invoices', to: '/admin/invoices', line: 'A numbered record of each cut reserved. Print one, or the book.' },
  { label: 'The work', to: '/admin/work', line: 'Reserved, held for cloth, on the table, packed, left the house. Print the card, the table, or the box.' },
  { label: 'Members', to: '/admin/members', line: 'Those who keep an account. Print the names.' },
  { label: 'The list', to: '/admin/list', line: 'Confirmed, and those still held. Print the list.' },
  { label: 'The field', to: '/admin/field', line: 'Other houses of the column, with their marks.' },
  { label: 'The diary', to: '/admin/diary', line: 'Letters held. New, open, and closed. Print the open letters.' },
  { label: 'The line', to: '/admin/line', line: 'What is finished, what is wired, what is next.' },
] as const
