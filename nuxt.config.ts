// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  vite: {
    server: {
      allowedHosts: true,
    },
  },
  modules: [
    "@nuxt/content",
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxt/scripts",
    "@nuxt/test-utils",
    "@nuxtjs/tailwindcss",
    "reka-ui/nuxt",
    "@nuxtjs/google-fonts",
    "motion-v/nuxt",
  ],
  icon: {
    serverBundle: {
      collections: ["uil"], // <!--- this
    },
  },
  nitro: {
    storage: {
      uploads: {
        driver: "fs",
        base: "./public/uploads",
      },
    },
    imports: {
      dirs: ["shared/**"],
    },
  },
  runtimeConfig: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    CHROME_PATH: process.env.CHROME_PATH,
    QSTASH_TOKEN: process.env.QSTASH_TOKEN,
    API_URL: process.env.API_URL,
    REDIS_URL: process.env.REDIS_URL,
    DB_URI: process.env.DB_URI,
    DB_SECRET: process.env.DB_SECRET,
  },
  imports: {
    dirs: ["shared/**"],
  },
  googleFonts: {
    families: {
      "Space Grotesk": true,
    },
  },
});
