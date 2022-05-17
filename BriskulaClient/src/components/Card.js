import React, {PureComponent} from 'react'
import { View, Image, StyleSheet } from 'react-native'

import { ScreenWidth, ScreenHeight, cardBackgroundImage } from '../classes'


export default class Card extends PureComponent{
  constructor(props){
    super(props)

    this.onPress = this.onPress.bind(this)
  }

  onPress = () => {
    if(this.props.onPress){
      this.props.onPress()
    }
  }

  render(){
    const cardImage = this.props.card ? this.props.card.image : cardBackgroundImage
    return(
      <View 
       styles = {styles.mainContainer}
       onStartShouldSetResponder = {() => true}
       onResponderRelease = {this.onPress}
      >
        <Image 
         source= {cardImage}
         style = {styles.image}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    width: ScreenWidth/6,
    height: ScreenHeight/4
  },

  image: {
    width: ScreenWidth/6,
    height: ScreenHeight/4,
    //flex: 1,
    resizeMode: 'contain',
  }
})