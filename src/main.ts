import { createSSRApp } from 'vue';
import router from './router/index';
import './style.css';
import App from './App.vue';

// createApp(App).mount('#app');
export function createApp() {
  //改成ssr渲染
  const app = createSSRApp(App);
  app.use(router);
  return { app, router };
}
