<script setup>
import {ref, watch, onMounted, onBeforeMount, getCurrentInstance} from "vue";
import {useRouter} from "vue-router";
import {ElMessageBox} from "element-plus";

// 模拟上传数据
function upLoaderHandler() {
  console.log('test!!!');
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