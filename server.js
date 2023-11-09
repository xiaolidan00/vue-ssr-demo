import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
// import { createProxyMiddleware as proxyserver } from 'http-proxy-middleware';
import serverConfig from './server-config.js';
import { createServer as createViteServer } from 'vite';
// import { createWindow } from './server-dom.js';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
async function createServer() {
  // createWindow();
  const app = express();

  //以中间件模式创建vite应用，这将禁用vite自身的html服务逻辑，让上级服务接管控制
  const vite = await createViteServer({
    server: {
      middlewareMode: true
    },
    appType: 'custom'
  });
  //使用vite的connect实例作为中间件
  app.use(vite.middlewares);
  app.use('*', async (req, res) => {
    //服务index.html
    const url = req.originalUrl;
    console.log('url', url);
    try {
      let html;

      //1.读取index.html
      let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
      //2.应用vite html转换，这将会注入vite HMR客户端，同时会从vite插件应用HTML转换
      template = await vite.transformIndexHtml(url, template);
      //3.加载服务器入坑，vite.ssrloadModule将自动转换，es module源码是指可以在node.js中运行，无需打包，并提供类似HMR(热更新)的机制
      const { render } = await vite.ssrLoadModule('/src/entry-server.ts');
      //4.渲染应用的html,entry-server。js导出的render函数调用了适当的SSR框架API
      const { html: appHtml } = await render(url);
      //5.注入渲染后的应用程序HTML到模板中
      html = template.replace(`<!--app-html-->`, appHtml);

      //6.返回渲染后的HTML
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (error) {
      //如果捕获错误，让vite修复改对战，这样它可以映射回你的实际源码中
      vite.ssrFixStacktrace(error);
      console.log(error);
      res.status(500).end(error.message);
    }
  });
  // app.use(
  //   '/api',
  //   proxyserver({
  //     target: `http://www.xiaolidan00.top/`,
  //     changeOrigin: true,
  //     pathRewrite: {
  //       '^/api': ''
  //     }
  //   })
  // );
  app.listen(serverConfig.port);
}
console.log(serverConfig.url);
createServer();
