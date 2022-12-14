import moment from 'moment'
import * as echarts from 'echarts'
import { allActiveType, activeTimeMap } from './config.js'

/**
 * 将原始JSON数据传换成每日数据
 * @param sourceData
 * @param startDate
 * @param endDate
 * @returns
 */
export function transformToDailyData(
  sourceData: any,
  startDate: string,
  endDate: string
) {
  const daysList = enumerateDaysBetweenDates(startDate, endDate)
  const map: any = {}
  for (const type of allActiveType) {
    map[type] = Math.random() * 100
  }
  const filterDataRange = filterDataByDateRange(sourceData, startDate, endDate)
  const dailyData = []
  for (const day of daysList) {
    const filterDataInOneDay = filterDataByDateRange(filterDataRange, day, day)
    const mapData = transformDataToMap(filterDataInOneDay, { ...activeTimeMap })
    const item = {
      时间: day,
      ...mapData,
    }
    dailyData.push(item)
  }
  return dailyData
}

/**
 * 获取所有活动的特定时间的时长
 */
export function getActivityData(dailyData: any) {
  const resObj: any = {}
  const daysList: any = []
  for (const dataInOneDay of dailyData) {
    daysList.push(dataInOneDay['时间'])
    for (const type of allActiveType) {
      if (resObj[type] == undefined) {
        resObj[type] = []
      } else {
        resObj[type].push(dataInOneDay[type])
      }
    }
  }
  const resArr = []
  for (const [key, value] of Object.entries(resObj)) {
    resArr.push({
      name: key,
      xAxisData: daysList,
      value: value,
    })
  }

  return resArr
}

/**
 * 分别汇总各类活动持续时间，返回一个包含各类时间的对象
 * @param sourceData 传入某时间段的数据
 */
export function transformDataToMap(sourceData: [], activeTimeMap: any) {
  for (const item of sourceData) {
    const timeType = item['活动类型']
    const timeDurationInHMS = item['持续时间']
    const timeDurationInSeconds = moment
      .duration(timeDurationInHMS)
      .as('seconds') // 将时分秒格式转换为数值型的秒值
    if (activeTimeMap[timeType] === undefined) {
      activeTimeMap[timeType] = timeDurationInSeconds
    } else {
      activeTimeMap[timeType] = activeTimeMap[timeType] + timeDurationInSeconds
    }
  }
  return activeTimeMap
}

/**
 * 根据时间范围筛选数据
 * @param sourceData
 * @param startDate
 * @param endDate
 */
export function filterDataByDateRange(
  sourceData: any,
  startDate: string,
  endDate: string
) {
  const startIndex = sourceData.findIndex((item: any) =>
    moment(item['开始时间'].slice(0, 10)).isSameOrBefore(endDate)
  )
  const endIndex = sourceData.findIndex((item: any) =>
    moment(item['开始时间'].slice(0, 10)).isBefore(startDate)
  )
  return sourceData.slice(startIndex, endIndex)
}

/**
 * 获取指定范围内的所有日期
 * @param startDate
 * @param endDate
 */
export function enumerateDaysBetweenDates(startDate: string, endDate: string) {
  // 假定你已经保证了startDate 小于endDate，且二者不相等
  const daysList = []
  const start = moment(startDate)
  const end = moment(endDate)
  daysList.push(start.format('YYYY-MM-DD'))
  while (start.add(1, 'days').isBefore(end)) {
    daysList.push(start.format('YYYY-MM-DD')) // 注意这里add方法处理后start对象已经改变。
  }
  daysList.push(end.format('YYYY-MM-DD'))
  return daysList
}

export function transformSecondsToHM(seconds: number) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds / 60) % 60)
  return hours == 0 ? `${minutes}m` : `${hours}h${minutes}m`
}

/**
 * 绘制单个活动的柱状图
 * @param lineChartDom
 * @param data
 * @param chartType
 */
export function drawBarChartOfSingleActivity(
  lineChartDom: HTMLElement,
  data: {
    name: string
    xAxisData: number[]
    value: number[]
  }
) {
  var myChart = echarts.init(lineChartDom!)
  var option = {
    legend: {},
    tooltip: {
      valueFormatter: transformSecondsToHM,
    },
    color:
      '#' +
      ('00000' + ((Math.random() * 0x1000000) << 0).toString(16)).substr(-6),
    yAxis: {
      axisLabel: {
        formatter: transformSecondsToHM,
      },
      type: 'value',
    },
    xAxis: {
      type: 'category',
      data: data.xAxisData,
    },
    series: [
      {
        name: data.name,
        data: data.value,
        type: 'bar',
      },
    ],
  }
  option && myChart.setOption(option)
}

/**
 * 柱状图
 * @param barChartDom
 * @param barData
 */
export function initBarChart(barChartDom: HTMLElement, barData: any) {
  console.log('barData', barData)
  var myChart = echarts.init(barChartDom!)
  var option = {
    tooltip: {
      valueFormatter: transformSecondsToHM,
    },
    dataset: [
      {
        dimensions: ['活动类型', '持续时间'],
        source: barData,
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
        formatter: transformSecondsToHM,
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
 * 折线图
 */
export function initLineChart(lineChartDom: HTMLElement, lineData: Array<{}>) {
  console.log('lineData', lineData)
  var myChart = echarts.init(lineChartDom!)
  var option = {
    legend: {},
    tooltip: {
      valueFormatter: transformSecondsToHM,
    },
    dataset: [
      {
        dimensions: ['时间', ...allActiveType],
        source: lineData,
      },
    ],
    yAxis: {
      axisLabel: {
        formatter: function (value: number) {
          const time = moment.duration(value, 'seconds')
          const hours = time.hours()
          const minutes = time.minutes()
          return `${hours}h${minutes}m`
        },
      },
    },
    xAxis: {
      type: 'category',
    },
    series: allActiveType.map((i: any) => ({
      type: 'line',
      smooth: true,
    })),
  }
  option && myChart.setOption(option)
}

/**
 * 饼图
 */
export function initPieChart(
  pieChartDom: HTMLElement,
  pieData: Array<[string, number]>
) {
  console.log('pieData', pieData)
  var myChart = echarts.init(pieChartDom!)
  var option = {
    legend: {
      orient: 'vertical',
      left: 0,
    },
    tooltip: {
      valueFormatter: transformSecondsToHM,
    },
    dataset: [
      {
        dimensions: ['活动类型', '持续时间'],
        source: pieData,
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
