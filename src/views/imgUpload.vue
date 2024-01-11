<script setup>
import {ref, watch, onMounted, onBeforeMount, getCurrentInstance} from "vue";
import {useRouter} from "vue-router";
import {ElLoading, ElMessage, ElMessageBox} from "element-plus";
import axios from 'axios'
import {Plus} from '@element-plus/icons-vue'

// 模拟上传数据
const instance = getCurrentInstance();
const router = useRouter();
const myAxios = axios.create({
  baseURL: 'http://localhost:8081',
});
myAxios.defaults.timeout = 10000;

function upLoaderHandler() {
  console.log('test!!!');
  const loading = ElLoading.service({
    fullscreen: true,
    text: '正在进行算法计算',
  })
  // 调用测试接口
  myAxios.get('http://localhost:8081/test')
      .then((res) => {
        const taskID = res.data.data;
        console.log(taskID);

        loading.close();
        router.push(`/task/${taskID}`);
      })
      .catch((error) => {
        console.log(error);
        ElMessage({
          message: '测试接口错误',
          type: 'error',
        })
      })
}

// 上传图片相关
const isFirst = ref(true);

function testUploader() {
  console.log('test');
  if (isFirst.value) {
    const loading = ElLoading.service({
      fullscreen: true,
      text: '正在进行算法计算',
    })
    // 调用测试接口
    myAxios.get('http://localhost:8081/test')
        .then((res) => {
          const taskID = res.data.data;
          console.log(taskID);

          loading.close();
          router.push(`/task/${taskID}`);
        })
        .catch((error) => {
          console.log(error);
          ElMessage({
            message: '测试接口错误',
            type: 'error',
          })
        })
  }
}

</script>

<template>
  <div id="content">
    <!--    <el-button type="primary" size="large" @click="upLoaderHandler">-->
    <!--      点击进行测试-->
    <!--    </el-button>-->
    <div id="upLoaderContainer">
      <el-upload
          class="avatar-uploader"
          multiple
          :show-file-list="false"
          :on-progress="testUploader"
      >
        <el-icon class="avatar-uploader-icon">
          <Plus/>
        </el-icon>
      </el-upload>
      <p style="color: rgba(85,85,85,0.8); text-align: center">请上传要检测的图片</p>
    </div>
  </div>
</template>

<style>
#content {
  display: flex;
  justify-content: center;
}

#upLoaderContainer {
  display: flex;
  flex-direction: column;

  margin: auto 0;
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 48px;
  color: #8c939d;
  width: 378px;
  height: 378px;
  text-align: center;
}
</style>
