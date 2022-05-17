import React, { PureComponent } from 'react'
import { View, StyleSheet, StatusBar, Button, ImageBackground } from 'react-native'
import { NavigationEvents } from 'react-navigation';

import { ScreenWidth, ScreenHeight, Game } from '../classes'

import { Card } from '../components'
import { CardsContainer } from '../containers'

const bgImage = require('../../assets/background.jpg')

export default class HomeScreen extends PureComponent{
  static navigationOptions = {
    header: null,
    title: 'Home'
  }

  constructor(props){
    super(props)

    this.goToGame = this.goToGame.bind(this)
    this.goToMultiPlayerGame = this.goToMultiPlayerGame.bind(this)
    this.changeUrl = this.changeUrl.bind(this)

    this.urls = ["ws://10.0.2.2:3000", "ws://192.168.1.8:3000"]
    this.url = 0
  }

  goToGame = () => {
    this.props.navigation.navigate("Game")
  }

  goToMultiPlayerGame(){
    this.props.navigation.navigate("MultiPlayer", {url: this.urls[this.url]})
  }

  changeUrl = () => {
    this.url = 1 - this.url
    this.forceUpdate()
  }

  render(){
    return(
      <ImageBackground style = {styles.mainContainer} source = {bgImage}>
        <StatusBar hidden = {true}/>
        <Button title = {"url: " + this.urls[this.url]} onPress = {this.changeUrl}/>
        <Button title = "play" onPress = {this.goToGame}/>
        <Button title = "Multiplayer" onPress = {this.goToMultiPlayerGame}/>
      </ImageBackground>
    )
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#00FFFF",
    alignItems: 'center',
    justifyContent: 'center'
  }
})