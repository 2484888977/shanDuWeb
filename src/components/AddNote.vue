<template>
  <div>
    <!--    面包屑导航-->
    <el-breadcrumb style="padding-bottom:15px " separator="/">
      <el-breadcrumb-item :to="{ path: '/main' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>笔记管理</el-breadcrumb-item>
      <el-breadcrumb-item>发布笔记</el-breadcrumb-item>
    </el-breadcrumb>
    <!--    页面内容-->
    <el-card>
      <el-row style="margin: 0 0 10px 0;">
        <el-upload
            size="mini"
            list-type="picture-card"
            class="upload-demo"
            ref="upload"
            action=" "
            accept=".jpg,.jpeg,.png,.JPG,.JPEG,.PNG"
            :on-error="asd"
            :on-remove="handleRemove"
            :file-list="fileList"
            :auto-upload="false">
          <i class="el-icon-plus"></i>
          <!--        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>-->
        </el-upload>
      </el-row>
      <el-row style="margin: 0 0 10px 0;">
        <el-col :span="20">
          <div style="margin: 0 0 0px 0;">请选择您要上传的图片(不超过N张)</div>
        </el-col>
        <el-col :span="2">
          <el-button style="position: relative;left: 89%;" size="mini" type="primary" @click="submitUpload">上传图片</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="3.5">
          <div style="position: relative;top: 5px;">请选择你要发布的位置:</div>
        </el-col>
        <el-col :span="6">
          <el-select v-model="note.majorid" placeholder="请选择">
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
          <div style="position: relative;top: 5px;">笔记标题:</div>
        </el-col>
        <el-col :span="6">
          <el-input
              placeholder="请输入笔记标题"
              v-model="note.title"
              clearable>
          </el-input>
        </el-col>
      </el-row>
      <el-row :gutter="10" style="padding: 20px 0 0 0;">
        <el-col :span="3.5">
          <div style="position: relative;top: 5px;">笔记内容:</div>
        </el-col>
        <el-col :span="6">
          <el-input
              type="textarea"
              :autosize="{ minRows: 2}"
              placeholder="请输入内容"
              v-model="note.contentinfo">
          </el-input>
        </el-col>
      </el-row>
      <el-button style="position: relative;left: 92%;" type="primary" @click="addNote">发布</el-button>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "AddNote",
  // 数据
  data() {
    return {
      fileList: [],
      apiType: "gtimg",
      token: "c24b825205a0f43baf5c890eda2b7052",
      note: {
        majorid: null,
        title: null,
        contentinfo: null,
      },
      //专业数据
      MajorList: [],
    }
  },
  //方法
  methods: {
    aaa(err, file) {
      console.log(file);
      console.log(err);
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    asd(err, file) {
      console.log(err);
      console.log(file);
      let formdata = new FormData;
      formdata.append('image', file.raw)
      formdata.append('apiType', this.apiType)
      formdata.append('token', this.token)
      let config = {
        headers: {
          'Content-Type': 'multipart/form-data'  //之前说的以表单传数据的格式来传递fromdata
        }
      };
      this.$http.post("https://www.hualigs.cn/api/upload", formdata, config).then((res) => {
        console.log(res)
        if (res.data.code === 1) {
          this.$message.success("登录成功")
          // this.$router.push('/main')
        } else this.$message.error("登录失败")
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
    //  发布按钮事件
    addNote() {
      this.$http.get("/NoteController/addNote", {
        params: {
          majorid: this.note.majorid,
          title: this.note.title,
          contentinfo: this.note.contentinfo,
        }
      }).then((res) => {
        // console.log(res)
        if (res.data.code === 1) {
          this.$message.success("发布成功")
        } else this.$message.error("发布失败")
      })
    },
  },
  //  钩子函数
  created() {
    this.selectMajor();
  }
}

</script>

<style scoped>

</style>
