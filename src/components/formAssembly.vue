<template>
  <div class="formAssembly">
    <Form ref="formInline" :model="formSearch" inline :label-width="formData.labelWidth">
      <Row type="flex" justify="start">
        <Col :span="formData.rowSpan" v-for="(item, index) in formData.fromParams" :key="index">
          <FormItem  class="formItem"
                    :label="item.name + ':'"
                    :prop="item.key"
                    :rules="item.rules">
            <!--input-->
            <Input
              v-if="item.type === 'input'"
              :type="item.text_type || 'text'"
              v-bind="setAttrs(item)"
              v-model.trim="formSearch[item.key]"
              clearable
              :show-word-limit="item.text_type === 'textarea'"
              maxlength="100"
              :disabled="item.disabled"
              :autosize="{minRows: 3,maxRows: 6}"
              :placeholder="'请输入' + item.name" />
            <!--input 带单位-->
            <div class="display-class" v-if="item.type === 'inputCom'">
              <Input
                type="text"
                clearable
                :disabled="item.disabled"
                v-bind="setAttrs(item)"
                v-model="formSearch[item.key]"
                :placeholder="'请输入' + item.name" />
              <span class="inputCom-span">{{ item.company }}</span>
            </div>
            <!--select -->
            <Select
              v-if="item.type === 'select'"
              v-model="formSearch[item.key]"
              filterable
              :disabled="item.disabled"
              clearable
              :max-tag-count="3"
              v-bind="setAttrs(item)"
              :multiple="item.multiple"
              @on-change="selectOptionChange"
              @on-open-change="selectOpenChange($event, item.key)"
              :placeholder="'请选择' + item.name">
              <Option
                v-for="(option, index) in item.options"
                :key="index"
                :value="option[item['props'] && item['props']['value']]"
                :label="option[item['props'] && item['props']['label']]" />
            </Select>
            <!--双 select下拉格式-->
            <div class="display-class" v-if="item.type === 'selectDouble'">
              <Select
                v-for="(children, index) in item.selectArr"
                :key="index"
                v-model="formSearch[children.key]"
                filterable
                clearable
                :disabled="children.disabled"
                :max-tag-count="3"
                v-bind="setAttrs(item)"
                :multiple="children.multiple"
                :placeholder="'请选择' + children.name" >
                <Option
                  v-for="(option, index) in children.options"
                  :key="index"
                  :value="option[children['props'] && children['props']['value']]"
                  :label="option[children['props'] && children['props']['label']]" />
              </Select>
            </div>
            <!--日期格式-->
            <DatePicker
              v-if="item.type === 'dateTime'"
              v-model="formSearch[item.key]"
              :type="item.text_type || date"
              clearable
              :disabled="item.disabled"
              v-bind="setAttrs(item)"
              :format="item.format"
              @on-change="formSearch[item.key] = $event"
              :placeholder="'请选择' + item.name"></DatePicker>
            <!--开关选择器-->
            <i-switch
              style="justify-content: flex-start"
              v-if="item.type === 'switch'"
              :disabled="item.disabled"
              v-bind="setAttrs(item)"
              v-model="formSearch[item.key]">
              <span slot="open">开</span>
              <span slot="close">关</span>
            </i-switch>
            <!--下拉select
            on-change 改变值
            on-toggle-expand 展开隐藏
            on-check-change checkbox选中 多选
            on-select-change 文本select选中 单选
            -->
            <tree-select
              v-if="item.type === 'treeSelect'"
              v-model="formSearch[item.key]"
              check-strictly
              :expand-all="true"
              :data="item.treeData"
              :load-data="item.loadData"
              :multiple="item.multiple"
              @on-change="handleTreeSelectChange"
              @on-toggle-expand="handleTreeSelectExpand"
              @on-check-change="handleTreeSelectCheckChange"
              @on-select-change="handleTreeSelectClick"
            ></tree-select>
            <!--上传图片-->
            <UploadImg
              v-if="item.type === 'uploadImg'"
              ref="uploadRef"
              :uploadParam="item"
              @uploadImgFn="uploadImgFn"></UploadImg>
          </FormItem>
        </Col>
      </Row>
      <span class="footer-button">
        <FormItem class="button">
            <Button type="primary" ghost @click="formCancelAll('formInline')">取消</Button>&nbsp;&nbsp;
            <Button type="primary" @click="formSubmitAll('formInline')">确定</Button>
        </FormItem>
      </span>
    </Form>
  </div>
</template>

<script>
import { Button, Form, FormItem, Row, Col, Input, Select, Option, DatePicker, Switch } from 'view-design'
import TreeSelect from '../components/tree-select/tree-select'
import UploadImg from '../components/uploadImg'

export default {
  name: 'formAssembly',
  components: {
    Button,
    Form,
    FormItem,
    Row,
    Col,
    Input,
    Select,
    Option,
    DatePicker,
    [Switch.name]: Switch,
    TreeSelect,
    UploadImg
  },
  props: {
    formData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      formSearch: {}
    }
  },
  methods: {
    setAttrs (params) {
      const { slot, ...options } = params
      return { ...options }
    },
    // select change
    selectOptionChange (e) {
      this.$emit('formOptionChange', e)
    },
    // select open
    selectOpenChange (e, key) {
      if (e) {
        this.$emit('selectOpen', key)
      }
    },
    // 提交
    formSubmitAll (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$emit('formSubmit', name, this.formSearch)
        }
      })
    },
    // 取消
    formCancelAll (name) {
      this.$emit('formCancel')
      this.$refs[name].resetFields()
    },
    // 下拉树形
    handleTreeSelectChange (e) {
      this.$emit('onTreeChange', e)
    },
    handleTreeSelectExpand (e) {
      this.$emit('onTreeExpand', e)
    },
    handleTreeSelectCheckChange (e) {
      this.$emit('onTreeCheck', e)
    },
    handleTreeSelectClick (e) {
      this.$emit('onTreeSelect', e)
    },
    // 上传图片
    uploadImgFn (e) {
      const paramList = this.formData.fromParams
      paramList.forEach((v) => {
        if (v.type === 'upload') {
          this.formSearch[v.key] = e.response.data.link // 上传资源服务器接口返回结果
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.formAssembly {
  width: 100%;
  height: 100%;
  .formItem {
    width: 100%;
    .display-class {
      display: flex;
      .inputCom-span {
        text-align: right;
        width: 40px;
      }
      /deep/ .ivu-select {
        margin-right: 10px;
      }
      /deep/ .ivu-select:last-child {
        margin-right: 0px;
      }
    }
  }
  .footer-button {
    width: 100%;
    border-top: 1px solid #e8eaec;
    .button {
      margin-top: 20px;
      display: flex;
      justify-content: flex-end;
    }
    /deep/ .ivu-form-item {
      width: 100%;
    }
  }
  /deep/ .ivu-date-picker {
    width: 100%;
  }
  /deep/ .ivu-form-item-content {
    text-align: left;
  }
}
</style>
