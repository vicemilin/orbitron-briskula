import React, { PureComponent } from 'react'
import { View, Text, Animated, Easing, StyleSheet, ImageBackground, ActivityIndicator } from 'react-native'

import { ScreenWidth, ScreenHeight, BackgroundImage, CardClass} from '../classes'
import { Card, Deck } from '../components'

import * as Colyseus from "colyseus.js"

import { NavigationEvents } from 'react-navigation';

export default class MultiPlayerGame extends PureComponent{
  static navigationOptions = {
    header: null,
    title: 'Multiplayer'
  }
  constructor(props){
    super(props)

    this.connected = false
    this.animating = false

    this.url = this.props.navigation.getParam("url")
    this.client
    this.room

    this.move
    this.playerCards
    this.playedCards
    this.rivalCards
    this.points
    this.cardsDealt
    this.lastCard
    this.handWon
    this.gameOver
    this.playersInfo
    this.gamesWon


    this.playedCardsPosition = new Animated.Value(0)

    this.cardPressed = this.cardPressed.bind(this)
    //this.onServerMessage = this.onServerMessage.bind(this)
  }

  ForceUpdate = () => {
    if(this.componentIsMounted){
      this.forceUpdate()
      //this.refs.deck.ForceUpdate()
    }
  }

  componentDidMount(){
    this.componentIsMounted = true
    this.client = new Colyseus.Client(this.url)
    this.client.onOpen.add(() => {
      this.room = this.client.join('game')
      this.room.onMessage.add((data) => {
        this.onServerMessage(data)
      })
    })
  }

  onServerMessage = (message) => {
    this.connected = true

    this.playersInfo = message.playersInfo
    this.gamesWon = message.gamesWon
    this.move = message.move
    this.playerCards = message.playerCards.map((card) => new CardClass(card.number, card.color))
    this.playedCards = message.playedCards.map((card) => new CardClass(card.number, card.color))
    const rivalCardsNumber = message.rivalCards
    this.rivalCards = []
    for(let i = 0; i < rivalCardsNumber; i++){
      this.rivalCards.push(0)
    }
    this.points = message.points
    this.cardsDealt = message.cardsDealt
    this.lastCard = new CardClass(message.lastCard.number, message.lastCard.color)
    this.gameOver = message.gameOver
    this.handWon = message.handWon

    if(this.handWon >= 0){
      this.AnimateCollecting(this.handWon)
    }
    else{ 
      this.ForceUpdate()
    }
  }

  AnimateCollecting = (player) => {
    const endPosition = player == 0 ? ScreenHeight : -ScreenHeight
    Animated.timing(this.playedCardsPosition, {
      toValue: endPosition,
      easing: Easing.linear,
      delay: 500,
      duration: 500,
      useNativeDriver: true
    }).start(() => {
      Animated.timing(this.playedCardsPosition, {
        toValue: 0,
        easing: Easing.linear,
        duration: 0,
        useNativeDriver: true
      }).start()
      this.ForceUpdate()
    })
  }

  onGameOver = () => {

  }

  cardPressed = (n) => () => {
    if(this.playedCards.length == 4 || this.move != 0 || this.animating){
      //this.AnimateCollecting(player)
      return
    }

    this.room.send({
      card: {number: this.playerCards[n].number, color: [this.playerCards[n].color]}
    })
    this.playedCards.push(this.playerCards[n])
    this.playerCards.splice(n,1)
    this.ForceUpdate()
  }

  render(){
    if(this.connected == false){
      return(
      <ImageBackground style = {[styles.mainContainer, {alignItems: 'center', justifyContent: 'center'}]} source = {BackgroundImage}>
        <ActivityIndicator />
      </ImageBackground>)
    }
    else{
    return(
      <ImageBackground style = {styles.mainContainer} source = {BackgroundImage}>
        <View style = {styles.rivalContainer}>
          <Text style = {styles.gamesText}>{this.gamesWon[1]}</Text>
          <Text style = {styles.gamesText}>{this.playersInfo[1]}</Text>
          {this.gameOver == true && <Text style = {styles.pointsText}>Punti: {this.points[1]}</Text>}
        </View>

        <View style = {styles.cardsContainer}>
          <View style = {styles.rivalCardsContainer}>
            {this.rivalCards.map((card, index) => 
              <View 
              key = {index}
              style = {{position: 'absolute', top: 0, left: index * ScreenWidth/8 + 20}}
              >
                <Card />
              </View>
            )}

            {this.move == 1 &&
              <View style = {styles.turnView}></View>
            } 
          </View>

          <View styles = {styles.middleContainer}>
            <Animated.View style = {[styles.playedCardsContainer, {transform: [{translateY: this.playedCardsPosition}]}]}>
              {this.playedCards.map((card, index) => 
                <View 
                key = {index}
                style = {{position: 'absolute', left: index * ScreenWidth/8 + 20}}
                >
                  <Card card = {card}/> 
                </View>
              )}
            </Animated.View>

            <View style = {styles.deckContainer}>
              <Deck cardsDealt = {this.cardsDealt} lastCard = {this.lastCard}/>
            </View>
          </View>

          <View style = {styles.playerCardsContainer}>
            {this.playerCards.map((card, index) => 
              <View 
              key = {index} 
              style = {{position: 'absolute', bottom: 0, left: index * ScreenWidth/8 + 20}}
              >
                <Card card = {card} onPress = {this.cardPressed(index)}/>
              </View>
            )}
            
            {this.move == 0 &&
              <View style = {styles.turnView}></View>
            }
          </View>

        </View>

        <View style = {styles.playerContainer}>
          <Text style = {styles.gamesText}>{this.gamesWon[0]}</Text>
          <Text style = {styles.gamesText}>{this.playersInfo[0]}</Text>
          {this.gameOver == true && <Text style = {styles.pointsText}>Punti: {this.points[0]}</Text>}
        </View>
      </ImageBackground>
    )}
  }
}

const styles = StyleSheet.create({
  mainContainer:{
    flex:1
  },

  cardsContainer:{
    width: ScreenWidth,
    height: ScreenHeight*0.8
  },

  rivalContainer: {
    width: ScreenWidth,
    height: ScreenHeight/20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },

  playerContainer: {
    width: ScreenWidth,
    height: ScreenHeight/20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },

  playerCardsContainer: {
    width: ScreenWidth,
    height: ScreenHeight*0.2
  },

  rivalCardsContainer: {
    width: ScreenWidth,
    height: ScreenHeight*0.2
  },

  middleContainer: {
    width: ScreenWidth,
    height: ScreenHeight*0.4,
    flexDirection: 'row',
    alignItems: 'center'
  },

  deckContainer:{
    position: 'absolute',
    right: ScreenHeight/8,
    top: ScreenHeight/16,
  },

  playedCardsContainer: {
    width: ScreenWidth,
    height: ScreenHeight*0.4,
    flexDirection: 'row',
    alignItems: 'center'
  },

  turnView:{
    position: 'absolute',
    width: ScreenWidth/12,
    height: ScreenWidth/12,
    borderRadius: ScreenWidth/24,
    backgroundColor: 'blue',
    bottom: ScreenHeight*0.8/8,
    right: ScreenWidth/12
  },

  gamesText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'blue',
  },

  pointsText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },

  playerNameText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
  }
})