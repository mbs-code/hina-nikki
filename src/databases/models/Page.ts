import { Tag } from '~~/src/databases/models/Tag'

export interface Page {
  id: number
  title: string
  text: string
  created_at: Date
  updated_at: Date
}

export type PageWithTags = Page & {
  tags: Tag[]
}
