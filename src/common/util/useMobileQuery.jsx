import {useLayoutEffect, useState} from 'react'

const useMobileQuery = () => {

  const [mobileState, setMobileState] = useState(null)

  const setMobileStateByWindow = (width) => {
    const widthMode = width < 640
    setMobileState(widthMode)
  }
  const handleQuery=() => {
    setMobileStateByWindow(window.innerWidth)
    const handleResize = (event) => {
      const widthMode = event.target.innerWidth < 640
      setMobileState(widthMode)
    }
    window.addEventListener('load', () => setMobileStateByWindow(window.innerWidth),
    )
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }

  return {mobileState,handleQuery}
}

export default useMobileQuery
