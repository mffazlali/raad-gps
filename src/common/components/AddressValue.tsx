import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useTranslation} from './LocalizationProvider'
import {useCatch, useEffectAsync} from '../util/reactHelper.js'
import {sessionActions} from '../clientStore'
import Spinner from './custom/feedback/spinner/Spinner'
import axios from 'axios'
import axiosInstance from '../../common/util/axiosConfig.ts'

const AddressValue = ({deviceId, latitude, longitude, addressOpen, setAddressOpen, setOptionToggle}: {
  deviceId: any,
  addressOpen: boolean,
  latitude: any,
  longitude: any,
  setAddressOpen: (prevState: boolean) => void,
  setOptionToggle: (prevState: boolean) => void
}) => {
  const t = useTranslation()
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)

  useEffectAsync(async () => {
    if (isOpen) {
      await getAddress()
    }
  }, [isOpen, latitude, longitude])

  useEffect(() => {
    if (!addressOpen) {
      setIsOpen(false)
    }
  }, [addressOpen])


  const getAddress = (async () => {
    setIsLoading(true)
    try {
      const response = await axiosInstance.get(`/api/server/geocode`, {
        params: {latitude, longitude}
      })
      let address = 'آدرس موجود نیست'
      if (response.status === 200) {
        const res: string = response.data
        if (res.trim() !== '') {
          address = res.toString().replace('IR', 'ايران').split(',').reverse().reduce((a, c) => a + ', ' + c)
        }
        dispatch(sessionActions.updateAddressPosition({deviceId, address}))
        if (!addressOpen) {
          setAddressOpen(true)
        }
      } else {
        dispatch(sessionActions.updateAddressPosition({deviceId, address}))
        if (!addressOpen) {
          setAddressOpen(true)
        }
      }
      setIsLoading(false)
    } catch (error) {
      dispatch(sessionActions.updateAddressPosition({deviceId, address: 'آدرس موجود نیست'}))
      if (!addressOpen) {
        setAddressOpen(true)
      }
      setIsLoading(false)
    }
  })

  return (
    <>
      {<a href="#" onClick={async () => {
        setIsOpen(true)
        setOptionToggle(false)
      }} className={'text-underline text-primary hover:text-green-700 flex justify-end'}>
        نمایش آدرس
      </a>}
    </>
  )

}

export default AddressValue
