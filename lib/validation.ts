import { experienceLevels, getRole, ranks, topics } from './site'

export type ApplicationInput = {
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
  consent: boolean
  website: string
}

export type ApplicationErrors = Partial<Record<keyof ApplicationInput, string>>

export const emptyApplication: ApplicationInput = {
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
  consent: false,
  website: '',
}

export const applicationSteps: { label: string; fields: (keyof ApplicationInput)[] }[] = [
  { label: 'Role', fields: ['role', 'name', 'email', 'discord', 'age'] },
  { label: 'Game profile', fields: ['ign', 'gameId', 'serverId', 'rank', 'mainHeroes', 'experience', 'availability', 'timezone'] },
  { label: 'Your story', fields: ['message', 'links'] },
  { label: 'Review', fields: ['consent'] },
]

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function validateApplication(input: ApplicationInput): ApplicationErrors {
  const errors: ApplicationErrors = {}
  const role = getRole(input.role)
  const isPlayer = role?.player ?? false
  const length = (value: string) => value.trim().length

  if (!role) errors.role = 'Choose the role you are applying for.'
  if (length(input.name) < 2 || length(input.name) > 60) errors.name = 'Enter your name (2-60 characters).'
  if (!emailPattern.test(input.email.trim()) || length(input.email) > 120) errors.email = 'Enter a valid email address.'
  if (length(input.discord) < 2 || length(input.discord) > 40) errors.discord = 'Enter your Discord username.'

  const age = Number(input.age)
  if (!Number.isInteger(age) || age < 13 || age > 60) errors.age = 'Age must be between 13 and 60.'

  if (isPlayer) {
    if (length(input.ign) < 2 || length(input.ign) > 40) errors.ign = 'Enter your in-game name.'
    if (!/^\d{5,15}$/.test(input.gameId.trim())) errors.gameId = 'Game ID should be numbers only.'
    if (!/^\d{1,6}$/.test(input.serverId.trim())) errors.serverId = 'Server ID should be numbers only.'
    if (!(ranks as readonly string[]).includes(input.rank)) errors.rank = 'Select your current or peak rank.'
    if (length(input.mainHeroes) < 2 || length(input.mainHeroes) > 200) errors.mainHeroes = 'List the heroes you play most.'
  } else {
    if (length(input.ign) > 40) errors.ign = 'Keep this under 40 characters.'
    if (input.gameId && !/^\d{5,15}$/.test(input.gameId.trim())) errors.gameId = 'Game ID should be numbers only.'
    if (input.serverId && !/^\d{1,6}$/.test(input.serverId.trim())) errors.serverId = 'Server ID should be numbers only.'
    if (length(input.mainHeroes) > 200) errors.mainHeroes = 'Keep this under 200 characters.'
  }

  if (!experienceLevels.some((level) => level.value === input.experience)) errors.experience = 'Select your experience level.'
  if (length(input.availability) < 3 || length(input.availability) > 200) errors.availability = 'Tell us when you can play or work.'
  if (length(input.timezone) < 2 || length(input.timezone) > 60) errors.timezone = 'Enter your timezone or country.'
  if (length(input.links) > 600) errors.links = 'Keep links under 600 characters.'
  if (length(input.message) < 30) errors.message = 'Give us at least a few sentences (30+ characters).'
  if (length(input.message) > 1200) errors.message = 'Please keep this under 1200 characters.'
  if (!input.consent) errors.consent = 'You need to confirm before submitting.'

  return errors
}

export function cleanApplication(raw: Partial<Record<keyof ApplicationInput, unknown>>): ApplicationInput {
  const text = (value: unknown, max: number) => (typeof value === 'string' ? value.trim().slice(0, max) : '')
  return {
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
