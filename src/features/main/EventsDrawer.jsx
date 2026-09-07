import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { formatNotificationTitle, formatTime } from '../../common/util/formatter.js'
import { useTranslation } from '../../common/components/LocalizationProvider.jsx'
import { eventsActions } from '../../common/clientStore/index.js'
import { usePreference } from '../../common/util/preferences.js'

const EventsDrawer = ({ open, onClose }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const t = useTranslation()

  const hours12 = usePreference('twelveHourFormat')

  const devices = useSelector((state) => state.devices.items)

  const events = useSelector((state) => state.events.items)

  const formatType = (event) =>
    formatNotificationTitle(t, {
      type: event.type,
      attributes: {
        alarms: event.attributes.alarm,
      },
    })

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Toolbar className={''} disableGutters>
        <Typography variant="h6" className={'grow-[1]'}>
          {t('reportEvents')}
        </Typography>
        <IconButton
          size="small"
          color="inherit"
          onClick={() => dispatch(eventsActions.deleteAll())}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Toolbar>
      <List className={''} dense>
        {events.map((event) => (
          <ListItemButton
            key={event.id}
            onClick={() => navigate(`/event/${event.id}`)}
            disabled={!event.id}>
            <ListItemText
              primary={`${devices[event.deviceId]?.name} • ${formatType(
                event
              )}`}
              secondary={formatTime(event.eventTime, 'seconds', hours12)}
            />
            <IconButton
              size="small"
              onClick={() => dispatch(eventsActions.delete(event))}>
              <DeleteIcon fontSize="small" className={''} />
            </IconButton>
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  )
}

export default EventsDrawer
