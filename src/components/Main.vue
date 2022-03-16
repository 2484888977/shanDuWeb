<template>
  <!--  <div style="h">-->
  <el-container style="height: 100%;">
    <!--    头部内容-->
    <el-header>
      <div>
        <img class="logo" src="../assets/logo.png">
        <span class="title" style="color: #fff">善读后台管理系统</span>
        <i class="el-icon-s-operation" style=" padding-left:20px;font-size: 20px; color: #dadada"
           @click="isCollapse=!isCollapse"></i>
      </div>
      <div>
        <el-button type="info" @click="quit">退出</el-button>
      </div>
    </el-header>
    <el-container>
      <!--      侧边栏内容-->
      <el-aside :width="isCollapse?'64px':'200px'">
        <!--        <div style=" text-align: center;color: #fff;background: rgb(74,80,100);cursor: pointer"-->
        <!--             @click="isCollapse=!isCollapse">|||-->
        <!--        </div>-->
        <el-menu
            default-active="2"
            class="el-menu-vertical-demo"
            :unique-opened="true"
            :router="true"
            :collapse-transition="false"
            :collapse="isCollapse"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#FFD700">
          <el-submenu :index="item.id+''" v-for="item in router" :key="item.id">
            <template slot="title">
              <i :class="item.icon"></i>
              <span>{{ item.name }}</span>
            </template>
            <el-menu-item :index="item2.path+''" v-for="item2 in item.children" :key="item2.id">
              <i :class="item2.icon"></i>
              <span slot="title">{{ item2.name }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--      主体内容-->
      <el-main>
<!--        <transition name="el-collapse-transition">-->
          <router-view></router-view>
<!--        </transition>-->
      </el-main>
    </el-container>
  </el-container>
  <!--  </div>-->
</template>

<script>
export default {
  name: "Main",
  data() {
    return {
      router: [
        {
          id: 1,
          name: "用户管理",
          icon: "el-icon-user",
          children: [
            {
              id: 1,
              name: "用户列表",
              path: "user",
              icon: "el-icon-user",
            },
            {
              id: 2,
              name: "用户建议/反馈列表",
              path: "showproposal",
              icon: "el-icon-message",
            }
          ]
        },
        {
          id: 2,
          name: "笔记管理",
          icon: "el-icon-document",
          children: [
            // {
            //   id: 1,
            //   name: "发布笔记",
            //   path: "addnote",
            //   icon: "el-icon-s-promotion",
            // },
            {
              id: 2,
              name: "笔记列表",
              icon: "el-icon-edit-outline",
              path: "shownote"
            },
            {
              id: 3,
              name: "推荐笔记列表",
              icon: "el-icon-star-off",
              path: "recnote"
            },
          ]
        },
        {
          id: 3,
          name: "评论管理",
          icon: "el-icon-chat-dot-round",
          children: [
            {
              id: 1,
              name: "评论列表",
              path: "content",
              icon: "el-icon-edit",
            },
          ]
        },
        {
          id: 4,
          name: "专业/学科管理",
          icon: "el-icon-collection",
          children: [
            {
              id: 1,
              name: "专业列表",
              path: "major",
              icon: "el-icon-notebook-1",
            },
            {
              id: 2,
              name: "学科列表",
              path: "subject",
              icon: "el-icon-notebook-2",
            },
          ]
        },
        // {
        //   id: 5,
        //   name: "音乐管理",
        //   icon: "el-icon-headset",
        //   children: [
        //     {
        //       id: 1,
        //       name: "添加音乐",
        //       path: "addmusic",
        //       icon: "el-icon-position",
        //     },
        //     {
        //       id: 2,
        //       name: "音乐列表",
        //       icon: "el-icon-service",
        //       path: "music"
        //     },
        //   ]
        // },
      ],
      isCollapse: false
    }
  },
  methods: {
    quit() {
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>

.logo {
  height: 60px;
  vertical-align: top;
  margin-right: 16px;
}

.title {
  font-size: 33px;
  color: #000000;
  font-family: 'Myriad Pro', 'Helvetica Neue', Arial, Helvetica, sans-serif;
  font-weight: 600;
  position: relative;
  top: 2px;
}

.el-header {
  background: rgb(55, 61, 65);
  display: flex;
  justify-content: space-between;
  line-height: 60px;
}

.el-aside {
  background: rgb(51, 55, 68);
}

.el-main {
  background: rgb(234, 237, 241);
}


</style>
