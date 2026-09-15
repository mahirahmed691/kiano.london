import {
  instagramPlates,
  plateIntervalDays,
  type InstagramPlate,
} from '@/data/instagram-plates'

const houseOrigin = 'https://www.kiano.london'

export type PlatePost = {
  plateId: string
  postedAt: string
  igMediaId: string
  permalink: string
}

export type PlateLine = InstagramPlate & {
  href: string
  postedAt: string | null
  igMediaId: string
  permalink: string
}

export function plateHref(src: string) {
  if (src.startsWith('http://') || src.startsWith('https://')) return src
  return `${houseOrigin}${src}`
}

export function asPlateLine(plate: InstagramPlate, post?: PlatePost | null): PlateLine {
  return {
    ...plate,
    href: plateHref(plate.src),
    postedAt: post?.postedAt ?? null,
    igMediaId: post?.igMediaId ?? '',
    permalink: post?.permalink ?? '',
  }
}

export function mergePlateLine(posts: readonly PlatePost[]): PlateLine[] {
  const byId = new Map(posts.map((post) => [post.plateId, post]))
  return instagramPlates.map((plate) => asPlateLine(plate, byId.get(plate.id)))
}

export function nextPlate(line: readonly PlateLine[]) {
  const posted = line
    .filter((plate) => plate.postedAt)
    .sort((a, b) => String(b.postedAt).localeCompare(String(a.postedAt)))
  const last = posted[0]
  const due =
    !last ||
    Date.now() - Date.parse(last.postedAt ?? '') >= plateIntervalDays * 24 * 60 * 60 * 1000
  if (!due) return { plate: null as PlateLine | null, waitUntil: last.postedAt }
  return { plate: line.find((item) => !item.postedAt) ?? null, waitUntil: last?.postedAt ?? null }
}
