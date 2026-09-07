import {StrictMode} from 'react'
import React from 'react'
import {createRoot} from 'react-dom/client'
import '@ant-design/v5-patch-for-react-19'
import './index.css'
import store from './common/clientStore'
import {Provider} from 'react-redux'
import {LocalizationProvider} from './common/components/LocalizationProvider'
import {BrowserRouter} from 'react-router-dom'
import 'moment/locale/fa.js'
import moment from 'moment'
import Navigation from './Navigation.jsx'
import ServerProvider from './common/controllers/ServerProvider.jsx'
import sentryConfig from '../sentry.config'
import dayjs from 'dayjs'
import 'dayjs/locale/fa.js'
import 'dayjs/locale/fa'
import jalaliday from 'jalali-plugin-dayjs'
import {scan} from 'react-scan' // must be imported before React and React DOM
import ReactQueryProvider from './ReactQueryProvider.jsx'

scan({
  enabled: false,
})

dayjs.extend(jalaliday)
dayjs.locale('fa')
dayjs.calendar('jalali')

sentryConfig()
moment.locale('fa')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ReactQueryProvider>
      <Provider store={store}>
        <LocalizationProvider>
          <ServerProvider>
            <BrowserRouter future={{
              v7_relativeSplatPath: true,
              v7_startTransition: true,
            }}>
              <Navigation />
            </BrowserRouter>
          </ServerProvider>
        </LocalizationProvider>
      </Provider>
    </ReactQueryProvider>
  </StrictMode>,
)
