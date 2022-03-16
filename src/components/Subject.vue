<template>
<div>
  <!--    面包屑导航-->
  <el-breadcrumb style="padding-bottom:15px " separator="/">
    <el-breadcrumb-item :to="{ path: '/main' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>专业/学科管理</el-breadcrumb-item>
    <el-breadcrumb-item>学科列表</el-breadcrumb-item>
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
        <el-button type="primary" @click="addSubect1">添加学科</el-button>
      </el-col>
      <el-col :span="1">
        <i class="el-icon-s-promotion" style="font-size: 25px;"></i>
      </el-col>
      <el-col :span="11" style="padding: 5px 0 0 0;">
        <span>支持学科 所属专业名称的精确及模糊查询。（点击右侧刷新按钮查看全部笔记）</span>
      </el-col>
      <el-col :span="1" style="position:absolute; left:90%;">
        <el-button type="primary" icon="el-icon-refresh-right" @click="getSubjectList(1)"></el-button>
      </el-col>
    </el-row>
    <!--      渲染专业数据表格-->
    <el-table
        :data="SubjectList.data"
        border
        style="width: 100%">
      <el-table-column
          type="index"
          width="35">
      </el-table-column>
      <el-table-column
          prop="subjectinfo"
          label="学科名称">
      </el-table-column>
      <el-table-column
          prop="majorinfo"
          label="所属专业"
          width="180">
      </el-table-column>
      <el-table-column
          prop="user_id"
          label="操作"
          width="300">
        <div slot-scope="scope">
          <el-button type="primary" size="mini" @click="updateSubect01(scope.row)">查看/编辑</el-button>
          <el-button type="danger" size="mini" @click="deleteSubect(scope.row)">删除</el-button>
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
        :total="SubjectList.count">
    </el-pagination>
    <!--      添加学科dialog对话框-->
    <el-dialog
        title="添加专业"
        :visible.sync="dialogaddSubject"
        border
        width="30%">
      <!--        内容区域-->
      <el-row :gutter="10">
        <el-col :span="3.5">
          <div style="position: relative;top: 5px;">请选择你要添加的专业:</div>
        </el-col>
        <el-col :span="12">
          <el-select v-model="addSubject.majorid" placeholder="请选择专业">
            <el-option
                v-for="item in MajorList"
                :key="item.majorid"
                :label="item.majorinfo"
                :value="item.majorid">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row :gutter="10" style="padding: 20px 0 0 0;">
        <el-col :span="3.5">
          <div style="position: relative;top: 8px;">学科名称:</div>
        </el-col>
        <el-col :span="18">
          <el-input
              placeholder="请输入学科名称"
              v-model="addSubject.subjectinfo"
              clearable>
          </el-input>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogaddMajor = false">取 消</el-button>
    <el-button type="primary" @click="addSubject01">添加</el-button>
        </span>
    </el-dialog>
    <!--      编辑学科dialog对话框-->
    <el-dialog
        title="查看/编辑学科"
        :visible.sync="dialogUpdateSubject"
        width="30%">
      <!--        内容区域-->
      <el-row :gutter="12">
        <el-col :span="3.5" style="padding: 0px 0 30px 40px;">
          <div style="position: relative;top: 5px;">所属专业:</div>
        </el-col>
        <el-col :span="12">
          <el-select v-model="UpdateSubjectList.majorid" placeholder="请选择专业">
            <el-option
                v-for="item in MajorList"
                :key="item.majorid"
                :label="item.majorinfo"
                :value="item.majorid">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-form :model="UpdateSubjectList" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="学科名称">
          <el-input v-model="UpdateSubjectList.subjectinfo"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogUpdateSubject = false">取 消</el-button>
    <el-button type="primary" @click="updateSubect">保 存</el-button>
  </span>
    </el-dialog>
  </el-card>
</div>
</template>

<script>
export default {
  name: "Subject",
  // 数据
  data() {
    return {
      //页码
      page: 1,
      //条数
      limit: 10,
      //搜素框数据
      keyword: null,
      //专业数据
      MajorList:[],
      //列表数据
      SubjectList: [],
      //编辑学科数据
      UpdateSubjectList: {
        majorid:'',
        subjectinfo: '',
        s_id:'',
      },
      //添加学科的数据
      addSubject: {
        majorid:'',
        subjectinfo: '',
      },
      // 对话框标识符
      dialogUpdateSubject: false,
      dialogaddSubject: false,
    }
  },
  //方法
  methods: {
    //关键字搜索
    Search() {
      this.page = 1;
      this.getSubjectList()
    },
    //请求查看学科列表数据
    getSubjectList(e) {
      // console.log(this.keyword)
      if (e === 1) this.keyword = null;
      if (this.keyword === '') this.keyword = null;
      this.$http.get("/SubjectContorller/selectSubject01", {
        params: {
          page: this.page,
          limit: this.limit,
          keyword: this.keyword,
        }
      }).then((res) => {
        // console.log(res)
        this.SubjectList = res.data;
        if (res.data.code === 1) {
          // this.$message.success("请求成功")
        } else this.$message.error("请求失败")
      })
    },
    //添加按钮事件
    addSubect1(){
      this.dialogaddSubject = !this.dialogaddSubject;
      this.selectMajor();
    },
    // 添加学科事件
    addSubject01() {
      this.dialogaddSubject = !this.dialogaddSubject
      // console.log(this.addSubject.subjectinfo)
      // console.log(this.addSubject.majorid)
      this.$http.get("/SubjectContorller/addSubject", {
        params: {
          subjectinfo: this.addSubject.subjectinfo,
          majorid: this.addSubject.majorid,
        }
      }).then((res) => {
        // console.log(res)
        if (res.data.code === 1) {
          this.getSubjectList();
          this.dialogaddMajor = false;
          this.$message.success("添加成功")
        } else this.$message.error("添加失败")
      })
    },
    //编辑学科按钮事件
    updateSubect01(row) {
      this.dialogUpdateSubject = !this.dialogUpdateSubject
      this.selectMajor();
      this.UpdateSubjectList = row;
      console.log(this.UpdateSubjectList)
    },
    //确认编辑事件
    updateSubect(){
      this.dialogUpdateSubject = !this.dialogUpdateSubject
      // console.log(this.UpdateMajorList.majorinfo)
      // console.log(this.UpdateMajorList.majorid)
      this.$http.get("/SubjectContorller/updateSubject", {
        params: {
          subjectinfo: this.UpdateSubjectList.subjectinfo,
          majorid: this.UpdateSubjectList.majorid,
          s_id:this.UpdateSubjectList.s_id,
        }
      }).then((res) => {
        console.log(res)
        if (res.data.code === 1) {
          this.$message.success("保存成功")
        } else this.$message.error("保存失败")
      })
    },
    //删除学科按钮事件
    deleteSubect(row){
      this.$confirm('此操作将永久删除该笔记, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.get("/SubjectContorller/deleteSubject", {
          params: {
            s_id: row.s_id,
          }
        }).then((res) => {
          // console.log(res)
          if (res.data.code === 1) {
            this.$message.success("删除成功")
            this.getSubjectList();
          } else this.$message.error("删除失败")
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    //  获取全部专业
    selectMajor() {
      this.$http.get("/MajorController/selectMajor").then((res) => {
        // console.log(res)
        this.MajorList = res.data.data;
        // console.log(this.MajorList)
        if (res.data.code === 1) {
          // this.$message.success("请求成功")
        } else this.$message.error("请求失败")
      })
    },
    //每页条数发生改变时触发
    SizeChange(limit) {
      this.limit = limit;
      this.getSubjectList();
    },
    //页码发生改变时触发
    CurrentChange(page) {
      this.page = page;
      this.getSubjectList();
    },
  },
  //  钩子函数
  created() {
    this.getSubjectList();
  }
}
</script>

<style scoped>

</style>
