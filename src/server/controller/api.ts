import Elysia from 'elysia'

export const apiController = new Elysia({ prefix: '/api' })

  .get('/hello', () => {
    return {
      message: 'Hello, world!',
      method: 'GET',
    }
  })
  .put('/hello', () => {
    return {
      message: 'Hello, world!',
      method: 'PUT',
    }
  })
  .get('/hello/:name', ({ params }) => {
    const name = params.name
    return {
      message: `Hello, ${name}!`,
    }
  })
