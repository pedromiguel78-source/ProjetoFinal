import Vue from 'vue';
import Router from 'vue-router';
import store from '../store';

import DocentesList from '../views/DocentesList.vue';
import DocenteDetail from '../views/DocenteDetail.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import MinhasPropostas from '../views/MinhasPropostas.vue';
import PropostaForm from '../views/PropostaForm.vue';

Vue.use(Router);

const router = new Router({
  mode: 'hash',
  routes: [
    { path: '/', name: 'docentes', component: DocentesList },
    { path: '/docentes/:id', name: 'docenteDetail', component: DocenteDetail },
    { path: '/login', name: 'login', component: Login },
    { path: '/registo', name: 'registo', component: Register },
    { path: '/minhas-propostas', name: 'minhasPropostas', component: MinhasPropostas, meta: { requiresAuth: true } },
    { path: '/propostas/nova', name: 'novaProposta', component: PropostaForm, meta: { requiresAuth: true } },
    { path: '/propostas/:id', name: 'editarProposta', component: PropostaForm, meta: { requiresAuth: true } }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((r) => r.meta.requiresAuth) && !store.getters['auth/isLoggedIn']) {
    return next({ name: 'login' });
  }
  next();
});

export default router;
