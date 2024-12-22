import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Company',
  description: 'collect more enterprise products',
  srcDir: 'src', // https://vitepress.dev/reference/site-config
  head: [
    [
      'link',
      {
        rel: 'icon',
        href: 'https://raw.githubusercontent.com/ThinkMars/company/refs/heads/main/playground/public/favicon.ico',
      },
    ],
  ],
  themeConfig: {
    logo: {
      src: 'https://raw.githubusercontent.com/ThinkMars/company/refs/heads/main/playground/public/company.png',
      width: 24,
      height: 24,
    },
    // https://vitepress.dev/reference/default-theme-config
    nav: [],
    search: {
      provider: 'local',
    },
    docFooter: {
      prev: '上一个',
      next: '下一个',
    },
    sidebar: {
      '/': [
        {
          text: '介绍',
          items: [{ text: '是什么', link: '/introduction/what' }],
        },
        {
          text: '作品列表',
          items: [
            { text: '性能指标', link: '/products/web-metrics' },
            { text: '聊天GPT', link: '/products/want-chat' },
          ],
        },
      ],
    },
    footer: {
      message:
        '<a href="https://github.com/ThinkMars/company/blob/main/LICENSE" target="_blank">MIT License</a>',
      copyright:
        'Copyright © 2024-present <a href="https://github.com/ThinkMars" target="_blank">ThinkMars</a>',
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/ThinkMars/company' },
    ],
  },
})
