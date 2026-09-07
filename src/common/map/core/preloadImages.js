import {grey} from '@mui/material/colors'
import createPalette from '@mui/material/styles/createPalette'
import {loadImage, prepareIcon, prepareImage} from './mapUtil'

import directionSvg from '../../../resources/images/direction.svg'
import backgroundSvg from '../../../resources/images/background.svg'
import noBackgroundSvg from '../../../resources/images/noBackground.svg'
import animalSvg from '../../../resources/images/medias/icons/animal.svg'
import bicycleSvg from '../../../resources/images/medias/icons/bicycle.svg'
import boatSvg from '../../../resources/images/medias/icons/boat.svg'
import busSvg from '../../../resources/images/medias/icons/bus.svg'
import carSvg from '../../../resources/images/medias/icons/car.svg'
import craneSvg from '../../../resources/images/medias/icons/crane.svg'
import defaultSvg from '../../../resources/images/medias/icons/default.svg'
import helicopterSvg from '../../../resources/images/medias/icons/helicopter.svg'
import motorcycleSvg from '../../../resources/images/medias/icons/motorcycle.svg'
import offroadSvg from '../../../resources/images/medias/icons/offroad.svg'
import personSvg from '../../../resources/images/medias/icons/person.svg'
import pickupSvg from '../../../resources/images/medias/icons/pickup.svg'
import planeSvg from '../../../resources/images/medias/icons/plane.svg'
import scooterSvg from '../../../resources/images/medias/icons/scooter.svg'
import shipSvg from '../../../resources/images/medias/icons/ship.svg'
import tractorSvg from '../../../resources/images/medias/icons/tractor.svg'
import trainSvg from '../../../resources/images/medias/icons/train.svg'
import tramSvg from '../../../resources/images/medias/icons/tram.svg'
import trolleybusSvg from '../../../resources/images/medias/icons/trolleybus.svg'
import truckSvg from '../../../resources/images/medias/icons/truck.svg'
import vanSvg from '../../../resources/images/medias/icons/van.svg'
import flagStop from '../../../resources/images/medias/flagStop.svg'


export const mapIcons = {
  flagStop: flagStop,
  // animal: animalSvg,
  // bicycle: bicycleSvg,
  // boat: boatSvg,
  // bus: busSvg,
  // car: carSvg,
  // crane: craneSvg,
  // default: defaultSvg,
  // helicopter: helicopterSvg,
  // motorcycle: motorcycleSvg,
  // offroad: offroadSvg,
  // person: personSvg,
  // pickup: pickupSvg,
  // plane: planeSvg,
  // scooter: scooterSvg,
  // ship: shipSvg,
  // tractor: tractorSvg,
  // train: trainSvg,
  // tram: tramSvg,
  // trolleybus: trolleybusSvg,
  // truck: truckSvg,
  // van: vanSvg,
  background:backgroundSvg
}

export const mapImageIcons = {
  flagStop2: flagStop,
  animal2: animalSvg,
  bicycle2: bicycleSvg,
  boat2: boatSvg,
  bus2: busSvg,
  car2: carSvg,
  crane2: craneSvg,
  default2: defaultSvg,
  helicopter2: helicopterSvg,
  motorcycle2: motorcycleSvg,
  offroad2: offroadSvg,
  person2: personSvg,
  pickup2: pickupSvg,
  plane2: planeSvg,
  scooter2: scooterSvg,
  ship2: shipSvg,
  tractor2: tractorSvg,
  train2: trainSvg,
  tram2: tramSvg,
  trolleybus2: trolleybusSvg,
  truck2: truckSvg,
  van2: vanSvg,
  backgroundSvg: backgroundSvg,
}

export const mapIconKey = (category) =>
  Object({...mapIcons, ...mapImageIcons}).hasOwnProperty(category) ? category : 'default'

export const mapImages = {}

const mapPalette = createPalette({
  neutral: {main: grey[500]},
})

export default async () => {
  const background = await loadImage(backgroundSvg)
  const noBackground = await loadImage(noBackgroundSvg)

  const backgroundHandle = (category) => {
    if (category === 'flagStop')
      return noBackground
    return background
  }

  mapImages.background = await prepareIcon(background)
  mapImages.direction = await prepareIcon(await loadImage(directionSvg))
  await Promise.all(
    Object.keys({...mapIcons}).map(async (category, index) => {
      const results = []
      if (index < Object.keys(mapIcons).length) {
        ;['info', 'success', 'error', 'neutral'].forEach((color) => {
          results.push(
            loadImage(mapIcons[category]).then((icon) => {
              mapImages[`${category}-${color}`] = prepareIcon(
                backgroundHandle(category),
                icon,
                mapPalette[color].main,
              )
            }),
          )
        })
      } else {
        if (category != 'backgroundSvg') {
          results.push(
            loadImage(mapImageIcons[category]).then((icon) => {
              mapImages[`${category}`] = prepareIcon(
                backgroundHandle(category),
                icon,
                mapPalette['neutral'].main,
              )
            }),
          )
        } else {
          results.push(
            loadImage(mapImageIcons[category]).then((icon) => {
              mapImages[`${category}`] = prepareImage(
                icon,
              )
            }),
          )
        }
      }

      await Promise.all(results)
    }),
  )
}
