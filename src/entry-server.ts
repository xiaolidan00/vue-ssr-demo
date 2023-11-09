import { createApp } from './main';
import { renderToString } from 'vue/server-renderer';
export async function render(url: string) {
  const { app, router } = createApp();
  router.push(url);
  //针对有懒加载的路由情况，需等待路由解析完
  await router.isReady();

  const ctx = {};
  //renderToString将此事的根实例转换成对应的HTML字符串
  const html = await renderToString(app, ctx);

  return { html };
}
