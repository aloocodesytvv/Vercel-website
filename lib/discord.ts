import { experienceLevels, getRole, siteUrl, staffExperienceLevels, topics } from './site'
import type { ApplicationRow, MessageRow } from './db'

type Embed = Record<string, unknown>

// Phoenix copper — Ashen Wings brand colour.
const COPPER = 0xc97b2d
const GOLD = 0xe8c07a

const cut = (value: string, max: number) => (value.length > max ? `${value.slice(0, max - 1)}…` : value)
const quote = (value: string, max: number) =>
  cut(value, max)
    .split('\n')
    .map((line) => `> ${line}`)
    .join('\n')
const mono = (value: string) => `\`${value.replace(/`/g, "'")}\``

const isPublicUrl = (url: string) => url.startsWith('https://') && !url.includes('localhost')

async function post(payload: { username: string; embeds: Embed[] }) {
  const url = process.env.DISCORD_WEBHOOK_URL
  if (!url) return false
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, allowed_mentions: { parse: [] } }),
      signal: AbortSignal.timeout(6000),
    })
    if (!response.ok) console.error('[discord] webhook responded', response.status)
    return response.ok
  } catch (error) {
    console.error('[discord] webhook failed', error)
    return false
  }
}

export const discordConfigured = () => Boolean(process.env.DISCORD_WEBHOOK_URL)

export async function sendApplicationToDiscord(app: ApplicationRow) {
  const base = siteUrl()
  const isStaff = app.track === 'staff'
  const role = getRole(isStaff ? app.staff_role || app.role : app.role)
  const roleName = role?.name ?? (isStaff ? app.staff_role : app.role) ?? 'Application'
  const trackLabel = isStaff ? 'Staff & Creators' : 'Player'
  const experience = isStaff
    ? staffExperienceLevels.find((level) => level.value === app.experience)?.label ?? app.experience
    : experienceLevels.find((level) => level.value === app.experience)?.label ?? app.experience
  const isMinor = app.age < 18

  const fields: { name: string; value: string; inline?: boolean }[] = [
    { name: '▸ Track', value: `**${trackLabel}**`, inline: true },
    { name: isStaff ? '▸ Staff role' : '▸ Lane', value: `**${roleName}**\n${role?.tag ?? ''}`, inline: true },
    {
      name: isStaff ? '▸ Experience' : '▸ Rank',
      value: isStaff ? experience : app.rank ? `**${app.rank}**` : 'n/a',
      inline: true,
    },
  ]
  if (!isStaff) {
    fields.push({ name: '▸ Game ID', value: app.game_id ? mono(`${app.game_id} (${app.server_id})`) : 'n/a', inline: true })
    if (app.main_heroes) fields.push({ name: '▸ Main heroes', value: cut(app.main_heroes, 200) })
    if (app.flex_lane) fields.push({ name: '▸ Flex lane', value: app.flex_lane, inline: true })
    if (app.shotcalling) fields.push({ name: '▸ Shot-calling', value: app.shotcalling, inline: true })
  } else {
    if (app.portfolio) fields.push({ name: '▸ Portfolio', value: cut(app.portfolio, 300) })
    if (app.tools) fields.push({ name: '▸ Tools & skills', value: cut(app.tools, 200) })
    if (app.hours) fields.push({ name: '▸ Weekly hours', value: cut(app.hours, 100), inline: true })
    if (app.past_teams) fields.push({ name: '▸ Past teams', value: cut(app.past_teams, 200) })
  }
  fields.push({ name: '▸ Discord', value: mono(app.discord), inline: true })
  fields.push({ name: '▸ Age', value: isMinor ? `${app.age}  ·  **minor**` : String(app.age), inline: true })
  fields.push({ name: '▸ Availability', value: cut(`${app.availability}  ·  ${app.timezone}`, 300) })
  if (isStaff && app.pitch) fields.push({ name: '▸ First idea', value: quote(app.pitch, 500) })
  if (app.links) fields.push({ name: '▸ Links', value: cut(app.links, 400) })
  fields.push({ name: '▸ Review in dashboard', value: `[Open application #${app.id}](${base}/admin/applications/${app.id})` })

  const embed: Embed = {
    author: { name: 'ASHEN WINGS  ·  RECRUITMENT DESK' },
    title: `New ${trackLabel.toLowerCase()} application  ·  ${roleName}`,
    url: `${base}/admin/applications/${app.id}`,
    description: `## ${cut(app.name, 60)}${app.ign ? `  ·  ${cut(app.ign, 40)}` : ''}\n${quote(app.message, 700)}`,
    color: isStaff ? GOLD : COPPER,
    fields,
    footer: { text: `Tracking ${app.code}  ·  Application #${app.id}  ·  Rise from the ashes.` },
    timestamp: new Date(app.created_at).toISOString(),
  }
  if (role && 'image' in role && role.image && isPublicUrl(base)) embed.thumbnail = { url: `${base}${role.image}` }

  return post({ username: 'Ashen Wings  ·  Recruitment', embeds: [embed] })
}

const topicColors: Record<string, number> = {
  partnership: GOLD,
  tournament: 0x4da3ff,
  media: 0xb07cff,
  recruitment: COPPER,
  general: 0x9a9aa3,
}

export async function sendMessageToDiscord(message: MessageRow) {
  const base = siteUrl()
  const topic = topics.find((item) => item.value === message.topic)
  const priority = message.topic === 'partnership' || message.topic === 'tournament'
  const embed: Embed = {
    author: { name: 'ASHEN WINGS  ·  INBOX' },
    title: `${priority ? 'Priority  ·  ' : ''}${topic?.label ?? message.topic}`,
    url: `${base}/admin/messages`,
    description: `## ${cut(message.name, 60)}${message.organisation ? `  ·  ${cut(message.organisation, 60)}` : ''}\n${quote(message.message, 1200)}`,
    color: topicColors[message.topic] ?? 0x9a9aa3,
    fields: [
      { name: '▸ Reply to', value: message.email, inline: true },
      { name: '▸ Topic', value: topic?.label ?? message.topic, inline: true },
    ],
    footer: { text: `Message #${message.id}  ·  Ashen Wings` },
    timestamp: new Date(message.created_at).toISOString(),
  }
  return post({ username: 'Ashen Wings  ·  Inbox', embeds: [embed] })
}
