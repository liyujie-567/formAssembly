<template>
  <div>
    <div class="demo-upload-list" v-for="(item, index) in uploadList" :key="index">
      <template v-if="item.status === 'finished'">
        <img :src="item.response.data.link">
        <div class="demo-upload-list-cover">
          <Icon type="ios-eye-outline" @click.native="handleView(item.response.data.link)"></Icon>
          <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
        </div>
      </template>
      <template v-if="item.status === 'view'">
        <img :src="item.link">
        <div class="demo-upload-list-cover">
          <Icon type="ios-eye-outline" @click.native="handleView(item.link)"></Icon>
          <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
        </div>
      </template>
      <template v-else>
        <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
      </template>
    </div>

    <Upload
      v-if="isUpload"
      ref="upload"
      :headers="accessToken"
      :show-upload-list="false"
      :on-success="handleSuccess"
      :max-size="2048"
      name="file"
      :on-format-error="handleFormatError"
      :on-exceeded-size="handleMaxSize"
      :before-upload="handleBeforeUpload"
      :multiple="uploadParam.multiple"
      :action="handleSuccessUrl"
      style="display: inline-block;width:58px;">
      <div style="width: 58px;height:58px;line-height: 74px;">
        <Icon type="ios-camera" size="40"></Icon>
      </div>
    </Upload>

    <Modal title="查看" v-model="visible">
      <div class="look-img">
        <img :src="imgUrl" v-if="visible" style="width: 100%">
      </div>
    </Modal>
  </div>
</template>

<script>
import { baseUrl } from '../assets/js/env'

export default {
  name: 'index',
  data () {
    return {
      imgUrl: '',
      visible: false,
      uploadList: [],
      isUpload: true,
      accessToken: '',
      handleSuccessUrl: baseUrl + '/api/ytcloud-resource/oss/endpoint/put-file?code=minio'
    }
  },
  props: {
    // 上传params
    uploadParam: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  mounted () {
    this.uploadList = this.$refs.upload.fileList
  },
  created () {
    this.accessToken = {
      // 'YtCloud-Auth': 'bearer ' + getToken(),
      Authorization: 'Basic c2FiZXI6c2FiZXJfc2VjcmV0'
    }
  },
  methods: {
    // 查看
    handleView (url) {
      this.imgUrl = url
      this.visible = true
    },
    // 删除
    handleRemove (file) {
      if (file.status === 'view') {
        this.uploadList.splice(this.uploadList.indexOf(file), 1)
        if (this.uploadList.length <= 0) {
          this.isUpload = true
        }
      } else {
        const fileList = this.$refs.upload.fileList
        this.$refs.upload.fileList.splice(fileList.indexOf(file), 1)
      }
    },
    // 成功
    handleSuccess (res, file) {
      // 调用接口上传图片流，返回图片服务地址
      this.uploadList = this.$refs.upload.fileList
      this.$emit('uploadImgFn', file)
    },
    // 图片格式限制提示
    handleFormatError (file) {
      this.$Message.warning('只能上传jpg,jpeg,png格式的图片!')
    },
    // 图片大小限制提示
    handleMaxSize (file) {
      this.$Message.warning('上传图片过大！')
    },
    // 图片数量限制提示
    handleBeforeUpload () {
      const check = this.uploadList.length < (this.uploadParam.size ? this.uploadParam.size : 1)
      if (this.uploadParam.size && this.uploadParam.size > 1) {
        if (!check) {
          this.$Message.warning('最多上传' + this.uploadParam.size + '张图片')
        }
      } else {
        if (!check) {
          this.$Message.warning('只能上传1张图片')
        }
      }
      return check
    },
    uploadOff () {
      this.isUpload = false
    },
    uploadOBj (obj) {
      if (obj.matoImg) {
        this.isUpload = false
        this.uploadList.push({
          status: 'view',
          link: obj.matoImg
        })
      } else {
        this.isUpload = true
      }
    },
    uploadClose () {
      this.uploadList = []
    }
  }
}
</script>

<style scoped>
  .demo-upload-list{
    display: inline-block;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0,0,0,.2);
    margin-right: 4px;
  }
  .demo-upload-list img{
    width: 100%;
    height: 100%;
  }
  .demo-upload-list-cover{
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,.6);
  }
  .demo-upload-list:hover .demo-upload-list-cover{
    display: block;
  }
  .demo-upload-list-cover i{
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }
  .look-img {
      height: 300px;
  }
</style>
