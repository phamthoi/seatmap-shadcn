export namespace Auth{
  export type LoginRQ = {
    email: string
    password: string
  }

  export type LoginRS = {
    userId: number
    roles: string[]
    token: Token
  }

  export type Token = {
    value: string
    type: string
  }
}