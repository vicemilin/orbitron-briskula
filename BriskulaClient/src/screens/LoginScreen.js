import React, { PureComponent } from 'react'
import { View, StyleSheet, StatusBar, Button } from 'react-native'
import { NavigationEvents } from 'react-navigation';

import { ScreenWidth, ScreenHeight } from '../classes'

import * as Colyseus from "colyseus.js"


export default class LoginScreen extends PureComponent{
  static navigationOptions = {
    header: null,
    title: 'Login'
  }

  constructor(props){
    super(props)
    this.url = this.props.navigation.getParam("url")
    this.client = new Colyseus.Client(this.url)

    this.onConnectionOpened = this.onConnectionOpened.bind(this)

    this.client.onOpen.add(() => {
      let room = this.client.join("game")
      room.onMessage.add((data)=>{
        console.warn(data)
      })
    })

  }

  componentDidMount(){
  }

  onConnectionOpened(){
    this.client.join("game")
  }

  render(){
    return(
      <View style = {styles.mainContainer}>
        <StatusBar hidden = {true}/>
        <Button title = "Home"  onPress= {() => this.props.navigation.navigate('Home')}></Button>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#FFFF00"
  }
})