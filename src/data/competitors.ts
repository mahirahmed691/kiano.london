import { packingNote } from '@/data/packing'
import { products } from '@/data/products'
import { site } from '@/data/site'
import { formatGbp } from '@/lib/money'

export type Channel = 'web' | 'shops' | 'whatsapp'
export type GarmentKind = 'emirati-thobe' | 'jubbah' | 'mixed-modest'
export type FitKind = 'house-block' | 'ready-to-wear' | 'made-to-measure' | 'mixed'
export type PriceStatus = 'published' | 'converted' | 'unpublished'

export type CompetitorHouse = {
  id: string
  name: string
  url: string
  origin: string
  channels: Channel[]
  garment: GarmentKind
  garmentLabel: string
  priceLowPence: number | null
  priceHighPence: number | null
  priceStatus: PriceStatus
  priceNote: string
  lead: string
  scentLabel: string
  fit: FitKind
  fitLabel: string
  cuts: string
  stance: string
  vs: string
  isKiano?: boolean
  sourced: string
}

export type CompetitorLedgerNote = {
  id: number
  name: string
  url: string
  notes: string
  priceLowPence: number | null
  priceHighPence: number | null
  createdAt: string
}

export const channelLabel: Record<Channel, string> = {
  web: 'Web',
  shops: 'Shops',
  whatsapp: 'WhatsApp',
}

function channelsCopy(channels: Channel[]) {
  return channels.map((channel) => channelLabel[channel]).join(' · ')
}

function kianoReference(): CompetitorHouse {
  const prices = products.map((piece) => piece.pricePence)
  const thobes = products.filter((piece) => piece.cut === 'Thobe')
  const jubbahs = products.filter((piece) => piece.cut === 'Jubbah')
  const colours = new Set(products.map((piece) => piece.colour))
  const low = Math.min(...prices)
  const high = Math.max(...prices)
  const thobeLow = Math.min(...thobes.map((piece) => piece.pricePence))
  const thobeHigh = Math.max(...thobes.map((piece) => piece.pricePence))
  const jubbahPrice = jubbahs[0]?.pricePence ?? 8500

  return {
    id: 'kiano',
    name: site.fullName,
    url: 'https://kiano.london',
    origin: 'London house',
    channels: ['web'],
    garment: 'emirati-thobe',
    garmentLabel: 'Emirati thobe and jubbah',
    priceLowPence: low,
    priceHighPence: high,
    priceStatus: 'published',
    priceNote: `The line: thobes ${formatGbp(thobeLow)}–${formatGbp(thobeHigh)}, jubbah ${formatGbp(jubbahPrice)}. Native GBP on the piece pages.`,
    lead: 'Made to order, four to eight weeks.',
    scentLabel: packingNote,
    fit: 'house-block',
    fitLabel: 'House block, made to order. An appointment if the block will not do.',
    cuts: `${thobes.length} thobes, jubbah in ${jubbahs.length} colours, ${colours.size} colours on the line, sizes 52–60.`,
    stance: 'A short Emirati column. London is the name of the house.',
    vs: 'The reference. Everything else is read against this line.',
    isKiano: true,
    sourced: 'src/data/products.ts',
  }
}

export const fieldHouses: CompetitorHouse[] = [
  kianoReference(),
  {
    id: 'bait-al-kandora',
    name: 'Bait Al Kandora',
    url: 'https://www.baitalkandora.com/collections/kandoras',
    origin: 'UAE retail, ships widely',
    channels: ['web', 'shops'],
    garment: 'mixed-modest',
    garmentLabel: 'Regional kandora, custom and ready-to-wear',
    priceLowPence: 7300,
    priceHighPence: 10000,
    priceStatus: 'converted',
    priceNote:
      'Ready-to-wear Gold Edition AED 350, Black Edition AED 475 on baitalkandora.com (read August 2026). Converted at £0.21 / AED. Custom listings show AED 0.00 until the configurator is filled — treat custom as on request. Sandals and accessories sit higher and are not in this band.',
    lead: 'Custom stated at seven days, with a trial before the balance.',
    scentLabel: 'Unlisted on the shop pages read.',
    fit: 'mixed',
    fitLabel: 'Ready-to-wear editions and made-to-measure / visiting tailor.',
    cuts: 'Sale filter listed 24 kandoras. Gold and Black editions, several regional collars.',
    stance: 'Flagship kandora house: shops, customisation, accessories. Volume and brand experience.',
    vs: 'Kiano is a short line, one silhouette language, no shop window.',
    sourced: 'baitalkandora.com collections and FAQ, August 2026',
  },
  {
    id: 'dar-al-ahad',
    name: 'Dar Al Ahad',
    url: 'https://daralahad.ae/shop/',
    origin: 'GCC e-commerce',
    channels: ['web'],
    garment: 'mixed-modest',
    garmentLabel: 'Emirati, Kuwaiti, Saudi, Qatari kandora',
    priceLowPence: null,
    priceHighPence: null,
    priceStatus: 'unpublished',
    priceNote:
      'daralahad.ae/shop listed eight results in August 2026 with sizes and colours, and no unit prices on the pages read. Marked on request.',
    lead: 'Unlisted.',
    scentLabel: 'Unlisted.',
    fit: 'ready-to-wear',
    fitLabel: 'Ready-to-wear catalogue, sized S–XXL.',
    cuts: 'Eight shop results. Several colours per cut, including kids.',
    stance: 'Many regional cuts as a catalogue.',
    vs: 'Kiano keeps five thobes and a jubbah. Fewer SKUs, more still.',
    sourced: 'daralahad.ae shop, August 2026',
  },
  {
    id: 'al-nashama',
    name: 'Al Nashama',
    url: 'https://www.alnashama.ae/',
    origin: 'UAE',
    channels: ['web', 'shops', 'whatsapp'],
    garment: 'mixed-modest',
    garmentLabel: 'Emirati, Kuwaiti, Qatari kandura; linen casuals',
    priceLowPence: 7300,
    priceHighPence: 9400,
    priceStatus: 'converted',
    priceNote:
      'Featured kandoras AED 350 (Silver) and AED 450 (Gold) on alnashama.ae, August 2026. Converted at £0.21 / AED. Linen shirts AED 180 and bishts AED 1,750 are outside this band.',
    lead: 'Made to measure. Days not published on the pages read.',
    scentLabel: 'Unlisted on the kandura pages read.',
    fit: 'made-to-measure',
    fitLabel: 'Choose fabric and design; the tailor cuts it.',
    cuts: 'Gold and Silver editions across several regional collars. Linen and kids beside the column.',
    stance: 'Made-to-measure kandura and linen casuals. WhatsApp tailor.',
    vs: 'Kiano is ready-to-wear from a house block, with an appointment if needed.',
    sourced: 'alnashama.ae, August 2026',
  },
  {
    id: 'qalbi',
    name: 'Qalbi Thobes',
    url: 'https://qalbithobes.co.uk/',
    origin: 'UK web',
    channels: ['web'],
    garment: 'emirati-thobe',
    garmentLabel: 'Omani and Emirati thobe',
    priceLowPence: 5300,
    priceHighPence: 5600,
    priceStatus: 'converted',
    priceNote:
      'Homepage listed €61,95–€64,95 in August 2026. Converted at £0.86 / EUR. The shop is UK-facing; the published unit is euro.',
    lead: 'Fast UK delivery. Days, not weeks.',
    scentLabel: 'Unlisted.',
    fit: 'ready-to-wear',
    fitLabel: 'Ready-to-wear, sized from a guide.',
    cuts: 'Nine thobes listed. Colours include white, navy, cream, burgundy, grey, forest, teal, sand.',
    stance: 'Omani and Emirati cuts for the UK, colour range for Eid and Jumu’ah.',
    vs: 'Kiano is slower (four to eight weeks), unscented packing, London as the house name.',
    sourced: 'qalbithobes.co.uk, August 2026',
  },
  {
    id: 'al-badr',
    name: 'Al Badr Clothing',
    url: 'https://albadrclothing.com/',
    origin: 'UK-facing, ships widely',
    channels: ['web'],
    garment: 'mixed-modest',
    garmentLabel: 'Qatari and Bahraini thobe; abayas beside',
    priceLowPence: 5200,
    priceHighPence: 5300,
    priceStatus: 'converted',
    priceNote:
      'Best-seller Qatari thobes $70 USD on albadrclothing.com, August 2026. Converted at £0.75 / USD. Abayas listed $63–$70. No Emirati column price was on the homepage read.',
    lead: 'Fast delivery, stated on the mark.',
    scentLabel: 'House reading: fragrance as ritual. Not priced as a garment.',
    fit: 'ready-to-wear',
    fitLabel: 'Ready-to-wear from their own works.',
    cuts: 'Several Qatari pinstripe and solid SKUs, Bahraini white, a womens line beside.',
    stance: 'Positions as considered modestwear: regional collars, factory story, scent at the edge.',
    vs: 'Kiano refuses scent in the box. Cloth should smell of cotton or wool.',
    sourced: 'albadrclothing.com, August 2026',
  },
  {
    id: 'al-qamees',
    name: 'Al Qamees',
    url: 'https://alqamees.com/collection/emirati-omani/',
    origin: 'Web, worldwide; WhatsApp till',
    channels: ['web', 'whatsapp'],
    garment: 'mixed-modest',
    garmentLabel: 'Emirati and Omani kandura, jalabiya, custom qamees',
    priceLowPence: 3400,
    priceHighPence: 7100,
    priceStatus: 'converted',
    priceNote:
      'Collection pages listed $44.95–$95 in August 2026; Emirati–Omani kanduras at $75. Converted at £0.75 / USD. The shop also offers sterling at checkout. Attars are sold beside the cloth.',
    lead: 'Custom and made-to-measure need planning; ready stock ships. Days not fixed on the pages read.',
    scentLabel: 'Sells attars. The garment itself is unlisted for scent.',
    fit: 'mixed',
    fitLabel: 'Ready-to-wear catalogue and a design-your-own qamees.',
    cuts: 'Claim of 100+ thobes and jubbas. Emirati–Omani is one room among many.',
    stance: 'Bespoke or everyday thobes; a wide modest catalogue.',
    vs: 'Kiano is Emirati column only. No fusion shirt, no office hybrid.',
    sourced: 'alqamees.com, August 2026',
  },
  {
    id: 'alif',
    name: 'Alif Thobes',
    url: 'https://alifthobes.com/collections/all',
    origin: 'UK web',
    channels: ['web'],
    garment: 'mixed-modest',
    garmentLabel: 'Emirati, collared, and embroidered thobe',
    priceLowPence: 2700,
    priceHighPence: 12500,
    priceStatus: 'published',
    priceNote:
      'Adult thobes £27–£125 GBP on alifthobes.com, August 2026. Casual Emirati around £30, collared £40, embroidered £90–£125. Kids from £14 are outside this band.',
    lead: 'Fast UK delivery.',
    scentLabel: 'Unlisted.',
    fit: 'ready-to-wear',
    fitLabel: 'Ready-to-wear, broad size run.',
    cuts: 'Twenty-plus adult SKUs on the all-products list. Wide colour, kids beside.',
    stance: 'Everyday to embroidered, priced as value, volume in the UK.',
    vs: 'Kiano is Emirati column only. No fusion shirt, no office hybrid.',
    sourced: 'alifthobes.com, August 2026',
  },
  {
    id: 'shukr',
    name: 'Shukr',
    url: 'https://www.shukr.co.uk/',
    origin: 'UK modest, natural fibre',
    channels: ['web'],
    garment: 'mixed-modest',
    garmentLabel: 'Mixed modest; western cuts beside the column',
    priceLowPence: null,
    priceHighPence: null,
    priceStatus: 'unpublished',
    priceNote:
      'Men’s thobe listings were not readable in August 2026 (the collection URL did not return). Shirt and dress pages are not a thobe band. Marked on request until a thobe price is kept on the ledger.',
    lead: 'Some made-to-order pieces stated at nine days on adjacent pages. Thobe lead unlisted.',
    scentLabel: 'Unlisted.',
    fit: 'mixed',
    fitLabel: 'Ready-to-wear and made-to-order, depending on the piece.',
    cuts: 'Broad modest catalogue. Thobe count not taken from a live list.',
    stance: 'Natural fibre, mixed western cuts, not an Emirati house.',
    vs: 'Kiano is Emirati column only. No fusion shirt, no office hybrid.',
    sourced: 'shukr.co.uk fetch attempt, August 2026',
  },
]

export const fieldReading = [
  'Kiano sits in the middle of the published sterling field: above the fast UK catalogues (Qalbi converted near £53–£56, Al Badr near £52, Alif from £27), and beside or just under the converted UAE flagship ready-to-wear bands (Bait Al Kandora £73–£100, Al Nashama £73–£94).',
  'The pounds are not the argument. The line is short, the packing is unscented, the block is the house, and the wait is four to eight weeks. Volume houses win on colour count and days. This house wins by refusing the catalogue.',
  'Dar Al Ahad and Shukr did not publish a usable thobe price on the pages read. They stay on the map as stance, not as a number, until someone writes a band on the ledger.',
].join(' ')

export function formatPriceBand(house: Pick<CompetitorHouse, 'priceLowPence' | 'priceHighPence' | 'priceStatus'>) {
  if (
    house.priceStatus === 'unpublished' ||
    house.priceLowPence == null ||
    house.priceHighPence == null
  ) {
    return 'On request'
  }
  const low = formatGbp(house.priceLowPence)
  const high = formatGbp(house.priceHighPence)
  if (low === high) return low
  return `${low}–${high}`
}

export function priceAxisMax(houses: CompetitorHouse[]) {
  const highs = houses
    .map((house) => house.priceHighPence)
    .filter((value): value is number => value != null && value > 0)
  return Math.max(9000, ...highs)
}

export function mergeFieldNotes(notes: CompetitorLedgerNote[]): CompetitorHouse[] {
  const byName = new Map(notes.map((note) => [note.name.trim().toLowerCase(), note]))
  const seen = new Set<string>()
  const merged = fieldHouses.map((house) => {
    const note = byName.get(house.name.trim().toLowerCase())
    if (!note) return house
    seen.add(house.name.trim().toLowerCase())
    const hasPrice = note.priceLowPence != null && note.priceHighPence != null
    return {
      ...house,
      url: note.url || house.url,
      priceLowPence: hasPrice ? note.priceLowPence : house.priceLowPence,
      priceHighPence: hasPrice ? note.priceHighPence : house.priceHighPence,
      priceStatus: hasPrice ? ('published' as const) : house.priceStatus,
      priceNote: hasPrice
        ? `Set on the ledger. ${house.priceNote}`
        : house.priceNote,
      stance: note.notes ? `${house.stance} ${note.notes}` : house.stance,
    }
  })

  const extras = notes
    .filter((note) => !seen.has(note.name.trim().toLowerCase()))
    .map((note) => ledgerHouseFromNote(note))

  return [...merged, ...extras]
}

function ledgerHouseFromNote(note: CompetitorLedgerNote): CompetitorHouse {
  const hasPrice = note.priceLowPence != null && note.priceHighPence != null
  return {
    id: `ledger-${note.id}`,
    name: note.name,
    url: note.url,
    origin: 'Added on the ledger',
    channels: ['web'],
    garment: 'mixed-modest',
    garmentLabel: 'To be read',
    priceLowPence: note.priceLowPence,
    priceHighPence: note.priceHighPence,
    priceStatus: hasPrice ? 'published' : 'unpublished',
    priceNote: hasPrice ? 'Set on the ledger.' : 'On request until a band is kept.',
    lead: 'Unlisted.',
    scentLabel: 'Unlisted.',
    fit: 'ready-to-wear',
    fitLabel: 'Unlisted.',
    cuts: 'Unlisted.',
    stance: note.notes || 'Kept from the ledger.',
    vs: 'A house added so the field can grow.',
    sourced: 'Ledger note',
  }
}

export function channelsCopyFor(house: CompetitorHouse) {
  return channelsCopy(house.channels)
}
