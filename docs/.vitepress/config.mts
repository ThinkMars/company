import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: '我的公司',
  description: 'collect more enterprise products',
  srcDir: 'src', // https://vitepress.dev/reference/site-config
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '指标监控', link: '/web-metrics-performance' },
      { text: '类GPT', link: '/my-gpt' },
    ],
    sidebar: {
      '/': [
        {
          text: '',
          items: [
            { text: '是什么', link: '/introduction' },
            { text: '产品列表', link: '/introduction/product-list' },
          ],
        },
      ],
      '/my-gpt/': [
        {
          text: '',
          items: [{ text: '类GPT', link: '/my-gpt/' }],
        },
      ],
      '/web-metrics-performance/': [
        {
          text: '',
          items: [{ text: '性能指标', link: '/web-metrics-performance/' }],
        },
      ],
    },
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present ThinkMars',
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/ThinkMars/company' },
    ],
  },
})
