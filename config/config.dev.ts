// https://umijs.org/config/
import { defineConfig } from 'umi';

const API_URL = 'http://127.0.0.1:8888';

// const API_URL = 'https://api.favcomic.com';

export default defineConfig({
  dva: {
    hmr: true,
  },
  plugins: [
    // https://github.com/zthxxx/react-dev-inspector
    'react-dev-inspector/plugins/umi/react-inspector',
  ],
  // https://github.com/zthxxx/react-dev-inspector#inspector-loader-props
  inspectorConfig: {
    exclude: [],
    babelPlugins: [],
    babelOptions: {},
  },
  define: {
    API_URL: API_URL,
  },
});
