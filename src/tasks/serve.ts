import { defineTask } from '@tossdev/click'
import { createServer } from 'vite'
import { setup, watch } from '..'

export const serveTask = defineTask({
  name: 'dev',
  about: 'Start dev server',
  handler(args, opts) {
    async function runTask() {
      await setup()
      const server = await createServer()
      await server.listen()
      server.printUrls()
      watch()
    }

    runTask().catch(console.error)
  }
})
