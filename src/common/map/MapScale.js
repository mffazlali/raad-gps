import maplibregl from 'maplibre-gl'
import * as maptilersdk from '@maptiler/sdk'
import { useEffect, useMemo, useRef } from 'react'
import { map } from './core/MapView'
import { useAttributePreference } from '../util/preferences.js'

const MapScale = () => {
  const distanceUnit = useAttributePreference('distanceUnit')

  const control = useMemo(() => new maptilersdk.ScaleControl(), [])

  useEffect(() => {
    map.addControl(control, 'top-left')
    return () => map.removeControl(control)
  }, [control])

  // Localize the scale control label (e.g., "m 30" -> "30 متر")
  const { unitMap, numUnitRe, unitNumRe } = useMemo(() => {
    return {
      unitMap: {
        m: 'متر',
        meter: 'متر',
        meters: 'متر',
        km: 'کیلومتر',
        kilometer: 'کیلومتر',
        kilometers: 'کیلومتر',
        mi: 'مایل',
        mile: 'مایل',
        miles: 'مایل',
        nmi: 'مایل دریایی',
        nm: 'مایل دریایی'
      },
      numUnitRe: /^(?<num>[-+]?\d*\.?\d+)\s*(?<unit>[a-zA-Z]+)$/,
      unitNumRe: /^(?<unit>[a-zA-Z]+)\s*(?<num>[-+]?\d*\.?\d+)$/
    }
  }, [])

  useEffect(() => {
    const container = control?._container || document.querySelector('.maplibregl-ctrl-scale')
    if (!container) return

    const lastAppliedRef = { value: container.textContent }

    const formatLabel = (text) => {
      if (!text) return text
      const normalized = String(text).trim().replace(/\s+/g, ' ')
      const matchNumUnit = normalized.match(numUnitRe)
      const matchUnitNum = normalized.match(unitNumRe)
      let num, unit
      if (matchNumUnit?.groups) {
        num = matchNumUnit.groups.num
        unit = matchNumUnit.groups.unit
      } else if (matchUnitNum?.groups) {
        num = matchUnitNum.groups.num
        unit = matchUnitNum.groups.unit
      } else {
        return text
      }
      const faUnit = unitMap[unit.toLowerCase()]
      return faUnit ? `${num} ${faUnit}` : `${num} ${unit}`
    }

    const applyFormat = () => {
      const current = container.textContent
      if (current === lastAppliedRef.value) return
      const formatted = formatLabel(current)
      if (formatted && formatted !== current) {
        lastAppliedRef.value = formatted
        container.textContent = formatted
      } else {
        lastAppliedRef.value = current
      }
    }

    applyFormat()
    const observer = new MutationObserver(applyFormat)
    observer.observe(container, { childList: true, characterData: true, subtree: false })
    return () => observer.disconnect()
  }, [control, unitMap, numUnitRe, unitNumRe])

  useEffect(() => {
    switch (distanceUnit) {
      case 'mi':
        control.setUnit('imperial')
        break
      case 'nmi':
        control.setUnit('nautical')
        break
      case 'km':
      default:
        control.setUnit('metric')
        break
    }
  }, [control, distanceUnit])

  return null
}

export default MapScale
