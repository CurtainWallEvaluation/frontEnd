<script setup>
import { ref, watch } from "vue";

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

// 分块展示分页控制
const currentPage = ref(0)
const pageSize = ref(0)
const total = ref(0)


// 右侧栏数据和界面控制
const sideDiaStatus = ref(false)
const sideDia = ref(null)
const currentDataIndex = ref(0)

watch(sideDiaStatus, (newValue) => {
  console.log(sideDia.value)

  if(newValue) {
    sideDia.value.style.minWidth = '35%';
  } else {
    sideDia.value.style.width = '0';
  }

  console.log(sideDia.value.style);
})

watch(currentDataIndex, (newDataIndex) => {
  // TODO:根据新的dataIndex更新右侧栏的详细信息
})

function sideDiaChange(newIndex) {

  sideDiaStatus.value = !sideDiaStatus.value;
  console.log(sideDiaStatus.value)
  return;

  if(sideDiaStatus && currentDataIndex === newIndex) {
    return;
  } else if(sideDiaStatus) {
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
        <el-row :gutter="10" justify="start">
          <el-col
              v-for="(curtainInfo, index) in tmpData.slice()"
              :key="index"
              :span="4"
              :offset="1"
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
        <el-card :body-style="{ padding: '10px 10px', backgroundColor: 'palegoldenrod', height: '100vh'}">
          <img
              src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
              class="image"
          />
          <div style="padding: 14px">
            <span>Yummy hamburger</span>
          </div>
        </el-card>
      </div>
    </div>
    <div id="bottomBar">
      <el-pagination
          small
          background
          layout="prev, pager, next"
          :total="50"
          class="mt-4"
      />
    </div>
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;

  height: 100%;
}

#content {
  margin: 5px 5px;

  display: flex;
}

#sideDia {
  background: blue;

  margin-left: 10px;

  width: 35%;
  height: 100%;

  transition: width;
}

</style>