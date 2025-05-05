import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import HomePage from '../views/HomePage.vue'  ;
import MatchesPage from '../views/MatchesPage.vue';
import TabsPage from '@/views/TabsPage.vue';
import Bundesliga from '@/views/Bundesliga.vue';
import America from '@/views/America.vue';
import FavoritesPage from '@/views/FavoritesPage.vue';


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
      component: Bundesliga
    },
    {
      path: 'Matches',
      component: MatchesPage
    },
    {
      path: 'America',
      component: America
    },
    { path: 'Favorites',
      component: FavoritesPage
    }
  ]
}  
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
