import { experienceLevels, getRole, siteUrl, topics } from './site'
import type { ApplicationRow, MessageRow } from './db'

type Embed = Record<string, unknown>

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
  const role = getRole(app.role)
  const experience = experienceLevels.find((level) => level.value === app.experience)?.label ?? app.experience
  const isMinor = app.age < 18
  const fields: { name: string; value: string; inline?: boolean }[] = [
    { name: '▸ ROLE', value: `**${role?.name ?? app.role}**\n${role?.tag ?? ''}`, inline: true },
    { name: '▸ RANK', value: app.rank ? `**${app.rank}**` : 'n/a', inline: true },
    { name: '▸ EXPERIENCE', value: experience, inline: true },
    { name: '▸ GAME ID', value: app.game_id ? mono(`${app.game_id} (${app.server_id})`) : 'n/a', inline: true },
    { name: '▸ DISCORD', value: mono(app.discord), inline: true },
    { name: '▸ AGE', value: isMinor ? `${app.age}  ·  **minor**` : String(app.age), inline: true },
  ]
  if (app.main_heroes) fields.push({ name: '▸ MAIN HEROES', value: cut(app.main_heroes, 200) })
  fields.push({ name: '▸ AVAILABILITY', value: cut(`${app.availability}  ·  ${app.timezone}`, 300) })
  if (app.links) fields.push({ name: '▸ LINKS', value: cut(app.links, 400) })
  fields.push({ name: '▸ CONTACT', value: `${app.email}\n[Open in dashboard](${base}/admin/applications/${app.id})` })

  const embed: Embed = {
    author: { name: 'FNATIC WOLF  ·  RECRUITMENT DESK' },
    title: `New application  ·  ${role?.name ?? app.role}`,
    url: `${base}/admin/applications/${app.id}`,
    description: `## ${cut(app.name, 60)}${app.ign ? `  ·  ${cut(app.ign, 40)}` : ''}\n${quote(app.message, 700)}`,
    color: 0xff5a1f,
    fields,
    footer: { text: `Tracking ${app.code}  ·  Application #${app.id}` },
    timestamp: new Date(app.created_at).toISOString(),
  }
  if (role && isPublicUrl(base)) embed.thumbnail = { url: `${base}${role.image}` }

  return post({ username: 'Fnatic Wolf  ·  Recruitment', embeds: [embed] })
}

const topicColors: Record<string, number> = {
  partnership: 0xffc247,
  tournament: 0x4da3ff,
  media: 0xb07cff,
  recruitment: 0xff5a1f,
  general: 0x9a9aa3,
}

export async function sendMessageToDiscord(message: MessageRow) {
  const base = siteUrl()
  const topic = topics.find((item) => item.value === message.topic)
  const priority = message.topic === 'partnership' || message.topic === 'tournament'
  const embed: Embed = {
    author: { name: 'FNATIC WOLF  ·  INBOX' },
    title: `${priority ? 'Priority  ·  ' : ''}${topic?.label ?? message.topic}`,
    url: `${base}/admin/messages`,
    description: `## ${cut(message.name, 60)}${message.organisation ? `  ·  ${cut(message.organisation, 60)}` : ''}\n${quote(message.message, 1200)}`,
    color: topicColors[message.topic] ?? 0x9a9aa3,
    fields: [
      { name: '▸ REPLY TO', value: message.email, inline: true },
      { name: '▸ TOPIC', value: topic?.label ?? message.topic, inline: true },
    ],
    footer: { text: `Message #${message.id}  ·  Fnatic Wolf` },
    timestamp: new Date(message.created_at).toISOString(),
  }
  return post({ username: 'Fnatic Wolf  ·  Inbox', embeds: [embed] })
}
