import { experienceLevels, getRole, ranks, staffExperienceLevels, staffRoles, topics } from './site'

export type Track = 'player' | 'staff'

export type ApplicationInput = {
  track: Track
  role: string
  name: string
  email: string
  discord: string
  age: string
  ign: string
  gameId: string
  serverId: string
  rank: string
  mainHeroes: string
  experience: string
  availability: string
  timezone: string
  links: string
  message: string
  // Staff track
  staffRole: string
  portfolio: string
  tools: string
  hours: string
  pastTeams: string
  pitch: string
  // Player track
  flexLane: string
  shotcalling: string
  consent: boolean
  website: string
}

export type ApplicationErrors = Partial<Record<keyof ApplicationInput, string>>

export const emptyApplication: ApplicationInput = {
  track: 'player',
  role: '',
  name: '',
  email: '',
  discord: '',
  age: '',
  ign: '',
  gameId: '',
  serverId: '',
  rank: '',
  mainHeroes: '',
  experience: '',
  availability: '',
  timezone: '',
  links: '',
  message: '',
  staffRole: '',
  portfolio: '',
  tools: '',
  hours: '',
  pastTeams: '',
  pitch: '',
  flexLane: '',
  shotcalling: '',
  consent: false,
  website: '',
}

export const playerSteps: { label: string; fields: (keyof ApplicationInput)[] }[] = [
  { label: 'Role', fields: ['role', 'name', 'email', 'discord', 'age'] },
  { label: 'Game profile', fields: ['ign', 'gameId', 'serverId', 'rank', 'mainHeroes', 'flexLane', 'shotcalling', 'experience', 'availability', 'timezone'] },
  { label: 'Your story', fields: ['message', 'links'] },
  { label: 'Review', fields: ['consent'] },
]

export const staffSteps: { label: string; fields: (keyof ApplicationInput)[] }[] = [
  { label: 'Role', fields: ['staffRole', 'name', 'email', 'discord', 'age'] },
  { label: 'Experience', fields: ['experience', 'portfolio', 'tools', 'hours', 'pastTeams', 'availability', 'timezone'] },
  { label: 'Your pitch', fields: ['pitch', 'message', 'links'] },
  { label: 'Review', fields: ['consent'] },
]

// Backwards-compatible name used by the old single form.
export const applicationSteps = playerSteps

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function validateApplication(input: ApplicationInput): ApplicationErrors {
  const errors: ApplicationErrors = {}
  const length = (value: string) => value.trim().length

  if (input.track !== 'player' && input.track !== 'staff') errors.track = 'Choose player or staff.'
  if (length(input.name) < 2 || length(input.name) > 60) errors.name = 'Enter your name (2-60 characters).'
  if (!emailPattern.test(input.email.trim()) || length(input.email) > 120) errors.email = 'Enter a valid email address.'
  if (length(input.discord) < 2 || length(input.discord) > 40) errors.discord = 'Enter your Discord username.'

  const age = Number(input.age)
  if (!Number.isInteger(age) || age < 13 || age > 60) errors.age = 'Age must be between 13 and 60.'

  if (input.track === 'staff') {
    if (!staffRoles.some((item) => item.id === input.staffRole)) errors.staffRole = 'Choose the staff role you are applying for.'
    if (!staffExperienceLevels.some((level) => level.value === input.experience)) errors.experience = 'Select your experience level.'
    if (length(input.portfolio) < 4 || length(input.portfolio) > 300) errors.portfolio = 'Add a portfolio link (or a link to your work).'
    if (length(input.tools) < 2 || length(input.tools) > 200) errors.tools = 'List the tools or skills you use.'
    if (length(input.hours) < 2 || length(input.hours) > 100) errors.hours = 'Tell us how many hours a week you can commit.'
    if (length(input.pastTeams) > 300) errors.pastTeams = 'Keep this under 300 characters.'
    if (length(input.pitch) < 30) errors.pitch = 'Give us your first idea in a few sentences (30+ characters).'
    if (length(input.pitch) > 800) errors.pitch = 'Please keep your pitch under 800 characters.'
    if (length(input.availability) < 3 || length(input.availability) > 200) errors.availability = 'Tell us when you can work.'
    if (length(input.timezone) < 2 || length(input.timezone) > 60) errors.timezone = 'Enter your timezone or country.'
    if (length(input.links) > 600) errors.links = 'Keep links under 600 characters.'
    if (length(input.message) < 30) errors.message = 'Tell us about yourself in a few sentences (30+ characters).'
    if (length(input.message) > 1200) errors.message = 'Please keep this under 1200 characters.'
  } else {
    const role = getRole(input.role)
    if (!role || !('player' in role && role.player)) errors.role = 'Choose the lane you are applying for.'
    if (length(input.ign) < 2 || length(input.ign) > 40) errors.ign = 'Enter your in-game name.'
    if (!/^\d{5,15}$/.test(input.gameId.trim())) errors.gameId = 'Game ID should be numbers only.'
    if (!/^\d{1,6}$/.test(input.serverId.trim())) errors.serverId = 'Server ID should be numbers only.'
    if (!(ranks as readonly string[]).includes(input.rank)) errors.rank = 'Select your current or peak rank.'
    if (length(input.mainHeroes) < 2 || length(input.mainHeroes) > 200) errors.mainHeroes = 'List the heroes you play most.'
    if (!experienceLevels.some((level) => level.value === input.experience)) errors.experience = 'Select your experience level.'
    if (length(input.availability) < 3 || length(input.availability) > 200) errors.availability = 'Tell us when you can play.'
    if (length(input.timezone) < 2 || length(input.timezone) > 60) errors.timezone = 'Enter your timezone or country.'
    if (length(input.links) > 600) errors.links = 'Keep links under 600 characters.'
    if (length(input.message) < 30) errors.message = 'Give us at least a few sentences (30+ characters).'
    if (length(input.message) > 1200) errors.message = 'Please keep this under 1200 characters.'
  }

  if (!input.consent) errors.consent = 'You need to confirm before submitting.'

  return errors
}

export function cleanApplication(raw: Partial<Record<keyof ApplicationInput, unknown>>): ApplicationInput {
  const text = (value: unknown, max: number) => (typeof value === 'string' ? value.trim().slice(0, max) : '')
  const track = raw.track === 'staff' ? 'staff' : 'player'
  return {
    track,
    role: text(raw.role, 20),
    name: text(raw.name, 80),
    email: text(raw.email, 140).toLowerCase(),
    discord: text(raw.discord, 60),
    age: text(raw.age, 3),
    ign: text(raw.ign, 60),
    gameId: text(raw.gameId, 20),
    serverId: text(raw.serverId, 10),
    rank: text(raw.rank, 40),
    mainHeroes: text(raw.mainHeroes, 240),
    experience: text(raw.experience, 20),
    availability: text(raw.availability, 240),
    timezone: text(raw.timezone, 80),
    links: text(raw.links, 700),
    message: text(raw.message, 1400),
    staffRole: text(raw.staffRole, 20),
    portfolio: text(raw.portfolio, 400),
    tools: text(raw.tools, 240),
    hours: text(raw.hours, 120),
    pastTeams: text(raw.pastTeams, 400),
    pitch: text(raw.pitch, 1000),
    flexLane: text(raw.flexLane, 20),
    shotcalling: text(raw.shotcalling, 10),
    consent: raw.consent === true,
    website: text(raw.website, 100),
  }
}

export type ContactInput = {
  topic: string
  name: string
  email: string
  organisation: string
  message: string
  website: string
}

export type ContactErrors = Partial<Record<keyof ContactInput, string>>

export const emptyContact: ContactInput = { topic: 'partnership', name: '', email: '', organisation: '', message: '', website: '' }

export function cleanContact(raw: Partial<Record<keyof ContactInput, unknown>>): ContactInput {
  const text = (value: unknown, max: number) => (typeof value === 'string' ? value.trim().slice(0, max) : '')
  return {
    topic: text(raw.topic, 30),
    name: text(raw.name, 80),
    email: text(raw.email, 140).toLowerCase(),
    organisation: text(raw.organisation, 100),
    message: text(raw.message, 2000),
    website: text(raw.website, 100),
  }
}

export function validateContact(input: ContactInput): ContactErrors {
  const errors: ContactErrors = {}
  if (!topics.some((topic) => topic.value === input.topic)) errors.topic = 'Choose a topic.'
  if (input.name.length < 2) errors.name = 'Enter your name.'
  if (!emailPattern.test(input.email)) errors.email = 'Enter a valid email address.'
  if (input.message.length < 20) errors.message = 'Tell us a bit more (20+ characters).'
  if (input.message.length > 2000) errors.message = 'Please keep this under 2000 characters.'
  return errors
}
