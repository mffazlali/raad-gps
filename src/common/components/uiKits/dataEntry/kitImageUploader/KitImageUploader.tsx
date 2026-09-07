import {UploadOutlined, InboxOutlined} from '@ant-design/icons'
import {Button, GetProp, Upload, UploadProps} from 'antd'
import {KitImageUploaderType} from './KitImageUploaderType.ts'
import {useEffect, useState} from 'react'
import {RcFile, UploadChangeParam} from 'antd/es/upload'
import {UploadFile} from 'antd/lib'
import {KitFileUploaderType} from '../kitFileUploader/KitFileUploaderType.ts'
import useNotification from '../../../../util/useNotification.tsx'

const {Dragger} = Upload

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (img: FileType, callback: (url: string) => void) => {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result as string))
  reader.readAsDataURL(img)
}

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

const validateSize = (size: number, maxMBSize: number) => {
  const fileSize = size / 1024 / 1024 // in MiB
  return fileSize < maxMBSize
}
const imageUploader = (props: KitImageUploaderType, callbacks: any) => {
  const {contextHolder, showNotification} = useNotification()

  return <>
    {contextHolder}
    <Upload name={props.name}
            style={props.style}
            rootClassName={props.classname}
            disabled={props.disabled}
            accept={props.accept}
            maxCount={props.maxCount}
            beforeUpload={(e) => {
              if (validateSize(e.size, 1)) {
                if (props.beforeUpload) {
                  let result = {target: {type: '', name: props.name, value: e, id: props.name}}
                  props.beforeUpload(result)
                  // uploadOnly(e)
                  return false
                } else {
                  callbacks.beforeUpload(e)
                  return false
                }
              } else {
                showNotification({
                  message: 'حجم فایل انتخاب شده باید کمتر از یک مگابایت باشد',
                  type: 'info',
                  duration: 2,
                  key: 'component',
                })
              }
            }
            }
            onChange={(e) => {
              let result: any = {target: {type: '', name: props.name, value: e.fileList, id: props.name}}
              if (props.onChange)
                if (e.fileList && validateSize(e.file.size, 1)) {
                  props.onChange(result)
                } else {
                  showNotification({
                    message: 'حجم فایل انتخاب شده باید کمتر از یک مگابایت باشد',
                    type: 'info',
                    duration: 2,
                    key: 'component',
                  })
                }
            }}
            fileList={props.value}
            multiple={props.multiple}
            listType={'picture'}
            onRemove={callbacks.onRemove}>
      <Button icon={<UploadOutlined />}>{props.title}</Button>
    </Upload>
  </>
}
const imageDragUploader = (props: KitImageUploaderType, imageUrl: any, callbacks: any) => {
  return <Upload name={props.name}
                 style={props.style}
                 rootClassName={props.classname}
                 disabled={props.disabled}
                 accept={props.accept}
                 maxCount={props.maxCount}
                 beforeUpload={(e) => {
                   if (props.beforeUpload) {
                     let result = {target: {type: '', name: props.name, value: e, id: props.name}}
                     props.beforeUpload(result)
                     // uploadOnly(e)
                   } else {
                     // callbacks.beforeUpload(e)
                   }
                 }
                 }
                 onChange={(e) => {
                   callbacks.onChange(e)
                   let result: any = {target: {type: '', name: props.name, value: e.fileList, id: props.name}}
                   if (props.onChange)
                     props.onChange(result)
                 }}
                 fileList={props.value}
                 multiple={props.multiple}
                 listType={'picture-card'}
                 showUploadList={false}
                 onRemove={callbacks.onRemove}>
    {imageUrl ? <img src={imageUrl} alt="avatar" style={{width: '100%'}} /> :
      <button style={{border: 0, background: 'none'}} type="button">
        <div style={{marginTop: 8}}>آپلود</div>
      </button>}
  </Upload>
}

const KitImageUploader = (props: KitImageUploaderType) => {
  const [fileList, setFileList] = useState<any[]>([])
  const [imageUrl, setImageUrl] = useState<string>()

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
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      if (props.beforeUpload) {
        let result: any = {target: {type: '', name: props.name, value: file, id: props.name}}
        props.beforeUpload(result)
        // 'فقط فابل JPG/PNG مجاز است'
        return false
      }

    }
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      if (props.beforeUpload) {
        let result: any = {target: {type: '', name: props.name, value: file, id: props.name}}
        props.beforeUpload(result)
//        'تصویر باید کمتر از 2MB باشد'
        return false
      }
    }
    setFileList([...fileList, file])
    return false
  })

  const onChange = (info: UploadChangeParam<UploadFile<any>>) => {
    if (props.type === 'dragger') {
      const fileList = info.fileList
      if (fileList.length > 0) {
        getBase64(fileList[fileList.length - 1].originFileObj as FileType, (url) => {
          setImageUrl(url)
        })
      }
    }
    let result: any = {target: {type: '', name: props.name, value: info, id: props.name}}
    if (props.onChange)
      props.onChange(result)
  }

  if (props.type === 'simple') {
    return imageUploader(props, {onRemove, beforeUpload, onChange})
  } else if (props.type === 'dragger') {
    return imageDragUploader(props, imageUrl, {onRemove, beforeUpload, onChange})
  }
  return imageUploader(props, {onRemove, beforeUpload, onChange})
}

export default KitImageUploader
