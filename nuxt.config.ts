export default defineNuxtConfig({
  modules: [
    '@nuxt/ui'
    // '@nuxthub/core' // Temporarily disable to fix renderer error
  ],
  // hub: {
  //   ai: false
  // },
  runtimeConfig: {
    oauth: {
      github: {
        clientId: process.env.NUXT_OAUTH_GITHUB_CLIENT_ID || '',
        clientSecret: process.env.NUXT_OAUTH_GITHUB_CLIENT_SECRET || ''
      },
      google: {
        clientId: process.env.NUXT_OAUTH_GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.NUXT_OAUTH_GOOGLE_CLIENT_SECRET || ''
      }
    }
  },
  nitro: {
    experimental: {
      wasm: true
    }
  },
  experimental: {
    componentIslands: false
  },
  ssr: true
})
