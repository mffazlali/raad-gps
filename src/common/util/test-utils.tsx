import React, {ReactElement} from 'react'
import {render, RenderOptions} from '@testing-library/react'
// import clientStore from '../clientStore'
import {Provider} from 'react-redux'
import store from '../clientStore'
import {BrowserRouter} from 'react-router-dom'

const AllTheProviders = ({children}: {children: React.ReactNode}) => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </Provider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, {wrapper: AllTheProviders, ...options})

export * from '@testing-library/react'
export {customRender as render}
