import { defineNuxtModule, addServerHandler, createResolver } from '@nuxt/kit'

// Module options TypeScript interface definition
export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-s3',
    configKey: 's3'
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  setup () {
    const resolver = createResolver(import.meta.url)

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addServerHandler({
      route: '/api/s3',
      method: 'put',
      middleware: true,
      lazy: true,
      handler: resolver.resolve('./runtime/handler')
    })
  }
})
