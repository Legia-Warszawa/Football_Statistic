import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import HomePage from '../views/HomePage.vue'  ;
import MatchesPage from '../views/MatchesPage.vue';
import TabsPage from '@/views/TabsPage.vue';


const routes =[
  {
    path: '/',
    redirect: '/tabs/Matches'
  },
{
  path: '/tabs/',
  component: TabsPage,
  children: [
    {
      path: '',
      redirect: '/tabs/Matches'
    },
    {
      path: 'Bundesliga',
      component: HomePage
    },
    {
      path: 'Matches',
      component: MatchesPage
    }
  ]
}  
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
