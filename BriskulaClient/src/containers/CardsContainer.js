import React, { PureComponent } from 'react'
import { View, Animated, Easing, StyleSheet } from 'react-native'

import { ScreenWidth, ScreenHeight } from '../classes'
import { Card, Deck } from '../components'

const width = ScreenWidth
const height = ScreenHeight*0.85

export default class CardsContainer extends PureComponent{
  constructor(props){
    super(props)
    this.componentIsMounted = true

    //this.cardPressed = this.cardPressed.bind(this)

    this.dealingCardPosition = new Animated.Value(0)
    this.playedCardsPosition = new Animated.Value(0)

    this.animating = false

    this.collectingFinished = this.collectingFinished.bind(this)
    this.dealingCardFinished = this.dealingCardFinished.bind(this)
    this.AnimateCollecting = this.AnimateCollecting.bind(this)
    this.onHandDone = this.onHandDone.bind(this)
  }

  ForceUpdate = () => {
    if(this.componentIsMounted){
      this.forceUpdate()
      this.refs.deck.ForceUpdate()
    }
  }

  StartGame = () => {
    Animated.timing(this.dealingCardPosition,{
      toValue: 0,
      duration: 0,
      useNativeDriver: true
    }).start()
    Animated.timing(this.playedCardsPosition,{
      toValue: 0,
      duration: 0,
      useNativeDriver: true
    }).start()
    this.animating = false
    this.props.game.dealCards()
    this.ForceUpdate()
  }

  componentDidMount(){
    this.props.game.dealCards()
    this.ForceUpdate()
  }

  playCard = (player, n) => {
    this.props.game.playCard(player, n)
    if(this.props.game.playedCards.length == 4){
      setTimeout(this.onHandDone(this.props.game.checkWin()), 1000)
    }
    if(player == 0){
      this.props.onCardPlayed()
    }
    this.ForceUpdate()
  }

  cardPressed = (player, n) => () => {
    if(this.animating || player != this.props.game.move) return
    if(this.props.game.playedCards.length == 4){
      //this.AnimateCollecting(player)
      return
    }

    this.playCard(player, n)
  }

  onHandDone = (winningPlayer) => () => {
    this.props.game.move = winningPlayer
    this.props.game.setHandPoints()

    this.AnimateCollecting(winningPlayer)
  }

  DealCards = () => {
    if(this.props.game.cardsDealt == 40){
      this.animating = false
      this.ForceUpdate()
      this.props.onHandDone()
      return
    }
    if(this.props.game.playerCards.length == 4 && this.props.game.rivalCards.length == 4){
      this.animating = false
      this.ForceUpdate()
      this.props.onHandDone()
      return
    }

    this.props.game._dealCard(this.props.game.move)
    this.AnimateDealingCard(this.props.game.move)
  }

  AnimateDealingCard = (player) => {
    const endPosition = player == 0 ? ScreenWidth*2 : -ScreenWidth*2
    this.animating = true

    Animated.timing(this.dealingCardPosition,{
      toValue: endPosition,
      easing: Easing.linear,
      duration: 500,
      useNativeDriver: true
    }).start(this.dealingCardFinished)
  }

  AnimateCollecting = (player) => {
    const endPosition = player == 0 ? ScreenWidth*2 : -ScreenWidth*2
    this.animating = true

    Animated.timing(this.playedCardsPosition,{
      toValue: endPosition,
      easing: Easing.linear,
      duration: 500,
      useNativeDriver: true
    }).start(this.collectingFinished)
  }

  dealingCardFinished = () => {
    Animated.timing(this.dealingCardPosition,{
      toValue: 0,
      duration: 0,
      useNativeDriver: true
    }).start()
    this.ForceUpdate()
    this.props.game.move = 1 - this.props.game.move
    this.DealCards()
  }

  collectingFinished = () => {
    this.props.onCollectingDone()
    if(this.props.game.cardsDealt == 40 && this.props.game.playerCards.length == 0){
      this.props.onGameOver()
      return
    }
    this.props.game.playedCards = []
    this.ForceUpdate()
    Animated.timing(this.playedCardsPosition,{
      toValue: 0,
      duration: 0,
      useNativeDriver: true
    }).start()
    this.DealCards()
  }

  render(){
    return(
      <View style = {styles.mainContainer}>
        <View style = {styles.rivalCardsContainer}>
          {this.props.game.rivalCards.map((card, index) => 
            <View 
             key = {index}
             style = {{position: 'absolute', top: 0, left: index * ScreenWidth/8 + 20}}
            >
              <Card />
            </View>
          )}

          {this.props.game.move == 1 && !this.animating &&
          <View style = {styles.turnView}></View>
          } 
        </View>
        
        <View style = {styles.playingAreaContainer}>
          
          <View style = {styles.deck}>
            <Deck cardsDealt = {this.props.game.cardsLeft} lastCard = {this.props.game.deck[39]} ref = "deck"/>
            <Animated.View style = {styles.animatedCard}>
            </Animated.View>
          </View>
          

          <Animated.View style = {[styles.playedCardsContainer, {transform: [{translateY: this.playedCardsPosition}]}]}>
            {this.props.game.playedCards.map((card, index) => 
              <View 
              key = {index}
              style = {{position: 'absolute', left: index * ScreenWidth/8 + 20}}
              >
                <Card card = {card}/>
              </View>
            )}
          </Animated.View>

        </View>

        <View style = {styles.playerCardsContainer}>
          {this.props.game.playerCards.map((card, index) => 
            <View 
             key = {index} 
             style = {{position: 'absolute', bottom: 0, left: index * ScreenWidth/8 + 20}}
            >
              <Card card = {card} onPress = {this.cardPressed(0, index)}/>
            </View>
          )}
          
          {this.props.game.move == 0 && !this.animating &&
          <View style = {styles.turnView}></View>
          }
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    width: width,
    height: height,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  playerCardsContainer: {
    width: width,
    height: height/5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },

  rivalCardsContainer:{
    width: width,
    height: height/5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },

  playingAreaContainer: {
    width: width,
    height: height/2,
    flexDirection: 'row',
    //alignItems: 'center',
    //justifyContent: 'center',
  },

  playedCardsContainer: {
    position: 'absolute',
    left:0,
    top: height/10
  },

  animatedCard: {
    position: 'absolute'
  },

  deck: {
    position: 'absolute',
    right: ScreenWidth/4,
    top: width/8
  },

  turnView:{
    position: 'absolute',
    width: width/12,
    height: width/12,
    borderRadius: width/24,
    backgroundColor: 'blue',
    bottom: width/8,
    right: width/12
  }
})