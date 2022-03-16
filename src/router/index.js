import Vue from 'vue'
import Router from 'vue-router'
import Main from '../components/Main'
import Login from '../components/Login'

Vue.use(Router)
const originalPush = Router.prototype.push

Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

export default new Router({
    mode: 'history',
    routes: [{
        //    路由地址
        path: '/',
        //    跳转的组件
        component: Login,
        },
        {
            //    路由地址
            path: '/main',
            //    跳转的组件
            component: Main,
            // 重定向
            redirect: "/welcome",
            children: [
                {
                    path: "/welcome",
                    name: "Welcome",
                    component: () => import("../components/Welcome")
                },
                {
                    path: "/user",
                    name: "User",
                    component: () => import("../components/User")
                },
                {
                    path: "/shownote",
                    name: "ShowNote",
                    component: () => import("../components/ShowNote")
                },
                {
                    path: "/addnote",
                    name: "addNote",
                    component: () => import("../components/AddNote")
                },
                {
                    path: "/addmusic",
                    name: "AddMusic",
                    component: () => import("../components/AddMusic")
                },
                {
                    path: "/content",
                    name: "Content",
                    component: () => import("../components/Comment")
                },
                {
                    path: "/music",
                    name: "Music",
                    component: () => import("../components/Music")
                },
                {
                    path: "/subject",
                    name: "Subject",
                    component: () => import("../components/Subject")
                },
                {
                    path: "/major",
                    name: "Major",
                    component: () => import("../components/Major")
                },
                {
                    path: "/recnote",
                    name: "RecNote",
                    component: () => import("../components/RecNote")
                },
                {
                    path: "/showproposal",
                    name: "ShowProposal",
                    component: () => import("../components/ShowProposal")
                },
            ]
        }
    ]
})

