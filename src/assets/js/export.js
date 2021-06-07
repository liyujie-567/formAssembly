/**
 * Created by liyujie on 2021/6/7.
 *
 * 导出excel
 * 复杂表头数据用children嵌套
 *
 */
import XLSX from 'xlsx-style'

/**
 * 构建excel表头
 * @param revealList 列表页面展示的表头
 * @returns {[]} excel表格展示的表头
 */
export const buildHeader = (revealList) => {
  const excelHeader = []
  // 构建生成excel表头需要的数据结构
  getHeader(revealList, excelHeader, 0, 0)
  // 多行表头长短不一，短的向长的看齐，不够的补上行合并占位符
  const max = Math.max(...(excelHeader.map(a => a.length)))
  excelHeader.filter(e => e.length < max).forEach(
    e => pushRowSpanPlaceHolder(e, max - e.length))
  return excelHeader
}

/**
 * 生成头部
 * @param headers 展示的头部
 * @param excelHeader excel头部
 * @param deep 深度
 * @param perOffset 前置偏移量
 * @returns {number}  后置偏移量
 */
export const getHeader = (headers, excelHeader, deep, perOffset) => {
  let offset = 0
  let cur = excelHeader[deep]
  if (!cur) {
    cur = excelHeader[deep] = []
  }
  // 填充行合并占位符
  pushRowSpanPlaceHolder(cur, perOffset - cur.length)
  for (let i = 0; i < headers.length; i++) {
    const head = headers[i]
    cur.push(head.title)
    if (Object.prototype.hasOwnProperty.call(head, 'children') && Array.isArray(head.children) && head.children.length > 0) {
      const childOffset = getHeader(head.children, excelHeader, deep + 1, cur.length - 1)
      // 填充列合并占位符
      pushColSpanPlaceHolder(cur, childOffset - 1)
      offset += childOffset
    } else {
      offset++
    }
  }
  return offset
}

/**
 * 根据选中的数据和展示的列，生成结果
 * @param selectionData
 * @param revealList
 */
export const extractData = (selectionData, revealList) => {
  // 列
  const headerList = flat(revealList)
  // 导出的结果集
  const excelRows = []
  // 如果有child集合的话会用到
  const dataKeys = new Set(Object.keys(selectionData[0]))
  selectionData.some(e => {
    if (e.children && e.children.length > 0) {
      const childKeys = Object.keys(e.children[0])
      for (let i = 0; i < childKeys.length; i++) {
        dataKeys.delete(childKeys[i])
      }
      return true
    }
  })
  flatData(selectionData, (list) => {
    excelRows.push(...buildExcelRow(dataKeys, headerList, list))
  })
  return excelRows
}

/**
 * 合并
 * */
export const buildExcelRow = (mainKeys, headers, rawDataList) => {
  // 合计行
  const sumCols = []
  // 数据行
  const rows = []
  for (let i = 0; i < rawDataList.length; i++) {
    const cols = []
    const rawData = rawDataList[i]
    // 提取数据
    for (let j = 0; j < headers.length; j++) {
      const header = headers[j]
      // 父元素键需要行合并
      if (rawData.rowSpan === 0 && mainKeys.has(header.key)) {
        cols.push('!$ROW_SPAN_PLACEHOLDER')
      } else {
        let value
        if (typeof header.exeFun === 'function') {
          value = header.exeFun(rawData)
        } else {
          value = rawData[header.key]
        }
        cols.push(value)
        // 如果该列需要合计,并且是数字类型
        if (header.summable && typeof value === 'number') {
          sumCols[j] = (sumCols[j] ? sumCols[j] : 0) + value
        }
      }
    }
    rows.push(cols)
  }
  // 如果有合计行
  if (sumCols.length > 0) {
    rows.push(...sumRowHandle(sumCols))
  }
  return rows
}

export const sumRowHandle = (sumCols) => {
  // TODO
  return []
}

/**
 * 合并头部单元格
 **/
export const doMerges = (arr) => {
  // 要么横向合并 要么纵向合并
  const deep = arr.length
  const merges = []
  for (let y = 0; y < deep; y++) {
    // 先处理横向合并
    const row = arr[y]
    let colSpan = 0
    for (let x = 0; x < row.length; x++) {
      if (row[x] === '!$COL_SPAN_PLACEHOLDER') {
        row[x] = undefined
        if (x + 1 === row.length) {
          merges.push({ s: { r: y, c: x - colSpan - 1 }, e: { r: y, c: x } })
        }
        colSpan++
      } else if (colSpan > 0 && x > colSpan) {
        merges.push({ s: { r: y, c: x - colSpan - 1 }, e: { r: y, c: x - 1 } })
        colSpan = 0
      } else {
        colSpan = 0
      }
    }
  }
  // 再处理纵向合并
  const colLength = arr[0].length
  for (let x = 0; x < colLength; x++) {
    let rowSpan = 0
    for (let y = 0; y < deep; y++) {
      if (arr[y][x] === '!$ROW_SPAN_PLACEHOLDER') {
        arr[y][x] = undefined
        if (y + 1 === deep) {
          merges.push({ s: { r: y - rowSpan, c: x }, e: { r: y, c: x } })
        }
        rowSpan++
      } else if (rowSpan > 0 && y > rowSpan) {
        merges.push({ s: { r: y - rowSpan - 1, c: x }, e: { r: y - 1, c: x } })
        rowSpan = 0
      } else {
        rowSpan = 0
      }
    }
  }
  return merges
}

/**
 *
 */
export const aoaToSheet = (data, headerRows) => {
  const ws = {}
  const range = { s: { c: 10000000, r: 10000000 }, e: { c: 0, r: 0 } }
  for (let R = 0; R !== data.length; ++R) {
    for (let C = 0; C !== data[R].length; ++C) {
      if (range.s.r > R) {
        range.s.r = R
      }
      if (range.s.c > C) {
        range.s.c = C
      }
      if (range.e.r < R) {
        range.e.r = R
      }
      if (range.e.c < C) {
        range.e.c = C
      }
      /// 这里生成cell的时候，使用上面定义的默认样式
      const cell = {
        v: data[R][C] || '',
        s: {
          font: { name: '宋体', sz: 11, color: { auto: 1 } },
          alignment: {
            /// 自动换行
            wrapText: 1,
            // 居中
            horizontal: 'center',
            vertical: 'center',
            indent: 0
          }
        }
      }
      // 头部列表加边框
      if (R < headerRows) {
        cell.s.border = {
          top: { style: 'thin', color: { rgb: '000000' } },
          left: { style: 'thin', color: { rgb: '000000' } },
          bottom: { style: 'thin', color: { rgb: '000000' } },
          right: { style: 'thin', color: { rgb: '000000' } }
        }
        cell.s.fill = {
          patternType: 'solid',
          fgColor: { theme: 3, tint: 0.3999755851924192, rgb: 'DDD9C4' },
          bgColor: { theme: 7, tint: 0.3999755851924192, rgb: '8064A2' }
        }
      }
      const cellRef = XLSX.utils.encode_cell({ c: C, r: R })
      if (typeof cell.v === 'number') {
        cell.t = 'n'
      } else if (typeof cell.v === 'boolean') {
        cell.t = 'b'
      } else {
        cell.t = 's'
      }
      ws[cellRef] = cell
    }
  }
  if (range.s.c < 10000000) {
    ws['!ref'] = XLSX.utils.encode_range(range)
  }
  return ws
}
/**
 * 填充行合并占位符
 * */
export const pushRowSpanPlaceHolder = (arr, count) => {
  for (let i = 0; i < count; i++) {
    arr.push('!$ROW_SPAN_PLACEHOLDER')
  }
}
// 填充列合并占位符
export const pushColSpanPlaceHolder = (arr, count) => {
  for (let i = 0; i < count; i++) {
    arr.push('!$COL_SPAN_PLACEHOLDER')
  }
}

/**
 * 展开数据，为了实现父子关系的数据进行行合并
* */
export const flatData = (list, eachDataCallBack) => {
  const resultList = []
  for (let i = 0; i < list.length; i++) {
    const data = list[i]
    const rawDataList = []
    // 每个子元素都和父元素合并成一条数据
    if (data.children && data.children.length > 0) {
      for (let j = 0; j < data.children.length; j++) {
        delete data.children[j].bsm
        const copy = Object.assign({}, data, data.children[j])
        rawDataList.push(copy)
        copy.rowSpan = (j > 0 ? 0 : data.children.length)
      }
    } else {
      data.rowSpan = 1
      rawDataList.push(data)
    }
    resultList.push(...rawDataList)
    if (typeof eachDataCallBack === 'function') {
      eachDataCallBack(rawDataList)
    }
  }
  return resultList
}

// 扁平头部
export const flat = (revealList) => {
  const result = []
  revealList.forEach(e => {
    if (Object.prototype.hasOwnProperty.call(e, 'children')) {
      result.push(...flat(e.children))
    } else if (Object.prototype.hasOwnProperty.call(e, 'exeFun')) {
      result.push(e)
    } else if (Object.prototype.hasOwnProperty.call(e, 'key')) {
      result.push(e)
    }
  })
  return result
}

export const s2ab = (s) => {
  const buf = new ArrayBuffer(s.length)
  const view = new Uint8Array(buf)
  for (let i = 0; i !== s.length; ++i) {
    view[i] = s.charCodeAt(i) & 0xFF
  }
  return buf
}

export const openDownloadXLSXDialog = (url, saveName) => {
  if (typeof url === 'object' && url instanceof Blob) {
    url = URL.createObjectURL(url) // 创建blob地址
  }
  const aLink = document.createElement('a')
  aLink.href = url
  aLink.download = saveName || '' // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
  let event
  if (window.MouseEvent) {
    event = new MouseEvent('click')
  } else {
    event = document.createEvent('MouseEvents')
    event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false,
      false, false, false, 0, null)
  }
  aLink.dispatchEvent(event)
}

export const exportElsx = (data, columns) => {
  if (!Array.isArray(data) || data.length < 1) {
    this.$Message.warning('请选择需要导出的数据！')
    return
  }
  const sheetName = 'xlsx复杂表格导出'
  // excel表头
  const excelHeader = buildHeader(columns)
  // 头部行数，用来固定表头
  const headerRows = excelHeader.length
  // 提取数据
  const dataList = extractData(data, columns)
  excelHeader.push(...dataList, [])
  // 计算合并
  const merges = doMerges(excelHeader)
  // 生成sheet
  const ws = aoaToSheet(excelHeader, headerRows)
  // 单元格合并
  ws['!merges'] = merges
  // 头部冻结
  ws['!freeze'] = {
    xSplit: '1',
    ySplit: '' + headerRows,
    topLeftCell: 'B' + (headerRows + 1),
    activePane: 'bottomRight',
    state: 'frozen'
  }
  // 列宽
  ws['!cols'] = [{ wpx: 165 }]
  const workbook = {
    SheetNames: [sheetName],
    Sheets: {}
  }
  workbook.Sheets[sheetName] = ws
  // excel样式
  const wopts = {
    bookType: 'xlsx',
    bookSST: false,
    type: 'binary',
    cellStyles: true
  }
  const wbout = XLSX.write(workbook, wopts)
  const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
  openDownloadXLSXDialog(blob, sheetName + '.xlsx')
}

export default {
  buildHeader,
  extractData,
  doMerges,
  aoaToSheet,
  s2ab,
  openDownloadXLSXDialog,
  exportElsx
}
