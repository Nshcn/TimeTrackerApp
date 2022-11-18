<script setup lang="ts">
import { watch, defineProps, ref, onMounted } from 'vue'
import { drawBarChartOfSingleActivity } from '@/utils'

const chartDom = ref(null)
const props = defineProps<{
  data: {
    name: string
    xAxisData: number[]
    value: number[]
  }
}>()

onMounted(() => {
  drawBarChartOfSingleActivity(chartDom.value!, props.data)
  watch([() => props.data], ([data]) => {
    drawBarChartOfSingleActivity(chartDom.value!, data)
  })
})
</script>
<template>
  <div class="chart"
       ref="chartDom">
  </div>
</template> 
<style scoped>
.chart {
  width: 500px;
  height: 300px;
  border: 1px solid black;
  border-radius: 30px;
  margin: 5px;
}
</style>