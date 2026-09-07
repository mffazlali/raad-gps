import {ColumnsKitGridType, KitGridType} from './KitGridType.ts'
import {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {AgGridReact} from 'ag-grid-react' // AG Grid Component
import {ModuleRegistry, ClientSideRowModelModule, AllCommunityModule} from 'ag-grid-community'
import {Theme, themeBalham, themeMaterial, themeQuartz} from 'ag-grid-community'
// import 'ag-grid-community/styles/ag-theme-quartz.css'
// import 'ag-grid-community/styles/ag-grid.css' // Mandatory CSS required by the grid
// import 'ag-grid-community/styles/ag-theme-quartz.css' // Optional Theme applied to the grid
import cls from 'classnames'
import {localEN} from './localEN.tsx'
import Spinner from '../../../custom/feedback/spinner/Spinner'
import CustomNoRowsOverlay from './customNoRowsOverlay.tsx'
import CustomLoadingOverlay from './customLoadingOverlay.tsx'
import store from '../../../../clientStore/index'
import dayjs from 'dayjs'
import {toJalaliMoment} from '../../../../util/DateTimeUtil'


ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  AllCommunityModule,
])

const myTheme = themeQuartz.withParams({
  spacing: 12,
  accentColor: 'red',
})


const paginationPageSize = 20
const paginationPageSizeSelector = [20, 50, 100]
const KitGrid = (props: KitGridType) => {
  const gridRef = useRef<AgGridReact<any>>(null)

  const loadingOverlayComponent = useMemo(() => {
    return CustomLoadingOverlay
  }, [])
  const loadingOverlayComponentParams = useMemo(() => {
    return {
      loadingMessage: 'لطفا صبر کنید',
    }
  }, [])
  const noRowsOverlayComponent = useMemo(() => {
    return CustomNoRowsOverlay
  }, [])
  const noRowsOverlayComponentParams = useMemo(() => {
    const timestamp=store.getState().session.timestamp
    return {
      noRowsMessageFunc: () => 'داده یافت نشد در: ' + toJalaliMoment(timestamp).format('jYYYY/jMM/jDD HH:mm:ss'),
    }
  }, [props.loading])

  const onBtShowLoading = useCallback(() => {
    if (gridRef.current?.api) {
      gridRef.current.api.showLoadingOverlay()
    }
  }, [])

  const onBtShowNoRows = useCallback(() => {
    if (gridRef.current?.api) {
      gridRef.current.api.showNoRowsOverlay()
    }
  }, [])

  const onBtHide = useCallback(() => {
    if (gridRef.current?.api) {
      gridRef.current.api.hideOverlay()
    }
  }, [])

  // const onRowSelected = useCallback((event) => {
  //   console.log({event})
  //   const selectedRows = gridRef.current.api.getSelectedRows();
  //   if(props.onRowSelect){
  //     props.onRowSelect(selectedRows)
  //   }
  // }, []);

  const getColumns = (columns: ColumnsKitGridType) => {
    return columns.map(column => {
      return {...column, suppressMovable: true}
    })
  }

  const onSelectionChanged = useCallback((event) => {
    if (gridRef.current?.api) {
      const selectedRows = gridRef.current.api.getSelectedRows()
      if (props.onSelectionChange) {
        props.onSelectionChange(selectedRows[0])
      }
    }
  }, [])

  useEffect(() => {
    if (props.loading != undefined) {
      if (props.loading) {
        onBtShowLoading()
      } else {
        if (props.dataSource && props.dataSource.length > 0) {
          onBtHide()
        } else {
          onBtShowNoRows()
        }
      }
    }
  }, [props.loading])

  const onGridReadyOC = useCallback(params => {
    params.api.sizeColumnsToFit() // while loading grid, we are setting
  }, [])

  const defaultColDef = {
    flex: 1,
  }

  const theme = useMemo<Theme | 'legacy'>(() => {
    return myTheme
  }, [])

  return <div
    style={{}}
    className={cls(props.containerClassName as any)}
  >
    <AgGridReact
      theme={themeQuartz}
      modules={[ClientSideRowModelModule, AllCommunityModule]}
      rowData={props.dataSource}
      onGridReady={props.isSizeColumnFit ? onGridReadyOC : undefined}
      // defaultColDef={defaultColDef}
      columnDefs={getColumns(props.columns)}
      className={props.className}
      rowSelection={'single'}
      pagination={props?.isPagination ?? true}
      cellSelection={false}
      paginationPageSize={paginationPageSize}
      paginationPageSizeSelector={paginationPageSizeSelector}
      loadingOverlayComponent={loadingOverlayComponent}
      loadingOverlayComponentParams={loadingOverlayComponentParams}
      noRowsOverlayComponent={noRowsOverlayComponent}
      noRowsOverlayComponentParams={noRowsOverlayComponentParams}
      localeText={localEN}
      enableRtl={true}
      onSelectionChanged={onSelectionChanged}
      ref={gridRef}
      suppressDragLeaveHidesColumns={true}
      loading={props.loading}
      suppressCellFocus={true}
    />
  </div>
}

export default KitGrid
