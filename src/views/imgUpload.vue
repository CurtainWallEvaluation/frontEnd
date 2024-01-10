<script setup>
import {ref, watch, onMounted, onBeforeMount, getCurrentInstance} from "vue";
import {useRouter} from "vue-router";
import {ElMessage, ElMessageBox} from "element-plus";

// 模拟上传数据
const instance = getCurrentInstance();
const router = useRouter();
function upLoaderHandler() {
  console.log('test!!!');
  // 调用测试接口
  instance.proxy.$axios.get('/test')
      .then((res) => {
        const taskID = res.data;

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

</script>

<template>
  <div id="content">
    <el-button type="primary" size="large" @click="upLoaderHandler">
      点击进行测试
    </el-button>
  </div>
</template>

<style scoped>
#content {
  display: flex;
  justify-content: center;

  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, 350%);
}

</style>