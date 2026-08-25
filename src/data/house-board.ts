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
    completion: 92,
    status: 'complete',
    note: 'Home, shop, collection, story, craft, visit. Quiet entrance: still first, type after.',
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
    completion: 78,
    status: 'partial',
    note: 'Neon inventory is live per size. There is no restock screen yet. Seeded quantities only.',
  },
  {
    name: 'Members',
    completion: 80,
    status: 'complete',
    note: 'Clerk sign-in, account of reservations, token on checkout. No Clerk webhook yet.',
  },
  {
    name: 'The list',
    completion: 72,
    status: 'partial',
    note: 'Subscribe and confirm via Resend. Domain must be verified for letters to leave.',
  },
  {
    name: 'Visit',
    completion: 70,
    status: 'partial',
    note: 'The form opens a letter. There is no diary, calendar, or confirmation loop.',
  },
  {
    name: 'Installable house',
    completion: 75,
    status: 'partial',
    note: 'PWA on the site. Expo is a WebView of the live origin, not a native shop.',
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
    completion: 70,
    status: 'partial',
    note: 'This board. Live counts when signed in. Expo can open kiano://admin. No restock, refund, or letter-send from here.',
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
    state: 'Live, incomplete',
    hook: 'None',
    events: 'Members are written when an account is opened, not from Svix.',
    note: 'Need CLERK_WEBHOOK_SIGNING_SECRET and a public /api/clerk-webhook before user.deleted can tidy Neon.',
  },
  {
    name: 'Neon Postgres',
    state: 'Live',
    hook: 'None',
    events: 'inventory, members, orders, order_lines, subscribers',
    note: 'Schema is created on first use. Restock is SQL, not a screen.',
  },
  {
    name: 'Resend',
    state: 'Wired',
    hook: 'None',
    events: 'List confirm letters',
    note: 'From address must be a verified domain. Until then the list holds unconfirmed rows.',
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
    copy: 'Paid reservations, remaining cuts, held sizes, members, confirmed and unconfirmed list rows. Currency is GBP pence.',
  },
  {
    title: 'What is not counted',
    copy: 'Sessions, bounce, cart abandonment, appointment letters, or refunds. London is the name of the house.',
  },
  {
    title: 'How it is read',
    copy: 'The board fetches /api/admin-summary with a Clerk bearer token. Unsigned or unlisted emails see nothing of the ledger.',
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
      'First screen is a still of Hadīd. No video element, no player chrome. Type sits on ivory after the plate. Cookie bar covers the hem on a first visit.',
    rank: 'Hold',
  },
  {
    surface: 'Home, phone',
    finding:
      'One still, mark and menu on the plate. The cookie bar takes the lower third on first visit. Both honest; both interrupt the still.',
    rank: 'Watch',
  },
  {
    surface: 'Shop',
    finding:
      'Type beside the sand jubbah, then three colours. On a phone the lookbook stacks, one still at a time. Quick-add is on the card.',
    rank: 'Hold',
  },
  {
    surface: 'Piece page',
    finding:
      'Full-height stills, pinch to look closer, nape monogram, packing as sentences. No film. Gallery stills repeat a stitch set on some pieces.',
    rank: 'Watch',
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
      'Signed-out: a type page, Sign in, return to the house. No cards, no gold, no table chrome. Allowlisted accounts see the ranked line after sign-in.',
    rank: 'Hold',
  },
  {
    surface: 'The ledger, phone',
    finding:
      'Same type, stacked. Footer night band comes in quickly. Reach it from Account, from The ledger in the menu when listed, or from kiano://admin in the Expo shell.',
    rank: 'Hold',
  },
  {
    surface: 'Expo shell',
    finding:
      'The native app is the website in a WebView. /admin is the same ledger. Gestures and safe-area are the shell; chrome is the site.',
    rank: 'Watch',
  },
] as const

export const houseScope = [
  'Real walks in public/films, then a player that does not invent motion from a still.',
  'Photographs of the bag, tissue, and box, so packing is an object.',
  'Clerk webhook to keep members in step with deleted accounts.',
  'A restock line on this board, or a quiet inventory letter.',
  'Appointment diary that does not become a booking widget.',
] as const
