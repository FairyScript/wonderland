import Elysia from 'elysia'
import index from '../app/index.html'
import { apiController } from './controller/api'

const app = new Elysia({
  serve: {
    routes: { '/*': index },
    development: process.env.NODE_ENV !== 'production' && {
      // Enable browser hot reloading in development
      hmr: true,

      // Echo console logs from the browser to the server
      console: true,
    },
  },
})
  .use(apiController)
  .listen(3000)

console.log(`🚀 Server running at ${app.server?.url}`)
