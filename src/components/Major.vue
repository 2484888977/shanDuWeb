<template>
  <div>
    <!--    面包屑导航-->
    <el-breadcrumb style="padding-bottom:15px " separator="/">
      <el-breadcrumb-item :to="{ path: '/main' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>专业/学科管理</el-breadcrumb-item>
      <el-breadcrumb-item>专业列表</el-breadcrumb-item>
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
        <el-col :span="2">
          <el-button type="primary" @click="dialogaddMajor = !dialogaddMajor;">添加专业</el-button>
        </el-col>
        <el-col :span="1">
          <i class="el-icon-s-promotion" style="font-size: 25px;"></i>
        </el-col>
        <el-col :span="11" style="padding: 5px 0 0 0;">
          <span>支持专业名称的精确及模糊查询。（点击右侧刷新按钮查看全部笔记）</span>
        </el-col>
        <el-col :span="1" style="position:absolute; left:90%;">
          <el-button type="primary" icon="el-icon-refresh-right" @click="getMajorList(1)"></el-button>
        </el-col>
      </el-row>
      <!--      渲染专业数据表格-->
      <el-table
          :data="MajorList.data"
          border
          style="width: 100%">
        <el-table-column
            type="index"
            width="35">
        </el-table-column>
        <el-table-column
            prop="majorinfo"
            label="专业名称">
        </el-table-column>
        <el-table-column
            prop="user_id"
            label="操作"
            width="300">
          <div slot-scope="scope">
            <el-button type="primary" size="mini" @click="updateMajor01(scope.row)">查看/编辑</el-button>
            <el-button type="danger" size="mini" @click="deleteMajor(scope.row)">删除</el-button>
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
          :total="MajorList.count">
      </el-pagination>
      <!--      添加专业dialog对话框-->
      <el-dialog
          title="添加专业"
          :visible.sync="dialogaddMajor"
          border
          width="30%">
        <!--        内容区域-->
        <el-row :gutter="10" style="padding: 0px 0 0 0;">
          <el-col :span="3.5">
            <div style="position: relative;top: 8px;">专业名称:</div>
          </el-col>
          <el-col :span="18">
            <el-input
                placeholder="请输入专业名称"
                v-model="addMajor.majorinfo"
                clearable>
            </el-input>
          </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
    <el-button @click="dialogaddMajor = false">取 消</el-button>
    <el-button type="primary" @click="addMajor01">添加</el-button>
        </span>
      </el-dialog>
      <!--      编辑专业dialog对话框-->
      <el-dialog
          title="查看/编辑专业"
          :visible.sync="dialogUpdateMajor"
          width="50%">
        <!--        内容区域-->
        <el-form :model="UpdateMajorList" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="专业名称">
            <el-input style="width: 220px" v-model="UpdateMajorList.majorinfo"></el-input>
          </el-form-item>
        </el-form>
        <el-row>
          <span style="color: black;font-size: 20px">包含学科</span>
        </el-row>
        <!--        <el-row :gutter="20" v-for="item in SubjectList" :key="item.s_id">-->
        <el-col v-for="item in SubjectList" :key="item.s_id" :span="8" style="padding: 15px 10px">
          {{ item.subjectinfo }}
        </el-col>
        <!--        </el-row>-->

        <span slot="footer" class="dialog-footer">
    <el-button @click="dialogUpdateMajor = false">取 消</el-button>
    <el-button type="primary" @click="updateNote">保 存</el-button>
       </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Major",
  // 数据
  data() {
    return {
      //页码
      page: 1,
      //条数
      limit: 10,
      //搜素框数据
      keyword: null,
      //列表数据
      MajorList: [],

      SubjectList: [],
      //编辑专业数据
      UpdateMajorList: {
        majorinfo: '',
      },
      //添加专业的数据
      addMajor: {
        majorinfo: '',
      },
      // 对话框标识符
      dialogUpdateMajor: false,
      dialogaddMajor: false,
    }
  },
  //方法
  methods: {
    //关键字搜索
    Search() {
      this.getMajorList()
    },
    //请求查看笔记列表数据
    getMajorList(e) {
      // console.log(this.keyword)
      if (e === 1) this.keyword = null;
      if (this.keyword === '') this.keyword = null;
      this.$http.get("/MajorController/selectMajor01", {
        params: {
          page: this.page,
          limit: this.limit,
          keyword: this.keyword,
        }
      }).then((res) => {
        // console.log(res)
        this.MajorList = res.data;
        if (res.data.code === 1) {
          // this.$message.success("请求成功")
        } else this.$message.error("请求失败")
      })
    },
    // 添加专业事件
    addMajor01() {
      this.$http.get("/MajorController/addMajor", {
        params: {
          majorinfo: this.addMajor.majorinfo,
        }
      }).then((res) => {
        // console.log(res)
        if (res.data.code === 1) {
          this.getMajorList();
          this.dialogaddMajor = false;
          this.$message.success("添加成功")
        } else this.$message.error("添加失败")
      })
    },
    //编辑专业按钮事件
    updateMajor01(row) {
      this.dialogUpdateMajor = !this.dialogUpdateMajor
      // this.selectMajor();
      this.getSubjectList()
      this.UpdateMajorList = row;
      console.log(this.UpdateMajorList)
    },
    //确认编辑事件
    updateNote() {
      this.dialogUpdateMajor = !this.dialogUpdateMajor
      // console.log(this.UpdateMajorList.majorinfo)
      // console.log(this.UpdateMajorList.majorid)
      this.$http.get("/MajorController/updateMajor", {
        params: {
          majorinfo: this.UpdateMajorList.majorinfo,
          majorid: this.UpdateMajorList.majorid,
        }
      }).then((res) => {
        console.log(res)
        if (res.data.code === 1) {
          this.$message.success("保存成功")
        } else this.$message.error("保存失败")
      })
    },
    //删除专业按钮事件
    deleteMajor(row) {
      this.$confirm('此操作将永久删除该笔记, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.get("/MajorController/deleteMajor", {
          params: {
            majorid: row.majorid,
          }
        }).then((res) => {
          // console.log(res)
          if (res.data.code === 1) {
            this.$message.success("删除成功")
            this.getMajorList();
          } else this.$message.error("删除失败")
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    //请求查看学科列表数据
    getSubjectList() {
      // console.log(this.keyword)
      this.$http.get("/SubjectContorller/selectSubject01", {
        params: {
          page: 1,
          limit: 1000,
          keyword: null,
        }
      }).then((res) => {
        // console.log(res)
        this.SubjectList = res.data.data;
        if (res.data.code === 1) {
          // this.$message.success("请求成功")
        } else this.$message.error("请求失败")
      })
    },
    //每页条数发生改变时触发
    SizeChange(limit) {
      this.limit = limit;
      this.getMajorList();
    },
    //页码发生改变时触发
    CurrentChange(page) {
      this.page = page;
      this.getMajorList();
    },
  },
  //  钩子函数
  created() {
    this.getMajorList();
  }
}
</script>

<style scoped>

</style>
