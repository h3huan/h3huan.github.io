import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

// 懒加载方式导入您的页面组件
const HomePage = () => import('../pages/HomePage.vue');
const CaculatePage = () => import('../pages/caculate.vue');

// 明确定义 routes 数组的类型为 RouteRecordRaw[]
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/caculate',
    name: 'Caculate',
    component: CaculatePage
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;