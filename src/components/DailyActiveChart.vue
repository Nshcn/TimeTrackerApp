<script setup lang="ts">
import { watch, defineProps, ref, onMounted, computed } from 'vue'
import { drawBarChartOfSingleActivity, transformSecondsToHM } from '@/utils'

const chartDom = ref(null)
const props = defineProps<{
  data: {
    name: string
    xAxisData: number[]
    value: number[]
  }
}>()

const timeInfo = computed(() => {
  const arr = props.data.value
  const sumTime = arr.reduce((pre, cur) => {
    return pre + cur
  })
  const lenOfAllDays = arr.length
  const lenOfNoneZeroDays = arr.filter((item) => item != 0).length
  const averageTimeOfAllDays = transformSecondsToHM(sumTime / lenOfAllDays)
  const averageTimeOfNoneZeroDays =
    lenOfNoneZeroDays == 0
      ? 0
      : transformSecondsToHM(sumTime / lenOfNoneZeroDays)
  const sumTimeInHM = transformSecondsToHM(sumTime)

  return {
    sumTimeInHM,
    averageTimeOfAllDays,
    averageTimeOfNoneZeroDays,
  }
})

onMounted(() => {
  drawBarChartOfSingleActivity(chartDom.value!, props.data)
  watch([() => props.data], ([data]) => {
    drawBarChartOfSingleActivity(chartDom.value!, data)
  })
})
</script>
<template>
  <div class="bar-card">
    总计{{timeInfo.sumTimeInHM}}
    平均/天{{timeInfo.averageTimeOfAllDays}}
    平均/非零天{{timeInfo.averageTimeOfNoneZeroDays}}
    <div class="chart"
         ref="chartDom">
    </div>
  </div>
</template> 
<style scoped>
.bar-card {
  width: 600px;
  height: 300px;
  border: 1px solid black;
  border-radius: 30px;
}
.chart {
  width: 100%;
  height: 90%;
  margin: 5px;
}
</style>