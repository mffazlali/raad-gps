import type { CustomLoadingCellRendererProps } from 'ag-grid-react';
import React from 'react';
import Spinner from '../../../custom/feedback/spinner/Spinner'

export default (props: CustomLoadingCellRendererProps & { loadingMessage: string }) => {
  return (
    <div className={'bg-gray200 rounded h-[10%] px-1 py-1 flex flex-col justify-center items-center'}>
     <Spinner/>
      <div>
        {props.loadingMessage}
      </div>
    </div>
  );
};
