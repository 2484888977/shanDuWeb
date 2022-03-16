<template>
  <div>
    <!--    面包屑导航-->
    <el-breadcrumb style="padding-bottom:15px " separator="/">
      <el-breadcrumb-item :to="{ path: '/main' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>评论管理</el-breadcrumb-item>
      <el-breadcrumb-item>评论列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--    页面内容-->
    <el-card>
      <!--    搜索头部-->
      <el-row :gutter="20" style="padding-bottom: 15px">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="keyword" class="input-with-select" @keyup.enter.native="Search"
                    clearable>
            <el-button slot="append" icon="el-icon-search" @click="Search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="1">
          <i class="el-icon-s-promotion" style="font-size: 25px;"></i>
        </el-col>
        <el-col :span="11" style="padding: 5px 0 0 0;">
          <span>支持昵称 笔记标题 评论的精确及模糊查询。（点击右侧刷新按钮查看全部评论）</span>
        </el-col>
        <el-col :span="1" style="position:absolute; left:90%;">
          <el-button type="primary" icon="el-icon-refresh-right" @click="getCommentList(1)"></el-button>
        </el-col>
      </el-row>
      <!--      渲染笔记数据表格-->
      <el-table
          :data="CommentList.data"
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
            prop="content"
            label="评论"
            width="180">
        </el-table-column>
        <el-table-column
            prop="title"
            label="笔记标题"
            width="180">
        </el-table-column>
        <el-table-column
            prop="collecnum"
            label="评论点赞数"
            width="100">
        </el-table-column>
        <el-table-column
            prop="datatime"
            label="评论日期">
        </el-table-column>
        <el-table-column
            prop="user_id"
            label="操作"
            width="300">
          <div slot-scope="scope">
            <el-button type="primary" size="mini" @click="updateCom(scope.row)">查看/编辑</el-button>
            <el-button type="danger" size="mini" @click="deleteCom(scope.row)">删除</el-button>
          </div>
        </el-table-column>
      </el-table>
      <!--            分页控件-->
      <el-pagination
          @size-change="SizeChange"
          @current-change="CurrentChange"
          :current-page="page"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="CommentList.count">
      </el-pagination>
    </el-card>
    <!--      编辑评论dialog对话框-->
    <el-dialog
        title="编辑评论"
        :visible.sync="dialogUpdateCom"
        width="40%">
      <!--        内容区域-->
      <el-row :gutter="50" style="padding: 0 0 20px 100px;">
        <el-col :span="8">
          <div>评论点赞数:{{ UpdateComList.collecnum }}</div>
        </el-col>
      </el-row>
      <el-form :model="UpdateComList" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="昵称" style="margin: 0 300px 15px 0;">
          <el-input v-model="UpdateComList.name" disabled></el-input>
        </el-form-item>
        <el-form-item label="评论时间" style="margin: 0 300px 15px 0;">
          <el-input v-model="UpdateComList.datatime" disabled></el-input>
        </el-form-item>
        <el-form-item label="评论" prop="contentinfo">
          <el-input v-model="UpdateComList.content" type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4}"></el-input>
        </el-form-item>
        <el-form-item label="笔记标题" style="margin: 0 300px 15px 0;">
          <el-input v-model="UpdateComList.title" disabled></el-input>
        </el-form-item>
        <el-form-item label="笔记内容">
          <el-input v-model="UpdateComList.contentinfo" type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4}" disabled></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogUpdateCom = false">取 消</el-button>
    <el-button type="primary" @click="updateCom1">保 存</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "content",
  data() {
    return {
      //页码
      page: 1,
      //条数
      limit: 10,
      //搜素框数据
      keyword: null,
      //列表数据
      CommentList: [],
      // 编辑评论数据
      UpdateComList: {
        content: "",
      },
      // 编辑菜单标识符
      dialogUpdateCom: false,
    }
  },
  //方法
  methods: {
    //关键字搜索
    Search() {
      this.getCommentList()
    },
    //请求查看列表数据
    getCommentList(e) {
      // console.log(this.keyword)
      if (e === 1) this.keyword = null;
      if (this.keyword === '') this.keyword = null;
      this.$http.get("/CommentController/selectComment", {
        params: {
          page: this.page,
          limit: this.limit,
          keyword: this.keyword,
        }
      }).then((res) => {
        // console.log(res)
        this.CommentList = res.data;
        if (res.data.code === 1) {
          // this.$message.success("请求成功")
        } else this.$message.error("请求失败")
      })
    },
    //编辑按钮事件
    updateCom(row) {
      this.dialogUpdateCom = !this.dialogUpdateCom
      this.UpdateComList = row;
      // console.log(this.UpdateComList)
    },
    // 确定编辑评论事件
    updateCom1() {
      this.dialogUpdateCom = !this.dialogUpdateCom,
          this.$http.get("/CommentController/updateComment", {
            params: {
              commentid: this.UpdateComList.commentid,
              content: this.UpdateComList.content,
            }
          }).then((res) => {
            // console.log(res)
            if (res.data.code === 1) {
              this.$message.success("保存成功")
            } else this.$message.error("保存失败")
          })
    },
    //删除评论
    deleteCom(row) {
      this.$confirm('此操作将永久删除该笔记, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.get("/CommentController/deleteComment", {
          params: {
            commentid: row.commentid,
          }
        }).then((res) => {
          // console.log(res)
          if (res.data.code === 1) {
            this.$message.success("删除成功")
            this.getCommentList();
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
      this.getCommentList();
    },
    //页码发生改变时触发
    CurrentChange(page) {
      this.page = page;
      this.getCommentList();
    },
  },
//  钩子函数
  created() {
    this.getCommentList();
  }
}
</script>

<style scoped>

</style>
