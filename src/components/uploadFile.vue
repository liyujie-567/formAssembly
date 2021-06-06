<template>
  <div class="uploadFile">
    <Row>
      <Col span="4">模板上传:</Col>
      <Col span="20">
        <Upload
          ref="upload"
          :show-upload-list="false"
          :headers="accessToken"
          :action="handleSuccessUrl"
          :format="['xls','xlsx']"
          :on-format-error="handleFormatError"
          :on-success="handleSuccess"
          name="file"
          type="drag">
          <div style="padding: 20px 0">
              <Icon type="ios-cloud-upload" size="52" style="color: #C0C4CC"></Icon>
              <p>将文件拖到此处，或 点击上传</p>
          </div>
        </Upload>
        <div>请上传 .xls, .xlsx 标准格式文件</div>
        <div>请确保导入数据中的字段值在主数据中已存在，否则将导入失败</div>
      </Col>
    </Row>
    <Row style="margin-top: 40px;">
        <Col span="4">模板下载:</Col>
        <Col span="20">
            <Button icon="ios-download-outline" type="primary" @click="exportClick">点击下载</Button>
        </Col>
    </Row>
  </div>
</template>

<script>
import { Row, Col, Upload, Button, Icon } from 'view-design'
// import config from '@/config'
// import { getToken } from '_l/util'

export default {
  name: 'uploadFile',
  components: {
    Row,
    Col,
    Upload,
    Button,
    Icon
  },
  data () {
    return {
      handleSuccessUrl: ''
    }
  },
  created () {
    this.accessToken = {
      // 'YtCloud-Auth': 'bearer ' + getToken(),
      Authorization: 'Basic c2FiZXI6c2FiZXJfc2VjcmV0'
    }
  },
  methods: {
    // 图片格式限制提示
    handleFormatError (file) {
      this.$Message.warning('只能上传.xls, .xlsx格式的文件!')
    },
    // 成功
    handleSuccess (res, file) {
      // 调用接口上传图片流，返回图片服务地址
      if (file.response.code === 200) {
        this.$emit('exportFileFn')
        this.$refs.upload.fileList = []
        this.$Message.success(file.response.msg)
      } else {
        this.$Message.error(file.response.msg)
      }
    },
    // 模板下载
    exportClick () {
      this.$emit('exportDownload')
    },
    // 上传接口
    handleSuccessFn (e) {
      // this.handleSuccessUrl = (process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro) + e
    }
  }
}
</script>

<style scoped lang="less">
.uploadFile {
    margin: 10px;
}
</style>
