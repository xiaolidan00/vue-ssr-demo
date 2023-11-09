# Vue3+Vite 服务端渲染示例

[掘金文章链接](https://juejin.cn/post/7299346713948930085)

## 待解决问题

- ssr 端一旦添加了 jsdom 后就会报错

```
[Vue Router warn]: No match found for location with path ""
file:///D:/code/vue-ssr/node_modules/.pnpm/vue-router@4.2.5_vue@3.3.4/node_modules/vue-router/dist/vue-router.mjs:3339
       const state = !isBrowser ? {} : history.state;
                                               ^

TypeError: Cannot read properties of undefined (reading 'state')
   at finalizeNavigation (file:///D:/code/vue-ssr/node_modules/.pnpm/vue-router@4.2.5_vue@3.3.4/node_modules/vue-router/dist/vue-router.mjs:3339:49)
   at file:///D:/code/vue-ssr/node_modules/.pnpm/vue-router@4.2.5_vue@3.3.4/node_modules/vue-router/dist/vue-router.mjs:3218:27
```

- ssr 渲染 html 时使用代理转发失败

```js
import { createProxyMiddleware as proxyserver } from 'http-proxy-middleware';
app.use(
  '/api',
  proxyserver({
    target: `http://www.xiaolidan00.top/`,
    changeOrigin: true,
    pathRewrite: {
      '^/api': ''
    }
  })
);
```
