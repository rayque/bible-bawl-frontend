import Vue from 'vue'
import { AclInstaller, AclCreate, AclRule } from 'vue-acl'
import router from './../routes'

Vue.use(AclInstaller)

export default new AclCreate({
    initial: 'public',
    notfound: {
        path: '/error'
    },
    router,
    acceptLocalRules: true,
    globalRules: {
        isAdmin: new AclRule('admin'),
        isRespondedor: new AclRule('auxiliar').generate(),
        isLogged: new AclRule('admin').or('auxiliar').generate(),
        isPublic: new AclRule('*'),

    },
    middleware: async acl => {
        console.log(acl);
        acl.change('admin')
    }
})