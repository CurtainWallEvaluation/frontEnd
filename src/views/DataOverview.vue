<script>
import echarts from '@/echarts';
import axios from 'axios';
import {ElLoading, ElMessage} from "element-plus";

const overallPiechartEvaluationData = {
  good: -1,
  qualified: -1,
  unqualified: -1,
}

const storeTableData = {
  num_good: 0,
  num_qualified:0,
  num_unqualified:0,
  crack_square_good: 0,
  crack_square_qualified: 0,
  crack_square_unqualified:0,
  dirt_cent_good:0,
  dirt_cent_qualified:0,
  dirt_cent_unqualified:0,
}

const glassHistogramChartData = {
  explotion: -1,
  noExplotion: -1
}

export default {
  props:{
    originalImgID: {
      type: Number,
      required: true
    },
    taskID:{
      type: Number,
      required: true
    }
  },
  mounted(){
    this.getOverallData()
    this.getGlassData()
    this.getStoneData()
  },
  name:"home",
  data(){
    return {
      tableData: [
        {
          name: '数量',
          good: storeTableData.num_good,
          qualified: storeTableData.num_qualified,
          unqualified: storeTableData.num_unqualified,
        },
        {
          name: '平均裂缝面积比',
          good: storeTableData.crack_square_good,
          qualified: storeTableData.crack_square_qualified,
          unqualified: storeTableData.crack_square_unqualified
        },
        {
          name: '最大污渍面积占比',
          good: storeTableData.dirt_cent_good,
          qualified: storeTableData.dirt_cent_qualified,
          unqualified: storeTableData.dirt_cent_unqualified
        }
      ]
    }
  },
  methods: {
    back(){
      this.$router.push({
        name: 'oriImageDetail',
        params:{
          taskID:this.taskID,
          originalImgID:this.originalImgID
        }
      })
    },
    async getOverallData(){
      const loading = ElLoading.service({
        fullscreen: true,
        text: '加载数据中',
      })
      try{
        const url = `http://localhost:8081/image/getOriImgStatic/${this.originalImgID}`
        const res = await axios({
          url,
        })
        console.log(res)
        overallPiechartEvaluationData.good = res.data.data.goodNum;
        overallPiechartEvaluationData.qualified = res.data.data.qualNum;
        overallPiechartEvaluationData.unqualified = res.data.data.uqualNum;
        console.log(overallPiechartEvaluationData.good)
        console.log(overallPiechartEvaluationData.qualified)
        console.log(overallPiechartEvaluationData.unqualified)
        let OverallPieChart = echarts.init(this.$refs.OverallPieChart)
        let data = [
          {
            value:overallPiechartEvaluationData.good,
            name:"优秀",
            itemStyle:{
              normal:{
                color:"rgb(27,217,27)"
              }
            }
          },
          {
            value:overallPiechartEvaluationData.qualified,
            name:"合格",
            itemStyle:{
              normal:{
                color:"rgb(255,255,30)"
              }
            }
          },
          {
            value:overallPiechartEvaluationData.unqualified,
            name:"不合格",
            itemStyle:{
              normal:{
                color:"rgb(200,0,0)"
              }
            }
          }
        ]
        let pieChartOption={
          title:{
            text:"分块图片韧性等级占比图",
            left:"center",
            bottom: '8%'
          },
          legend:{
            left:"left",
            orient:"vertical"
          },
          series:[
            {
              name:"基于熵值法评估体系",
              type:"pie",
              data,
              radius:["20%","70%"],
              label:{
                show:true,
                position:"inside"
              },
              roseType:"area",
              itemStyle:{
                shadowBlur:200,
                shadowColor:"reba(0,0,0,.5)"
              }
            }
          ]
        }
        OverallPieChart.setOption(pieChartOption)
        console.log("already update piechart data")
        loading.close();
      } catch(error){
        console.log(error)
        ElMessage({
          message: '数据加载失败',
          type: 'error',
        })
        loading.close();
      }
    },
    async getGlassData(){
      const loading = ElLoading.service({
        fullscreen: true,
        text: '加载数据中',
      })
      try{
        const url = `http://localhost:8081/image/getOriImgGlassStatic/${this.originalImgID}`
        const res = await axios({
          url,
        })
        const glassdata = res.data.data.data
        glassHistogramChartData.explotion = glassdata[0]
        glassHistogramChartData.noExplotion = glassdata[1]
        console.log(glassHistogramChartData.explotion)
        console.log(glassHistogramChartData.noExplotion)
        let glassHistogram = echarts.init(this.$refs.glassHistogram)
        let xData =  Object.values(glassHistogramChartData)
        let yData = ["有内爆","无内爆"];
        let histogramOption = {
          title:{
            text:"玻璃幕墙内爆统计图"
          },
          xAxis:{

          },
          yAxis:{
            data:yData,
            type:"category"
          },
          legend:{
            left:"right",
            orient:"vertical"
          },
          series:[
            {
              name:"幕墙块数",
              type:"bar",
              data:xData,
              barWidth: 30,
              itemStyle:{
                normal:{
                  color:function(params){
                    let colorList=[
                      "#FD6C63",
                      "#82FD63"
                    ]
                    return colorList[params.dataIndex]
                  }
                }
              }
            }
          ]
        }
        glassHistogram.setOption(histogramOption)
        console.log("already get glass data")
        loading.close();
      } catch(error){
        console.log(error)
        ElMessage({
          message: '数据加载失败',
          type: 'error',
        })
        loading.close();
      }
    },
    async getStoneData(){
      const loading = ElLoading.service({
        fullscreen: true,
        text: '加载数据中',
      })
      try{
        const url = `http://localhost:8081/image/getImgCurtainInfo/${this.originalImgID}`
        const res = await axios({
          url,
        })
        const stonelist = res.data.data.stoneList;
        stonelist.forEach(item=>{
          console.log(item.point)
          if(item.point >= 0.9){
            storeTableData.num_good++
            storeTableData.crack_square_good += item.crackAreaProportion
            storeTableData.dirt_cent_good = Math.max(
                storeTableData.dirt_cent_good,
                item.stainAreaProportion
            )
          }
          else if(item.point >= 0.6 && item.point < 0.9){
            // 合格
            storeTableData.num_qualified++
            storeTableData.crack_square_qualified += item.crackAreaProportion
            storeTableData.dirt_cent_qualified = Math.max(
                storeTableData.dirt_cent_qualified,
                item.stainAreaProportion
            )
          } else {
            // 不合格
            storeTableData.num_unqualified++
            storeTableData.crack_square_unqualified += item.crackAreaProportion
            storeTableData.dirt_cent_unqualified = Math.max(
                storeTableData.dirt_cent_unqualified,
                item.stainAreaProportion
            )
          }
        })
        storeTableData.crack_square_good = storeTableData.crack_square_good / storeTableData.num_good
        storeTableData.crack_square_qualified = storeTableData.crack_square_qualified / storeTableData.num_qualified
        storeTableData.crack_square_unqualified = storeTableData.crack_square_unqualified / storeTableData.num_unqualified
        console.log(storeTableData)
        console.log("already get glass data")
        this.tableData = [
          {
            name: '数量',
            good: storeTableData.num_good,
            qualified: storeTableData.num_qualified,
            unqualified: storeTableData.num_unqualified,
          },
          {
            name: '平均裂缝面积比',
            good: storeTableData.crack_square_good,
            qualified: storeTableData.crack_square_qualified,
            unqualified: storeTableData.crack_square_unqualified
          },
          {
            name: '最大污渍面积占比',
            good: storeTableData.dirt_cent_good,
            qualified: storeTableData.dirt_cent_qualified,
            unqualified: storeTableData.dirt_cent_unqualified
          }
        ]
        loading.close();
      } catch(error){
        console.log(error)
        ElMessage({
          message: '数据加载失败',
          type: 'error',
        })
        loading.close();
      }
    }
  }
};
</script>

<template>
  <div class = "dataOverview">
    <div class = "taskbar">
      <el-button class = "backButton" >
        <el-icon class="el-icon--left">
          <ArrowLeft/>
        </el-icon>
        <span class = "backWord" @click="back">返回</span>
      </el-button>
    </div>
    <div class = "container">
      <div class = "OverallChart">
        <div class="pieChartTop">
          <el-icon class = "chartIcon"><PieChart/></el-icon>
          <el-text type = "primary" class = "chartTitle">幕墙总体质量评估结果</el-text>
          <br>
          <el-text type = "success" class = "chartNextTitle">基于熵值法评估体系</el-text>
          <div>------------------------------------------------------------------------</div>
        </div>
        <div ref="OverallPieChart" id="OverallPieChart"></div>
        <div
            style="width: 400px; height: 400px"
            ref = "chartRef"
        ></div>
      </div>
      <div class = "categoryStatic">
        <div class="categoryStaticTitle">
          <el-icon class = "categoryStaticPic"><document/></el-icon>
          <div class="staticTitle">石材幕墙综合统计</div>
        </div>
        <el-table
            :data="tableData"
            border="true"
            stripe="true"
            empty-text="-"
            :header-cell-style="{background:'#CCF6FF'}"
            style="
            width: 100%;
            height: 95%;
            margin-bottom: 20px;
            font-size: 15px;
            "
            :row-style="{height: '87px'}">
          <el-table-column
              prop="name"
              label="数据/质量">
          </el-table-column>
          <el-table-column
              prop="good"
              label="优秀">
          </el-table-column>
          <el-table-column
              prop="qualified"
              label="合格">
          </el-table-column>
          <el-table-column
              prop="unqualified"
              label="不合格">
          </el-table-column>
        </el-table>
        <div class = "glass_histogram">
          <div ref="glassHistogram" id="glassHistogram"></div>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>

.dataOverview {
  position: relative;
  background-color: #f5f5f5;
}

.taskbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-basis: 5%;
  background: #CCF6FF;
  margin-bottom: 20px;
}

.backButton {
  background-color: #D9D9D9;
  border-radius: 15px;
  width: 90px;
  height: 50px;
  padding: 5px 10px;
  margin-left: 50px;
}

.el-icon--left {
  color: black;
  font-size: 20px
}

.backWord {
  color: black;
  font-size: 20px;
}

.container {
  display: flex;
  margin-top: 50px;
}

.pieChartTop{
  height:100px;
  margin-bottom:10px;
}

.chartIcon{
  font-size:35px;
  margin-left:15px;
  margin-top:15px
}

.chartTitle{
  font-size:30px;
  margin-left:10px;
  color:#337ecc;
}

.chartNextTitle{
  font-size:15px;
  margin-left:100px;
  color:black;
}

.OverallChart {
  display: block;
  background: white;
  height:500px;
  width:500px;
  margin-top:50px;
  margin-right:150px;
  margin-left: 100px;
}


.categoryStatic{
  background: white;
  display:flex;
  flex-direction: column;
  height: 90vh;
}

.categoryStaticTitle {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.staticTitle{
  font-size: 20px;
  margin-left:30px;
  margin-top:10px;
  margin-bottom: 5px;
  font-weight: bold;
  color:#303133;
}


.categoryStaticPic{
  font-size: 25px;
  margin-left:30px;
  margin-top:10px;
}

.glass_histogram{
  background: white;
  width:600px
}

.table th,
.table td {
  border: 1px solid #ddd;
  padding: 8px;
}

#glassHistogram{
  width:500px;
  height:300px;
  border:2px;
  margin-left:40px;
}

#OverallPieChart{
  width:400px;
  height:400px;
  margin-left:35px;
  margin-top:35px;
}

</style>