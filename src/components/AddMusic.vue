<template>
  <div>
    <!--    面包屑导航-->
    <el-breadcrumb style="padding-bottom:15px " separator="/">
      <el-breadcrumb-item :to="{ path: '/main' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>音乐管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加音乐</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>


      <el-row style="margin: 0 0 10px 0;">
        <el-upload
            size="mini"
            accept=".mp3,.m4a"
            class="upload-demo"
            ref="upload"
            action=" "
            :on-error="asd"
            :on-remove="handleRemove"
            :file-list="fileList"
            :auto-upload="false">
<!--          <i class="el-icon-plus"></i>-->
                  <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        </el-upload>
      </el-row>
      <el-row style="margin: 0 0 10px 0;">
        <el-col :span="20">
          <div style="margin: 0 0 0px 0;">请选择您要上传的音乐(不超过N)</div>
        </el-col>
        <el-col :span="2">
          <el-button style="position: relative;left: 89%;" size="mini" type="primary" @click="submitUpload">上传音乐</el-button>
        </el-col>
      </el-row>


      <el-row :gutter="10" style="padding: 20px 0 0 0;">
        <el-col :span="3.5">
          <div style="position: relative;top: 5px;">音乐名:</div>
        </el-col>
        <el-col :span="6">
          <el-input
              placeholder="请输入音乐名"
              v-model="music.m_name"
              clearable>
          </el-input>
        </el-col>
      </el-row>
      <el-row :gutter="10" style="padding: 20px 0 0 0;">
        <el-col :span="3.5">
          <div style="position: relative;top: 5px;">音乐网络连接:</div>
        </el-col>
        <el-col :span="6">
          <el-input
              type="textarea"
              :autosize="{ minRows: 2}"
              placeholder="请上传音乐"
              v-model="music.music">
          </el-input>
        </el-col>
      </el-row>
      <el-button style="position: relative;left: 92%;" type="primary" @click="addMusic">发布</el-button>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "AddMusic",
  data() {
    return {
      fileList: [],
      action: "http://upload.qiniup.com",
      music: {
        m_name: null,
        music: null,
      },
    }
  },
  //方法
  methods: {


    submitUpload() {
      this.$refs.upload.submit();
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    asd(err, file) {
      console.log(file);
      this.$http.get("/UserController/getVoucher").then((res) => {
        // console.log(res)
        if (res.data.code === 1) {
          this.$message.success("成功")
          let formdata = new FormData;
          formdata.append('file', file.raw)
          formdata.append('action', this.action)
          formdata.append('token', res.data.data)
          let config = {
            headers: {
              'Content-Type': 'multipart/form-data'  //之前说的以表单传数据的格式来传递fromdata
               }
          };
          this.$http.post("https://upload.qiniup.com", formdata, config).then((res) => {
            // console.log(res)
            // console.log("http://r4ykjc6dn.hd-bkt.clouddn.com/"+res.data.key)
            this.music.music = "http://r652ixhp3.hd-bkt.clouddn.com/"+res.data.key
            console.log(this.music.music)
          })
        } else this.$message.error("发布失败")
      })
    },


    //  发布按钮事件
    addMusic() {
      this.$http.get("/MusicContorller/addMusic", {
        params: {
          m_name: this.music.m_name,
          music: this.music.music,
        }
      }).then((res) => {
        // console.log(res)
        if (res.data.code === 1) {
          this.$message.success("发布成功")
        } else this.$message.error("发布失败")
      })
    },
  }
}
</script>

<style scoped>

</style>
