<template>
  <Select
    ref="select"
    class="tree-select"
    v-bind="$attrs"
    @on-change="handleChange"
    :multiple="multiple"
    clearable
  >
    <tree-select-tree-item
      :selectedArray="value"
      :data="data"
      @on-clear="handleClear"
      :load-data="loadData"
      :checkbox="multiple"
      @on-check="handleTreeCheck"
      @on-select="handleTreeSelect"
    ></tree-select-tree-item>
  </Select>
</template>

<script>
import Emitter from 'view-design/src/mixins/emitter'
import TreeSelectTreeItem from './tree-select-tree.vue'
import { Select } from 'view-design'

export default {
  name: 'TreeSelect',
  mixins: [Emitter],
  components: {
    Select,
    TreeSelectTreeItem
  },
  props: {
    value: {
      type: Array,
      default: () => []
    },
    data: {
      type: Array,
      default: () => []
    },
    multiple: {
      type: Boolean,
      default: () => false
    },
    loadData: Function
  },
  data () {
    return {
      isChangedByTree: true,
      isInit: true
    }
  },
  provide () {
    return {
      parent: this
    }
  },
  methods: {
    handleChange (selected) {
      if (this.multiple) {
        if (!this.isChangedByTree) this.$emit('input', selected)
        this.isChangedByTree = false
      }
    },
    handleTreeCheck (selectedArray) {
      this.isChangedByTree = true
      this.$emit('input', selectedArray.map(item => item.id))
    },
    handleTreeSelect (selectedArray) {
      if (!this.multiple) {
        this.$emit('input', selectedArray.map(item => item.id))
      }
    },
    handleClear () {
      this.$refs.select.reset()
    }
  }
}
</script>

<style lang="less">
.tree-select {
  .ivu-select-dropdown {
    padding: 0 6px;
  }
}
</style>
