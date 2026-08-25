import type { ClerkProviderProps } from '@clerk/react'

export const clerkAppearance = {
  variables: {
    colorPrimary: '#1B1714',
    colorBackground: '#F2EBDC',
    colorForeground: '#1B1714',
    colorMutedForeground: '#6F675C',
    colorPrimaryForeground: '#F2EBDC',
    colorInput: '#FAF7F1',
    colorInputForeground: '#1B1714',
    colorNeutral: '#3F3933',
    colorDanger: '#1B1714',
    borderRadius: '0',
    fontFamily: '"Jost", ui-sans-serif, system-ui, sans-serif',
    fontFamilyButtons: '"Jost", ui-sans-serif, system-ui, sans-serif',
  },
  layout: {
    logoPlacement: 'none',
    socialButtonsVariant: 'blockButton',
  },
  elements: {
    card: {
      boxShadow: 'none',
      border: '1px solid #D4CBB8',
      borderRadius: '0',
      backgroundColor: '#F2EBDC',
    },
    headerTitle: {
      fontFamily: '"Cormorant Garamond", ui-serif, Georgia, serif',
      fontWeight: '300',
      fontSize: '2rem',
    },
    headerSubtitle: {
      fontWeight: '300',
    },
    formButtonPrimary: {
      boxShadow: 'none',
      borderRadius: '0',
      textTransform: 'uppercase',
      letterSpacing: '0.22em',
      fontSize: '11px',
      fontWeight: '400',
      backgroundColor: '#1B1714',
      color: '#F2EBDC',
      WebkitAppearance: 'none',
      WebkitTextFillColor: '#F2EBDC',
    },
    socialButtonsBlockButton: {
      borderRadius: '0',
      boxShadow: 'none',
    },
    formFieldInput: {
      borderRadius: '0',
    },
    footer: {
      background: 'transparent',
    },
  },
} as NonNullable<ClerkProviderProps['appearance']>
