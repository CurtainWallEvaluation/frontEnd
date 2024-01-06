<script setup>
import {ref, watch, onMounted, onBeforeMount} from "vue";
import {useRouter} from "vue-router";
import axios from "axios";
import {ArrowLeftBold} from "@element-plus/icons-vue";

// 分块算法返回数据存储
const stoneList = [
  {
    imageUrl: '123.cc',
    stainAreaProportion: 0.235,
    point: 82.1,
    stainColorDiffer: 21.2,
    crackAreaProportion: 0.012,
    crackNum: 2,
    lengthCaculate: 0.002,
    widthCaculate: 0.001,
    status: 1,
  },
  {
    imageUrl: '123.cc',
    stainAreaProportion: 0.135,
    point: 92.1,
    stainColorDiffer: 15.2,
    crackAreaProportion: 0.022,
    crackNum: 1,
    lengthCaculate: 0.002,
    widthCaculate: 0.001,
    status: 0,
  },
  {
    imageUrl: '123.cc',
    stainAreaProportion: 0.535,
    point: 78.1,
    stainColorDiffer: 32.2,
    crackAreaProportion: 0.009,
    crackNum: 2,
    lengthCaculate: 0.003,
    widthCaculate: 0.002,
    status: 2,
  },
  {
    imageUrl: '123.cc',
    stainAreaProportion: 0.172,
    point: 85.1,
    stainColorDiffer: 12.2,
    crackAreaProportion: 0.002,
    crackNum: 2,
    lengthCaculate: 0.001,
    widthCaculate: 0.005,
    status: 1,
  },
  {
    imageUrl: '123.cc',
    stainAreaProportion: 0.235,
    point: 88.1,
    stainColorDiffer: 9.2,
    crackAreaProportion: 0.002,
    crackNum: 5,
    lengthCaculate: 0.012,
    widthCaculate: 0.009,
    status: 1,
  },
  {
    imageUrl: '123.cc',
    stainAreaProportion: 0.335,
    point: 76.1,
    stainColorDiffer: 25.2,
    crackAreaProportion: 0.022,
    crackNum: 4,
    lengthCaculate: 0.012,
    widthCaculate: 0.011,
    status: 2,
  },
  {
    imageUrl: '123.cc',
    stainAreaProportion: 0.235,
    point: 71.2,
    stainColorDiffer: 35.2,
    crackAreaProportion: 0.010,
    crackNum: 3,
    lengthCaculate: 0.012,
    widthCaculate: 0.003,
    status: 2,
  },
]
const glassList = [
  {
    imageUrl: '123.cc',
    isImplosion: 0,
    status: 0,
  },
  {
    imageUrl: '123.cc',
    isImplosion: 1,
    status: 1,
  },
  {
    imageUrl: '123.cc',
    isImplosion: 1,
    status: 1,
  },
  {
    imageUrl: '123.cc',
    isImplosion: 0,
    status: 0,
  },
]

// 将后端的两条数组组成为一条展示数组，并添加对应的类型
function dataPreProcess(stoneList, glassList) {
  let ret = [];

  for (let stoneImage of stoneList) {
    ret.push({
      type: 'stone',
      ...stoneImage,
    })
  }

  for (let glassImage of glassList) {
    ret.push({
      type: 'glass',
      ...glassImage,
    })
  }

  return ret;
}

const tmpData = dataPreProcess(stoneList, glassList);

// 路由设置
const router = useRouter();

onBeforeMount(() => {
  currentData.value = tmpData[currentDataIndex.value];
})
// 渲染后进入后初始化数据
onMounted(() => {
  //TODO：初始化分页数据，并根据Router的taskID到数据库中取得对应的原图数据（无需数据库分页）
  currentPage.value = 1;
  pageSize.value = 12;
  total.value = tmpData.length;

  linesCount.value = pageSize.value / lineSize.value
  sideDiaStatus.value = false;

  //TODO:对获取的stone数组和glass数组进行预处理

})

// 分块展示分页控制
const currentPage = ref(0)
const total = ref(0)
const pageSize = ref(10)
const baseCount = ref(0)

function handlePageChange(newPage) {
  // TODO:重新获取对应数量的分块数据
  baseCount.value = (newPage - 1) * pageSize.value;

}

function handleSizeChange(newSize) {
  // TODO:根据当前页大小，重新渲染数据；行数应该取数据行数和页面行数的较小值
  linesCount.value = Math.min(newSize / lineSize.value, tmpData.length / lineSize.value);
  currentPage.value = 1;
  pageSize.value = newSize;
  baseCount.value = 0;

}

// 左侧分块展示行列控制
const lineSize = ref(6);
const linesCount = ref(2);

// 右侧栏数据和界面控制
const sideDiaStatus = ref(false)
const sideDia = ref(null)
const imgContainer = ref(null)
const currentDataIndex = ref(0)
const currentData = ref(tmpData[currentDataIndex])

// 控制侧边栏的宽度
watch(sideDiaStatus, (newValue) => {
  if (newValue) {
    sideDia.value.style.width = '40%';
    sideDia.value.style.fontSize = 'x-large';
    sideDia.value.style.padding = '10px';
    imgContainer.value.style.display = 'block'
  } else {
    sideDia.value.style.width = '0px';
    sideDia.value.style.fontSize = '0';
    sideDia.value.style.padding = '0';
    imgContainer.value.style.display = 'none';

    currentDiv.value = null;
  }
})

watch(currentDataIndex, (newDataIndex) => {
  currentData.value = tmpData[newDataIndex];
})

let currentDiv = ref(null);

// 记录选中的DIV并显示边框
watch(currentDiv, (newDiv, oldValue) => {
  // 取消选中旧的DIV边框
  if(oldValue !== null) {
    oldValue.style.outline = 'none';
  }

  // 选中新的DIV边框
  if (newDiv !== null) {
    newDiv.style.outline = '4px solid yellow'
  }
})

function sideDiaChange(newIndex, event) {
  // sideDiaStatus.value = !sideDiaStatus.value;
  // return;

  currentDiv.value = event.currentTarget;

  if (!sideDiaStatus.value) {
    sideDiaStatus.value = !sideDiaStatus.value;
    currentDataIndex.value = newIndex;
  } else if (currentDataIndex.value === newIndex) {
    // 同一个分块点击进行回收
    sideDiaStatus.value = !sideDiaStatus.value;
  } else if (sideDiaStatus) {
    currentDataIndex.value = newIndex;
  }
}

</script>

<template>
  <main>
    <div id="topBar">
      <el-button-group size="large">
        <el-button color="#E5E5B0" type="primary" :icon="ArrowLeftBold" @click="router.push('/taskOverview')">返回</el-button>
        <el-button color="#E5E5B0" type="primary" @click="router.push('/oriImageOverview')">
          数据概览
          <el-icon class="el-icon--right">
            <ArrowRight/>
          </el-icon>
        </el-button>
      </el-button-group>
    </div>
    <div id="content">
      <div id="overview">
        <el-scrollbar>
          <el-row :gutter="10" justify="start" v-for="i in linesCount">
            <el-col
                v-for="(curtainInfo, index) in tmpData.slice((i - 1) * lineSize, i * lineSize)"
                :key="index + (i - 1) * lineSize"
                :span="4"
            >
              <div class="infoCard" @click="sideDiaChange(index + (i - 1) * lineSize, $event)">
                <el-image fit="fill" :class="curtainInfo.status === 0? 'safe' : (curtainInfo.status === 1? 'normal' : 'danger')" :src="curtainInfo.imageUrl" style="width: 100%; height: 100%">
                  <template #error>
                    <div class="image-slot">
                      <el-icon>
                        <Picture/>
                      </el-icon>
                    </div>
                  </template>
                </el-image>
                <div class="infoIndex">{{ index + (i - 1) * lineSize }}</div>
              </div>
            </el-col>
          </el-row>
        </el-scrollbar>
      </div>
      <div id="sideDia" ref="sideDia">
        <!--        TODO: 侧边显示栏待完成-->
        <h1>
          幕墙类型：{{ currentData.type === 'glass' ? '玻璃' : '石材' }}
          <el-tag v-if="currentData.status === 0 && sideDiaStatus" type="success" size="large">良好</el-tag>
          <el-tag v-else-if="currentData.status === 1 && sideDiaStatus" type="warning" size="large">合格</el-tag>
          <el-tag v-else-if="sideDiaStatus" type="danger" size="large">异常</el-tag>
        </h1>
        <div v-if="currentData.type === 'glass'" class="DetailInfo" id="glassInfo">
          <p>内爆：{{ currentData.isImplosion ? '是' : '否' }}</p>
        </div>
        <div v-else class="DetailInfo" id="wallInfo">
          <div id="fissureInfo">
            <p>裂缝条数：{{ 1 }}</p>
            <p>裂缝面积占比：{{ currentData.crackAreaProportion }}</p>
            <p>裂缝长度平方占比：{{ currentData.lengthCaculate }}</p>
            <p>裂缝平均宽度平方面积比：{{ currentData.widthCaculate }}</p>
          </div>
          <div id="stainInfo">
            <p>污渍面积占比：{{ currentData.stainAreaProportion }}</p>
            <el-tooltip class="box-item"
                        effect="light"
                        content="污渍部分平均每个像素点和非污渍部分的像素点灰度值差值"
                        placement="bottom">
              <p>污渍色差：{{ currentData.stainColorDiffer }}</p>
            </el-tooltip>
          </div>
        </div>
        <div id="imgContainer" ref="imgContainer">
          <el-image fit="fill">
            <template #error>
              <div class="image-slot">
                图片加载失败！
              </div>
            </template>
          </el-image>
        </div>
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

#topBar {
  flex-basis: 5%;

  box-sizing: border-box;
  margin: 0 30px;
  display: flex;
  justify-content: start;

  padding: 10px;
}

#content {
  margin: 0 30px 0 30px;
  display: flex;
  box-sizing: border-box;

  flex-grow: 1;
}

#overview {
  width: 100%;
}

#sideDia {
  background: rgba(95, 158, 160, 0.44);

  border-radius: 15px;
  margin-left: 10px;
  padding: 10px;

  width: 40%;
  height: 100%;
  font-size: x-large;

  display: flex;
  flex-direction: column;

  transition: all 0.5s;
}

#wallInfo {
  display: flex;
  gap: 10px;
  justify-content: space-evenly;
}

#imgContainer {
  //background: red;

  & .image-slot {
    display: flex;
    //text-align: center;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background: var(--el-fill-color-light);
    color: var(--el-text-color-secondary);
    font-size: 30px;
  }

  flex-grow: 1;
}

.el-row {
  padding-bottom: 10px;
}

.infoCard {
  background: aquamarine;

  min-height: 250px;
  cursor: pointer;
  margin: 5px;

  display: flex;
  flex-direction: column;

  transition: outline-width 0.2s;
}

.infoCard .el-image {
  flex-grow: 1;
  opacity: 0.4;
  & .safe {
    background: green;
  }

  & .normal {
    background: yellow;
  }
  & .danger {
    background: red;
  }
}

.infoCard .image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-secondary);
  font-size: 30px;
}

.infoIndex {
  text-align: center;
  flex-basis: 10%;
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