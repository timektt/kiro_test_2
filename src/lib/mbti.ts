import { MBTIType } from '@/types'

export interface MBTIInfo {
  type: MBTIType
  name: string
  nickname: string
  description: string
  traits: string[]
  color: string
  emoji: string
  strengths: string[]
  challenges: string[]
}

export const MBTI_DATA: Record<MBTIType, MBTIInfo> = {
  // Analysts
  INTJ: {
    type: 'INTJ',
    name: 'Architect',
    nickname: 'The Mastermind',
    description: 'Imaginative and strategic thinkers, with a plan for everything.',
    traits: ['Strategic', 'Independent', 'Decisive', 'Determined'],
    color: 'purple',
    emoji: '🏗️',
    strengths: ['Strategic thinking', 'Independence', 'Determination', 'Vision'],
    challenges: ['Perfectionism', 'Impatience', 'Overthinking', 'Social situations']
  },
  INTP: {
    type: 'INTP',
    name: 'Thinker',
    nickname: 'The Logician',
    description: 'Innovative inventors with an unquenchable thirst for knowledge.',
    traits: ['Analytical', 'Creative', 'Objective', 'Curious'],
    color: 'indigo',
    emoji: '🧠',
    strengths: ['Logical analysis', 'Creativity', 'Objectivity', 'Intellectual curiosity'],
    challenges: ['Procrastination', 'Insensitivity', 'Absent-mindedness', 'Condescension']
  },
  ENTJ: {
    type: 'ENTJ',
    name: 'Commander',
    nickname: 'The Executive',
    description: 'Bold, imaginative and strong-willed leaders, always finding a way.',
    traits: ['Confident', 'Strategic', 'Charismatic', 'Efficient'],
    color: 'red',
    emoji: '👑',
    strengths: ['Leadership', 'Strategic thinking', 'Efficiency', 'Confidence'],
    challenges: ['Impatience', 'Arrogance', 'Intolerance', 'Ruthlessness']
  },
  ENTP: {
    type: 'ENTP',
    name: 'Debater',
    nickname: 'The Visionary',
    description: 'Smart and curious thinkers who cannot resist an intellectual challenge.',
    traits: ['Innovative', 'Enthusiastic', 'Charismatic', 'Knowledgeable'],
    color: 'orange',
    emoji: '💡',
    strengths: ['Innovation', 'Enthusiasm', 'Charisma', 'Quick thinking'],
    challenges: ['Argumentative', 'Insensitive', 'Intolerant', 'Difficulty focusing']
  },

  // Diplomats
  INFJ: {
    type: 'INFJ',
    name: 'Advocate',
    nickname: 'The Counselor',
    description: 'Quiet and mystical, yet very inspiring and tireless idealists.',
    traits: ['Insightful', 'Principled', 'Passionate', 'Altruistic'],
    color: 'teal',
    emoji: '🌟',
    strengths: ['Insight', 'Inspiration', 'Passion', 'Altruism'],
    challenges: ['Perfectionism', 'Sensitivity', 'Burnout', 'Reluctance to open up']
  },
  INFP: {
    type: 'INFP',
    name: 'Mediator',
    nickname: 'The Healer',
    description: 'Poetic, kind and altruistic people, always eager to help a good cause.',
    traits: ['Idealistic', 'Loyal', 'Adaptable', 'Curious'],
    color: 'green',
    emoji: '🌱',
    strengths: ['Idealism', 'Loyalty', 'Adaptability', 'Passion'],
    challenges: ['Impracticality', 'Self-isolation', 'Unfocused', 'Emotionally vulnerable']
  },
  ENFJ: {
    type: 'ENFJ',
    name: 'Protagonist',
    nickname: 'The Teacher',
    description: 'Charismatic and inspiring leaders, able to mesmerize their listeners.',
    traits: ['Charismatic', 'Altruistic', 'Natural leader', 'Reliable'],
    color: 'blue',
    emoji: '🎭',
    strengths: ['Charisma', 'Altruism', 'Leadership', 'Reliability'],
    challenges: ['Overly idealistic', 'Too selfless', 'Too sensitive', 'Fluctuating self-esteem']
  },
  ENFP: {
    type: 'ENFP',
    name: 'Campaigner',
    nickname: 'The Inspirer',
    description: 'Enthusiastic, creative and sociable free spirits, who can always find a reason to smile.',
    traits: ['Enthusiastic', 'Creative', 'Sociable', 'Energetic'],
    color: 'pink',
    emoji: '🎨',
    strengths: ['Enthusiasm', 'Creativity', 'Sociability', 'Optimism'],
    challenges: ['Poor practical skills', 'Difficulty focusing', 'Overthinking', 'Gets stressed easily']
  },

  // Sentinels
  ISTJ: {
    type: 'ISTJ',
    name: 'Logistician',
    nickname: 'The Inspector',
    description: 'Practical and fact-minded, reliable and responsible.',
    traits: ['Honest', 'Direct', 'Strong-willed', 'Dutiful'],
    color: 'slate',
    emoji: '📋',
    strengths: ['Honesty', 'Dedication', 'Strong-will', 'Responsibility'],
    challenges: ['Stubbornness', 'Insensitivity', 'Always by the book', 'Judgmental']
  },
  ISFJ: {
    type: 'ISFJ',
    name: 'Protector',
    nickname: 'The Nurturer',
    description: 'Very dedicated and warm protectors, always ready to defend their loved ones.',
    traits: ['Supportive', 'Reliable', 'Patient', 'Imaginative'],
    color: 'cyan',
    emoji: '🛡️',
    strengths: ['Support', 'Reliability', 'Patience', 'Practical skills'],
    challenges: ['Humble', 'Shy', 'Take things personally', 'Repress feelings']
  },
  ESTJ: {
    type: 'ESTJ',
    name: 'Executive',
    nickname: 'The Supervisor',
    description: 'Excellent administrators, unsurpassed at managing things or people.',
    traits: ['Dedicated', 'Strong-willed', 'Direct', 'Honest'],
    color: 'amber',
    emoji: '💼',
    strengths: ['Dedication', 'Strong-will', 'Direct', 'Honesty'],
    challenges: ['Inflexible', 'Uncomfortable with unconventional situations', 'Judgmental', 'Too focused on social status']
  },
  ESFJ: {
    type: 'ESFJ',
    name: 'Consul',
    nickname: 'The Provider',
    description: 'Extraordinarily caring, social and popular people, always eager to help.',
    traits: ['Strong practical skills', 'Dutiful', 'Very loyal', 'Sensitive'],
    color: 'emerald',
    emoji: '🤝',
    strengths: ['Practical skills', 'Loyalty', 'Good at connecting with others', 'Hard-working'],
    challenges: ['Worried about social status', 'Inflexible', 'Reluctant to innovate', 'Vulnerable to criticism']
  },

  // Explorers
  ISTP: {
    type: 'ISTP',
    name: 'Virtuoso',
    nickname: 'The Craftsman',
    description: 'Bold and practical experimenters, masters of all kinds of tools.',
    traits: ['Tolerant', 'Flexible', 'Charming', 'Unpredictable'],
    color: 'stone',
    emoji: '🔧',
    strengths: ['Optimistic', 'Creative', 'Practical', 'Spontaneous'],
    challenges: ['Stubborn', 'Insensitive', 'Private', 'Easily bored']
  },
  ISFP: {
    type: 'ISFP',
    name: 'Adventurer',
    nickname: 'The Artist',
    description: 'Flexible and charming artists, always ready to explore new possibilities.',
    traits: ['Charming', 'Sensitive', 'Imaginative', 'Passionate'],
    color: 'rose',
    emoji: '🎪',
    strengths: ['Charming', 'Sensitive to others', 'Imaginative', 'Passionate'],
    challenges: ['Fiercely independent', 'Unpredictable', 'Easily stressed', 'Overly competitive']
  },
  ESTP: {
    type: 'ESTP',
    name: 'Entrepreneur',
    nickname: 'The Dynamo',
    description: 'Smart, energetic and very perceptive people, who truly enjoy living on the edge.',
    traits: ['Bold', 'Rational', 'Practical', 'Original'],
    color: 'yellow',
    emoji: '⚡',
    strengths: ['Bold', 'Rational and practical', 'Original', 'Perceptive'],
    challenges: ['Insensitive', 'Impatient', 'Risk-prone', 'Unstructured']
  },
  ESFP: {
    type: 'ESFP',
    name: 'Entertainer',
    nickname: 'The Performer',
    description: 'Spontaneous, energetic and enthusiastic people – life is never boring around them.',
    traits: ['Bold', 'Original', 'Aesthetics', 'Showmanship'],
    color: 'lime',
    emoji: '🎉',
    strengths: ['Bold', 'Original', 'Practical', 'Observant'],
    challenges: ['Sensitive', 'Conflict-averse', 'Easily bored', 'Poor long-term planning']
  }
}

export const MBTI_CATEGORIES = {
  ANALYSTS: ['INTJ', 'INTP', 'ENTJ', 'ENTP'] as MBTIType[],
  DIPLOMATS: ['INFJ', 'INFP', 'ENFJ', 'ENFP'] as MBTIType[],
  SENTINELS: ['ISTJ', 'ISFJ', 'ESTJ', 'ESFJ'] as MBTIType[],
  EXPLORERS: ['ISTP', 'ISFP', 'ESTP', 'ESFP'] as MBTIType[]
}

export const CATEGORY_INFO = {
  ANALYSTS: {
    name: 'Analysts',
    description: 'Rational and impartial, they excel at intellectual debates and scientific or technological fields.',
    color: 'purple'
  },
  DIPLOMATS: {
    name: 'Diplomats', 
    description: 'Cooperative and imaginative, they tend to see the good in everyone and everything.',
    color: 'green'
  },
  SENTINELS: {
    name: 'Sentinels',
    description: 'Cooperative and highly practical, they are excellent at creating and maintaining a secure and stable environment.',
    color: 'blue'
  },
  EXPLORERS: {
    name: 'Explorers',
    description: 'Highly independent, they strongly dislike rules and limitations and are often seen as the life of the party.',
    color: 'orange'
  }
}

export function getMBTIInfo(type: MBTIType): MBTIInfo {
  return MBTI_DATA[type]
}

export function getMBTICategory(type: MBTIType): keyof typeof MBTI_CATEGORIES {
  for (const [category, types] of Object.entries(MBTI_CATEGORIES)) {
    if (types.includes(type)) {
      return category as keyof typeof MBTI_CATEGORIES
    }
  }
  return 'ANALYSTS' // fallback
}

export function getRandomMBTIType(): MBTIType {
  const allTypes = Object.keys(MBTI_DATA) as MBTIType[]
  return allTypes[Math.floor(Math.random() * allTypes.length)]
}

export function getMBTIColorClass(type: MBTIType): string {
  const info = getMBTIInfo(type)
  const colorMap: Record<string, string> = {
    purple: 'bg-purple-100 text-purple-800 border-purple-200',
    indigo: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    red: 'bg-red-100 text-red-800 border-red-200',
    orange: 'bg-orange-100 text-orange-800 border-orange-200',
    teal: 'bg-teal-100 text-teal-800 border-teal-200',
    green: 'bg-green-100 text-green-800 border-green-200',
    blue: 'bg-blue-100 text-blue-800 border-blue-200',
    pink: 'bg-pink-100 text-pink-800 border-pink-200',
    slate: 'bg-slate-100 text-slate-800 border-slate-200',
    cyan: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    amber: 'bg-amber-100 text-amber-800 border-amber-200',
    emerald: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    stone: 'bg-stone-100 text-stone-800 border-stone-200',
    rose: 'bg-rose-100 text-rose-800 border-rose-200',
    yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    lime: 'bg-lime-100 text-lime-800 border-lime-200'
  }
  return colorMap[info.color] || 'bg-gray-100 text-gray-800 border-gray-200'
}

