<template>
  <div>
    <div v-bind:id="id" :style="eStyle"></div>
  </div>
</template>

<script>
export default {
  name: 'Echarts',
  props: {
    // 图表ID
    id: {
      type: String,
      default: ''
    },
    // 图表样式
    eStyle: {
      type: Object,
      default () {
        return {}
      }
    },
    // 图表属性
    option: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      charts: {}
    }
  },
  watch: {
    option: {
      handler (n) {
        this.$nextTick(() => {
          this.drawLine(this.id, n)
        })
      },
      deep: true
    }
  },
  mounted () {
    // this.$nextTick(() => {
    this.drawLine(this.id, this.option)
    // })
    window.addEventListener('resize', () => {
      this.charts.resize()
    })
  },
  methods: {
    drawLine (id, option) {
      if (!id) {
        return false
      }
      this.charts = this.$echarts.init(document.getElementById(id))
      // 打开loading
      this.charts.showLoading({
        text: '正在加载数据'
      })
      // 组装图表
      this.charts.setOption(option)
      // 关闭loading
      if (option.series.length > 0) {
        this.charts.hideLoading()
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
