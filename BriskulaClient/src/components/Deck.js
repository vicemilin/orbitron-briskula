import React, {PureComponent} from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'

import { ScreenWidth, ScreenHeight, cardBackgroundImage } from '../classes'


export default class Deck extends PureComponent{
  constructor(props){
    super(props)
    this.componentIsMounted = true
  }

  ForceUpdate = () => {
    if(this.componentIsMounted){
      this.forceUpdate()
    }
  }

  render(){
    const cardsLeft = 40 - this.props.cardsDealt
    return(
      <View 
       styles = {[styles.mainContainer, this.props.style]}
      >
        {cardsLeft > 0 &&
        <Image 
         source= {this.props.lastCard.image}
         style = {[styles.image, {position: 'absolute', transform:[{rotate: '90deg'}]}]}
        />
        }
        {cardsLeft > 1 &&
        <Image 
        source= {cardBackgroundImage}
        style = {[styles.image]}
        />
        }

        {cardsLeft == 4 && 
          <Text style = {styles.textWarning}>! ! ! !</Text>
        }
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
    position: 'absolute',
  },

  textWarning:{
    fontSize: 30,
    fontWeight: 'bold',
    color: 'red',
    position: 'absolute'
  }
})