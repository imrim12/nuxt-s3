import path from 'path'

import { defineNuxtModule, addServerHandler, createResolver } from '@nuxt/kit'

// Module options TypeScript interface definition
export interface ModuleOptions {
  env: string;
  route: string;
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-s3',
    configKey: 's3'
  },
  // Default configuration options of the Nuxt module
  defaults: {
    env: path.resolve(process.cwd(), '.env'),
    route: '/api/s3',
  },
  async setup(options) {
    const dotenv = await import('dotenv')
    dotenv.config({ path: options.env })

    const resolver = createResolver(import.meta.url)

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addServerHandler({
      route: options.route,
      method: 'put',
      middleware: true,
      lazy: true,
      handler: resolver.resolve('./runtime/handler')
    })
  }
})
