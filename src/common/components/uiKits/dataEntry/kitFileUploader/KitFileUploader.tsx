import {UploadOutlined, InboxOutlined} from '@ant-design/icons'
import {Button, Upload} from 'antd'
import {KitFileUploaderType} from './KitFileUploaderType.ts'
import {useEffect, useState} from 'react'
import {RcFile, UploadChangeParam} from 'antd/es/upload'
import {UploadFile} from 'antd/lib'

const {Dragger} = Upload

const uploadOnly = (e: RcFile) => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.readAsDataURL(e)
    reader.onload = () => {
      const img = document.createElement('img')
      img.src = reader.result as string
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.naturalWidth
        canvas.height = img.naturalHeight
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(img, 0, 0)
        ctx.fillStyle = 'red'
        ctx.textBaseline = 'middle'
        ctx.font = '33px Arial'
        ctx.fillText('Ant Design', 20, 20)
        canvas.toBlob((result) => resolve(result as any))
      }
    }
  })

}

const fileUploader = (props: KitFileUploaderType, callbacks: any) => {
  return <Upload name={props.name}
                 showUploadList={props.showUploadList == null ? true : props.showUploadList}
                 accept={props.accept}
                 maxCount={props.maxCount}
                 style={props.style}
                 className={props.classname}
                 disabled={props.disabled}
                 fileList={props.value}
                 multiple={props.multiple}
                 listType={'text'}
                 action={props.action}
                 customRequest={(options) => props.customRequest(options)}
                 beforeUpload={(e) => {
                   if (props.beforeUpload) {
                     let result = {target: {type: '', name: props.name, value: e, id: props.name}}
                     props.beforeUpload(result)
                     uploadOnly(e).then()
                   } else {
                     callbacks.beforeUpload(e)
                   }
                 }
                 }
                 onChange={(e) => {
                   let result = {target: {type: '', name: props.name, value: e, id: props.name}}
                   if (props.onChange)
                     props.onChange(result as any)
                 }}
                 onRemove={callbacks.onRemove}>
    <Button icon={<UploadOutlined />}>{props.title}</Button>
  </Upload>
}

const fileDragUploader = (props: KitFileUploaderType, callbacks: any) => {
  return <Dragger name={props.name}
                  style={props.style}
                  rootClassName={props.classname}
                  disabled={props.disabled}
                  onChange={(e) => {
                    let result: any = {target: {type: '', name: props.name, value: e, id: props.name}}
                    if (props.onChange)
                      props.onChange(result)
                  }}
                  fileList={props.value}
                  multiple={props.multiple}
                  listType={'text'}
                  accept={props.accept}
                  maxCount={props.maxCount}
                  beforeUpload={callbacks.beforeUpload} onRemove={callbacks.onRemove}>
    <p className="ant-upload-drag-icon">
      <InboxOutlined />
    </p>
    <p className="ant-upload-text">یک فایل را در اینجا بکشید و رها کنید یا کلیک کنید</p>
    {/*<p className="ant-upload-hint">*/}
    {/*  Support for a single or bulk upload. Strictly prohibited from uploading company data or other*/}
    {/*  banned files.*/}
    {/*</p>*/}
  </Dragger>
}

const KitFileUploader = (props: KitFileUploaderType) => {
  const [fileList, setFileList] = useState<any[]>([])
  useEffect(() => {
    setFileList(props.value ?? [])
  }, [])

  const onRemove = (file: UploadFile<any>) => {
    const index = fileList.indexOf(file)
    const newFileList = fileList.slice()
    newFileList.splice(index, 1)
    setFileList(newFileList)
  }

  const beforeUpload = ((file: RcFile) => {
    setFileList([...fileList, file])
    return false
  })

  const onChange = ({file}: UploadChangeParam<UploadFile<any>>) => {
    // setFileList(newFileList)
    let result: any = {target: {type: file, name: props.name, value: fileList, id: props.name}}
    if (props.onChange)
      props.onChange(result)
  }

  if (props.type === 'simple') {
    return fileUploader(props, {onRemove, beforeUpload, onChange})
  } else if (props.type === 'dragger') {
    return fileDragUploader(props, {onRemove, beforeUpload, onChange})
  }
  return fileUploader(props, {onRemove, beforeUpload, onChange})
}

export default KitFileUploader
