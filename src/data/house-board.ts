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
    note: 'Neon inventory per size. Allowlisted members set remaining cuts on the ledger. The public inventory route is read-only.',
  },
  {
    name: 'Members',
    completion: 90,
    status: 'complete',
    note: 'Clerk sign-in, account of reservations, token on checkout. Svix webhook keeps members in step when an account is written or deleted.',
  },
  {
    name: 'The list',
    completion: 72,
    status: 'partial',
    note: 'Subscribe and confirm via Resend. Domain must be verified for letters to leave.',
  },
  {
    name: 'Visit',
    completion: 82,
    status: 'partial',
    note: 'The form still opens a letter. A copy is held in Neon when the atelier can keep it, and shown on the ledger. No calendar widget.',
  },
  {
    name: 'Installable house',
    completion: 78,
    status: 'partial',
    note: 'PWA on the site. Expo is a WebView of the live origin. Header and notices respect the safe area; pinch-zoom on the piece stays.',
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
    completion: 86,
    status: 'partial',
    note: 'This board. Live counts, remaining cuts to set, diary letters. Expo can open kiano://admin. No refund or letter-send from here.',
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
    events: 'inventory, members, orders, order_lines, subscribers, webhook_events, appointments, competitor_notes',
    note: 'Schema is created on first use. Remaining cuts are set from the ledger, not from SQL by hand.',
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
    copy: 'Paid reservations, remaining cuts, held sizes, members, confirmed and unconfirmed list rows, appointment letters. Currency is GBP pence.',
  },
  {
    title: 'What is not counted',
    copy: 'Sessions, bounce, cart abandonment, or refunds. London is the name of the house.',
  },
  {
    title: 'How it is read',
    copy: 'The board fetches /api/admin-summary, /api/admin-inventory, and /api/admin-competitors with a Clerk bearer token. Unsigned or unlisted emails see nothing of the ledger. Inventory and field notes require requireAdmin.',
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
      'Signed-out: a type page, Sign in, return to the house. Remaining cuts are a line of sizes, not a grid. Allowlisted accounts see the ranked line after sign-in.',
    rank: 'Hold',
  },
  {
    surface: 'The ledger, phone',
    finding:
      'Same type, stacked. Reach it from Account, from The ledger in the menu when listed, or from kiano://admin in the Expo shell.',
    rank: 'Hold',
  },
  {
    surface: 'Expo shell',
    finding:
      'The native app is the website in a WebView. /admin is the same ledger. Gestures and safe-area are the shell; chrome is the site. kiano://admin still opens the board.',
    rank: 'Watch',
  },
] as const

export const houseScope = [
  'Real walks in public/films, then a player that does not invent motion from a still.',
  'Photographs of the bag, tissue, and box, so packing is an object.',
  'Point the Clerk dashboard at POST /api/clerk-webhook and set CLERK_WEBHOOK_SIGNING_SECRET.',
  'A confirmation letter for the visit, without becoming a booking widget.',
] as const
