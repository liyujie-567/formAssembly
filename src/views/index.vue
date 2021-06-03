<template>
  <div>
    <tree-select
        v-model="treeSelected"
        style="width: 300px;"
        check-strictly
        :expand-all="true"
        :load-data="loadData"
        :multiple="true"
        @on-change="handleTreeSelectChange"
        @on-toggle-expand="handleTreeSelectExpand"
        @on-check-change="handleTreeSelectCheckChange"
        @on-select-change="handleTreeSelectClick"
        :data="treeData"
      ></tree-select>
      <Button @click="changeTreeData">更新树数据</Button>
      <Button @click="clickData">获取选中数据</Button>
  </div>
</template>

<script>
import TreeSelect from '_c/tree-select'
import { newTreeData } from '@/mock/data/tree-select'
import { getTreeSelectData } from '@/api/data'
export default {
  name: 'tree_select_page',
  components: {
    TreeSelect
  },
  data () {
    return {
      treeSelected: [],
      treeData: []
    }
  },
  mounted () {
    getTreeSelectData().then(res => {
      const { data } = res
      this.treeData = data
    })
  },
  methods: {
    changeTreeData () {
      this.treeData = newTreeData
      // this.treeSelected = [];
    },
    clickData () {
      console.log('treeSelected====', this.treeSelected)
    },
    handleTreeSelectChange (list) {
      console.log('handleTreeSelectChange==', list)
    },
    handleTreeSelectExpand (item) {
      console.log('toggle expand==', item)
    },
    handleTreeSelectCheckChange (selectedArray, item) {
      console.log('handleTreeSelectCheckChange==', selectedArray, item)
    },
    handleTreeSelectClick (selectArray, item) {
      console.log('handleTreeSelectClick==', selectArray, item)
    },
    loadData (item, callback) {
      setTimeout(() => {
        let data = [
          {
            id: 111,
            title: '1-1-1'
          },
          {
            id: 112,
            title: '1-1-2'
          },
          {
            id: 113,
            title: '1-1-3'
          },
          {
            id: 114,
            title: '1-1-4'
          }
        ]
        callback(data)
      }, 1000)
    }
  }
}
</script>

<style>

</style>
