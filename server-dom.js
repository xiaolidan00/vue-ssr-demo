import jsdom from 'jsdom';
import serverConfig from './server-config.js';
//模拟window对象逻辑

export function createWindow() {
  const resourceLoader = new jsdom.ResourceLoader({
    //模拟UA
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
  });
  const dom = new jsdom.JSDOM('', {
    url: serverConfig.url,
    resources: resourceLoader
  });
  global.window = dom.window;
  global.document = dom.window.document;
  global.navigator = dom.window.navigator;
  global.history = dom.history;
  window.nodejs = true; //设置window标识出node环境
}
