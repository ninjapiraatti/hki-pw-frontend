export interface Listable {
  id: string
  title: string
  ingress?: string
  body?: string
  images?: Record<string, string>
  tags?: string[]
  created: string
  updated: string
}

export interface Character extends Listable {
  name: string
  bio: string
  image: File | null
  strength: number
  perception: number
  endurance: number
  charisma: number
  intelligence: number
  agility: number
  luck: number
  deutscheMarks: number
  inventory: string[]
}

export interface Thing extends Listable {
  attributeEffects?: AttributeEffect[]
  skillEffects?: SkillEffect[]
  damage?: string
}

export interface Article extends Listable {
  author: string
}

export interface AttributeEffect {
  target: "Strength" | "Perception" | "Endurance" | "Charisma" | "Intelligence" | "Agility" | "Luck"
  strength: number
}

export interface SkillEffect {
  target: string
  strength: number
}