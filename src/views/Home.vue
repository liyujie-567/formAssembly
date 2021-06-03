<template>
  <div class="home">
    <Button>Default</Button>
    <Button type="primary">Primary</Button>
    <Button type="dashed">Dashed</Button>
    <Button type="text">Text</Button>
    <br><br>
    <Button type="info">Info</Button>
    <Button type="success">Success</Button>
    <Button type="warning">Warning</Button>
    <Button type="error">Error</Button>
    <div class="label">测试字体</div>

    <div>时间格式化 : {{ date }}</div>

    <Echarts :id="one.Id" :eStyle="one.eStyle" :option="one.Option"></Echarts>

    <Slider v-model="value" range />

    <router-link to="/list">
      <Button type="primary">表单组件</Button>
    </router-link>

  </div>
</template>

<script>
import { Button, Slider } from 'view-design'
import util from './../assets/js/util'
import Echarts from '../components/Echarts'

export default {
  name: 'Home',
  components: {
    Echarts,
    [Button.name]: Button,
    [Slider.name]: Slider
  },
  data () {
    return {
      date: util.formatDate(new Date(), 'yyyy年MM月dd hh分mm秒'),
      one: {
        Id: '',
        eStyle: {},
        Option: {}
      },
      value: [20, 50]
    }
  },
  created () {
    this.initOne()
  },
  methods: {
    initOne () {
      this.one.Id = 'one'
      this.one.eStyle = { height: '310px' }
      this.one.Option = {
        grid: {
          top: '3%',
          left: '3%',
          right: '3%',
          bottom: '0%',
          containLabel: true
        },
        xAxis: {
          name: '日',
          type: 'category',
          boundaryGap: false,
          data: ['1', '3', '5', '7', '9', '11', '13']
        },
        yAxis: {
          type: 'value',
          name: '百分比',
          min: 0,
          max: 100
        },
        series: [{
          type: 'line',
          symbol: 'none',
          itemStyle: {
            normal: {
              color: '#1181ec', // 改变折线点的颜色
              lineStyle: {
                color: '#1181ec' // 改变折线颜色
              }
            }
          },
          areaStyle: {
            normal: {
              color: '#2e64b5'
            }
          },
          data: [60, 68, 66, 67, 50, 89, 30]
        }]
      }
    }
  }
}
</script>
<style>
  .label{
    font-size: 20px;
    width: 100px;
    height: 40px;
  }
</style>
