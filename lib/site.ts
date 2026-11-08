export const site = {
  name: 'Fnatic Wolf',
  short: 'FW',
  tagline: 'Rise with the pack.',
  game: 'Mobile Legends: Bang Bang',
  description:
    'Fnatic Wolf is a young, ambitious Mobile Legends: Bang Bang esports organisation. Apply to join the roster, meet the pack, or partner with us.',
  nav: [
    { href: '/', label: 'Home' },
    { href: '/recruitment', label: 'Recruitment' },
    { href: '/faq', label: 'FAQ' },
    { href: '/contact', label: 'Contact' },
  ],
} as const

export type RoleId = 'gold' | 'exp' | 'mid' | 'jungle' | 'roam' | 'staff'

export type Role = {
  id: RoleId
  name: string
  tag: string
  image: string
  blurb: string
  traits: string[]
  player: boolean
  accent: string
}

export const roles: Role[] = [
  {
    id: 'gold',
    name: 'Gold Laner',
    tag: 'Marksman',
    image: '/art/role-gold.png',
    blurb: 'The late-game carry. Positioning, farm discipline and calm under pressure.',
    traits: ['Safe, consistent positioning', 'Objective timing', 'Comfortable carrying fights'],
    player: true,
    accent: '#ff5a1f',
  },
  {
    id: 'exp',
    name: 'EXP Laner',
    tag: 'Fighter',
    image: '/art/role-exp.png',
    blurb: 'The frontline lane general. Wins trades, creates space, takes the hard fights.',
    traits: ['Lane control and wave management', 'Flexible hero pool', 'Team-fight initiation'],
    player: true,
    accent: '#ff7a2f',
  },
  {
    id: 'mid',
    name: 'Mid Laner',
    tag: 'Mage',
    image: '/art/role-mid.png',
    blurb: 'The map-wide playmaker. Rotations, burst and tempo that decide the match.',
    traits: ['Fast rotations', 'Burst combo execution', 'Vision and tempo calls'],
    player: true,
    accent: '#ff5a1f',
  },
  {
    id: 'jungle',
    name: 'Jungler',
    tag: 'Assassin',
    image: '/art/role-jungle.png',
    blurb: 'The engine of the team. Pathing, ganks, objectives and relentless map pressure.',
    traits: ['Efficient clear routes', 'Objective control', 'Sharp gank timing'],
    player: true,
    accent: '#ff8a4c',
  },
  {
    id: 'roam',
    name: 'Roamer',
    tag: 'Tank / Support',
    image: '/art/role-roam.png',
    blurb: 'The shot-caller\'s shield. Vision, peel and engages that open every fight.',
    traits: ['Vision and map awareness', 'Engage / peel decisions', 'Communication first'],
    player: true,
    accent: '#ff5a1f',
  },
  {
    id: 'staff',
    name: 'Staff & Creators',
    tag: 'Coach · Analyst · Content · Mods',
    image: '/art/role-staff.png',
    blurb: 'Coaches, analysts, editors, designers and community mods who build the brand behind the roster.',
    traits: ['Reliable and self-driven', 'Portfolio or proven experience', 'Understands MLBB and its community'],
    player: false,
    accent: '#ff7a2f',
  },
]

export const ranks = [
  'Epic',
  'Legend',
  'Mythic',
  'Mythical Honor',
  'Mythical Glory',
  'Mythical Immortal',
] as const

export const experienceLevels = [
  { value: 'ranked', label: 'Ranked only' },
  { value: 'scrims', label: 'Scrims / custom lobbies' },
  { value: 'amateur', label: 'Amateur tournaments' },
  { value: 'semi-pro', label: 'Semi-pro / organised teams' },
  { value: 'pro', label: 'Professional' },
  { value: 'staff', label: 'Staff / non-playing experience' },
] as const

export const topics = [
  { value: 'partnership', label: 'Partnership / sponsorship' },
  { value: 'tournament', label: 'Scrims / tournament invite' },
  { value: 'media', label: 'Media / collaboration' },
  { value: 'recruitment', label: 'Recruitment question' },
  { value: 'general', label: 'General enquiry' },
] as const

export const statuses = [
  {
    value: 'new',
    label: 'Received',
    tone: 'ember',
    publicText: 'Your application is in the queue. A member of the team will read it shortly.',
  },
  {
    value: 'reviewing',
    label: 'In review',
    tone: 'sky',
    publicText: 'The manager is reviewing your application right now.',
  },
  {
    value: 'shortlisted',
    label: 'Shortlisted',
    tone: 'amber',
    publicText: 'You made the shortlist. Watch your Discord DMs for the next step.',
  },
  {
    value: 'trial',
    label: 'Trial invited',
    tone: 'violet',
    publicText: 'You are invited to a trial. Check your Discord for scrim details.',
  },
  {
    value: 'accepted',
    label: 'Accepted',
    tone: 'green',
    publicText: 'Welcome to the pack. You will be contacted with onboarding details.',
  },
  {
    value: 'waitlist',
    label: 'Waitlist',
    tone: 'slate',
    publicText: 'We liked what we saw but have no open slot right now. You are on our waitlist.',
  },
  {
    value: 'declined',
    label: 'Not this time',
    tone: 'red',
    publicText: 'We are not moving forward right now. Keep grinding and feel free to apply again later.',
  },
] as const

export type StatusValue = (typeof statuses)[number]['value']

export const getRole = (id: string) => roles.find((role) => role.id === id)
export const getStatus = (value: string) => statuses.find((status) => status.value === value) ?? statuses[0]

export const faqs = [
  {
    category: 'Recruitment',
    items: [
      {
        q: 'Do I need competitive experience to apply?',
        a: 'No. Experience helps, but game sense, attitude and coachability matter more. If you are ranked high and serious about improving, apply and tell us your story.',
      },
      {
        q: 'Which roles are you recruiting for?',
        a: 'All five in-game roles (Gold, EXP, Mid, Jungle, Roam) plus staff and creator positions such as coaches, analysts, video editors, designers and community moderators.',
      },
      {
        q: 'How long does the review take?',
        a: 'Most complete applications are reviewed within 7 to 14 days. Every application is read by the manager personally, so quality beats speed.',
      },
      {
        q: 'How will I hear back?',
        a: 'Through the Discord username you give us, so make sure your DMs are open. You can also check your application status any time with your tracking code.',
      },
      {
        q: 'Can I apply for more than one role?',
        a: 'Yes. Submit a separate application for each role and be clear about your strongest one.',
      },
    ],
  },
  {
    category: 'Requirements',
    items: [
      {
        q: 'What rank do I need?',
        a: 'We look for players in Epic and above, with a strong preference for Mythic and higher. A lower rank with outstanding results or growth can still be considered.',
      },
      {
        q: 'Is there an age limit?',
        a: 'Applicants must be at least 13. If you are under 18, we will need a parent or guardian to be aware of your participation before any trial.',
      },
      {
        q: 'What do I need to be available for?',
        a: 'Scheduled scrims, practice blocks and tournaments. Tell us your real availability on the form; honesty here saves everyone time.',
      },
    ],
  },
  {
    category: 'Partnerships',
    items: [
      {
        q: 'Can my organisation or brand collaborate with Fnatic Wolf?',
        a: 'Absolutely. We are open to scrims, showmatches, content collaborations, sponsorships and media features. Use the contact page and choose the partnership topic.',
      },
      {
        q: 'How quickly do you reply to partnership enquiries?',
        a: 'Usually within 48 hours. Partnership messages are flagged so they reach the manager first.',
      },
    ],
  },
  {
    category: 'General',
    items: [
      {
        q: 'Is Fnatic Wolf a new organisation?',
        a: 'Yes, and we are proud of it. Everyone who joins now helps write the first chapter of the pack.',
      },
      {
        q: 'Does it cost anything to apply?',
        a: 'Never. Applying is free, and we will never ask for money during recruitment.',
      },
    ],
  },
]

export const news = [
  {
    tag: 'Announcement',
    title: 'Recruitment is officially open',
    excerpt:
      'We are scouting players across all five lanes, plus coaches, analysts, creators and community staff. Applications are reviewed personally.',
    image: '/art/hero-wolf.png',
    position: '75% 40%',
    href: '/recruitment',
    cta: 'Apply now',
  },
  {
    tag: 'Culture',
    title: 'What we look for in a Wolf',
    excerpt:
      'Rank gets you noticed. Discipline, communication and coachability get you signed. Here is the standard we hold ourselves to.',
    image: '/art/pack.png',
    position: '50% 50%',
    href: '/faq',
    cta: 'Read the FAQ',
  },
  {
    tag: 'Partnerships',
    title: 'Open to collabs, scrims and sponsors',
    excerpt:
      'Organisations, creators and brands: if you want to build something with a hungry young team, our door is open.',
    image: '/art/role-staff.png',
    position: '50% 30%',
    href: '/contact?topic=partnership',
    cta: 'Start a conversation',
  },
]

export const partnerOffers = [
  {
    title: 'Scrims & showmatches',
    text: 'Reliable practice partners and content-ready showmatches with a team that shows up on time.',
  },
  {
    title: 'Creator collaborations',
    text: 'Joint streams, challenges, edits and series built around our roster and your audience.',
  },
  {
    title: 'Sponsorship & brand integration',
    text: 'Clean, professional placements across our content, jerseys and community channels.',
  },
  {
    title: 'Media & features',
    text: 'Interviews, org spotlights and behind-the-scenes access to a young team on the rise.',
  },
]

export const socialLinks = () =>
  [
    { label: 'Discord', href: process.env.DISCORD_INVITE_URL },
    { label: 'Instagram', href: process.env.INSTAGRAM_URL },
    { label: 'YouTube', href: process.env.YOUTUBE_URL },
    { label: 'TikTok', href: process.env.TIKTOK_URL },
    { label: 'X', href: process.env.X_URL },
  ].filter((link): link is { label: string; href: string } => Boolean(link.href))

export const siteUrl = () => {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return 'http://localhost:3000'
}
