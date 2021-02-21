module.exports = {
  title: "Ikarosxのblog",
  description: "Like someone.",
  dest: "public",
  plugins: [
    [
      // 流程图
      'flowchart',

    ],
    ['@vuepress/last-updated'],
    // [
    //   // bgm
    //   '@vuepress-reco/vuepress-plugin-bgm-player',
    //   {
    //     audios: [
    //       {
    //         name: '野孩子',
    //         url: '/bgm/野孩子.mp3',
    //         cover: '/bgm/野孩子.jpg'
    //       },
    //       {
    //         name: '容易受伤的女人',
    //         url: '/bgm/容易受伤的女人.mp3',
    //         cover: '/bgm/容易受伤的女人.jpg'
    //       },
    //       {
    //         name: '广东爱情故事',
    //         url: '/bgm/广东爱情故事.mp3',
    //         cover: '/bgm/广东爱情故事.jpg'
    //       },
    //       {
    //         name: '初恋情人',
    //         url: '/bgm/初恋情人.mp3',
    //         cover: '/bgm/初恋情人.jpg'
    //       },

    //     ]
    //   }
    // ]
  ],
  head: [
    [
      "link",
      {
        rel: "icon",
        href: "https://ikaros-picture.oss-cn-shenzhen.aliyuncs.com/typora/Ikaros/Honeyview_Ikaros.jpg",
      },
    ],
    [
      "meta",
      {
        name: "viewport",
        content: "width=device-width,initial-scale=1,user-scalable=no",
      },
    ],
  ],
  "theme": "reco",
  "themeConfig": {
    valineConfig: {
      appId: '7JwCDpIsNOoOuKfciYt03nzm-gzGzoHsz',
      appKey: 'DuthgbpxmqnuMQtJqHbBgMTR'
    },
    nav: [
      {
        text: "Home",
        link: "/",
        icon: "reco-home",
      },
      {
        text: "TimeLine",
        link: "/timeline/",
        icon: "reco-date",
      },
      {
        "text": "Contact",
        "icon": "reco-message",
        "items": [
          {
            "text": "GitHub",
            "link": "https://github.com/Ikarosx",
            "icon": "reco-github"
          }
        ]
      }

    ],
    subSidebar: 'auto',
    "type": "blog",
    "blogConfig": {
      "category": {
        "location": 2,
        "text": "Category"
      },
      "tag": {
        "location": 3,
        "text": "Tag"
      }
    },
    friendLink: [
      {
        title: "GitHub",
        link: "https://github.com/Ikarosx",
        desc: "IkarosxのGithub",
        email: "532288425@qq.com",
        logo:
          "https://ikaros-picture.oss-cn-shenzhen.aliyuncs.com/typora/Ikaros/Honeyview_Ikaros.jpg",
      },
      {
        title: "疫情监控",
        link: "http://ikarosx.cn:5000",
        desc: "两个人的回忆",
        logo:
          "https://ikaros-picture.oss-cn-shenzhen.aliyuncs.com/typora/Ikaros/logo.ico",
      },
      {
        title: "布叮校园",
        link: "https://buding.ikarosx.cn",
        desc: "贯穿大学却一直没有完成的项目",
        logo:
          "https://ikaros-picture.oss-cn-shenzhen.aliyuncs.com/typora/Ikaros/5c64d6739cc7760016881134.png",
      },
      {
        title: "酷虾",
        link: "https://parva.cool",
        desc: "提前抱大腿",
        logo:
          "https://ikaros-picture.oss-cn-shenzhen.aliyuncs.com/typora/Ikaros/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20200731174758.jpg",
      },
    ],
    logo: "https://ikaros-picture.oss-cn-shenzhen.aliyuncs.com/typora/Ikaros/Honeyview_Ikaros.jpg",
    search: true,
    searchMaxSuggestions: 10,
    lastUpdated: "Last Updated",
    author: "Ikarosx",
    authorAvatar: "https://ikaros-picture.oss-cn-shenzhen.aliyuncs.com/typora/Ikaros/Honeyview_Ikaros.jpg",
    startYear: "2020",
  },
  markdown: {
    lineNumbers: true,
  },
}