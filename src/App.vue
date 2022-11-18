<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import { default as timeData } from './components/timeData'
import * as echarts from 'echarts'
import moment from 'moment'
import {
  transformDataToMap,
  filterDataByDateRange,
  transformToDailyData,
  initBarChart,
  initPieChart,
  initLineChart,
  getActivityData,
  drawBarChartOfSingleActivity,
} from './utils/index'
import { activeTimeMap } from './utils/config.js'
import DailyActiveChartVue from './components/DailyActiveChart.vue'

const dataRange = ref('')
interface ChartItemData {
  chartType: 'bar' | 'line'
  data: any
}
const chartItemData: ChartItemData = reactive({ chartType: 'bar', data: 323 })

let state: any = reactive({ activityDataArr: [] })

onMounted(() => {
  let startDay = '2022-04-24'
  let endDay = '2022-05-18'
  let dailyData = transformToDailyData(timeData, startDay, endDay)
  let resArr = getActivityData(dailyData)
  state.activityDataArr = resArr
  console.log('activityDataArr', state.activityDataArr)
  var barChartDom = document.getElementById('bar-chart')
  initBarChart(barChartDom!, timeSource)
  var pieChartDom = document.getElementById('pie-chart')
  initPieChart(pieChartDom!, timeSource)
  var lineChartDom = document.getElementById('line-chart')
  initLineChart(lineChartDom!, dailyData)
  // var lineChartDom1 = document.getElementById('line-chart1')
  // drawBarChartOfSingleActivity(
  //   lineChartDom1!,
  //   daysList,
  //   [{ name: '睡觉', data: activityData['睡觉'] }],
  //   'bar'
  // )
  // chartItemData.chartType = 'bar'
  // chartItemData.data = [daysList, activityData['睡觉']]
})
let timeSource: any = []
// watch(dataRange, () => {
//   timeSource = refreshData()
//   let startDay = moment(dataRange.value[0]).format('YYYY-MM-DD')
//   let endDay = moment(dataRange.value[1]).format('YYYY-MM-DD')
//   console.log('=---', startDay, endDay)

//   lineData = transformToDailyData(timeData, startDay, endDay)
//   var barChartDom = document.getElementById('bar-chart')
//   initBarChart(barChartDom!, timeSource)
//   var pieChartDom = document.getElementById('pie-chart')
//   initPieChart(pieChartDom!, timeSource)
//   var lieChartDom = document.getElementById('line-chart')
//   initLineChart(lieChartDom!, lineData)
// })

function test(startDay: string, endDay: string) {
  // console.log(moment(dataRange.value[0]).format('YYYY-MM-DD'))
  chartItemData.chartType = chartItemData.chartType == 'line' ? 'bar' : 'line'
}

// function refreshData() {
//   let filterData = filterDataByDateRange(
//     timeData,
//     moment(dataRange.value[0]).format('YYYY-MM-DD'),
//     moment(dataRange.value[1]).format('YYYY-MM-DD')
//   )
//   let timeMap = transformDataToMap(filterData as [], { ...activeTimeMap })
//   let timeSource: any = []
//   for (const [key, value] of Object.entries(timeMap)) {
//     timeSource.push([key, value])
//   }
//   return timeSource
// }

// let lineData = transformToDailyData(
//   timeData,
//   moment(dataRange.value[0]).format('YYYY-MM-DD'),
//   moment(dataRange.value[1]).format('YYYY-MM-DD')
// )
</script>

<template>
  <div>
    <el-date-picker v-model="dataRange"
                    type="daterange"
                    range-separator="To"
                    start-placeholder="Start date"
                    end-placeholder="End date"
                    :default-value="[new Date(), new Date()]"
                    placeholder=""></el-date-picker>
  </div>
  <el-button type="primary"
             @click="test">test</el-button>
  <div id="bar-chart"
       class="chart"></div>
  <div id="line-chart"
       class="chart"></div>
  <div id="line-chart1"
       class="chart"></div>
  <div id="pie-chart"
       class="chart"></div>
  <div v-for="data in state.activityDataArr"
       :key="data.name">
    <DailyActiveChartVue :data="data"></DailyActiveChartVue>
  </div>
</template>

<style>
.chart {
  width: 500px;
  height: 300px;
  border: 1px solid black;
}
</style>