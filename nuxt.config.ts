export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss'
    // '@nuxthub/core' // Temporarily disable to fix renderer error
  ],
  // hub: {
  //   ai: false
  // },
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
