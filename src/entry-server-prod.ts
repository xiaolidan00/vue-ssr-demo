import { createApp } from './main';
import { basename } from 'node:path';
import { renderToString } from 'vue/server-renderer';
type ManifestType = {
  [prop: string]: string[];
};
type CtxType = {
  modules: string[];
};
export async function render(url: string, manifest: ManifestType) {
  const { app, router } = createApp();
  router.push(url);
  await router.isReady();
  const ctx: CtxType = {} as CtxType;
  //renderToString将此事的根实例转换成对应的HTML字符串
  const html = await renderToString(app, ctx);
  //获取首屏需要动态预加载的资源
  const preloadLinks = renderPreloadLinks(ctx.modules, manifest);
  return { html, preloadLinks };
}
//获取preload资源
function renderPreloadLinks(modules: string[], manifest: ManifestType) {
  let links = '';
  const seen = new Set();
  modules.forEach((id: string) => {
    const files = manifest[id];
    if (files) {
      files.forEach((file: string) => {
        if (!seen.has(file)) {
          seen.add(file);
          const filename = basename(file);
          if (manifest[filename]) {
            for (const depFile of manifest[filename]) {
              links += renderPreloadLink(depFile);
              seen.add(depFile);
            }
          }
          links += renderPreloadLink(file);
        }
      });
    }
  });
  return links;
}
function renderPreloadLink(file: string) {
  if (file.endsWith('.js')) {
    return `<link rel="modulepreload" crossorigin href="${file}">`;
  } else if (file.endsWith('.css')) {
    return `<link rel="stylesheet" href="${file}">`;
  } else if (file.endsWith('.woff')) {
    return ` <link rel="preload" href="${file}" as="font" type="font/woff" crossorigin>`;
  } else if (file.endsWith('.woff2')) {
    return ` <link rel="preload" href="${file}" as="font" type="font/woff2" crossorigin>`;
  } else if (file.endsWith('.gif')) {
    return ` <link rel="preload" href="${file}" as="image" type="image/gif">`;
  } else if (file.endsWith('.jpg') || file.endsWith('.jpeg')) {
    return ` <link rel="preload" href="${file}" as="image" type="image/jpeg">`;
  } else if (file.endsWith('.png')) {
    return ` <link rel="preload" href="${file}" as="image" type="image/png">`;
  } else {
    // TODO
    return '';
  }
}
