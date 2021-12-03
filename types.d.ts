export interface ServerError extends Error {
  statusCode?: number
  errors?: string[]
}

export interface INews {
  id: string
  author: string
  avatar: string
  title: string
  url: string
}

export interface INewsImage {
  id: string
  newsId: string
  image: string
}

export interface INewsComment {
  id: string
  newsId: string
  name: string
  avatar: string
  comment: string
}

export interface IQuery {
  [key: string]: unknown
}

export interface IQueryChange {
  [key: string]: unknown
}

export interface IModel {
  create(data: M): Promise<unknown>
  find(query: IQuery): Promise<unknown[]>
  findFirst(query: IQuery): Promise<unknown>
  update(query: IQuery, change: IQueryChange): Promise<unknown[]>
  remove(query: IQuery): Promise<void>
}
