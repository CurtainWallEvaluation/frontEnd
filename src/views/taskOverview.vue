<script setup>

// 路由设置
import {useRouter} from "vue-router";

const router = useRouter();

const tmpData = [
  {
    oriImageID: 1,
    taskID: 1,
    imageUrl: '12.cc',
    glassNum: 3,
    stoneNum: 2,
    status: 0,
  },
  {
    oriImageID: 2,
    taskID: 1,
    imageUrl: '12.cc',
    glassNum: 1,
    stoneNum: 4,
    status: 1,
  },
  {
    oriImageID: 3,
    taskID: 1,
    imageUrl: '12.cc',
    glassNum: 1,
    stoneNum: 4,
    status: 1,
  },
  {
    oriImageID: 4,
    taskID: 1,
    imageUrl: '12.cc',
    glassNum: 3,
    stoneNum: 1,
    status: 0,
  },
  {
    oriImageID: 5,
    taskID: 1,
    imageUrl: '12.cc',
    glassNum: 1,
    stoneNum: 2,
    status: 0,
  },
  {
    oriImageID: 6,
    taskID: 1,
    imageUrl: '12.cc',
    glassNum: 3,
    stoneNum: 6,
    status: 1,
  },
]

// 渲染后进入后初始化数据
onMounted(() => {
  //TODO：初始化分页数据，并从数据库中取得相关数据（该任务对应的任务占总数）
  currentPage.value = 1;
  pageSize.value = 12;
  total.value = tmpData.length;

  linesCount.value = pageSize.value / lineSize.value


})
// 分块展示分页控制
const currentPage = ref(0)
const total = ref(0)
const pageSize = ref(10);
// 分块展示行列控制
const lineSize = ref(6);
const linesCount = ref(2);

function handlePageChange(newPage) {
  // TODO:从数据库重新获取对应数量的原图数据


}

function handleSizeChange(newSize) {
  // TODO:根据当前页大小，向数据库申请新的数据；行数应该取数据行数和页面行数的较小值
  linesCount.value = Math.min(newSize / lineSize.value, tmpData.length / lineSize.value);

}

</script>

<template>
  <el-row :gutter="10" justify="start" v-for="i in linesCount">
    <el-col

    >

    </el-col>
  </el-row>

</template>

<style scoped>
.el-row {
  padding-bottom: 5px;

}
</style>