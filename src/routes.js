import VueRouter from "vue-router";
import {AclRule} from 'vue-acl'

import Home from './components/HelloWorld'
import Auxiliares from './components/admin/Auxiliares'
import GerenciarCopa from './components/admin/GerenciarCopa'
import Resultados from './components/admin/Resultados'
import Equipes from './components/auxiliar/Equipes'
import Copa from './components/auxiliar/Copa'
import PainelGeral from './components/Pergunta/PainelGeral'
import Login from './components/login/Login'

import PageNotFound from './components/views/PageNotFound'

import Vue from "vue";

const routes = [
    // {
    //     path: '/login',
    //     component: Login,
    //     meta: {
    //         rule: 'isPublic'
    //     }
    // },
    {
        path: '/',
        component: Home,
        meta: {
            rule: 'isPublic'
        }
    },
    {
        path: '/admin/auxiliares',
        component: Auxiliares,
        name: 'auxiliares',
        meta: {
            rule: 'isAdmin'
        }
    },
    {
        path: '/admin/gerenciar-copa',
        component: GerenciarCopa,
        name: 'GerenciarCopa',
        meta: {
            rule: 'isAdmin'
        }
    },
    {
        path: '/admin/resultados',
        component: Resultados,
        name: 'resultados',
        meta: {
            rule: 'isAdmin'
        }
    },
    {
        path: '/painel',
        component: PainelGeral,
        name: 'painel',
        meta: {
            rule: 'isLogged'
        }
    },
    {
        path: '/auxiliar/equipes',
        component: Equipes,
        name: 'equipes',
        meta: {
            rule: 'isLogged'
        }
    },
    {
        path: '/copa',
        component: Copa,
        name: 'copa',
        meta: {
            rule: 'isLogged'
        }
    },
    {
        path: '*',
        name: 'notfound',
        component: PageNotFound,
        meta: {
            rule: '*'
        }
    }
];

Vue.use(VueRouter);

export default new VueRouter({
    routes,
    mode: 'history'
});
