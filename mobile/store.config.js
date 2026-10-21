const year = new Date().getFullYear()
const phone = process.env.APP_STORE_REVIEW_PHONE?.trim() || '+44 7784 452854'

const description = [
  'Kiano London is a London house of Urban Emirati garments.',
  '',
  'Urban Emirati in stone grey, cream and black. Cotton viscose mix, light GSM. Sizes 52 to 60, from the house block. Made to order.',
  '',
  'Discipline, craftsmanship, and purpose woven into every garment. Hand-finished by artisans, made to be worn with intent.',
  '',
  'The house, the stills, the shop, the collection, and a visit sit in the app. The scent — Mayfair, Bond Street, Kensington — is coming. Bag, account, and the till open the live house.',
  '',
  'Visits by appointment. London.',
  '',
  'atelier@kiano.london',
].join('\n')

const info = {
  title: 'Kiano London',
  subtitle: 'Urban Emirati garments.',
  description,
  keywords: [
    'urban emirati',
    'jubbah',
    'thobe',
    'london',
    'garment',
    'modest',
    'atelier',
    'kiano',
  ],
  releaseNotes:
    'The house, as it stands. Urban Emirati in stone grey, cream and black. The scent is coming.',
  promoText: 'Urban Emirati garments. Worn with purpose.',
  marketingUrl: 'https://www.kiano.london',
  supportUrl: 'https://www.kiano.london/visit',
  privacyPolicyUrl: 'https://www.kiano.london/privacy',
  privacyChoicesUrl: 'https://www.kiano.london/privacy',
}

const apple = {
  version: '1.0.0',
  copyright: `${year} Kiano London`,
  categories: ['SHOPPING', 'LIFESTYLE'],
  release: {
    automaticRelease: false,
  },
  advisory: {
    alcoholTobaccoOrDrugUseOrReferences: 'NONE',
    contests: 'NONE',
    gamblingSimulated: 'NONE',
    horrorOrFearThemes: 'NONE',
    matureOrSuggestiveThemes: 'NONE',
    medicalOrTreatmentInformation: 'NONE',
    profanityOrCrudeHumor: 'NONE',
    sexualContentGraphicAndNudity: 'NONE',
    sexualContentOrNudity: 'NONE',
    violenceCartoonOrFantasy: 'NONE',
    violenceRealistic: 'NONE',
    violenceRealisticProlongedGraphicOrSadistic: 'NONE',
    gambling: false,
    unrestrictedWebAccess: true,
    kidsAgeBand: null,
    ageRatingOverride: 'NONE',
    koreaAgeRatingOverride: 'NONE',
  },
  info: {
    'en-GB': info,
    'en-US': { ...info },
  },
  review: {
    firstName: 'Mahir',
    lastName: 'Ahmed',
    email: 'atelier@kiano.london',
    phone,
    demoRequired: false,
    notes: [
      'Native rooms (House, Line, Stills, a piece, Scent, Visit, Story, Craftsmanship, Privacy, Cookies, Returns) do not require an account.',
      'Bag, Word, Account, and checkout open https://www.kiano.london in the shell (Clerk and Stripe). No demo account is required to review the garment rooms.',
      'To open the till: Shop → a colour → choose a size → Add to bag → Reserve the cut. Stripe Checkout opens on the live house.',
      'Camera permission is only for Stripe’s card scan on their page. The house does not keep photographs. Push permission is for Word from the house and this week’s still.',
      'The scent line is coming and is not of the bag.',
      'ITSAppUsesNonExemptEncryption is false. Privacy nutrition labels are in store/PRIVACY-LABELS.md.',
    ].join('\n'),
  },
}

module.exports = {
  configVersion: 0,
  apple,
}
