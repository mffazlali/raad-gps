import React, { useState } from 'react'
import {
  AppBar,
  Breadcrumbs,
  Divider,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import MenuIcon from '@mui/icons-material/Menu'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from './LocalizationProvider'

const PageTitle = ({ breadcrumbs }) => {
  const theme = useTheme()
  const t = useTranslation()

  const desktop = true

  if (desktop) {
    return (
      <Typography variant="h6" noWrap>
        {t(breadcrumbs[0])}
      </Typography>
    )
  }
  return (
    <Breadcrumbs>
      {breadcrumbs.slice(0, -1).map((breadcrumb) => (
        <Typography variant="h6" color="inherit" key={breadcrumb}>
          {t(breadcrumb)}
        </Typography>
      ))}
      <Typography variant="h6" color="textPrimary">
        {t(breadcrumbs[breadcrumbs.length - 1])}
      </Typography>
    </Breadcrumbs>
  )
}

const PageLayout = ({ menu, breadcrumbs, children }) => {
  const classes = useStyles()
  const theme = useTheme()
  const navigate = useNavigate()

  const desktop = true

  const [openDrawer, setOpenDrawer] = useState(false)

  return desktop ? (
    <div className={'h-full flex'}>
      <Drawer
        variant="permanent"
        className={'w-full'}
        classes={{ paper: '' }}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            sx={{ mr: 2 }}
            onClick={() => navigate('/')}>
            <ArrowBackIcon />
          </IconButton>
          <PageTitle breadcrumbs={breadcrumbs} />
        </Toolbar>
        <Divider />
        {menu}
      </Drawer>
      <div className={'grow-[1] items-stretch flex flex-col overflow-y-auto'}>{children}</div>
    </div>
  ) : (
    <div className={'h-full flex flex-col'}>
      <Drawer
        variant="temporary"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        classes={{ paper: '' }}>
        {menu}
      </Drawer>
      <AppBar
        className={'z-[1]'}
        position="static"
        color="inherit">
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            sx={{ mr: 2 }}
            onClick={() => setOpenDrawer(true)}>
            <MenuIcon />
          </IconButton>
          <PageTitle breadcrumbs={breadcrumbs} />
        </Toolbar>
      </AppBar>
      <div className={'grow-[1] items-stretch flex flex-col overflow-y-auto'}>{children}</div>
    </div>
  )
}

export default PageLayout
