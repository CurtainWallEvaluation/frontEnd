<script setup>
import {ref, watch, onMounted, onBeforeMount, getCurrentInstance} from "vue";
import {useRouter} from "vue-router";
import {ElLoading, ElMessage} from "element-plus";

const content = ref(null);
const allTasks = ref([]);
const instance = getCurrentInstance();
const tableLoading = ref(false);
const router = useRouter();

onMounted(() => {
  const loading = ElLoading.service({
    target: content.value,
    text: '加载历史任务中',
  })

  // 渲染页面时获取全部任务
  instance.proxy.$axios.get('/task/getAllTask')
      .then((res) => {
        console.log(res);
        allTasks.value = res.data.data;

        ElMessage({
          message: '数据加载成功',
          type: 'success',
        })
        loading.close();
      })
      .catch((error) => {
        console.log(error);

        ElMessage({
          message: '数据加载失败',
          type: 'error',
        })
        loading.close();
      })
})

// 点击任务后进入对应任务页面
function handleClick(taskID) {
  console.log(taskID);

  router.push(`/task/${taskID}`);
}

</script>

<template>
  <div id="content" ref="content">
    <el-table :data="allTasks" border style="width: auto">
      <el-table-column fixed prop="taskID" label="任务ID" width="70"/>
      <el-table-column prop="dateTime" label="任务日期" width="180"/>
      <el-table-column prop="totalNum" label="检测图片总数" width="180"/>
      <el-table-column prop="qualNum" label="合格图片张数" width="180"/>
      <el-table-column prop="unqualNum" label="异常图片张数" width="180"/>
      <el-table-column fixed="right" align="center" label="操作" min-width="100">
        <template #default="scope">
          <el-button
              size="default"
              type="primary"
              @click="handleClick(allTasks[scope.$index].taskID)">
            查看详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped>
#content {
  height: 100%;
  width: 100%;
  //background: #024f67;

  display: flex;
  justify-content: center;
}
</style>