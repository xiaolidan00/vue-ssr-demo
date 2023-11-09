import { createRouter, createWebHistory, createMemoryHistory } from 'vue-router';
console.log('is SSR', import.meta.env.SSR);
const router = createRouter({
  //服务端用内存历史，浏览器端用history
  history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
  routes: [
    {
      path: '/hello',
      name: 'hello',
      component: () => import('@/components/HelloWorld.vue'),
      meta: {
        title: 'HelloWorld'
      }
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('@/components/Home.vue'),
      meta: {
        title: 'home'
      }
    },
    {
      path: '/error',
      name: 'error',
      component: () => import('@/components/ErrorPage.vue'),
      meta: {
        title: 'error'
      }
    }
  ]
});
//注意路由守卫只有在浏览器端可用，如果服务端用会报错
if (!import.meta.env.SSR) {
  router.beforeEach((to, from, next) => {
    if (to.matched.length > 0) {
      //有匹配路径
      next();
    } else {
      //没有匹配路径
      next('/error');
    }
  });

  router.afterEach((to) => {
    if (to.meta?.title) {
      document.title = to.meta.title;
    }
  });
}

export default router;
