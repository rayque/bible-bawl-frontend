import VueRouter from "vue-router";
import { AclRule } from 'vue-acl'

import Home from './components/HelloWorld'
import Respondedores from './components/admin/Respondedores'
import GerenciarCopa from './components/admin/GerenciarCopa'
import Equipes from './components/respondedor/Equipes'
import Copa from './components/respondedor/Copa'
import Login from './components/login/Login'
import Vue from "vue";

 const routes = [
   {
     path: '/login',
     component: Login,
     meta: {
       rule: 'isPublic'
     }
   },
  {
    path: '/',
    component: Home,
    meta: {
      rule: new AclRule('admin').generate()
    }
  },
  {
    path: '/admin/respondedores',
    component: Respondedores,
    name: 'respondedores',
    meta: {
      rule: new AclRule('respondedor').generate()
    }
  },
  { path: '/admin/gerenciar-copa', component: GerenciarCopa, name: 'GerenciarCopa'},
  { path: '/respondedor/equipes', component: Equipes, name: 'equipes'},
  { path: '/copa', component: Copa, name: 'copa'},
  { path: '*', redirect: '/'},
];

Vue.use(VueRouter);

export default new VueRouter({
  routes,
  mode: 'history'
});
