export interface Character {
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
}

export interface Article {
  id: string
  title: string
  body: string
  images: File[]
  tags: string[]
  created: string
  updated: string
}

export interface Effect {
  name: string
  description: string
}

export interface Thing {
  id: string
  title: string
  body: string
  images: File[]
  tags: string[]
  created: string
  updated: string
  effects: Effect[]
}