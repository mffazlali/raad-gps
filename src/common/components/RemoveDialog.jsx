import React from 'react'
import Button from '@mui/material/Button'
import { Snackbar } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import { useTranslation } from './LocalizationProvider'
import { useCatch } from '../util/reactHelper.js'
import { snackBarDurationLongMs } from '../util/duration'
import axios from 'axios'
import axiosInstance from '../util/axiosConfig'


const useStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.down('md')]: {
      bottom: `calc(${theme.dimensions.bottomBarHeight}px + ${theme.spacing(
        1
      )})`,
    },
  },
  button: {
    height: 'auto',
    marginTop: 0,
    marginBottom: 0,
    color: theme.palette.error.main,
  },
}))

const RemoveDialog = ({ open, endpoint, itemId, onResult }) => {
  const classes = useStyles()
  const t = useTranslation()

  const handleRemove = useCatch(async (itemId) => {
    try {
      const response = await axiosInstance.delete(`/api/${endpoint}/${itemId}`)
      if (response.status === 204) {
        onResult(true)
      }
    } catch (error) {
      throw Error(error.response?.data || error.message)
    }
  })

  return (
    <Snackbar
      className={classes.root}
      open={open}
      autoHideDuration={snackBarDurationLongMs}
      onClose={() => onResult(false)}
      message={t('sharedRemoveConfirm')}
      action={
        <Button size="small" className={classes.button} onClick={handleRemove}>
          {t('sharedRemove')}
        </Button>
      }
    />
  )
}

export default RemoveDialog
