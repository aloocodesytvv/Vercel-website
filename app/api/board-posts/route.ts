import { NextResponse } from 'next/server'
import { boardBannerFor } from '@/lib/site'
import { ensureSchema, getSql, type BoardPostRow } from '@/lib/db'
import { sendBoardPostToDiscord } from '@/lib/discord'
import { cleanBoardPost, validateBoardPost } from '@/lib/validation'

const publicPost = (row: BoardPostRow) => ({
  id: row.id,
  category: row.category,
  postType: row.post_type,
  orgName: row.org_name,
  title: row.title,
  detail: row.detail,
  roleNeeded: row.role_needed,
  rank: row.rank,
  speciality: row.speciality,
  experience: row.experience,
  languages: row.languages,
  sells: row.sells,
  buyHow: row.buy_how,
  instagram: row.instagram,
  // Older rows only have instagram — treat them as Instagram contacts.
  contactType: row.contact_type || 'instagram',
  contactValue: row.contact_value || row.instagram,
  ownerAdded: row.owner_added,
  logo: row.logo,
  banner: row.banner,
  featuredDays: row.featured_days,
  createdAt: row.created_at,
})

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams
    const category = params.get('category') ?? ''
  const featuredOnly = params.get('featured') === '1'
  try {
    await ensureSchema()
    const sql = getSql()
    const rows = (await sql`SELECT * FROM board_posts
      WHERE status = 'approved'
        AND (${category} = '' OR category = ${category})
        AND (${featuredOnly ? 1 : 0} = 0 OR featured_days > 0)
      ORDER BY featured_days DESC, created_at DESC
      LIMIT 100`) as BoardPostRow[]
    return NextResponse.json({ ok: true, posts: rows.map(publicPost) })
  } catch (error) {
    console.error('[board-posts] failed to load', error)
    return NextResponse.json({ ok: true, posts: [] })
  }
}

export async function POST(request: Request) {
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 })
  }

  const input = cleanBoardPost(body)
  if (input.website) return NextResponse.json({ ok: true })

  const errors = validateBoardPost(input)
  if (Object.keys(errors).length) return NextResponse.json({ ok: false, errors }, { status: 422 })

  try {
    await ensureSchema()
    const sql = getSql()
    const banner = boardBannerFor(`${input.orgName}:${input.title}`)
    const rows = (await sql`INSERT INTO board_posts
      (category, post_type, org_name, title, detail, role_needed, rank, speciality, experience, languages, sells, buy_how, instagram, contact_type, contact_value, logo, banner, featured_days)
      VALUES (${input.category}, ${input.postType}, ${input.orgName}, ${input.title}, ${input.detail}, ${input.roleNeeded}, ${input.rank},
        ${input.speciality}, ${input.experience}, ${input.languages}, ${input.sells}, ${input.buyHow}, ${input.instagram},
        ${input.contactType}, ${input.contact},
        ${input.logo}, ${banner}, ${input.featuredDays})
      RETURNING *`) as BoardPostRow[]

    const saved = rows[0]
    const delivered = await sendBoardPostToDiscord(saved)
    if (delivered) await sql`UPDATE board_posts SET discord_sent = TRUE WHERE id = ${saved.id}`

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[board-posts] failed to save', error)
    return NextResponse.json({ ok: false, error: 'Something went wrong on our side. Please try again in a moment.' }, { status: 500 })
  }
}
