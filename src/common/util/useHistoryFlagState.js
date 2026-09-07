import {useEffect, useState} from 'react'

const saveHistoryFlagState = (value) => {
  window.localStorage.setItem('historyFlags', JSON.stringify(value))
}

const getHistoryFlagState = () => {
  return JSON.parse(window.localStorage.getItem('historyFlags'))
}

export const removeStorageHistoryFlagState = () => {
  window.localStorage.removeItem('historyFlags')
}

export default (key, defaultValue) => {

  return {getHistoryFlagState,saveHistoryFlagState}
}
