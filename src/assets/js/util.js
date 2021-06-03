const util = {
  // 时间格式化
  formatDate (oldDate, fmt) {
    let date = new Date()
    if (typeof oldDate === 'string' || typeof oldDate === 'number') {
      date = new Date(+oldDate)
    } else {
      date = oldDate
    }
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    const o = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'h+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds()
    }
    function padLeftZero (str) {
      return ('00' + str).substr(str.length)
    }
    for (const k in o) {
      if (new RegExp(`(${k})`).test(fmt)) {
        const str = o[k] + ''
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
      }
    }
    return fmt
  },
  // 获取当前时间 all 年-月-日 时-分-秒 | ymdhm 年-月-日 时-分 | ymd 年-月-日 | ym 年-月 | hm 时-分 | y 年 | m 月 | d 日
  formatDateInfo (value, type) {
    if (value == null) {
      return ''
    } else {
      let out = ''
      const date = new Date(value)
      const y = date.getFullYear()// 年
      let MM = date.getMonth() + 1// 月
      MM = MM < 10 ? ('0' + MM) : MM
      let d = date.getDate()// 日
      d = d < 10 ? ('0' + d) : d
      let h = date.getHours()// 时
      h = h < 10 ? ('0' + h) : h
      let m = date.getMinutes()// 分
      m = m < 10 ? ('0' + m) : m
      let s = date.getSeconds()// 秒
      s = s < 10 ? ('0' + s) : s
      if (type === 'all') {
        out = y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s
      } else if (type === 'ymdhm') {
        out = y + '-' + MM + '-' + d + ' ' + h + ':' + m
      } else if (type === 'ymd') {
        out = y + '-' + MM + '-' + d
      } else if (type === 'ym') {
        out = y + '-' + MM
      } else if (type === 'hm') {
        out = h + ':' + m
      } else if (type === 'y') {
        out = y
      } else if (type === 'm') {
        out = m
      } else if (type === 'd') {
        out = d
      }
      return out
    }
  },
  // 以“天”为单位获取响应的时间戳
  setDate (num) {
    return Date.now() + num * 24 * 60 * 60 * 1000
  },
  // 根据当前时间后推date月数
  getMonthDate (date) {
    const now = new Date()
    const year = now.getFullYear()
    let month = now.getMonth() + 1 // 0-11表示1-12月
    let day = now.getDate()
    const dateObj = {}
    if (parseInt(month) < 10) {
      month = '0' + month
    }
    if (parseInt(day) < 10) {
      day = '0' + day
    }

    dateObj.now = year + '-' + month + '-' + day

    if (parseInt(month) === 1) { // 如果是1月份，则取上一年的10月份
      dateObj.last = (parseInt(year) - 1) + '-10-' + day
      return dateObj
    }
    if (parseInt(month) === 2) { // 如果是2月份，则取上一年的11月份
      dateObj.last = (parseInt(year) - 1) + '-11-' + day
      return dateObj
    }
    if (parseInt(month) === 3) { // 如果是3月份，则取上一年的12月份
      dateObj.last = (parseInt(year) - 1) + '-12-' + day
      return dateObj
    }

    const preSize = new Date(year, parseInt(month) - date, 0).getDate() // 开始时间所在月的总天数
    if (preSize < parseInt(day)) {
      // 开始时间所在月的总天数<本月总天数，比如当前是5月30日，在2月中没有30，则取下个月的第一天(3月1日)为开始时间
      const resultMonth = parseInt(month) - 2 < 10 ? ('0' + parseInt(month) - 2) : (parseInt(month) - 2)
      dateObj.last = year + '-' + resultMonth + '-01'
      return dateObj
    }

    if (parseInt(month) <= 10) {
      dateObj.last = year + '-0' + (parseInt(month) - date) + '-' + day
      return dateObj
    } else {
      dateObj.last = year + '-' + (parseInt(month) - date) + '-' + day
      return dateObj
    }
  },
  // 获取 URL 中的参数
  getUrlParams (param) {
    const query = window.location.search.substring(1)
    const vars = query.split('&')
    for (let i = 0; i < vars.length; i++) {
      const pair = vars[i].split('=')
      if (pair[0] === param) { return pair[1] }
    }
    return false
  },
  // 数组降维 二维及多维
  arrayFlat (arr, type) {
    let arrs = []
    if (type) {
      arrs = Array.prototype.concat.apply([], arr)
    } else {
      arrs = arr.flat(3)
    }
    return arrs
  },
  // 深拷贝
  deepClone (obj) {
    return JSON.parse(JSON.stringify(obj))
  },
  // 去除数组中的空值
  trimNull (array) {
    for (let i = 0; i < array.length; i++) {
      if (array[i] === '' || typeof (array[i]) === 'undefined') {
        array.splice(i, 1)
        i = i - 1
      }
    }
    return array
  },
  // 节流函数(指定时间间隔内只会执行一次任务。)
  throttle (fn) {
    // 4、通过闭包保存一个标记
    let canRun = true
    return function () {
      // 5、在函数开头判断标志是否为 true，不为 true 则中断函数
      if (!canRun) {
        return
      }
      // 6、将 canRun 设置为 false，防止执行之前再被执行
      canRun = false
      // 7、定时器
      setTimeout(() => {
        fn.call(this, arguments)
        // 8、执行完事件（比如调用完接口）之后，重新将这个标志设置为 true
        canRun = true
      }, 1000)
    }
  },
  /**
   * @desc 函数防抖 (任务频繁触发的情况下，只有任务触发的间隔超过指定间隔的时候，任务才会执行。)
   * @param func 函数
   * @param wait 延迟执行毫秒数
   * @param immediate true 表立即执行，false 表非立即执行
   */
  debounce (func, wait, immediate) {
    let timeout
    return function () {
      const self = this
      const args = arguments
      if (timeout) clearTimeout(timeout)
      if (immediate) {
        const callNow = !timeout
        timeout = setTimeout(() => {
          timeout = null
        }, wait)
        if (callNow) func.apply(self, args)
      } else {
        timeout = setTimeout(function () {
          func.apply(self, args)
        }, wait)
      }
    }
  },
  // 获取数组极值
  mathApply (array, type) {
    let math = ''
    if (type === 'min') {
      math = Math.min.apply(Math, array)
      // es6
      // Math.min(...array)
    } else {
      math = Math.max.apply(Math, array)
      // es6
      // Math.max(...array)
    }
    return math
  },
  // 判断小数是否相等
  epsEqu (x, y) {
    return Math.abs(x - y) < Math.pow(2, -52)
  },
  // 数组排序
  arraySort (arr) {
    function compare (num1, num2) {
      return (num1 > num2 ? 1 : -1)
    }
    return arr.sort(compare)
  },
  // 字母排序
  letterSort (arr) {
    function compare (str1, str2) {
      return str1.localeCompare(str2)
    }
    return arr.sort(compare)
  }
}

export default util
