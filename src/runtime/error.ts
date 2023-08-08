import { createError } from 'h3'

export class HttpError {
  messages: string[] = []

  constructor(messages?: string[]) {
    if (messages) {
      this.messages = messages;
    }
  }

  BAD_DATA = createError({
    statusCode: 400,
    message: this.messages.length > 0 ? this.messages.join(', ') : 'Bad data!'
  })

  UNAUTHORIZED = createError({
    statusCode: 401,
    message: 'Unauthorized!'
  })

  METHOD_NOT_ALLOWED = createError({
    statusCode: 405,
    message: 'Method is not allowed!'
  })

  NOT_FOUND = createError({
    statusCode: 404,
    message: 'Not Found!'
  })

  INTERNAL_SERVER_ERROR = createError({
    statusCode: 500,
    message: 'Internal Server Error!'
  })
}