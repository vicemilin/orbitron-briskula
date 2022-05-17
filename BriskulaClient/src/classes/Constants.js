import { Dimensions } from 'react-native'

const width= Dimensions.get('window').width
const height = Dimensions.get('window').height

const cardBackgroundImage = require('../../assets/cards/cardBackground.jpg')
const bgImage = require('../../assets/background.jpg')

export {
  width,
  height,
  bgImage,
  cardBackgroundImage
}