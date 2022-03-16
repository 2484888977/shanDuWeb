<template>
  <div>
    <!--    面包屑导航-->
    <el-breadcrumb style="padding-bottom:15px " separator="/">
      <el-breadcrumb-item :to="{ path: '/main' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>笔记管理</el-breadcrumb-item>
      <el-breadcrumb-item>笔记列表</el-breadcrumb-item>
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
          <span>支持笔记作者 标题 专业的精确及模糊查询。（点击右侧刷新按钮查看全部笔记）</span>
        </el-col>
        <el-col :span="1" style="position:absolute; left:90%;">
          <el-button type="primary" icon="el-icon-refresh-right" @click="getNoteList(1)"></el-button>
        </el-col>
      </el-row>
      <!--      渲染笔记数据表格-->
      <el-table
          :data="NoteList.data"
          border
          style="width: 100%">
        <el-table-column
            type="index"
            width="35">
        </el-table-column>
        <el-table-column
            prop="name"
            label="作者"
            width="100">
        </el-table-column>
        <el-table-column
            prop="majorinfo"
            label="所属专业"
            width="100">
        </el-table-column>
        <el-table-column
            prop="subjectinfo"
            label="所属学科"
            width="150">
        </el-table-column>
        <el-table-column
            prop="title"
            label="笔记标题"
            width="180">
        </el-table-column>
        <el-table-column
            prop="comnum"
            label="评论数"
            width="100">
        </el-table-column>
        <el-table-column
            prop="collecnum"
            label="收藏数"
            width="100">
        </el-table-column>
        <el-table-column
            prop="datatime"
            label="发布日期">
        </el-table-column>
        <el-table-column
            prop="user_id"
            label="操作"
            width="330">
          <div slot-scope="scope">
            <!--            <el-tooltip class="item" effect="dark" content="查看" placement="top">-->
            <!--              <el-button icon="el-icon-search" size="mini"></el-button>-->
            <!--            </el-tooltip>-->
            <el-button size="mini" @click="selectcomment(scope.row)">评论</el-button>
            <el-button type="primary" size="mini" @click="updateNote(scope.row)">查看/编辑</el-button>
            <el-button type="warning" size="mini" @click="TuiJNote(scope.row)" :disabled="scope.row.recommendid == 1">设为推荐</el-button>
            <el-button type="danger" size="mini" @click="deleteNote(scope.row)">删除</el-button>
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
          :total="NoteList.count">
      </el-pagination>
      <!--      编辑笔记dialog对话框-->
      <el-dialog
          title="编辑用户"
          :visible.sync="dialogUpdateUser"
          width="30%">
        <!--        内容区域-->
        <el-row :gutter="50" style="padding: 0 0 20px 100px;">
          <el-col :span="8">
            <div>笔记评论数:{{ UpdateNoteList.comnum }}</div>
          </el-col>
          <el-col :span="8">
            <div>笔记收藏数:{{ UpdateNoteList.collecnum }}</div>
          </el-col>
        </el-row>
        <el-form :model="UpdateNoteList" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="作者">
            <el-input v-model="UpdateNoteList.name" disabled></el-input>
          </el-form-item>
          <el-form-item label="发布日期">
            <el-input v-model="UpdateNoteList.datatime" disabled></el-input>
          </el-form-item>
          <el-form-item label="专业">
            <el-select v-model="UpdateNoteList.majorid" placeholder="请选择" @change="selectsubject">
              <el-option
                  v-for="item in MajorList"
                  :key="item.majorid"
                  :label="item.majorinfo"
                  :value="item.majorid">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="学科">
            <el-select v-model="UpdateNoteList.subjectid" placeholder="请选择">
              <el-option
                  v-for="item in SubjectList"
                  :key="item.s_id"
                  :label="item.subjectinfo"
                  :value="item.s_id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="笔记标题" prop="title">
            <el-input v-model="UpdateNoteList.title"></el-input>
          </el-form-item>
          <el-form-item label="笔记内容" prop="contentinfo">
            <el-input v-model="UpdateNoteList.contentinfo" type="textarea"
                      :autosize="{ minRows: 2, maxRows: 4}"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
    <el-button @click="dialogUpdateUser = false">取 消</el-button>
    <el-button type="primary" @click="updateNote1">保 存</el-button>
  </span>
      </el-dialog>
      <!--      查看笔记评论dialog对话框-->
      <el-dialog
          title="评论"
          :visible.sync="dialogselectcomment"
          border
          width="60%">
        <!--        内容区域-->
        <el-row>
          <el-col :span="2">
            <span>
              评论列表
            </span>
          </el-col>
          <el-col :span="3">
            <el-button type="primary" @click="updateComment" style="margin: -10px 0 10px 728px;">
              添加评论
            </el-button>
          </el-col>
        </el-row>
        <!--      渲染评论数据表格-->
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
              label="评论内容"
              width="180">
          </el-table-column>
          <el-table-column
              prop="datatime"
              label="评论时间"
              width="180">
          </el-table-column>
          <el-table-column
              prop="collecnum"
              label="点赞数"
              width="100">
          </el-table-column>
          <el-table-column
              prop="user_id"
              label="操作">
            <div slot-scope="scope">
              <el-button type="primary" size="mini" @click="updateCom(scope.row)">查看/编辑</el-button>
              <el-button type="danger" size="mini" @click="deleteCom(scope.row)">删除</el-button>
            </div>
          </el-table-column>
        </el-table>
      </el-dialog>
      <!--      添加评论dialog对话框-->
      <el-dialog
          title="评论"
          :visible.sync="dialogaddcomment"
          border
          width="30%">
        <!--        内容区域-->
        <el-row :gutter="10">
          <el-col :span="3.5">
            <div style="position: relative;top: 5px;">评 论 者:</div>
          </el-col>
          <el-col :span="18">
            <el-select v-model="addComList.u_id" placeholder="请选择">
              <el-option
                  v-for="item in UserList"
                  :key="item.u_id"
                  :label="item.name"
                  :value="item.u_id">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row :gutter="10" style="padding: 20px 0 0 0;">
          <el-col :span="3.5">
            <div style="position: relative;top: 5px;">评论内容:</div>
          </el-col>
          <el-col :span="18">
            <el-input
                type="textarea"
                :autosize="{ minRows: 2}"
                placeholder="请输入内容"
                v-model="addComList.content">
            </el-input>
          </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
    <el-button @click="dialogaddcomment = false">取 消</el-button>
    <el-button type="primary" @click="addComment">评 论</el-button>
        </span>
      </el-dialog>
      <!--      编辑评论dialog对话框-->
      <el-dialog
          title="编辑评论"
          :visible.sync="dialogUpdateCom"
          width="30%">
        <!--        内容区域-->
        <el-row :gutter="50" style="padding: 0 0 20px 100px;">
          <el-col :span="8">
            <div>评论点赞数:{{ UpdateComList.collecnum }}</div>
          </el-col>
        </el-row>
        <el-form :model="UpdateComList" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="昵称">
            <el-input v-model="UpdateComList.name" disabled></el-input>
          </el-form-item>
          <el-form-item label="评论时间">
            <el-input v-model="UpdateComList.datatime" disabled></el-input>
          </el-form-item>
          <el-form-item label="评论内容" prop="contentinfo">
            <el-input v-model="UpdateComList.content" type="textarea"
                      :autosize="{ minRows: 2, maxRows: 4}"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
    <el-button @click="dialogUpdateCom = false">取 消</el-button>
    <el-button type="primary" @click="updateCom1">保 存</el-button>
  </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "ShowNote",
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
      NoteList: [],
      //全部用户数据
      UserList: [],
      //添加评论的数据
      addComList: {
        u_id: "",
        content: "",
      },
      //专业数据
      MajorList: [],
      //学科数据
      SubjectList:[],
      //查看的当条笔记数据
      NoteL: {},
      //评论数据
      CommentList: [],
      //编辑笔记数据
      UpdateNoteList: {
        majorid: null,
        subjectid:null,
        title: '',
        contentinfo: '',
      },
      // 编辑评论数据
      UpdateComList:{
        content:"",
      },
      // 编辑菜单标识符
      dialogUpdateUser: false,
      dialogselectcomment: false,
      dialogaddcomment: false,
      dialogUpdateCom:false,
    }
  },
  //方法
  methods: {
    //关键字搜索
    Search() {
      this.getNoteList()
    },
    //将笔记设为推荐
    TuiJNote(row){
      this.$http.get("/NoteController/updateNote01", {
        params: {
          id:row.id,
          recommendid:1,
        }
      }).then((res) => {
        // console.log(res)
        this.NoteList = res.data;
        if (res.data.code === 1) {
          this.$message.success("推荐成功")
          this.getNoteList()
        } else this.$message.error("推荐失败")
      })
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
    //获取对应专业学科
    selectsubject(e){
      // console.log(e)
      // console.log(this.UpdateNoteList.majorid)
      if (e != null)
      this.UpdateNoteList.majorid = e
      this.$http.get("/SubjectContorller/selectSubject",{
        params: {
          majorid: this.UpdateNoteList.majorid
        }
      }).then((res) => {
        // console.log(res)
        this.SubjectList = res.data.data;
        // console.log(this.SubjectList)
        if (res.data.code === 1) {
          // this.$message.success("请求成功")
        } else this.$message.error("请求失败")
      })
    },
    //请求查看笔记列表数据
    getNoteList(e) {
      // console.log(this.keyword)
      if (e === 1) this.keyword = null;
      if (this.keyword === '') this.keyword = null;
      this.$http.get("/NoteController/selectNote", {
        params: {
          page: this.page,
          limit: this.limit,
          keyword: this.keyword,
        }
      }).then((res) => {
        console.log(res)
        this.NoteList = res.data;
        if (res.data.code === 1) {
          // this.$message.success("请求成功")
        } else this.$message.error("请求失败")
      })
    },
    //编辑笔记按钮事件
    updateNote(row) {
      this.dialogUpdateUser = !this.dialogUpdateUser
      this.selectMajor();
      this.UpdateNoteList = row;
      this.selectsubject();
      // console.log(this.UpdateNoteList)
    },
    // 确定编辑笔记事件
    updateNote1() {
      this.dialogUpdateUser = !this.dialogUpdateUser,
          this.$http.get("/NoteController/updateNote", {
            params: {
              id: this.UpdateNoteList.id,
              title: this.UpdateNoteList.title,
              contentinfo: this.UpdateNoteList.contentinfo,
              majorid: this.UpdateNoteList.majorid,
              subjectid: this.UpdateNoteList.subjectid,
            }
          }).then((res) => {
            // console.log(res)
            this.getNoteList()
            if (res.data.code === 1) {
              this.$message.success("保存成功")
            } else this.$message.error("保存失败")
          })
    },
    //删除笔记按钮事件
    deleteNote(row) {
      this.$confirm('此操作将永久删除该笔记, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.get("/NoteController/deleteNote", {
          params: {
            id: row.id,
          }
        }).then((res) => {
          // console.log(res)
          if (res.data.code === 1) {
            this.$message.success("删除成功")
            this.getNoteList();
          } else this.$message.error("删除失败")
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    //评论按钮事件
    selectcomment(row) {
      this.dialogselectcomment = !this.dialogselectcomment
      // console.log(row);
      this.NoteL = row;
      this.selectCom();
    },
    // 添加评论按钮事件
    updateComment() {
      this.dialogaddcomment = !this.dialogaddcomment;
      this.selectUser();
      // console.log(this.NoteL.comnum)
    },
    //保存评论事件
    addComment() {
      this.dialogaddcomment = !this.dialogaddcomment;
      this.$http.get("/CommentController/addComment", {
        params: {
          note_id: this.NoteL.id,
          u_id: this.addComList.u_id,
          content: this.addComList.content,
          code: 1,
          comnum:this.NoteL.comnum,
        }
      }).then((res) => {
        // console.log(res)
        if (res.data.code === 1) {
          this.$message.success("评论成功")
          this.getNoteList();
          this.selectCom();
        } else this.$message.error("评论失败")
      })
    },
    //编辑评论按钮事件
    updateCom(row){
      this.dialogUpdateCom = !this.dialogUpdateCom
      this.UpdateComList = row;
      // console.log(this.UpdateComList)
    },
    // 确定编辑评论事件
    updateCom1(){
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
    deleteCom(row){
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
            this.selectCom();
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
      this.getNoteList();
    },
    //页码发生改变时触发
    CurrentChange(page) {
      this.page = page;
      this.getNoteList();
    },
    //  查询全部用户
    selectUser() {
      this.$http.get("/UserController/selectUser", {
        params: {
          page: 1,
          limit: 1000000,
          keyword: null,
        }
      }).then((res) => {
        // console.log(res)
        this.UserList = res.data.data;
        // console.log(this.UserList)
        if (res.data.code === 1) {
          // this.$message.success("请求成功")
        } else this.$message.error("请求失败")
      })
    },
    //  查询全部评论
    selectCom() {
      this.$http.get("/CommentController/selectComment02", {
        params: {
          code: 1,
          note_id: this.NoteL.id,
        }
      }).then((res) => {
        // console.log(res)
        this.CommentList = res.data;
        if (res.data != null) {
          // this.$message.success("请求成功")
        } else this.$message.error("请求失败")
      })
    },
  },
  //  钩子函数
  created() {
    this.getNoteList();
  }
}
</script>

<style scoped>

</style>
