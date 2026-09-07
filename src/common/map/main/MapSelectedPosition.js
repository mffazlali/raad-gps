import {useEffect} from 'react'

import {useSelector} from 'react-redux'
import {map} from '../core/MapView'
import dimensions from '../../theme/dimensions.js'
import {useAttributePreference} from '../../util/preferences.js'
import {usePrevious} from '../../util/reactHelper.js'

const MapSelectedPosition = ({position}) => {

  const selectZoom = useAttributePreference('web.selectZoom', 10)
  const mapFollow = useAttributePreference('mapFollow', false)

  useEffect(() => {
    if (position) {
      map.easeTo({
        center: [position.longitude, position.latitude],
        zoom: Math.max(map.getZoom(), selectZoom),
        offset: [0, -dimensions.popupMapOffset / 2],
      })
    }

  }, [position])

  return null
}

export default MapSelectedPosition
