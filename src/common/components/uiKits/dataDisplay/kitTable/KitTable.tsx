import {Space, Table, Tag} from 'antd'
import {KitTableType} from './KitTableType.ts'
import {useEffect, useState} from 'react'
import {ColumnsType} from 'antd/es/table/InternalTable'
import {TableRowSelection} from 'antd/es/table/interface'
import styles from './KitTable.module.css'


const KitTable = (props: KitTableType) => {

  const [columns, setColumns] = useState<ColumnsType<[]>>([])

  const rowSelection: TableRowSelection<any> = {
    onChange: (selectedRowKeys, selectedRows) => {
      if (props.onChange)
        props.onChange(selectedRowKeys, selectedRows)
    },
    onSelect: (record, selected, selectedRows) => {
      if (props.onSelect)
        props.onSelect(record, selected, selectedRows)
    },
  }


  useEffect(() => {
    const tempColumns: ColumnsType<[]> = []
    props.columns.forEach((column, index) => {
      tempColumns.push({title: column.title, key: column.key, dataIndex: column.dataIndex,width:100})
      if (column.nestedKeys && column.nestedKeys.length > 0) {
        const nestedKeysFN = (value: any, record: any, index: number) => {
          return (<>{value}</>)
        }
        tempColumns[index] = {...tempColumns[index], render: nestedKeysFN}
      }
      if (column.pipeFn) {
        const pipeFN = (value: any, record: any, index: number) => {
          return (<>{column.pipeFn!(value, record)}</>)
        }
        tempColumns[index] = {...tempColumns[index], render: pipeFN}
      }
      switch (column.type) {
        case 'tag':
          const tagFN = (value: any, record: any, index: number) => (
            <>
              {record[column.key].map((tag: any) => {
                let color = tag.length > 5 ? 'geekblue' : 'green'
                if (tag === 'loser') {
                  color = 'volcano'
                }
                return (
                  <Tag color={color} key={tag}>
                    {tag.toUpperCase()}
                  </Tag>
                )
              })}
            </>
          )
          tempColumns[index] = {...tempColumns[index], render: tagFN}
          break
        case 'action':
          let actionFN
          const actionConfig = column.actionConfig
          if (actionConfig!.mode === 'simple' || actionConfig!.mode === undefined) {
            actionFN = (value: any, record: any, index: number) => {
              const elements = actionConfig!.controls.map((action, index) => {
                return (<button className={styles.actionButton} key={index} onClick={() => {
                  if (action.onClick) action.onClick(record)
                }}>{action.element}</button>)
              })
              return (
                <div>{elements}</div>
              )
            }
          }
          tempColumns[index] = {...tempColumns[index], render: actionFN}
          break
      }
      if (column.sort) {
        const sortFn = (a: any, b: any) => {
          if (column.type == 'text') {
            return a[column.key].length - b[column.key].length
          } else {
            return a[column.key] - b[column.key]
          }
        }
        // const sortDirections: SortOrder[] = column.sortDirections === 'desc' ? ['descend'] : ['ascend']
        tempColumns[index] = {
          ...tempColumns[index],
          sorter: sortFn,
          defaultSortOrder: column.defaultSortOrder === 'asc' ? 'ascend' : 'descend',
        }
      }
    })
    setColumns(tempColumns)
  }, [props])
  return <Table className={styles.dataTable} dataSource={props.dataSource} columns={columns}
                rowKey={props.rowKey !== undefined ? (record) => record[props.rowKey ?? ''] : undefined}
                pagination={{pageSize: 10,size:'small',responsive:true}} loading={props.loading} size={'middle'}
                rowSelection={props.rowSelection ? {...rowSelection, type: props.typeSelection} : undefined}
                bordered={false} virtual={false} direction={'rtl'}  scroll={{y: 1000,x:100,scrollToFirstRowOnChange:true}} />
}

export default KitTable
