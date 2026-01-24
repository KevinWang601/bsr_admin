// @ts-ignore
/* eslint-disable */

declare namespace DTO {
  type LoginParams = {
    username?: string;
    password?: string;
    code?: string;
    autoLogin?: boolean;
    cur?: string;
  };

  type Resp<T> = {
    code?: number;
    result?: string;
    msg?: string;
    model?: T;
  };

  type Login = {
    id?: number;
    name?: string;
    phone?: string;
    role?: string;
    token?: string;
    rememberMe?: boolean;
  };

  type MenuListItem = {
    id?: string;
    number?: number;
    parentNumber?: number;
    sort?: number;
    icon?: string;
    name?: string;
    path?: string;
    url?: string;
    status?: number;
    statusDesc?: string;
    authPattern?: string;
    menuDesc?: string;
    creatorId?: number;
    creatorName?: string;
    updateTime?: Date;
    createTime?: Date;
  };

  type ButtonListItem = {
    id?: string;
    menuId?: string;
    sort?: number;
    icon?: string;
    name?: string;
    url?: string;
    position?: number;
    notify?: number;
    status?: number;
    statusDesc?: string;
    authPattern?: string;
    nameDesc?: string;
    creatorId?: number;
    creatorName?: string;
    updateTime?: Date;
    createTime?: Date;
    menu?: any;
  };

  type UserListItem = {
    id?: string;
    companyId?: string;
    loginName?: string;
    password?: string;
    salt?: string;
    agentCode?: string;
    agentRatio?: number;
    agentRenewRatio?: number;
    balance?: number;
    realName?: string;
    phone?: string;
    gender?: string;
    status?: number;
    loginTime?: Date;
    updateTime?: Date;
    createTime?: Date;
    company?: any;
    roles?: any[];
    roleNames?: string;
  };

  type RoleListItem = {
    id?: string;
    roleName?: string;
    roleDesc?: string;
    status?: number;
    creatorName?: string;
    updateTime?: Date;
    createTime?: Date;
  };

  type CustomerListItem = {
    id?: string;
    loginName?: string;
    password?: string;
    nickName?: string;
    avatarUrl?: string;
    gender?: string;
    limiting?: number;
    status?: number;
    authTime?: Date;
    isVip?: boolean;
    loginTime?: Date;
    updateTime?: Date;
    createTime?: Date;
    company?: any;
    roles?: any[];
    roleNames?: string;
    parent?: CustomerListItem;
  };

  type AgentWithdrawItem = {
    id?: string;
    agentId?: string;
    amount?: number;
    address?: string;
    proof?: string;
    proofUrl?: string;
    updateTime?: Date;
    createTime?: Date;
    status?: number;
  };

  type AgentPerformanceItem = {
    id?: string;
    agentId?: string;
    customerId?: string;
    orderId?: string;
    orderPrice?: number;
    agentRatio?: number;
    income?: number;
    status?: number;
    createTime?: Date;
    number?: number;
    productName?: string;
  };

  type TagListItem = {
    id?: string;
    name?: string;
    slug?: string;
    adults?: number;
    sort?: number;
  };

  type CategoryListItem = {
    id?: string;
    name?: string;
    slug?: string;
    hot?: number;
    gender?: number;
    sort?: number;
  };

  type AppEdnpointListItem = {
    id?: string;
    type?: number;
    name?: string;
    url?: string;
    network?: number;
    status?: number;
    sort?: number;
  };

  type AppVersionListItem = {
    id?: string;
    platform?: number;
    versionName?: string;
    versionNote?: string;
    downloadUrl?: string;
    forceUpgrade?: number;
    createTime?: Date;
    status?: number;
  };

  type NovelListItem = {
    coverUrl: any;
    thumbUrl: any;
    id?: string;
    customerId?: string;
    customer?: CustomerListItem;
    categoryId?: string;
    novelCategory?: CategoryListItem;
    novelCustomer?: CustomerListItem;
    title?: string;
    titleAlias?: string;
    slug?: string;
    space?: number;
    cover?: string;
    authors?: string;
    tags?: string;
    tagNames?: List<string>;
    tagSlugs?: List<string>;
    comment?: number;
    finished?: number;
    hot?: number;
    recommend?: number;
    top?: number;
    adults?: number;
    gender?: number;
    source?: number;
    score?: number;
    wordCount?: number;
    chapterCount?: number;
    sourceUrl?: string;
    viewCount: number;
    collectCount?: number;
    startMemberChapter?: number;
    startPriceChapter?: number;
    onlineTime?: Date;
    offlineTime?: Date;
    updateTime?: Date;
    createTime?: Date;
    status?: number;
    note?: string;
  };

  type CommentListItem = {
    id?: string;
    loginName?: string;
    replyLoginName?: string;
    title?: string;
    chapterTitle?: string;
    lineNum?: number;
    conent?: string;
    replyCount?: number;
    awesome?: number;
    score?: number;
    createTime?: Date;
    status?: number;
    sort?: number;
  };

  type NovelChapterItem = {
    id?: string;
    title?: string;
    content?: string;
    type?: number;
    imageCount: number;
    chapterCount: number;
    member: number;
    price: number;
    onlineTime: Date;
    offlineTime: Date;
    updateTime?: Date;
    createTime?: Date;
    sort?: number;
    status?: number;
    coverUrl?: string;
    novel?: NovelListItem;
  };

  type ReadRecordCountItem = {
    customerId?: string;
    loginName?: string;
    readCount?: number;
    limited?: number;
  };

  type PopularComicListItem = {
    id?: string;
    host?: number;
    comicId?: string;
    comicTitle?: string;
    image?: string;
    imageUrl?: string;
    type?: number;
    sort?: number;
    createTime?: Date;
  };

  type UniqueListItem = {
    id?: string;
    uniques?: number;
    dateTime?: string;
    hostName?: string;
  };

  type RechargeProductListItem = {
    id?: string;
    type?: number;
    name?: string;
    brief?: string;
    val?: number;
    price?: number;
    discountPrice?: number;
    giftIntegral?: number;
    recommend?: number;
    createTime?: Date;
    sort?: number;
    status?: number;
  };

  type PaymentMethodListItem = {
    id?: string;
    name?: string;
    icon?: string;
    iconUrl?: string;
    icon?: string;
    channel?: string;
    feeRate?: number;
    currency?: number;
    checked?: number;
    status?: number;
    note?: string;
    sort?: number;
  };

  type RechargeOrderListItem = {
    id?: string;
    customerId?: string;
    productId?: string;
    transactionId?: string;
    transactionNumber?: string;
    channel?: string;
    feeRate?: number;
    flatFee?: number;
    orderMum?: number;
    orderType?: number;
    customerLoginName?: string;
    productName?: string;
    productVal?: number;
    productPrice?: number;
    productDiscountPrice?: number;
    amount?: number;
    profit?: number;
    updateTime?: Date;
    createTime?: Date;
    status?: number;
    statusDesc?: string;
  };

  type BalanceRecordListItem = {
    id?: string;
    customerId?: string;
    transactionId?: string;
    operate?: number;
    resourceId?: string;
    amount?: number;
    balance?: number;
    createTime?: Date;
    note?: string;
    loginName?: string;
  };

  type BannerListItem = {
    id?: string;
    novelId?: string;
    image?: string;
    imageUrl?: string;
    linkUrl?: string;
    title?: string;
    subTitle?: string;
    appShow?: number;
    sort?: number;
    status?: number;
  };

  type AdvertisementListItem = {
    id?: string;
    num?: string;
    host?: number;
    section?: string;
    sectionUrl?: string;
    type?: number;
    image?: string;
    imageUrl?: string;
    linkUrl?: string;
    device?: number;
    hint?: number;
    sort?: number;
    status?: number;
    createTime?: Date;
  };

  type ComicAdvertisementListItem = {
    id?: string;
    scope?: int;
    comicType?: number;
    comicId?: string;
    image?: string;
    imageUrl?: string;
    linkUrl?: string;
    hit?: number;
    status?: number;
    note?: string;
    createTime?: Date;
  };

  type TranslationAgencyListItem = {
    id?: string;
    name?: string;
    logo?: string;
    logoUrl?: string;
    contact?: string;
    brief?: string;
    quantity?: number;
    status?: number;
  };

  type CustomerWishListItem = {
    id?: string;
    memberId?: string;
    type?: number;
    name?: string;
    authorName?: string;
    url?: string;
    note?: string;
    email?: string;
    reply?: string;
    status?: number;
    updateTime?: Date;
    createTime?: Date;
    customer?: CustomerListItem;
  };

  type CustomerReminderListItem = {
    id?: string;
    type?: number;
    contentId?: string;
    contentName?: string;
    totalCount?: number;
    waitProcessCount?: number;
    status?: number;
    note?: string;
    updateTime?: Date;
    createTime?: Date;
  };

  type RewardProductListItem = {
    id?: string;
    name?: string;
    icon?: string;
    iconUrl?: string;
    amount?: number;
    status?: number;
  };

  type NoticeListItem = {
    id?: string;
    content?: string;
    link?: string;
    sort?: number;
    timeZone?: string;
    startTime?: Date;
    endTime?: Date;
  };

  type FaqListItem = {
    id?: string;
    question?: string;
    answer?: string;
    manual?: string;
    sort?: number;
  };

  type CardOrderListItem = {
    id?: string;
    transactionId?: string;
    senderName?: string;
    senderEmail?: string;
    receiverName?: string;
    receiverEmail?: string;
    amount?: number;
    updateTime?: Date;
    createTime?: Date;
    status?: number;
  };

  type GiftEventListItem = {
    id?: string;
    name?: string;
    note?: string;
    limitCount?: number;
    startTime?: Date;
    endTime?: Date;
    createTime?: Date;
    status?: number;
  };

  type SignInSettingListItem = {
    id?: string;
    dateName?: string;
    continueDay?: number;
    integral?: number;
    continueIntegral?: number;
    sort?: number;
  };

  type CouponListItem = {
    id?: string;
    name?: string;
    type?: number;
    integral?: number;
    val?: number;
    image?: string;
    stock?: number;
    fixedStock?: number;
    validDay?: number;
    registerAward?: number;
    imageUrl?: string;
    productNames?: string;
    sort?: number;
    status?: number;
  };

  type ContactListItem = {
    id?: string;
    email?: string;
    content?: string;
    imageUrl?: string;
    createTime?: Date;
    status?: number;
    customer?: CustomerListItem;
  };

  type CollectListItem = {
    id?: string;
    title?: string;
    memberId?: string;
    loginName?: string;
    createTime?: Date;
  };

  type MessageListItem = {
    id?: string;
    memberId?: string;
    content?: string;
    status?: number;
    updateTime?: Date;
    createTime?: Date;
    customer?: CustomerListItem;
  };

  type SeoMetaListItem = {
    id?: string;
    host?: number;
    section?: string;
    sectionUrl?: string;
    type?: number;
    key?: string;
    content?: string;
    sort?: number;
  };
}

type Operation = {
  id?: string;
  name: string;
  position?: number;
  notify?: number;
  url?: string;
};
