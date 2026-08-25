import { verifyToken } from '@clerk/backend'

export async function clerkUserIdFrom(request: Request) {
  const header = request.headers.get('authorization')
  const token = header?.startsWith('Bearer ') ? header.slice(7).trim() : ''
  if (!token || !process.env.CLERK_SECRET_KEY) return null

  try {
    const payload = await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY })
    return typeof payload.sub === 'string' && payload.sub ? payload.sub : null
  } catch {
    return null
  }
}
