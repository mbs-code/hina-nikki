import { Tag } from '~~/src/databases/models/Tag'

export type Page = {
  id: number
  title: string
  text: string
  created_at: Date
  updated_at: Date
}

export type PageWithTag = Page & {
  tags: Tag[]
}

export type FormPage = {
  title: string
  text: string
  // tags: string[]
}
