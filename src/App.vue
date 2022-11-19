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

const state: any = reactive({
  activityDataArr: [],
  startDay: '',
  endDay: '',
})

// watch([state.startDay, state.endDay], () => {
//   let dailyData = transformToDailyData(timeData, state.startDay, state.endDay)
//   state.activityDataArr = getActivityData(dailyData)
// })
let lineChartDom = null
let barChartDom = null
let pieChartDom = null

onMounted(() => {
  lineChartDom = document.getElementById('line-chart')
  barChartDom = document.getElementById('bar-chart')
  pieChartDom = document.getElementById('pie-chart')
  state.startDay = '2022-11-01'
  state.endDay = '2022-11-12'
  const dailyData = transformToDailyData(timeData, state.startDay, state.endDay)
  state.activityDataArr = getActivityData(dailyData)
  // initLineChart(lineChartDom!, dailyData)
  // initBarChart(barChartDom!, timeSource)
  // initPieChart(pieChartDom!, timeSource)

  // var lineChartDom1 = document.getElementById('line-chart1')
  // drawBarChartOfSingleActivity(
  //   lineChartDom1!,
  //   daysList,
  //   [{ name: '睡觉', data: activityData['睡觉'] }],
  //   'bar'
  // )
  // chartItemData.chartType = 'bar'
  // chartItemData.data = [daysList, activityData['睡觉']]
  watch([() => state.startDay, () => state.endDay], () => {
    const dailyData = transformToDailyData(
      timeData,
      state.startDay,
      state.endDay
    )
    state.activityDataArr = getActivityData(dailyData)
  })
})
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

function test(rangeType: number) {
  const curDate = moment(new Date()).format('YYYY-MM-DD')
  const prevDate = moment(curDate)
    .subtract(rangeType, 'days')
    .format('YYYY-MM-DD')
  state.startDay = prevDate
  state.endDay = curDate
  // console.log(moment(dataRange.value[0]).format('YYYY-MM-DD'))
  // chartItemData.chartType = chartItemData.chartType == 'line' ? 'bar' : 'line'
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
             @click="test(365)">过去一年</el-button>
  <el-button type="primary"
             @click="test(30)">过去一个月</el-button>
  <el-button type="primary"
             @click="test(7)">过去一周</el-button>
  <div id="bar-chart"
       class="chart"></div>
  <div id="line-chart"
       class="chart"></div>
  <div id="pie-chart"
       class="chart"></div>
  <div class="barChartContainer">
    <DailyActiveChartVue v-for="data in state.activityDataArr"
                         :key="data.name"
                         :data="data"></DailyActiveChartVue>
  </div>
</template>

<style>
.barChartContainer {
  width: 100%;
  height: 1000px;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
}
</style>