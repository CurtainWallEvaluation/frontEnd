<script>
import { ref, onMounted } from 'vue'
import echarts from '@/echarts'
export default {
  name: 'PieChart',
  setup() {
    const chartRef = ref(null);

    onMounted(() =>{
      const chart = echarts.init(chartRef.value);
      const data = [
        { name: '优秀', value : 3 },
        { name: '良好', value : 4 },
        { name: '合格', value : 1 },
        { name: '不合格', value : 2 }
      ];

      const option = {
        series: [
          {
            type:'pie',
            radius: ['20%','70%'],
            label: {
              show: true,
              position: 'inside',
              formatter: '{d}%\n{b}',
            },
            data: data,
          },
        ],
      };
      chart.setOption(option);
    });
    return {
      chartRef,
    };
  },
};
</script>

<template>
  <div>
    <div class = "title">
      <h1>数据概览</h1>
    </div>
    <div class = "taskbar">
      <div class = "leftButton">
        <button>Button1</button>
        <button>Button2</button>
      </div>
      <div class = "rightButton">
        <button>数据导出</button>
      </div>
    </div>
    <div class = "container">
      <div class = "chart">
        <div
            style="width: 400px; height: 400px"
            ref = "chartRef"
        ></div>
      </div>

      <div class = "table">
        <table
            width="600"
            height="350">
          <tr>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>

          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>

          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </table>
      </div>
    </div>
  </div>

</template>

<style scoped>
.title {
  margin-bottom: 20px;
  margin-left: 30px;
  text-align: center;
  font-size: 24px;
}
.taskbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  margin-bottom: 20px;
  margin-left:30px
}
.leftButton {
  margin-left: 80px;
}

.rightButton{
  margin-right: 100px;
}
button {
  width: 120px;
  height: 50px;
  font-size: 16px;
  margin: 0 30px;
}


.container {
  display: flex;
  margin-top: 50px;
}

.chart {
  width: 50%;
  margin-left: 150px;
}

.table {
  border-collapse: collapse;
  width: 50%;
  margin-top: 50px;
  margin-right: 100px;
}


.table th,
.table td {
  border: 1px solid #ddd;
  padding: 8px;
}

</style>