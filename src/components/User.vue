<template>
  <div>
    <!--    面包屑导航-->
    <el-breadcrumb style="padding-bottom:15px " separator="/">
      <el-breadcrumb-item :to="{ path: '/main' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--    页面内容-->
    <el-card>
      <!--    搜索头部-->
      <el-row :gutter="40" style="padding-bottom: 15px">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="keyword" class="input-with-select" @keyup.enter.native="Search"
                    clearable>
            <el-button slot="append" icon="el-icon-search" @click="Search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="1">
          <i class="el-icon-s-promotion" style="font-size: 25px;"></i>
        </el-col>
        <el-col :span="10" style="padding: 5px 0 0 0;">
          <span>支持昵称的精确及模糊查询。（点击右侧刷新按钮查看全部笔记）</span>
        </el-col>
        <el-col :span="4" style="  position:absolute; left:90%;">
          <el-button type="primary" icon="el-icon-refresh-right" @click="getUserList(1)"></el-button>
        </el-col>
      </el-row>
      <!--      渲染数据表格-->
      <el-table
          :data="UserList.data"
          border
          style="width: 100%">
        <el-table-column
            type="index"
            width="35">
        </el-table-column>
        <el-table-column
            prop="name"
            label="昵称"
            width="180">
        </el-table-column>
        <el-table-column
            prop="birthday"
            label="生日"
            width="180">
        </el-table-column>
        <el-table-column
            prop="sex"
            label="性别"
            width="180">
        </el-table-column>
        <el-table-column
            prop="shopImage"
            label="头像"
            width="70">
          <template slot-scope="scope">
            <el-image style="width: 50px; height: 50px;border-radius: 25px;" :src="scope.row.vx_head" fit="cover"/>
          </template>
        </el-table-column>
        <el-table-column
            prop="notenber"
            label="笔记数"
            width="70">
        </el-table-column>
        <el-table-column
            prop="collecnber"
            label="收藏数"
            width="70">
        </el-table-column>
        <el-table-column
            prop="introduce"
            label="个人介绍">
        </el-table-column>
        <el-table-column
            prop="user_id"
            label="操作"
            width="250">
          <div slot-scope="scope">
            <!--            <el-tooltip class="item" effect="dark" content="查看" placement="top">-->
            <!--              <el-button icon="el-icon-search" size="mini"></el-button>-->
            <!--            </el-tooltip>-->
            <el-button type="primary" size="mini" @click="updateUser(scope.row)">查看/编辑</el-button>
            <el-button type="danger" size="mini" @click="deleteUser(scope.row)">删除</el-button>
          </div>
        </el-table-column>
      </el-table>
      <!--      分页控件-->
      <el-pagination
          @size-change="SizeChange"
          @current-change="CurrentChange"
          :current-page="page"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="UserList.count">
      </el-pagination>
      <!--      编辑用户dialog对话框-->
      <el-dialog
          title="编辑用户"
          :visible.sync="dialogUpdateUser"
          width="30%">
        <!--        内容区域-->
        <el-row :gutter="50" style="padding: 0 0 20px 100px;">
          <el-col :span="8">
            <div>笔记数:{{ UpdateUserList.notenber }}</div>
          </el-col>
          <el-col :span="8">
            <div>收藏数:{{ UpdateUserList.collecnber }}</div>
          </el-col>
        </el-row>
        <el-form :model="UpdateUserList" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="昵称" prop="name">
            <el-input v-model="UpdateUserList.name"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-input v-model="UpdateUserList.sex"></el-input>
          </el-form-item>
          <el-form-item label="生日" prop="birthday">
            <el-date-picker
                style="width: 315.75px"
                v-model="UpdateUserList.birthday"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="个人介绍" prop="introduce">
            <el-input v-model="UpdateUserList.introduce" type="textarea"
                      :autosize="{ minRows: 2, maxRows: 4}"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
    <el-button @click="dialogUpdateUser = false">取 消</el-button>
    <el-button type="primary" @click="updateUser1">保 存</el-button>
  </span>
      </el-dialog>

    </el-card>
  </div>
</template>

<script>
export default {
  name: "User",
  //数据
  data() {
    return {
      //页码
      page: 1,
      //条数
      limit: 10,
      //搜素框数据
      keyword: null,
      //列表数据
      UserList: [],
      //编辑列表数据
      UpdateUserList: {
        name: '',
        sex: '',
        birthday: null,
        introduce: '',
      },
      // 编辑菜单标识符
      dialogUpdateUser: false,
      //验证规则
      rules: {
        address: [
          {required: true, validator: this.phoneRules, trigger: 'blur'}
        ],
        user_id: [{required: true, message: '请输入证件号', trigger: 'blur'},
          {
            pattern: /(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0\d|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/,
            message: '请输入正确的证件号'
          },
          {validator: this.IdentityCodeValid, trigger: 'blur'}],
      }
    }
  },
  //方法
  methods: {
    //关键字搜索
    Search() {
      // console.log(this.keyword)
      this.getUserList()
    },
    //请求查看用户列表数据
    getUserList(e) {
      // console.log(this.keyword)
      if (e === 1) this.keyword = null;
      if (this.keyword === '') this.keyword = null;
      this.$http.get("/UserController/selectUser", {
        params: {
          page: this.page,
          limit: this.limit,
          keyword: this.keyword,
        }
      }).then((res) => {
        // console.log(res)
        this.UserList = res.data;
        if (res.data.code === 1) {
          // this.$message.success("请求成功")
        } else this.$message.error("请求失败")
      })
    },
    //编辑按钮事件
    updateUser(row) {
      this.dialogUpdateUser = !this.dialogUpdateUser
      console.log(row)
      // row.birthday = null
      this.UpdateUserList = row;
      // console.log(this.UpdateUserList)
    },
    //确定编辑事件
    updateUser1() {
      this.dialogUpdateUser = !this.dialogUpdateUser,
          this.$http.get("/UserController/updateUser", {
            params: {
              u_id: this.UpdateUserList.u_id,
              name: this.UpdateUserList.name,
              sex: this.UpdateUserList.sex,
              birthday: this.UpdateUserList.birthday,
              introduce: this.UpdateUserList.introduce,
            }
          }).then((res) => {
            // console.log(res)
            if (res.data.code === 1) {
              // this.$message.success("保存成功")
              this.getUserList();
            } else this.$message.error("保存失败")
          })
    },
    //删除按钮事件
    deleteUser(row) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.get("/UserController/deleteUser", {
          params: {
            u_id: row.u_id,
          }
        }).then((res) => {
          console.log(res)
          if (res.data.code === 1) {
            this.$message.success("删除成功")
            this.getUserList();
          } else this.$message.error("删除失败")
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    //每页条数发生改变时触发
    SizeChange(limit) {
      this.limit = limit;
      this.getUserList();
    },
    //页码发生改变时触发
    CurrentChange(page) {
      this.page = page;
      this.getUserList();
    },
  },
  //  钩子函数
  created() {
    this.getUserList();
  }
}
</script>

<style scoped>

</style>
