import Footer from '@/components/Footer';
import TagView from '@/components/TagView';
import {
  AudioOutlined,
  BarsOutlined,
  // BookOutlined,
  DollarOutlined,
  FileImageOutlined,
  // LinkOutlined,
  ReadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  TeamOutlined,
  BankOutlined,
} from '@ant-design/icons';
import type { MenuDataItem, Settings as LayoutSettings } from '@ant-design/pro-components';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { PageLoading, ProBreadcrumb } from '@ant-design/pro-components';
import type { RequestConfig, RunTimeLayoutConfig } from 'umi';
import { history } from 'umi';
import defaultSettings from '../config/defaultSettings';
import { SmileOutlined, HeartOutlined, MenuOutlined } from '@ant-design/icons';
import EventEmitter from '@/utils/eventEmitter';
import { getLoginDto, removeLoginDto, saveUserMenus, removeUserMenus } from '@/util';
import { loadMenus } from './services/user';
import { message } from 'antd';

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/login';

const IconMap = {
  smile: <SmileOutlined />,
  heart: <HeartOutlined />,
  user: <UserOutlined />,
  menu: <MenuOutlined />,
  book: <ReadOutlined />,
  bars: <BarsOutlined />,
  image: <FileImageOutlined />,
  audio: <AudioOutlined />,
  video: <VideoCameraOutlined />,
  order: <DollarOutlined />,
  team: <TeamOutlined />,
  bank: <BankOutlined />,
};

const loopMenuItem = (menus: MenuDataItem[]): MenuDataItem[] =>
  menus.map(({ icon, routes, ...item }) => ({
    ...item,
    icon: icon && IconMap[icon as keyof typeof IconMap],
    routes: routes && loopMenuItem(routes),
  }));

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: DTO.Login;
  loading?: boolean;
  collapsed?: boolean;
  getCurrentUser?: () => Promise<DTO.Login | undefined>;
}> {
  const getCurrentUser = () => {
    return getLoginDto();
  };
  // 如果不是登录页面，执行
  if (history.location.pathname !== loginPath) {
    const currentUser = getCurrentUser();
    return {
      getCurrentUser,
      currentUser,
      settings: defaultSettings,
      collapsed: true,
    };
  }
  return {
    getCurrentUser,
    settings: defaultSettings,
    collapsed: false,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  return {
    collapsed: initialState?.collapsed,
    headerContentRender: () => {
      return (
        <div style={{ display: 'flex' }}>
          <div
            onClick={() => {
              setInitialState({ ...initialState, collapsed: !initialState?.collapsed });
            }}
            style={{
              padding: '0 10px 0 10px',
              cursor: 'pointer',
              fontSize: '16px',
              width: '28px',
            }}
          >
            {initialState?.collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </div>
          <div style={{ marginLeft: '16px' }}>
            <ProBreadcrumb />
          </div>
        </div>
      );
    },
    breadcrumbRender: (routers = []) => [
      {
        path: '/',
        breadcrumbName: '首页',
      },
      ...routers,
    ],
    rightContentRender: () => <TagView />,
    contentStyle: {
      paddingTop: '34px',
    },
    disableContentMargin: false,
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      } else {
        EventEmitter.emit('routerChange', location);
      }
    },
    menu: {
      params: initialState,
      request: async (params, defaultMenuData) => {
        // initialState.currentUser 中包含了所有用户信息
        console.log(params, defaultMenuData);
        if (!initialState?.currentUser) return [];
        const token =
          getLoginDto() !== null ? getLoginDto().token : initialState?.currentUser.token;
        const result = await loadMenus(token);
        let menuData = result.model || [];
        menuData = [...loopMenuItem(menuData)];
        saveUserMenus(menuData);
        return menuData;
      },
    },
    collapsedButtonRender: null,
    links: isDev
      ? [
          // <Link key="openapi" to="/umi/plugin/openapi" target="_blank">
          //   <LinkOutlined />
          //   <span>OpenAPI 文档</span>
          // </Link>,
          // <Link to="/~docs" key="docs">
          //   <BookOutlined />
          //   <span>业务组件文档</span>
          // </Link>,
        ]
      : [
          <div
            key="collapsed"
            style={{ float: 'right', textAlign: 'right' }}
            onClick={() => {
              setInitialState({ ...initialState, collapsed: !initialState?.collapsed });
            }}
          >
            <div
              style={{
                cursor: 'pointer',
                fontSize: '16px',
                width: '28px',
              }}
            >
              {initialState?.collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </div>
          </div>,
        ],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children, props) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          {!props.location?.pathname?.includes('/login') && (
            // <SettingDrawer
            //   disableUrlParams
            //   enableDarkTheme
            //   settings={initialState?.settings}
            //   onSettingChange={(settings) => {
            //     setInitialState((preInitialState) => ({ ...preInitialState, settings }));
            //   }}
            // />
            <></>
          )}
        </>
      );
    },
    ...initialState?.settings,
  };
};

const authHeaderInterceptor = (url: string, options: RequestConfig) => {
  const loginDto = getLoginDto();
  if (loginDto) {
    options.headers = {
      token: loginDto.token,
      ...options.headers,
    };
  }
  return {
    url: `${url}`,
    options: { ...options, interceptors: true },
  };
};

const cookieInterceptors = async (response: Response) => {
  const data = response.clone();
  if (
    data.headers.get('Content-Type') !== null &&
    data.headers.get('Content-Type')?.indexOf('application/json') !== -1
  ) {
    const json = await data.json();
    if (json.code === 1) {
      removeLoginDto();
      removeUserMenus();
      window.location.href = '/login';
    }
  }
  return response;
};

export const request: RequestConfig = {
  credentials: 'include',
  withCredentials: true,
  requestInterceptors: [authHeaderInterceptor],
  responseInterceptors: [cookieInterceptors],
  errorHandler: (error) => {
    console.log(error.data);
    message.error('系统错误，请联系上帝');
  },
};
