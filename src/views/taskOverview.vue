<script setup>
import {ref, watch, onMounted, onBeforeMount, getCurrentInstance, inject} from "vue";
// 路由设置
import {useRouter} from "vue-router";
import {ArrowLeftBold, Search} from "@element-plus/icons-vue";
import {ElLoading, ElMessage} from "element-plus";

const props = defineProps(['taskID']);
const router = useRouter();

const tmpData = [
  {
    originalImgID: 1,
    taskID: 1,
    imageUrl: '12.cc',
    glassNum: 3,
    stoneNum: 2,
    status: 0,
  },
  {
    originalImgID: 2,
    taskID: 1,
    imageUrl: '12.cc',
    glassNum: 1,
    stoneNum: 4,
    status: 1,
  },
  {
    originalImgID: 3,
    taskID: 1,
    imageUrl: '12.cc',
    glassNum: 1,
    stoneNum: 4,
    status: 1,
  },
  {
    originalImgID: 4,
    taskID: 1,
    imageUrl: '12.cc',
    glassNum: 3,
    stoneNum: 1,
    status: 0,
  },
  {
    originalImgID: 5,
    taskID: 1,
    imageUrl: '12.cc',
    glassNum: 1,
    stoneNum: 2,
    status: 0,
  },
  {
    originalImgID: 6,
    taskID: 1,
    imageUrl: '12.cc',
    glassNum: 3,
    stoneNum: 6,
    status: 1,
  },
]

// 获取当前组件上下文实例
const instance = getCurrentInstance();
const container = ref(null);

// 渲染后进入后初始化数据
onMounted(() => {
  // 初始化分页数据，并从数据库中取得相关数据（该任务对应的任务占总数）
  currentPage.value = 1;
  pageSize.value = 12;
  linesCount.value = Math.ceil(pageSize.value / lineSize.value);

  // 向数据库拿取对应任务信息
  console.log(props.taskID);
  const loading = ElLoading.service({
    fullscreen: true,
    lock: true,
    text: '加载数据中',
  })

  instance.proxy.$axios.get(`/task/getTaskInfo/${props.taskID}`)
      .then((res) => {
        console.log(res);
        taskInfo.value = res.data.data;
        console.log(taskInfo.value);
        total.value = taskInfo.value.totalNum;

        // 向数据库分页拿取对应任务的图片信息
        instance.proxy.$axios.get('/task/getImgByPage',
            {
              params: {
                taskID: props.taskID,
                currentPage: currentPage.value,
                pageSize: pageSize.value,
              }
            })
            .then((res) => {
              console.log(res);
              displayData.value = res.data.data;
              console.log(displayData.value);

              ElMessage({
                message: '原图数据加载成功',
                type: 'success',
              })

              loading.close();
            })
            .catch((error) => {
              console.log(error);

              ElMessage({
                message: '原图数据加载失败',
                type: 'error',
              })

              loading.close();
            })

        ElMessage({
          message: '任务数据加载成功',
          type: 'success',
        })
      })
      .catch((error) => {
        console.log(error);

        loading.close();
        ElMessage({
          message: '任务数据加载失败',
          type: 'error',
        })
      })

  taskInfoDialogStatus.value = false;
})

// 页面元素索引
const content = ref(null);
const dialog = ref(null);
// 展示用数据
const displayData = ref(tmpData);

// 分块展示分页控制
const currentPage = ref(0)
const total = ref(0)
const pageSize = ref(10);
// 分块展示行列控制
const lineSize = ref(6);
const linesCount = ref(2);

// 异常图片查看：包括异常图片数据，异常图片的前端分页
const dangerOnly = ref(false);
// 用来调节是前端分页还是数据库分页
const baseCount = ref(0);

// 负责危险照片筛选的模式切换
watch(dangerOnly, (newValue, oldValue) => {
  if (newValue === oldValue) {
    return;
  }

  const loading = ElLoading.service({
    fullscreen: true,
    lock: true,
    text: '切换筛选中',
  })
  // 切换为查看异常图片
  if (newValue === true) {
    instance.proxy.$axios.get(`/task/getErrorImg/${props.taskID}`)
        .then((res) => {
          console.log(res);
          displayData.value = res.data.data;
          total.value = displayData.value.length;
          // linesCount.value = Math.ceil(Math.min(lineSize.value, displayData.value.length / lineSize.value));
          console.log(linesCount.value);
          console.log(displayData.value);

          loading.close();
          handlePageChange(1);
          ElMessage({
            message: '数据加载成功',
            type: 'success',
          })
        })
        .catch((error) => {
          console.log(error);
          loading.close();

          ElMessage({
            message: '数据加载失败',
            type: 'error',
          })
        })
  }
  // 切换到查看全部图片，重新向数据库请求
  else {
    currentPage.value = 1;
    instance.proxy.$axios.get('/task/getImgByPage',
        {
          params: {
            taskID: props.taskID,
            currentPage: currentPage.value,
            pageSize: pageSize.value,
          }
        })
        .then((res) => {
          console.log(res);
          displayData.value = res.data.data;
          total.value = displayData.value.length;
          linesCount.value = Math.ceil(Math.min(lineSize.value, displayData.value.length / lineSize.value));

          handlePageChange(1);
          loading.close();
        })
        .catch((error) => {
          console.log(error);

          loading.close();
          ElMessage({
            message: '数据加载失败',
            type: 'error',
          })
        })
  }
})

function handlePageChange(newPage) {
  // 若为只看异常则为前端分页baseCount要更新；若为看全部则baseCount不更新
  const loading = ElLoading.service({
    target: content.value,
    text: '切换页面中',
  })

  if (dangerOnly.value) {
    // 前端分页
    console.log('test');
    console.log(pageSize.value);
    currentPage.value = newPage;
    baseCount.value = (newPage - 1) * pageSize.value
    linesCount.value = Math.ceil(Math.min(linesCount.value, displayData.value.slice(baseCount.value, baseCount.value + pageSize.value).length / lineSize.value));
    console.log(linesCount.value);
    loading.close();

  } else {
    // 向数据库更新数据（后端分页）
    baseCount.value = 0;
    instance.proxy.$axios.get('/task/getImgByPage',
        {
          params: {
            taskID: props.taskID,
            currentPage: newPage,
            pageSize: pageSize.value,
          },
        })
        .then((res) => {
          console.log(res);
          displayData.value = res.data.data;

        })
        .catch((error) => {
          console.log(error);

          ElMessage({
            message: '数据加载失败',
            type: 'error',
          })
        })

    loading.close();
  }
}

function handleSizeChange(newSize) {

  linesCount.value = Math.ceil(Math.min(newSize / lineSize.value, displayData.value.length / lineSize.value));
  pageSize.value = newSize;

  console.log(displayData.value);
  console.log(displayData.value.slice(0, 1));
  console.log(lineSize.value);
  console.log(linesCount.value);
  console.log(newSize);
  // 若更新页大小则默认回到第一页
  handlePageChange(1);
}

// 单次任务的统计弹窗
const taskData = {
  taskID: '1',
  dateTime: '2012-12-12',
  qualNum: 122,
  unqualNum: 23,
  totalNum: 145,
}
const taskInfo = ref(taskData);
const taskInfoDialogStatus = ref(true);

// 用户点击原图后跳转到具体图页面
function oriImageClickHanler(taskID, originalImgID) {
  console.log(taskID, originalImgID);
  router.push(`/oriImageDetail/${taskID}/${originalImgID}`);
}

// 加载echart图片
const isFirstView = ref(true);
watch(taskInfoDialogStatus, (newValue) => {
  if(newValue && isFirstView.value) {
    isFirstView.value = false;

    console.log(container.value);
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
            {value: taskInfo.value.qualNum, name: '合格图片数量', itemStyle: { normal: { color: 'green'}}},
            {value: taskInfo.value.unqualNum, name: '异常图片数量', itemStyle: { normal: { color: 'red'}}},
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
  <main>
    <el-dialog v-model="taskInfoDialogStatus" ref="dialog" title="本次任务数据统计"
               width="50%">
      <template #header>
        <div id="taskInfoDialogHeader">
          <h1 ref="h1">本次任务质量评估结果</h1>
          <p style="color: #808080">评估任务数量：{{ taskInfo.totalNum }}</p>
        </div>
      </template>
      <div id="dialogContent" ref="container">
        <!--弹窗中的图表-->
      </div>
      <div ref="test">

      </div>
    </el-dialog>
    <div id="topBar">
      <div class="leftPart">
        <el-button-group size="large">
          <el-button color="#E5E5B0" type="primary" :icon="ArrowLeftBold" @click="router.push('/homepage')">返回
          </el-button>
          <el-button color="#E5E5B0" type="primary" @click="taskInfoDialogStatus=true">
            任务数据统计
          </el-button>
        </el-button-group>
      </div>
      <div class="centerPart">
        任务日期：{{ taskInfo.dateTime }}
      </div>
      <div class="rightPart">
        <el-button :icon="Search" :type="dangerOnly? 'primary' : 'danger'" :round="!dangerOnly" size="large"
                   @click="dangerOnly=!dangerOnly">
          {{ dangerOnly ? '查看所有图片' : '查看异常图片' }}
        </el-button>
      </div>
    </div>
    <div id="content" ref="content">
      <!--图例部分-->
      <div id="legend">
        <div>
          <div id="redRec"></div>
        </div>
        <div>
          <div id="greenRec"></div>
        </div>
      </div>
      <!--原图信息部分（卡片部分）-->
      <div id="cardArea">
        <el-row :gutter="10" justify="start" v-for="i in linesCount">
          <el-col
              v-for="(oriImageInfo, index) in displayData.slice(baseCount + (i - 1) * lineSize, baseCount + i * lineSize)"
              :key="baseCount + index + (i - 1) * lineSize"
              :span="4"
          >
            <div class="infoCard" @click="oriImageClickHanler(oriImageInfo.taskID, oriImageInfo.originalImgID)">
              <div class="imageContainer" :class="oriImageInfo.status === 0? 'safe' : 'danger'">
                <el-image fit="fill" :src="oriImageInfo.imageUrl">
                  <template #error>
                    <div class="image-slot">
                      <el-icon>
                        <Picture/>
                      </el-icon>
                    </div>
                  </template>
                </el-image>
              </div>
              <div class="imageIndex">
                {{ baseCount + index + (i - 1) * lineSize }}
              </div>
            </div>

          </el-col>
        </el-row>
      </div>
    </div>
    <div id="bottomBar">
      <div id="pagination">
        <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            @current-change="handlePageChange"
            @size-change="handleSizeChange"
            :total="total"
            :page-sizes="[12, 18, 36, 72]"
            layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </div>
  </main>
</template>

<style scoped>
main {
  margin: 0;
  padding: 0;

  display: flex;
  flex-direction: column;
  height: 100vh;

  background: antiquewhite;
}

#topBar {
  flex-basis: 5%;
  padding: 10px 30px;

  background: #CCF6FF;
  box-sizing: border-box;
  display: flex;
  justify-content: start;

  & .leftPart {
    flex-basis: 30%;
  }

  & .centerPart {
    flex-basis: 40%;
    text-align: center;

    font-size: xx-large;
    font-weight: bold;
  }

  & .rightPart {
    flex-basis: 30%;
    display: flex;
    justify-content: right;
  }
}

#content {
  margin: 0 30px 0 30px;
  display: flex;
  flex-direction: column;
  justify-content: start;
  box-sizing: border-box;

  flex-grow: 1;
}

#legend {
  padding: 10px 30px;
  display: flex;
  justify-content: start;
  gap: 50px;
  font-size: large;

  & #redRec {
    background: red;
    //width: 50px;
    height: 100%;
  }

  & #redRec::after {
    content: '异常';
    position: relative;
    left: 120%;
    color: red;
  }

  & #greenRec {
    background: green;
    //width: 50px;
    height: 100%;
  }

  & #greenRec::after {
    content: '正常';
    position: relative;
    left: 120%;
    color: green;
  }
}

.el-row {
  padding-bottom: 5px;
}

.infoCard {
  min-height: 250px;
  cursor: pointer;
  margin: 5px;

  display: flex;
  flex-direction: column;
  text-align: center;
  transition: box-shadow 0.3s;

  & .imageContainer {
    position: relative;
    flex-grow: 1;
  }

  & .imageContainer.safe {
    background: green;
  }

  & .imageContainer.danger {
    background: red;
  }
}

.infoCard .el-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  opacity: 0.5;
}

.infoCard:hover {
  box-shadow: 0 16px 32px 0 rgba(48, 55, 66, 0.15);;
}

.infoCard .image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  //background: var(--el-fill-color-light);
  //color: var(--el-text-color-secondary);
  font-size: 30px;
}

#bottomBar {
  flex-basis: 7%;

  display: flex;
  justify-content: center;
}

#pagination {
  margin: auto 0;
}

#dialogContent {
  padding: 0;
  margin: 0;

  width: 700px;
  height: 300px;
}
</style>