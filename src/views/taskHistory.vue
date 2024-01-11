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
        displayTasks.value = allTasks.value;

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

  dialogVisible.value = false;
})

// 表格的日期筛选功能
const tableRef = ref(null);
const dateRange = ref('');
const displayTasks = ref(null);

// 每当日期范围改变，则进行展示的更新
watch(dateRange, (newRange) => {
  console.log(newRange);

  if(newRange) {
    displayTasks.value = allTasks.value.filter((taskInfo) => {
      const leftDate = new Date(newRange[0]);
      const rightDate = new Date(newRange[1]);
      const targetDate = new Date(taskInfo.dateTime);

      return ((targetDate >= leftDate) && (targetDate <= rightDate))
    })
  } else {
    displayTasks.value = allTasks.value;
  }

})

const shortcuts = [
  {
    text: '上个星期',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: '上个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  },
  {
    text: '前三月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    },
  },
]


// 点击任务后进入对应任务页面
function handleClick(taskID) {
  router.push(`/task/${taskID}`);
}

// 处理查看对应任务的数据统计的弹窗
const currentTaskInfo = ref({});
const dialogVisible = ref(true);
const container = ref(null);

function dialogClickHandler(taskInfo) {
  console.log(taskInfo);
  dialogVisible.value = true;
  currentTaskInfo.value = taskInfo;
}

watch(dialogVisible, (newValue) => {

  console.log(container.value);
  if(newValue) {
    let chartInstance = instance.proxy.$echarts.init(container.value, "light");

    let option = {
      title: {
        text: '图片合格异常分布',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'right'
      },
      series: [
        {
          name: '图片占比',
          type: 'pie',
          radius: '70%',
          data: [
            {value: currentTaskInfo.value.qualNum, name: '合格图片数量', itemStyle: { normal: { color: 'green'}}},
            {value: currentTaskInfo.value.unqualNum, name: '异常图片数量', itemStyle: { normal: { color: 'red'}}},
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
    chartInstance.setOption(option);
  }
})

</script>
<template>
  <el-dialog v-model="dialogVisible" ref="dialog"
             width="50%">
    <template #header>
      <div id="taskInfoDialogHeader">
        <h2>任务质量统计结果</h2>
        <p style="color: #808080">评估日期：{{ currentTaskInfo.dateTime }}</p>
        <p style="color: #808080">评估图片总数：{{ currentTaskInfo.totalNum }}</p>
      </div>
    </template>
    <div id="dialogContent" ref="container">
      <!--        TODO: 弹窗中的图表-->

    </div>
  </el-dialog>
  <div id="content" ref="content">
    <div id="selector">
      <el-date-picker
          v-model="dateRange"
          type="daterange"
          value-format="YYYY-MM-DD"
          unlink-panels
          clearable
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :shortcuts="shortcuts"
          size="default"
          :filter-method="filterHandler"
      />
    </div>
    <el-table :data="displayTasks" ref="tableRef" border size="large" style="width: auto">
      <el-table-column fixed prop="taskID" sortable label="任务ID" min-width="120"/>
      <el-table-column prop="dateTime" sortable label="任务日期" min-width="180"/>
      <el-table-column prop="totalNum" label="检测图片总数" width="180"/>
      <el-table-column prop="qualNum" label="合格图片张数" width="180"/>
      <el-table-column prop="unqualNum" label="异常图片张数" width="180"/>
      <el-table-column fixed="right" align="center" label="操作" min-width="200">
        <template #default="scope">
          <el-button
              size="default"
              type="primary"
              @click="dialogClickHandler(allTasks[scope.$index])">
            数据统计
          </el-button>

          <el-button
              size="default"
              type="text"
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

  display: flex;
  flex-direction: column;
  justify-content: start;
}

#selector {
  display: flex;
  justify-content: start;
}

#dialogContent {
  padding: 0;
  margin: 0;

  width: 700px;
  height: 300px;
}
</style>