export type HouseNav = {
  open: (path: string) => void
  openWeb: (path: string) => void
  roomHeight: number
  bottomInset: number
  onOverlay: (value: boolean) => void
}
