import { createRouter , createWebHistory} from 'vue-router'
import City from  '../src/components/City.vue'
import WeatherCondition from  '../src/components/WeatherCondition.vue'
import User from  '../src/components/User.vue'
import WeatherReport from  '../src/components/WeatherReport.vue'
import LoginPage from '../src/pages/Login.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: City },
    { path: '/city', component: City },
    { path: '/weatherCondition', component: WeatherCondition },
    { path: '/user', component: User },
    { path: '/weatherReport', component: WeatherReport },
    { path: '/login', component: LoginPage },

    // otherwise redirect to home
   
  ]
});

router.beforeEach((to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ['/login', '/register'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('user');

  if (authRequired && !loggedIn) {
    return next('/login');
  }

  next();
})
