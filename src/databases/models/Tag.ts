import { RegexUtil } from '~~/src/utils/RegexUtil'

export type DBTag = {
  id: number
  name: string // unique
  color?: string
  is_pinned: number // 0, 1
  order: number // 0 ~
  created_at: string // iso8601 UTC
  updated_at: string // iso8601 UTC
}

export type Tag = {
  id: number
  name: string // unique
  color?: string
  isPinned: boolean
  order: number
  createdAt: Date
  updatedAt: Date
}

export type FormTag = {
  name: string // unique
  color?: string
  isPinned: boolean
  order: number
}

export const formatTag = (db: DBTag): Tag => {
  return {
    id: db.id,
    name: db.name,
    color: db.color,
    isPinned: Boolean(db.is_pinned),
    order: db.order,
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
    is_pinned: form.isPinned ? 1 : 0,
    order: form.order ?? 0,
  }
}
