import { defineEventHandler, createError } from 'h3'

export default defineEventHandler((event) => {
  const method = event.node.req.method
  switch (method) {
    case 'PUT':

      return { success: true };

    default:
      return createError({
        statusCode: 405,
        message: `Method ${method} is not allowed`
      });
  }
})
