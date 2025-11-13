export interface User {
  username: string
  role: 'admin' | 'hacker'
}

export interface IdeaPage {
  title: string
  content: string
  filename: string
}

export interface IdeaPageMetadata {
  title: string
  filename: string
}

export type IdeaVisibility = 'public' | 'private' | string[]

export type IdeaType = 'Hackathon idea' | 'Project idea' | 'Resume project idea'

export interface HackathonIdea {
  id: string
  name: string
  author: string
  description: string
  visibility: IdeaVisibility
  ideaType: IdeaType
  pages: IdeaPage[]
  approved: boolean
  createdAt: string
}

export interface AppSettings {
  requireAdminApproval: boolean
}

export type Theme = 'light' | 'dark' | 'ocean' | 'sunset' | 'forest' | 'purple'
