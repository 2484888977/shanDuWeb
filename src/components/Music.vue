<template>
  <div class="music">
    <!--    面包屑导航-->
    <el-breadcrumb style="padding-bottom:15px " separator="/">
      <el-breadcrumb-item :to="{ path: '/main' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>音乐管理</el-breadcrumb-item>
      <el-breadcrumb-item>音乐列表</el-breadcrumb-item>
    </el-breadcrumb>
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
          <span>支持音乐名的精确及模糊查询。（点击右侧刷新按钮查看全部音乐）</span>
        </el-col>
        <el-col :span="1" style="position:absolute; left:90%;">
          <el-button type="primary" icon="el-icon-refresh-right" @click="getMusicList(1)"></el-button>
        </el-col>
      </el-row>
      <!--      渲染笔记数据表格-->
      <el-table
          :data="MusicList.data"
          border
          style="width: 100%">
        <el-table-column
            type="index"
            width="35">
        </el-table-column>
        <el-table-column
            prop="m_name"
            label="音乐名"
            width="180">
        </el-table-column>
        <el-table-column
            prop="music"
            label="音乐">
          <template slot-scope="scope">
            <audio class="music0" :src="scope.row.music" controls="controls"></audio>
          </template>
        </el-table-column>
        <el-table-column
            prop="user_id"
            label="操作"
            width="180">
          <div slot-scope="scope">
            <el-button type="danger" size="mini" @click="deleteMus(scope.row)">删除</el-button>
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
          :total="MusicList.count">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "music",
  data() {
    return {
      //页码
      page: 1,
      //条数
      limit: 10,
      //搜素框数据
      keyword: null,
      //列表数据
      MusicList: [],
      // 编辑评论数据
      UpdateMusList: {
        content: "",
      },
      // 编辑菜单标识符
      dialogUpdateMus: false,
    }
  },
  methods: {
    //关键字搜索
    Search() {
      this.getMusicList()
    },
    //请求查看列表数据
    getMusicList(e) {
      // console.log(this.keyword)
      if (e === 1) this.keyword = null;
      if (this.keyword === '') this.keyword = null;
      this.$http.get("/MusicContorller/selectMsic", {
        params: {
          page: this.page,
          limit: this.limit,
          keyword: this.keyword,
        }
      }).then((res) => {
        // console.log(res.data)
        this.MusicList = res.data;
        // console.log(this.MusicList.data[0].music);
        if (res.data.code === 1) {
          // this.$message.success("请求成功")
        } else this.$message.error("请求失败")
      })
    },

    //删除音乐
    deleteMus(row) {
      this.$confirm('此操作将永久删除该笔记, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.get("/MusicContorller/deleteMusic", {
          params: {
            m_id: row.m_id,
          }
        }).then((res) => {
          // console.log(res)
          if (res.data.code === 1) {
            this.$message.success("删除成功")
            this.getMusicList();
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
      this.getMusicList();
    },
    //页码发生改变时触发
    CurrentChange(page) {
      this.page = page;
      this.getMusicList();
    },
  },
  //  钩子函数
  created() {
    this.getMusicList();
  }
};
</script>

<style scoped>
.music0{
  border-radius:25px;
  width: 700px;
  margin: 0px auto;
  background-size:cover;
}
</style>
