'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { adminConfigured, assertAdmin, checkPassword, createSession, destroySession } from './auth'
import { ensureSchema, getSql } from './db'
import { statuses } from './site'

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
