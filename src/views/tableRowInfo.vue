<template>
    <div class="rowInfo">
      <formAssembly
        :formData="searchFrom"
        @formSubmit="submitOk"
        @formCancel="submitCancel"></formAssembly>
    </div>
</template>

<script>
import formAssembly from '../components/formAssembly'

export default {
  name: 'tableRowInfo',
  components: {
    formAssembly
  },
  data () {
    return {
      // 控件设置
      searchFrom: {
        labelWidth: 120,
        rowSpan: 12, // 8,12,24 表单排列方式
        fromParams: [
          {
            name: '输入框',
            key: 'a',
            type: 'input',
            rules: {
              required: true, message: '请输入xxx', trigger: 'blur'
            }
          },
          {
            name: '密码框',
            key: 'b',
            type: 'input',
            text_type: 'password'
          },
          {
            name: '带单位',
            key: 'c',
            type: 'inputCom',
            company: '万元',
            rules: {
              required: true, message: '请输入xxx', trigger: 'blur'
            }
          },
          {
            name: 'select',
            key: 'd',
            type: 'select',
            props: {
              label: 'name',
              value: 'id'
            },
            options: [
              {
                id: 1,
                name: '11'
              },
              {
                id: 2,
                name: '22'
              },
              {
                id: 3,
                name: '33'
              },
              {
                id: 4,
                name: '44'
              }
            ]
          },
          {
            name: '双select',
            key: 'taskStatus',
            type: 'selectDouble',
            selectArr: [
              {
                name: 'select1',
                key: 'e',
                props: {
                  label: 'name',
                  value: 'id'
                },
                options: [
                  {
                    id: 1,
                    name: '11'
                  },
                  {
                    id: 2,
                    name: '22'
                  },
                  {
                    id: 3,
                    name: '33'
                  },
                  {
                    id: 4,
                    name: '44'
                  }
                ]
              },
              {
                name: 'select2',
                key: 'f',
                props: {
                  label: 'name',
                  value: 'id'
                },
                options: [
                  {
                    id: 1,
                    name: '11'
                  },
                  {
                    id: 2,
                    name: '22'
                  },
                  {
                    id: 3,
                    name: '33'
                  },
                  {
                    id: 4,
                    name: '44'
                  }
                ]
              }
            ]
          },
          {
            name: '开始时间',
            key: 'g',
            type: 'dateTime',
            text_type: 'datetime'
          },
          {
            name: '结束时间',
            key: 'h',
            type: 'dateTime',
            format: 'yyyy-MM-DD',
            text_type: 'datetimerange'
          },
          {
            name: 'switch',
            key: 'i',
            type: 'switch'
          },
          {
            name: '下拉树形',
            key: 'j',
            type: 'treeSelect',
            treeData: [
              {
                id: 'a',
                title: 'a',
                children: [
                  {
                    id: 'a1',
                    title: 'a-1',
                    children: [
                      {
                        id: 112,
                        title: '1-1-2'
                      },
                      {
                        id: 'a12',
                        title: 'a-1-2'
                      },
                      {
                        id: 'a13',
                        title: 'a-1-3'
                      },
                      {
                        id: 'a14',
                        title: 'a-1-4'
                      }
                    ]
                  },
                  {
                    id: 'a2',
                    title: 'a-2',
                    children: [
                      {
                        id: 'a21',
                        title: 'b-2-1'
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            name: '文本框',
            key: 'k',
            type: 'input',
            text_type: 'textarea'
          }
        ],
        // 表单参数
        searchParams: {
          a: '',
          b: '',
          c: '',
          d: '',
          e: '',
          f: '',
          g: '',
          h: '',
          i: '',
          j: '',
          k: ''
        }
      }
    }
  },
  methods: {
    submitOk (e) {
      console.log('表单数据===', e)
      this.$router.go(-1)
    },
    submitCancel () {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped lang="less">
.rowInfo {
  padding: 20px;
}
</style>
