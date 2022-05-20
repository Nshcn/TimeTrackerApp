<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { default as timeData } from './components/timeData'
import * as echarts from 'echarts'
import moment from 'moment'
const dataRange = ref('')
let startDate = dataRange.value[0]
let endDate = dataRange.value[1]
// onMounted(() => {
//   initBarChart()
//   initPieChart()
// })
let timeSource: any = []
watch(dataRange, () => {
  timeSource = refreshData()
  console.log(timeSource)
  initBarChart()
  initPieChart()
})

function test() {
  console.log(moment(dataRange.value[0]).format('YYYY-MM-DD'))
}

function refreshData() {
  let filterData = filterDataByDateRange(
    timeData,
    moment(dataRange.value[0]).format('YYYY-MM-DD'),
    moment(dataRange.value[1]).format('YYYY-MM-DD')
  )
  let timeMap = transformDataToMap(filterData as [])
  let timeSource: any = []
  for (const [key, value] of Object.entries(timeMap)) {
    timeSource.push([key, value])
  }
  return timeSource
}

/**
 * 分别汇总各类活动持续时间，返回一个包含各类时间的对象
 * @param timeDataArr
 */
function transformDataToMap(timeDataArr: []) {
  let timeMap: any = {}
  for (let item of timeDataArr) {
    let timeType = item['活动类型']
    let timeDurationInHMS = item['持续时间']
    let timeDurationInSeconds = moment.duration(timeDurationInHMS).as('seconds') // 将时分秒格式转换为数值型的秒值
    if (timeMap[timeType] === undefined) {
      timeMap[timeType] = timeDurationInSeconds
    } else {
      timeMap[timeType] = timeMap[timeType] + timeDurationInSeconds
    }
  }
  return timeMap
}

/**
 * 根据时间范围筛选数据
 * @param sourceData
 * @param startDate
 * @param endDate
 */
function filterDataByDateRange(
  sourceData: any,
  startDate: string,
  endDate: string
) {
  let startIndex = sourceData.findIndex((item: any) =>
    moment(item['开始时间'].slice(0, 10)).isSameOrBefore(endDate)
  )
  let endIndex = sourceData.findIndex((item: any) =>
    moment(item['开始时间'].slice(0, 10)).isBefore(startDate)
  )
  console.log('index', startDate, endDate, startIndex, endIndex)

  return sourceData.slice(startIndex, endIndex)
}

/**
 * 柱状图
 */
function initBarChart() {
  var chartDom = document.getElementById('bar-chart')
  var myChart = echarts.init(chartDom!)
  var option = {
    tooltip: {
      valueFormatter: (value: number) => {
        let time = moment.duration(value, 'seconds')
        let hours = time.hours()
        let minutes = time.minutes()
        return `${hours}小时${minutes}分钟`
      },
    },
    dataset: [
      {
        dimensions: ['活动类型', '持续时间'],
        source: timeSource,
      },
      {
        transform: {
          type: 'sort',
          config: { dimension: '持续时间', order: 'asc' },
        },
      },
    ],

    xAxis: {
      axisLabel: {
        formatter: function (value: number) {
          let time = moment.duration(value, 'seconds')
          let hours = time.hours()
          let minutes = time.minutes()
          return `${hours}小时${minutes}分钟`
        },
      },
    },
    yAxis: {
      type: 'category',
    },
    series: [
      {
        type: 'bar',
        encode: { x: '持续时间', y: '活动类型' },
        datasetIndex: 1,
      },
    ],
  }

  option && myChart.setOption(option)
}

/**
 * 饼图
 */
function initPieChart() {
  var chartDom = document.getElementById('pie-chart')
  var myChart = echarts.init(chartDom!)
  var option = {
    legend: {
      orient: 'vertical',
      left: 0,
    },
    tooltip: {
      valueFormatter: (value: number) => {
        let time = moment.duration(value, 'seconds')
        let hours = time.hours()
        let minutes = time.minutes()
        return `${hours}小时${minutes}分钟`
      },
    },
    dataset: [
      {
        dimensions: ['活动类型', '持续时间'],
        source: timeSource,
      },
      {
        transform: {
          type: 'sort',
          config: { dimension: '持续时间', order: 'asc' },
        },
      },
    ],

    series: [
      {
        type: 'pie',
        datasetIndex: 1,
      },
    ],
  }

  option && myChart.setOption(option)
}
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
  <div id="bar-chart"></div>
  <div id="pie-chart"></div>
</template>

<style>
#bar-chart,
#pie-chart {
  width: 1000px;
  height: 500px;
}
</style>