import React from 'react';
import type { CustomLoadingCellRendererProps } from 'ag-grid-react';

export default (props: CustomLoadingCellRendererProps & { noRowsMessageFunc: () => string }) => {
  return (
    <div className="bg-gray200 rounded h-[10%] px-1 py-1">
      <i> {props.noRowsMessageFunc()}</i>
    </div>
  );
};
