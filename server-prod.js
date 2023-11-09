import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import serverConfig from './server-config.js';
// import { createWindow } from './server-dom.js';
async function createServer() {
  // createWindow();
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const resolve = (p) => path.resolve(__dirname, p);
  //1.读取index.html
  let template = fs.readFileSync(resolve('dist/client/index.html'), 'utf-8');
  //ssr-manifest.json资源映射表
  const mainfest = JSON.parse(fs.readFileSync(resolve('dist/client/ssr-manifest.json'), 'utf-8'));
  const app = express();
  //压缩结果文本内容
  app.use((await import('compression')).default());
  //客户端静态资源路径
  app.use(
    '/',
    (await import('serve-static')).default(resolve('dist/client'), {
      index: false
    })
  );
  app.use('*', async (req, res) => {
    //服务index.html
    const url = req.originalUrl;
    console.log('url', url);
    try {
      const render = (await import('./dist/server/entry-server-prod.js')).render;

      //4.渲染应用的html,entry-server。js导出的render函数调用了适当的SSR框架API
      const { html: appHtml, preloadLinks } = await render(url, mainfest);
      //5.注入渲染后的应用程序HTML到模板中
      let html = template
        .replace(`<!--preload-links-->`, preloadLinks)
        .replace(`<!--app-html-->`, appHtml);

      //6.返回渲染后的HTML
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (error) {
      console.log(error);
      res.status(500).end(error.message);
    }
  });
  app.listen(serverConfig.port);
}
console.log(serverConfig.url);
createServer();
