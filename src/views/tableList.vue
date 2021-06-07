<template>
  <div class="tableList">
    <!--普通table-->
    <Table border :columns="columns" :data="data"></Table>

    <!--复杂表头table-->
    <div style="margin-top: 20px;">
      <Table border :columns="complexColumns" :data="data"></Table>
      <Button type="primary" @click="exportFn">导出</Button>
    </div>

    <Modal
      v-model="modalStatus"
      title="弹框"
      width="80%"
      footer-hide>
      <formAssembly
        ref="assembly"
        :formData="searchFrom"
        @formSubmit="submitOk"
        @formCancel="submitCancel"></formAssembly>
    </Modal>
  </div>
</template>

<script>
import { Table, Button, Tag, Modal, Switch } from 'view-design'
import formAssembly from '../components/formAssembly'
import { exportElsx } from '../assets/js/export'

export default {
  name: 'tableList',
  components: {
    Table,
    [Button.name]: Button,
    [Tag.name]: Tag,
    Modal,
    formAssembly,
    [Switch.name]: Switch
  },
  data () {
    return {
      columns: [
        {
          title: '名称',
          key: 'name'
        },
        {
          title: '类型',
          key: 'type'
        },
        {
          title: '宽度',
          key: 'width'
        },
        {
          title: '高度',
          key: 'height'
        },
        {
          title: '性别',
          key: 'six'
        },
        {
          title: '状态',
          key: 'status',
          render: (h, params) => {
            const row = params.row
            const color = row.status === 1 ? 'primary' : row.status === 2 ? 'success' : 'error'
            const text = row.status === 1 ? 'Working' : row.status === 2 ? 'Success' : 'Fail'
            return h(Tag, {
              props: {
                type: 'dot',
                color: color
              }
            }, text)
          }
        },
        {
          title: 'Action',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h(Button, {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.$router.push('/row')
                  }
                }
              }, 'view'),
              h(Button, {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.modalStatus = true
                  }
                }
              }, 'modal')
            ])
          }
        }
      ],
      data: [
        {
          name: 'John Brown',
          type: 1,
          width: 18,
          height: 18,
          six: 1,
          status: 2
        },
        {
          name: 'Jim Green',
          type: 1,
          width: 20,
          height: 10,
          six: 2,
          status: 1
        },
        {
          name: 'Joe Black',
          type: 2,
          width: 39,
          height: 23,
          six: 1,
          status: 2
        },
        {
          name: 'Jon Snow',
          type: 1,
          width: 44,
          height: 52,
          six: 1,
          status: 1
        }
      ],
      modalStatus: false,
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
            name: '图片上传',
            key: 'k',
            type: 'uploadImg'
          },
          {
            name: '文本框',
            key: 'l',
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
          k: '',
          l: ''
        }
      },

      // 复杂table
      complexColumns: [
        {
          title: '名称',
          key: 'name',
          align: 'center'
        },
        {
          title: '属性',
          align: 'center',
          children: [
            {
              title: '宽度',
              key: 'width',
              align: 'center'
            },
            {
              title: '高度',
              key: 'height',
              align: 'center'
            },
            {
              title: '性别',
              key: 'six',
              align: 'center'
            }
          ]
        },
        {
          title: '状态',
          key: 'status',
          align: 'center'
        }
      ]
    }
  },
  created () {
  },
  methods: {
    submitOk (name, e) {
      console.log('表单数据===', this.$refs.assembly.$refs.formInline)
      this.modalStatus = false
      this.$refs.assembly.$refs.formInline.resetFields()
    },
    submitCancel () {
      this.modalStatus = false
    },
    // 导出
    exportFn () {
      exportElsx(this.data, this.complexColumns)
    }
  }
}
</script>

<style scoped lang="less">
.tableList {}
</style>
