<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { default as timeData } from './components/timeData'
import * as echarts from 'echarts'
import moment from 'moment'
import {
  transformDataToMap,
  filterDataByDateRange,
  transformDataToLine,
  initBarChart,
  initPieChart,
  initLineChart,
} from './utils/index'
import { activeTimeMap } from './utils/config.js'

const dataRange = ref('')
let startDate = dataRange.value[0]
let endDate = dataRange.value[1]
onMounted(() => {
  console.log('eeee')
  let startDay = '2022-05-05'
  let endDay = '2022-05-17'
  lineData = transformDataToLine(timeData, startDay, endDay)
  var barChartDom = document.getElementById('bar-chart')
  initBarChart(barChartDom!, timeSource)
  var pieChartDom = document.getElementById('pie-chart')
  initPieChart(pieChartDom!, timeSource)
  var lieChartDom = document.getElementById('line-chart')
  initLineChart(lieChartDom!, lineData)
})
let timeSource: any = []
// watch(dataRange, () => {
//   timeSource = refreshData()
//   let startDay = moment(dataRange.value[0]).format('YYYY-MM-DD')
//   let endDay = moment(dataRange.value[1]).format('YYYY-MM-DD')
//   console.log('=---', startDay, endDay)

//   lineData = transformDataToLine(timeData, startDay, endDay)
//   var barChartDom = document.getElementById('bar-chart')
//   initBarChart(barChartDom!, timeSource)
//   var pieChartDom = document.getElementById('pie-chart')
//   initPieChart(pieChartDom!, timeSource)
//   var lieChartDom = document.getElementById('line-chart')
//   initLineChart(lieChartDom!, lineData)
// })

function test(startDay: string, endDay: string) {
  console.log(moment(dataRange.value[0]).format('YYYY-MM-DD'))
}

function refreshData() {
  let filterData = filterDataByDateRange(
    timeData,
    moment(dataRange.value[0]).format('YYYY-MM-DD'),
    moment(dataRange.value[1]).format('YYYY-MM-DD')
  )
  let timeMap = transformDataToMap(filterData as [], { ...activeTimeMap })
  let timeSource: any = []
  for (const [key, value] of Object.entries(timeMap)) {
    timeSource.push([key, value])
  }
  return timeSource
}

let lineData = transformDataToLine(
  timeData,
  moment(dataRange.value[0]).format('YYYY-MM-DD'),
  moment(dataRange.value[1]).format('YYYY-MM-DD')
)
</script>

<template>
  <div>
    {{startDate}}
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
</template>

<style>
.chart {
  width: 1000px;
  height: 500px;
}
</style>