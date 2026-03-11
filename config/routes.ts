export default [
  { path: "/", name: "欢迎页", redirect: "/welcome" },
  { path: "/login", layout: false, name: "登录", component: "./Login" },
  { path: "/welcome", name: "欢迎页", icon: "smile", component: "./Welcome" },
  {
    path: "/system",
    name: "系统管理",
    routes: [
      { name: "菜单管理", path: "/system/menu/:id", component: "./MenuList" },
      {
        name: "按钮管理",
        path: "/system/button/:id",
        component: "./ButtonList",
      },
      {
        name: "公告管理",
        path: "/system/notice/:id",
        component: "./NoticeList",
      },
      { name: "问答管理", path: "/system/faq/:id", component: "./FaqList" },
      {
        name: "广告管理",
        path: "/system/advertisement/:id",
        component: "./AdvertisementList",
      },
      {
        name: "轮播管理",
        path: "/system/banner/:id",
        component: "./BannerList",
      },
      {
        name: "SEO设置",
        path: "/system/seometa/:id",
        component: "./SeoMetaList",
      },
    ],
  },
  {
    path: "/account",
    name: "账户管理",
    routes: [
      { name: "用户管理", path: "/account/user/:id", component: "./UserList" },
      {
        name: "会员管理",
        path: "/account/customer/:id",
        component: "./CustomerList",
      },
      { name: "角色管理", path: "/account/role/:id", component: "./RoleList" },
      // { name: '催更管理', path: '/account/reminder/:id', component: './CustomerReminderList' },
      {
        name: "联系我们",
        path: "/account/contact/:id",
        component: "./ContactList",
      },
      {
        name: "消息管理",
        path: "/account/message/:id",
        component: "./MessageList",
      },
      // { name: '分享数据', path: '/account/share/:id', component: './ShareRecordList' },
      {
        name: "收藏数据",
        path: "/account/collect/:id",
        component: "./CollectList",
      },
    ],
  },
  {
    path: "/workbench",
    name: "工作台管理",
    routes: [
      {
        name: "公告管理",
        path: "/workbench/bulletin/:id",
        component: "./BulletinList",
      },
    ]
  },
  {
    path: "/novel",
    name: "小说管理",
    routes: [
      {
        name: "分类管理",
        path: "/novel/category/:id",
        component: "./CategoryList",
      },
      { name: "标签管理", path: "/novel/tag/:id", component: "./TagList" },
      { name: "小说管理", path: "/novel/mgr/:id", component: "./NovelList" },
      {
        name: "章节管理",
        path: "/novel/chapter/:id",
        component: "./NovelChapterList",
      },
      {
        name: "热门推荐",
        path: "/novel/popular/:id",
        component: "./PopularComicList",
      },
      {
        name: "评论管理",
        path: "/novel/comment/:id",
        component: "./ComicCommentList",
      },
      {
        name: "浏览记录",
        path: "/novel/read/record/:id",
        component: "./ReadRecordList",
      },
      {
        name: "浏览统计",
        path: "/novel/read/record/count/:id",
        component: "./ReadRecordCountList",
      },
      {
        name: "漫画广告",
        path: "/novel/advertisement/:id",
        component: "./ComicAdvertisementList",
      },
    ],
  },
  {
    path: "/payment",
    name: "支付管理",
    routes: [
      {
        name: "支付方式",
        path: "/payment/method/:id",
        component: "./PaymentMethodList",
      },
      {
        name: "充值商品",
        path: "/payment/rechargeproduct/:id",
        component: "./RechargeProductList",
      },
      {
        name: "打赏商品",
        path: "/payment/rewardproduct/:id",
        component: "./RewardProductList",
      },
      {
        name: "充值订单",
        path: "/payment/rechargeorder/:id",
        component: "./RechargeOrderList",
      },
      {
        name: "余额记录",
        path: "/payment/balancerecord/:id",
        component: "./BalanceRecordList",
      },
    ],
  },
  {
    path: "/salary",
    name: "薪资管理",
    routes: [
      {
        name: "提现管理",
        path: "/salary/withdraw/:id",
        component: "./WithdrawList",
      },
    ],
  },
];
