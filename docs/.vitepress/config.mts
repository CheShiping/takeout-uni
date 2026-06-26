import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

export default withMermaid(
  defineConfig({
  title: '外卖点餐系统实战教程',
  description: '基于 Vue 3 + TypeScript + uni-app 3.x 的跨平台外卖点餐系统开发全流程',
  lang: 'zh-CN',
  // IMPORTANT: must match GitHub repo name exactly with leading/trailing slashes
  base: '/takeout-uni/',

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
  ],

  themeConfig: {
    // Navigation bar
    nav: [
      { text: '首页', link: '/' },
      { text: '教程', link: '/tutorials/01-项目概述与环境搭建' },
      {
        text: '项目源码',
        items: [
          { text: 'GitHub 仓库', link: 'https://github.com/shiping/takeout-uni' },
        ]
      },
    ],

    // Sidebar - configure per chapter
    sidebar: {
      '/tutorials/': [
        {
          text: '基础篇',
          items: [
            { text: '1. 项目概述与环境搭建', link: '/tutorials/01-项目概述与环境搭建' },
            { text: '2. 项目架构设计', link: '/tutorials/02-项目架构设计' },
            { text: '3. 网络请求封装', link: '/tutorials/03-网络请求封装' },
            { text: '4. 状态管理', link: '/tutorials/04-状态管理' },
            { text: '5. 类型系统设计', link: '/tutorials/05-类型系统设计' },
          ]
        },
        {
          text: '核心功能篇',
          items: [
            { text: '6. 首页开发', link: '/tutorials/06-首页开发' },
            { text: '7. 店铺模块', link: '/tutorials/07-店铺模块' },
            { text: '8. 食品详情与规格选择', link: '/tutorials/08-食品详情与规格选择' },
            { text: '9. 购物车模块', link: '/tutorials/09-购物车模块' },
            { text: '10. 订单流程', link: '/tutorials/10-订单流程' },
          ]
        },
        {
          text: '进阶篇',
          items: [
            { text: '11. 地址管理', link: '/tutorials/11-地址管理' },
            { text: '12. 用户认证', link: '/tutorials/12-用户认证' },
            { text: '13. 评价系统', link: '/tutorials/13-评价系统' },
            { text: '14. 通用组件与工具', link: '/tutorials/14-通用组件与工具' },
            { text: '15. 跨平台适配', link: '/tutorials/15-跨平台适配' },
            { text: '16. 样式与主题', link: '/tutorials/16-样式与主题' },
            { text: '17. 构建与发布', link: '/tutorials/17-构建与发布' },
          ]
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/shiping/takeout-uni' }
    ],

    footer: {
      message: '基于 Vue 3 + TypeScript + uni-app 3.x 的跨平台外卖点餐系统开发教程',
      copyright: '© 2026 takeout-uni 教程'
    },

    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索文档' },
          modal: {
            noResultsText: '无结果',
            footer: { closeText: '关闭' }
          }
        }
      }
    },

    docFooter: {
      prev: '上一章',
      next: '下一章'
    },

    outline: {
      label: '本页目录',
      level: [2, 3]
    },

    editLink: {
      pattern: 'https://github.com/shiping/takeout-uni/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页'
    },

    lastUpdated: {
      text: '最后更新',
      formatOptions: { dateStyle: 'short' }
    }
  },

  markdown: {
    lineNumbers: true,
  }
}))
