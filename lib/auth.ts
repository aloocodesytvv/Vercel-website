import { createHash, createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const COOKIE = 'aw_admin'
const MAX_AGE = 60 * 60 * 24 * 7

const secretKey = () => {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD
  return secret ? createHash('sha256').update(`aw-session:${secret}`).digest() : null
}

const sign = (value: string) => {
  const key = secretKey()
  if (!key) throw new Error('Admin is not configured')
  return createHmac('sha256', key).update(value).digest('base64url')
}

export const adminConfigured = () => Boolean(process.env.ADMIN_PASSWORD)

export function checkPassword(input: string) {
  const expected = process.env.ADMIN_PASSWORD
  if (!expected) return false
  const a = createHash('sha256').update(input).digest()
  const b = createHash('sha256').update(expected).digest()
  return timingSafeEqual(a, b)
}

const cookieOptions = () => ({
  httpOnly: true,
  secure: true,
  sameSite: (process.env.NODE_ENV === 'production' ? 'lax' : 'none') as 'lax' | 'none',
  path: '/',
})

export async function createSession() {
  const expires = String(Date.now() + MAX_AGE * 1000)
  const jar = await cookies()
  jar.set(COOKIE, `${expires}.${sign(expires)}`, { ...cookieOptions(), maxAge: MAX_AGE })
}

export async function destroySession() {
  const jar = await cookies()
  jar.set(COOKIE, '', { ...cookieOptions(), maxAge: 0 })
}

export async function isAdmin() {
  if (!adminConfigured()) return false
  const token = (await cookies()).get(COOKIE)?.value
  if (!token) return false
  const [expires, signature] = token.split('.')
  if (!expires || !signature || Number(expires) < Date.now()) return false
  const expected = Buffer.from(sign(expires))
  const actual = Buffer.from(signature)
  return expected.length === actual.length && timingSafeEqual(expected, actual)
}

export async function requireAdmin() {
  if (!(await isAdmin())) redirect('/admin/login')
}

export async function assertAdmin() {
  if (!(await isAdmin())) throw new Error('Unauthorised')
}
