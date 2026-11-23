'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { adminConfigured, assertAdmin, checkPassword, createSession, destroySession } from './auth'
import { ensureSchema, getSql } from './db'
import { boardBannerFor, statuses } from './site'
import { cleanBoardPost, validateBoardPost, type BoardPostErrors, type BoardPostInput } from './validation'

export type LoginState = { error?: string } | undefined

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  if (!adminConfigured()) return { error: 'Admin password is not configured yet. Add ADMIN_PASSWORD in project Vars.' }
  const password = String(formData.get('password') ?? '')
  if (!checkPassword(password)) {
    await new Promise((resolve) => setTimeout(resolve, 800))
    return { error: 'Incorrect password.' }
  }
  await createSession()
  redirect('/admin')
}

export async function logoutAction() {
  await destroySession()
  redirect('/admin/login')
}

export async function updateApplicationAction(formData: FormData) {
  await assertAdmin()
  await ensureSchema()
  const id = Number(formData.get('id'))
  const requested = String(formData.get('quick') || formData.get('status') || '')
  const status = statuses.find((item) => item.value === requested)?.value
  const rating = Math.min(5, Math.max(0, Number(formData.get('rating')) || 0))
  const adminNotes = String(formData.get('adminNotes') ?? '').slice(0, 4000)
  const publicNote = String(formData.get('publicNote') ?? '').slice(0, 600)
  if (!Number.isInteger(id) || !status) return

  const sql = getSql()
  await sql`UPDATE applications
    SET status = ${status}, rating = ${rating}, admin_notes = ${adminNotes}, public_note = ${publicNote}, updated_at = NOW()
    WHERE id = ${id}`
  revalidatePath('/admin', 'layout')
  redirect(`/admin/applications/${id}?saved=1`)
}

export async function deleteApplicationAction(formData: FormData) {
  await assertAdmin()
  const id = Number(formData.get('id'))
  if (!Number.isInteger(id)) return
  await getSql()`DELETE FROM applications WHERE id = ${id}`
  revalidatePath('/admin', 'layout')
  redirect('/admin/applications')
}

export async function setMessageStatusAction(formData: FormData) {
  await assertAdmin()
  const id = Number(formData.get('id'))
  const status = formData.get('status') === 'handled' ? 'handled' : 'new'
  if (!Number.isInteger(id)) return
  await getSql()`UPDATE contact_messages SET status = ${status} WHERE id = ${id}`
  revalidatePath('/admin', 'layout')
}

export async function deleteMessageAction(formData: FormData) {
  await assertAdmin()
  const id = Number(formData.get('id'))
  if (!Number.isInteger(id)) return
  await getSql()`DELETE FROM contact_messages WHERE id = ${id}`
  revalidatePath('/admin', 'layout')
}

export async function setBoardPostStatusAction(formData: FormData) {
  await assertAdmin()
  await ensureSchema()
  const id = Number(formData.get('id'))
  const status = String(formData.get('status') ?? '')
  if (!Number.isInteger(id) || !['approved', 'declined', 'pending'].includes(status)) return
  const sql = getSql()
  // Approving a featured post starts its featuring clock now.
  await sql`UPDATE board_posts
    SET status = ${status}, updated_at = NOW(),
      featured_until = CASE WHEN ${status} = 'approved' AND featured_days > 0
        THEN NOW() + featured_days * INTERVAL '1 day' ELSE featured_until END
    WHERE id = ${id}`
  revalidatePath('/admin/board')
  revalidatePath('/board')
  revalidatePath('/')
}

// Owner adds a featured post himself: it goes live immediately, in gold,
// and it is free — no payment. Same fields as the public board form.
export async function addBoardPostAction(input: BoardPostInput): Promise<{ ok: boolean; errors?: BoardPostErrors }> {
  await assertAdmin()
  const cleaned = cleanBoardPost(input)
  const errors = validateBoardPost(cleaned)
  if (cleaned.featuredDays < 1 || cleaned.featuredDays > 7) {
    errors.featuredDays = 'Pick 1 to 7 days of featuring.'
  }
  if (Object.keys(errors).length) return { ok: false, errors }
  await ensureSchema()
  const sql = getSql()
  const banner = boardBannerFor(`${cleaned.orgName}:${cleaned.title}`)
  // Owner posts go live featured straight away, so the clock starts now.
  const featuredUntil = new Date(Date.now() + cleaned.featuredDays * 86400000).toISOString()
  await sql`INSERT INTO board_posts
    (category, post_type, org_name, title, detail, role_needed, rank, speciality, experience, languages, sells, buy_how,
     instagram, contact_type, contact_value, logo, banner, featured_days, featured_until, status, owner_added)
    VALUES (${cleaned.category}, ${cleaned.postType}, ${cleaned.orgName}, ${cleaned.title}, ${cleaned.detail}, ${cleaned.roleNeeded},
      ${cleaned.rank}, ${cleaned.speciality}, ${cleaned.experience}, ${cleaned.languages}, ${cleaned.sells},
      ${cleaned.buyHow}, ${cleaned.instagram}, ${cleaned.contactType}, ${cleaned.contact}, ${cleaned.logo},
      ${banner}, ${cleaned.featuredDays}, ${featuredUntil}, 'approved', TRUE)`
  revalidatePath('/admin/board')
  revalidatePath('/board')
  revalidatePath('/')
  redirect('/admin/board?added=1')
}

// Change the featuring of a live post: 1–7 days to lower or extend it,
// 0 to unfeature it (it stays live as a standard blue listing).
export async function setBoardPostFeaturedAction(formData: FormData) {
  await assertAdmin()
  await ensureSchema()
  const id = Number(formData.get('id'))
  const days = Number(formData.get('featuredDays'))
  if (!Number.isInteger(id) || ![0, 1, 2, 3, 4, 5, 6, 7].includes(days)) return
  const sql = getSql()
  // Changing the duration restarts the featuring clock from now;
  // unfeaturing (0 days) clears it.
  await sql`UPDATE board_posts
    SET featured_days = ${days}, updated_at = NOW(),
      featured_until = CASE WHEN ${days} > 0 THEN NOW() + ${days} * INTERVAL '1 day' ELSE NULL END
    WHERE id = ${id}`
  revalidatePath('/admin/board')
  revalidatePath('/board')
  revalidatePath('/')
}

export async function deleteBoardPostAction(formData: FormData) {
  await assertAdmin()
  const id = Number(formData.get('id'))
  if (!Number.isInteger(id)) return
  await getSql()`DELETE FROM board_posts WHERE id = ${id}`
  revalidatePath('/admin/board')
  revalidatePath('/board')
  revalidatePath('/')
}
