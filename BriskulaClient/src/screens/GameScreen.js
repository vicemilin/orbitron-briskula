import React, { PureComponent } from 'react'
import { View, Text, StyleSheet, StatusBar, ImageBackground } from 'react-native'
import { NavigationEvents } from 'react-navigation';

import { ScreenWidth, ScreenHeight, Match } from '../classes'
import { CardsContainer } from '../containers'

const bgImage = require('../../assets/background.jpg')

export default class GameScreen extends PureComponent{
  static navigationOptions = {
    header: null,
    title: 'Game'
  }

  constructor(props){
    super(props)
    this.match = new Match()

    this.onCardPlayed = this.onCardPlayed.bind(this)
    this.onHandDone = this.onHandDone.bind(this)
    this.onCollectingDone = this.onCollectingDone.bind(this)
    this.onGameOver = this.onGameOver.bind(this)

    this.cards;
  }

  componentDidMount = () => {
    if(this.match.game.move == 1){
      this.playAIMove()
    }
  }

  playAIMove = () => {
    setTimeout(()=>{
      const m = this.match.playAIMove()
      this.cards.playCard(1, m)
    }, 600)
  }

  onCardPlayed = () => {
    if(this.match.game.move == 1 && this.match.game.playedCards.length < 4){
      this.playAIMove()
    }
  }

  onCollectingDone = () => {
    this.forceUpdate()
  }

  onGameOver = () => {
    this.match.nextGame()
    this.cards.StartGame()
    this.forceUpdate()
    this.onHandDone()
  }

  onHandDone = () => {
    if(this.match.game.move == 1){
      this.playAIMove()
    }
  }

  render(){
    return(
      <ImageBackground style = {styles.mainContainer} source = {bgImage}>
        <StatusBar hidden = {true}/>
        <View style = {styles.info}>
          <Text style = {styles.gamesText}>{this.match.gamesWon[1]}</Text>
          <Text style = {styles.pointsText}>Punti: {this.match.game.points[1]}</Text>
        </View>

        <CardsContainer 
         ref = {ref => (this.cards = ref)}
         onCardPlayed = {this.onCardPlayed}
         game = {this.match.game}
         onHandDone = {this.onHandDone}
         onCollectingDone = {this.onCollectingDone}
         onGameOver = {this.onGameOver}
        />

        <View style = {styles.info}>
          <Text style = {styles.gamesText}>{this.match.gamesWon[0]}</Text>
          <Text style = {styles.pointsText}>Punti: {this.match.game.points[0]}</Text>
        </View>
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
  },

  info: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: ScreenWidth*0.9
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
  }
})