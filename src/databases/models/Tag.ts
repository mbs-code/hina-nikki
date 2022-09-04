import { RegexUtil } from '~~/src/utils/RegexUtil'

export type DBTag = {
  id: number
  name: string // unique
  color?: string
  created_at: string // iso8601 UTC
  updated_at: string // iso8601 UTC
}

export type Tag = {
  id: number
  name: string // unique
  color?: string
  createdAt: Date
  updatedAt: Date
}

export type FormTag = {
  name: string // unique
  color?: string
}

export const formatTag = (db: DBTag): Tag => {
  return {
    id: db.id,
    name: db.name,
    color: db.color,
    createdAt: new Date(db.created_at),
    updatedAt: new Date(db.updated_at),
  }
}

export const parseTag = (form: FormTag) => {
  // バリデ
  const name = form.name?.trim()
  if (!name) { throw new Error('Name is empty.') }
  if (!RegexUtil.isHashtagTitle(name)) { throw new Error('Name has different format.') }

  return {
    name,
    color: form.color,
  }
}
