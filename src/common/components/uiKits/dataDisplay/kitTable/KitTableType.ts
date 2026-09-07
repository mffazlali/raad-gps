import React from 'react'

type ColumnsType = 'tag' | 'action' | 'text' | 'number'

export type DataTableColumnsType = {
  title: string,
  dataIndex: string,
  key: string,
  type?: ColumnsType
  nestedKeys?: string[]
  pipeFn?: (value: any,record?:any) => string
  actionConfig?: {
    mode?: 'simple' | 'Dropdown'
    controls: {element: React.ReactNode, onClick?: (record: any) => void}[]
  }
  sort?: boolean
  defaultSortOrder?: 'asc' | 'desc'
}


export type KitTableType = {
  dataSource: any[]
  columns: DataTableColumnsType[]
  rowKey?: string
  loading?: boolean
  rowSelection?: boolean,
  typeSelection?: 'radio' | 'checkbox'
  onChange?: (selectedRowKeys: React.Key[], selectedRows: any[]) => void
  onSelect?: (record: any, selected: boolean, selectedRows: any[]) => void
}
