# 一个表单组件

## Project setup
```
一个基于view-design框架的 表单组件，集成输入框，下拉框，下拉树形，日期，开关，上传图片等。。。 的表单组件。

{
  labelWidth: 120,  文本框宽度
  rowSpan: 12,  8,12,24 表单排列方式
  fromParams: 表单对象
    name: 名称
    key: 字段key
    type: 表单类型 （input 输入框控件（默认text），inputCom 输入框带单位控件，select 下拉控件， selectDouble 双下拉控件，dateTime 时间控件（默认date））
    text_type: 跟type共用，更改相同控件不同控件类型，如：input输入框转成textarea，dateTime时间控件转成datetime，year等
    rules: { 校验规则
      required: true, message: '请输入xxx', trigger: 'blur'
    }
}

表单methods：
 select 下拉：
   formOptionChange 选中
   selectOpen 展开

 treeSelect 下拉树形：
   onTreeChange 选中
   onTreeExpand 展开
   onTreeCheck 多选checkbox选中
   onTreeSelect 单选文本选中

 form 表单：
   formSubmit 提交
   formCancel 取消
```

# xlsx导出
```
  npm install xlsx --save
  npm install xlsx-style --save

  Table控件复杂表头通过children嵌套，引用：export.js 调用 exportElsx(a, b) 函数，a: table数据源，b: columns数据源
```
