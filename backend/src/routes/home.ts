import { defineRoutes } from '../utils/utils'
export default defineRoutes(app => {
  app.get('/', {
    schema: {
      summary: 'Home Page',
      description: 'This is the home page of the application.',
      tags: ['Home'],
      response: {
        200: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Welcome to the home page!' }
          }
        }
      }
    }
  }, (req, res) => {
    res.send({ message: 'Welcome to the home page!' })
  })
})