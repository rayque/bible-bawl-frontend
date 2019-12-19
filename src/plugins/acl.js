import Vue from 'vue'
import { AclInstaller, AclCreate, AclRule } from 'vue-acl'
import router from './../routes'
import store from './../store'
import jwt from "jsonwebtoken";

Vue.use(AclInstaller)

export default new AclCreate({
    initial: 'public',
    notfound: {
        path: '/'
    },
    router,
    acceptLocalRules: true,
    globalRules: {
        isAdmin: new AclRule('admin').generate(),
        isAuxiliar: new AclRule('auxiliar').generate(),
        isLogged: new AclRule('admin').or('auxiliar').generate(),
        isPublic: new AclRule('*'),

    },
    middleware: async acl => {
        const dados = jwt.decode(localStorage.token);
        let permissao =  dados ? dados.permissao : 'public';
        acl.change(permissao)
    }
})