export type FeatureStatus = 'complete' | 'partial' | 'missing'

export type HouseFeature = {
  name: string
  completion: number
  status: FeatureStatus
  note: string
}

export const houseFeatures: HouseFeature[] = [
  {
    name: 'Editorial rooms',
    completion: 94,
    status: 'complete',
    note: 'Home, shop, collection, story, craft, visit. Quiet entrance: still first. The cookie strip waits until the plate has been seen.',
  },
  {
    name: 'The line',
    completion: 90,
    status: 'complete',
    note: 'Five thobes, jubbah in three colours, sizes 52–60, colour swatches, size guide.',
  },
  {
    name: 'Bag and checkout',
    completion: 88,
    status: 'complete',
    note: 'Drawer, quick add, Stripe Checkout, return to a reservation page. Stripe is the till.',
  },
  {
    name: 'Stock',
    completion: 90,
    status: 'complete',
    note: 'Neon inventory per size, with a movement book for sale, restock, and adjust. Allowlisted members set remaining cuts. The public inventory route is read-only.',
  },
  {
    name: 'Members',
    completion: 92,
    status: 'complete',
    note: 'Clerk sign-in, account of reservations, token on checkout. Svix webhook keeps members in step. The ledger lists those who keep an account.',
  },
  {
    name: 'The list',
    completion: 80,
    status: 'partial',
    note: 'Subscribe and confirm via Resend. The ledger reads confirmed and held. Domain must be verified for letters to leave.',
  },
  {
    name: 'Visit',
    completion: 90,
    status: 'partial',
    note: 'The form still opens a letter. A copy is held in Neon, and a confirmation is sent: held, not booked. Shown on the ledger. No calendar widget.',
  },
  {
    name: 'Installable house',
    completion: 78,
    status: 'partial',
    note: 'PWA on the site. Expo is a WebView of the live origin. Header and notices respect the safe area; pinch-zoom on the piece stays. Word from the house can push once a native build holds the token.',
  },
  {
    name: 'Share and search',
    completion: 82,
    status: 'complete',
    note: 'Open Graph, canonical URLs, share bots get a document. No on-site search.',
  },
  {
    name: 'Cloth at touching distance',
    completion: 65,
    status: 'partial',
    note: 'Pinch-zoom on the piece page. Packing is still copy. No photographs of the box or bag.',
  },
  {
    name: 'House film',
    completion: 0,
    status: 'missing',
    note: 'Unwired. Stills only until a real walk exists. Do not restore Ken Burns plates.',
  },
  {
    name: 'House ledger',
    completion: 94,
    status: 'complete',
    note: 'The board is an index. Cuts, prices, VAT, accounts, invoices, members, the list, diary, the field, and the line sit on their own pages. Sizes at none are named. Rooms stay under the header while you work. Expo can open kiano://admin. Refunds stay in Stripe.',
  },
  {
    name: 'Word from the house',
    completion: 88,
    status: 'complete',
    note: 'Members and the ledger share one inbox. A reserved cut, a visit letter, a confirmed name, a size at none or back on the line, and a new account. Expo can push the same word to a signed-in device.',
  },
  {
    name: 'Analytics',
    completion: 10,
    status: 'missing',
    note: 'No PostHog, GA, or funnel. The ledger is the only house-side count.',
  },
  {
    name: 'Returns and refunds',
    completion: 0,
    status: 'missing',
    note: 'Stripe Dashboard only. No house copy or flow.',
  },
]

export const houseIntegrations = [
  {
    name: 'Stripe Checkout',
    state: 'Live',
    hook: 'POST /api/stripe-webhook',
    events: 'checkout.session.completed, checkout.session.async_payment_succeeded',
    note: 'Verifies the Stripe signature. Writes the order, takes stock, links a member if the session carried one.',
  },
  {
    name: 'Clerk',
    state: 'Live',
    hook: 'POST /api/clerk-webhook',
    events: 'user.created, user.updated, user.deleted',
    note: 'verifyWebhook from @clerk/backend/webhooks. Needs CLERK_WEBHOOK_SIGNING_SECRET. Deleted accounts leave the members table; paid orders stay, unlinked.',
  },
  {
    name: 'Neon Postgres',
    state: 'Live',
    hook: 'None',
    events:
      'inventory, stock_movements, invoices, invoice_lines, members, orders, order_lines, subscribers, webhook_events, appointments, competitor_notes, notices, notice_reads, push_tokens',
    note: 'Schema is created on first use. Remaining cuts, movements, and invoices are written from the ledger and from paid Stripe sessions.',
  },
  {
    name: 'Resend',
    state: 'Wired',
    hook: 'None',
    events: 'List confirm letters, visit confirmation (held, not booked)',
    note: 'From address must be a verified domain. Until then the list holds unconfirmed rows.',
  },
  {
    name: 'Expo push',
    state: 'Wired',
    hook: 'POST /api/notices',
    events: 'A signed-in device keeps an Expo token. Word is sent through exp.host when a notice is written.',
    note: 'Needs a native build, not Expo Go on Android. iOS asks on the next EAS archive. Android also needs FCM in EAS credentials.',
  },
  {
    name: 'Vercel',
    state: 'Live',
    hook: 'None',
    events: 'SPA rewrites, api/ functions',
    note: 'Unknown routes rewrite to index.html. api/ stays on Functions.',
  },
] as const

export const houseDataNotes = [
  {
    title: 'What is counted',
    copy: 'Paid reservations, remaining cuts, movements, VAT-inclusive prices, invoices, members, the list, appointment letters, word from the house. Currency is GBP pence. VAT is round(gross × 20/120). Sizes at none are named on the board.',
  },
  {
    title: 'What is not counted',
    copy: 'Sessions, bounce, cart abandonment, or refunds. London is the name of the house.',
  },
  {
    title: 'How it is read',
    copy: 'The board fetches /api/admin with a Clerk bearer token. Unsigned or unlisted emails see nothing of the ledger. Writes require requireAdmin. A customer invoice opens only with a Stripe session id.',
  },
] as const

export const houseCompetitors = [
  {
    name: 'Bait Al Kandora',
    where: 'UAE retail, ships widely',
    stance: 'Flagship kandora house: shops, customisation, accessories. Volume and brand experience.',
    vs: 'Kiano is a short line, one silhouette language, no shop window.',
  },
  {
    name: 'Dar Al Ahad',
    where: 'GCC e-commerce',
    stance: 'Many regional cuts (Emirati, Saudi, Qatari) as a catalogue.',
    vs: 'Kiano keeps five thobes and a jubbah. Fewer SKUs, more still.',
  },
  {
    name: 'Al Nashama',
    where: 'UAE',
    stance: 'Made-to-measure kandura and linen casuals. Gold editions, WhatsApp tailor.',
    vs: 'Kiano is ready-to-wear from a house block, with an appointment if needed.',
  },
  {
    name: 'Qalbi Thobes',
    where: 'UK web',
    stance: 'Omani and Emirati cuts for the UK, fast delivery, colour range for Eid and Jumu’ah.',
    vs: 'Kiano is slower (four to eight weeks), unscented packing, London as the house name.',
  },
  {
    name: 'Al Badr Clothing',
    where: 'UK',
    stance: 'Positions as luxury modestwear: wool, regional collars, fragrance ritual.',
    vs: 'Kiano refuses scent in the box. Cloth should smell of cotton or wool.',
  },
  {
    name: 'Al Qamees / Alif / Shukr',
    where: 'UK modest',
    stance: 'Bespoke or everyday thobes; Shukr mixes western cuts and natural fibre.',
    vs: 'Kiano is Emirati column only. No fusion shirt, no office hybrid.',
  },
] as const

export const houseVisualAudit = [
  {
    surface: 'Home, desktop',
    finding:
      'First screen is a still of Hadīd. No video element, no player chrome. Type sits on ivory after the plate. Cookie consent waits until the still has been left.',
    rank: 'Hold',
  },
  {
    surface: 'Home, phone',
    finding:
      'One still, mark and menu on the plate. The cookie strip is compact and stays off the first plate. Header respects the safe area in the PWA and under native chrome.',
    rank: 'Hold',
  },
  {
    surface: 'Shop',
    finding:
      'Type beside the sand jubbah, ivory header, then three colours. On a phone the lookbook stacks, one still at a time. Quick-add is on the card.',
    rank: 'Hold',
  },
  {
    surface: 'Collection',
    finding:
      'Layl beside the name of the room, same split as the shop. Five pieces numbered. Hajar still closes the page.',
    rank: 'Hold',
  },
  {
    surface: 'Piece page',
    finding:
      'Stills start below the ivory header. On a phone the name, price and bag sit under the first plate; the sentences follow. Pinch to look closer. No film.',
    rank: 'Hold',
  },
  {
    surface: 'Checkout',
    finding:
      'Ledger voice on the site; Stripe is the next page. That hop will always feel like software. Keep copy short.',
    rank: 'Hold',
  },
  {
    surface: 'The ledger, desktop',
    finding:
      'The board is an index: counts open their rooms, rooms keep a sticky line under the house header. Remaining cuts at none sit in stone.',
    rank: 'Hold',
  },
  {
    surface: 'The ledger, phone',
    finding:
      'Rooms scroll sideways and stay. Reach it from Account, from The ledger in the menu when listed, or from kiano://admin in the Expo shell.',
    rank: 'Hold',
  },
  {
    surface: 'Expo shell',
    finding:
      'The native app is the website in a WebView. /admin and /admin/cuts, /prices, /accounts, /invoices, /members, /list, /field, /diary, /line are the same ledger. Word from the house is the site inbox; a signed-in device can take a push. Gestures and safe-area are the shell; chrome is the site. kiano://admin still opens the board.',
    rank: 'Watch',
  },
] as const

export const houseScope = [
  'Real walks in public/films, then a player that does not invent motion from a still.',
  'Photographs of the bag, tissue, and box, so packing is an object.',
  'Point the Clerk dashboard at POST /api/clerk-webhook and set CLERK_WEBHOOK_SIGNING_SECRET.',
] as const
