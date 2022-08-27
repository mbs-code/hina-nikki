import { Tag } from '~~/src/databases/models/Tag'

export type Report = {
  id: number
  title: string
  text: string
  created_at: Date
  updated_at: Date
}

export type ReportWithTag = Report & {
  tags: Tag[]
}

export type FormReport = {
  title: string
  text: string
  // tags: string[]
}
