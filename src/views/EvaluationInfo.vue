<script setup>
import {ref, watch, onMounted} from "vue";

// 分块算法返回数据存储
const tmpData = [
  {
    toughnessLevel: 0,
    toughGrade: 82,
    type: 'wall',
    isImplosion: false,
    isStained: false,
    stainChromatism: 23.2,
    stainArea: 12.4,
    isFissured: true,
    fissureAvgHeight: 12.1,
    fissureAvgWidth: 3.4,
    fissureMaxWidth: 5.1,
  },
  {
    toughnessLevel: 0,
    toughGrade: 91,
    type: 'glass',
    isImplosion: false,
    isStained: true,
    stainChromatism: 21.1,
    stainArea: 12.4,
    isFissured: false,
    fissureAvgHeight: 0,
    fissureAvgWidth: 0,
    fissureMaxWidth: 0,
  },
  {
    toughnessLevel: 1,
    toughGrade: 72.2,
    type: 'wall',
    isImplosion: false,
    isStained: true,
    stainChromatism: 10.2,
    stainArea: 20.1,
    isFissured: true,
    fissureAvgHeight: 12.1,
    fissureAvgWidth: 3.4,
    fissureMaxWidth: 5.1,
  },
  {
    toughnessLevel: 2,
    toughGrade: 82,
    type: 'glass',
    isImplosion: true,
    isStained: false,
    stainChromatism: 0,
    stainArea: 0,
    isFissured: false,
    fissureAvgHeight: 0,
    fissureAvgWidth: 0,
    fissureMaxWidth: 0,
  },
  {
    toughnessLevel: 2,
    toughGrade: 82,
    type: 'glass',
    isImplosion: true,
    isStained: false,
    stainChromatism: 0,
    stainArea: 0,
    isFissured: false,
    fissureAvgHeight: 0,
    fissureAvgWidth: 0,
    fissureMaxWidth: 0,
  },
  {
    toughnessLevel: 2,
    toughGrade: 82,
    type: 'glass',
    isImplosion: true,
    isStained: false,
    stainChromatism: 0,
    stainArea: 0,
    isFissured: false,
    fissureAvgHeight: 0,
    fissureAvgWidth: 0,
    fissureMaxWidth: 0,
  },
  {
    toughnessLevel: 2,
    toughGrade: 82,
    type: 'glass',
    isImplosion: true,
    isStained: false,
    stainChromatism: 0,
    stainArea: 0,
    isFissured: false,
    fissureAvgHeight: 0,
    fissureAvgWidth: 0,
    fissureMaxWidth: 0,
  },
]

// 进入后初始化数据
onMounted(() => {
  //TODO：初始化分页数据，并从数据库中取得相关数据
  currentPage.value = 1;
  pageSize.value = 12;
  total.value = tmpData.length;

  linesCount.value = pageSize.value / lineSize.value

})

// 分块展示分页控制
const currentPage = ref(0)
const total = ref(0)
const pageSize = ref(10);

function handlePageChange(newPage) {
  // TODO:从数据库重新获取对应数量的分块数据
}

function handleSizeChange(newSize) {
  // TODO:根据当前页大小，向数据库申请新的数据
  linesCount.value = newSize/lineSize.value;
}

// 左侧分块展示行列控制
const lineSize = ref(6);
const linesCount = ref(2);

// 右侧栏数据和界面控制
const sideDiaStatus = ref(true)
const sideDia = ref(null)
const currentDataIndex = ref(0)

// 控制侧边栏的宽度
watch(sideDiaStatus, (newValue) => {
  if (newValue) {
    sideDia.value.style.width = '40%';
  } else {
    sideDia.value.style.width = '0px';
  }
})

watch(currentDataIndex, (newDataIndex) => {
  // TODO:根据新的dataIndex更新右侧栏的详细信息

})

function sideDiaChange(newIndex) {

  sideDiaStatus.value = !sideDiaStatus.value;
  return;

  if (sideDiaStatus && currentDataIndex === newIndex) {
    // 同一个分块点击进行回收
    sideDiaStatus.value = !sideDiaStatus.value;
  } else if (sideDiaStatus) {
    // TODO:更换右侧详细展示数据
    currentDataIndex.value = newIndex;

  } else {
    sideDiaStatus.value = true;
    // TODO:更新右侧详细数据
    currentDataIndex.value = newIndex;
  }
}

</script>

<template>
  <main>
    <div id="content">
      <div id="overview">
        <el-row :gutter="10" justify="start" v-for="i in linesCount">
          <el-col
              v-for="(curtainInfo, index) in tmpData.slice(i * lineSize, (i + 1)*lineSize)"
              :key="index"
              :span="3"
          >
            <el-card :body-style="{ padding: '0', cursor: 'pointer', backgroundColor: 'palegoldenrod'}"
                     shadow="hover" @click="sideDiaChange(index)">
              <img
                  src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
                  class="image"
              />
              <div style="padding: 14px">
                <span>Yummy hamburger</span>
                <div class="bottom">
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
      <div id="sideDia" ref="sideDia">
        <!--        TODO: 待完成-->
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
  display: flex;
  flex-direction: column;
  height: 100vh;

  background: antiquewhite;
}

#content {
  margin: 30px 30px 0 30px;
  display: flex;
  box-sizing: border-box;
  width: 100%;
  flex-grow: 1;
}

#sideDia {
  background: cadetblue;

  border-radius: 15px;
  margin-left: 10px;

  width: 40%;
  height: 100%;

  transition: width 0.5s;
}

#bottomBar {
  flex-basis: 7%;

  display: flex;
  justify-content: center;
}

#pagination {
  margin: auto 0;
}

</style>