import React from 'react'
import {
  ITooltipParams,
} from 'ag-grid-community'

export type ColumnsKitGridType = {
  field: string,
  headerName: string
  valueFormatter?: (p: any) => any,
  filter?: boolean,
  floatingFilter?: boolean,
  cellRenderer?: any,
  flex?: number,
  checkboxSelection?: boolean
  pinned?: 'right' | 'left'
  hide?: boolean,
  suppressToolPanel?: boolean
  resizable?: boolean
  width?: number
  headerTooltip?:string,
  tooltipValueGetter?: (p: ITooltipParams) => string
}[]

export type KitGridType = {
  className?: string | undefined
  containerClassName?: string | undefined
  dataSource: any[]
  columns: ColumnsKitGridType | null,
  isPagination?: boolean
  loading?: boolean
  isSizeColumnFit?: boolean
  // onRowSelect?: (rows:any[])=>void
  onSelectionChange?: (rows: any) => void
}
