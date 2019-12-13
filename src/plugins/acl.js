import Vue from 'vue'
import { AclInstaller, AclCreate, AclRule } from 'vue-acl'
import router from './../routes'

Vue.use(AclInstaller)

export default new AclCreate({
    initial: 'public',
    notfound: {
        path: '/copa',
        forwardQueryParams: true,
    },
    router,
    acceptLocalRules: true,
    globalRules: {
        isAdmin: new AclRule('admin'),
        isRespondedor: new AclRule('respondedor'),
        isPublic: new AclRule('*')
    },
    middleware: async acl => {
        console.log(acl);
        // await timeout(2000) // call your api
        acl.change('*')
    }
})