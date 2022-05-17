import { Schema, type, ArraySchema } from '@colyseus/schema'
import { Client } from 'colyseus';

class Card{
  @type("string")
  color: string

  @type("number")
  number: number

  constructor(number: number, color: string){
    this.color = color
    this.number = number
  }
}

function initDeck(): Array<Card>{ 
  const colors = ['b', 'd', 'k', 's']
  const temp : ArraySchema<Card> = new ArraySchema<Card>()

  colors.forEach((color) => {
    for(let i = 0; i < 10; i++){
    temp.push(new Card(i, color))
    }
  })

  let currentIndex = temp.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = temp[currentIndex];
    temp[currentIndex] = temp[randomIndex];
    temp[randomIndex] = temporaryValue;
  }

  return temp;
}

export class Player{
  client: Client
  connected: boolean
  constructor(client: Client){
    this.client = client;
    this.connected = true
  }
}

export class Game{
  deck: Array<Card>
  cardsDealt = 0
  playerOneCards = new Array<Card>()
  playerTwoCards = new Array<Card>()
  playedCards = new Array<Card>()
  adut: string
  deckPoints = [11, 0, 10, 0, 0, 0, 0, 2, 3, 4]
  points = new Array<number>()
  move = Math.random() < 0.5 ? 0 : 1
  players = new Array<Player>()

  constructor(){
    this.deck = initDeck()
    this.adut = this.deck[this.deck.length - 1].color
    this.points.push(0)
    this.points.push(0)
  }

  dealCard = (player: number) => {
    if(player == 0){
      this.playerOneCards.push(this.deck[this.cardsDealt])
    }
    if(player == 1){
      this.playerTwoCards.push(this.deck[this.cardsDealt])
    }

    this.cardsDealt++
  }

  dealCards = () =>{
    if(this.cardsDealt == 40){
      return
    }
    let i = this.move
    while(this.playerOneCards.length < 4 || this.playerTwoCards.length < 4){
      this.dealCard(i)
      i = 1 - i
    }
  }

  playCard = (player : number, i: number) => {
    if(this.move != player || this.playedCards.length == 4) return

    if(player == 0){
      this.playedCards.push(this.playerOneCards[i])
      this.playerOneCards.splice(i, 1)
    }

    if(player == 1){
      this.playedCards.push(this.playerTwoCards[i])
      this.playerTwoCards.splice(i, 1)
    }

    this.move = 1 - this.move
  }

  setHandPoints = () => {
    this.points[this.move] += this.getHandPoints()
  }

  getHandPoints = () : number => {
    //Returns number of points of played hand
    let points = 0
    for(let i = 0; i < 4; i++){
      points += this.deckPoints[this.playedCards[i].number]
    }
    return points
  }

  checkWin = () : number => {
    //Checks which player won the hand
     const firstMove = this.move
     const t = [0,1,0,1,1,0,1,0]
 
     let strongestAdut = -1
 
     for(let i = 0; i < 4; i++){
       if(this.playedCards[i].color == this.adut){
         if(strongestAdut == -1){
           strongestAdut = i
         }
         else{
           if(this.deckPoints[this.playedCards[i].number] == this.deckPoints[this.playedCards[strongestAdut].number]){
             if(this.playedCards[i].number > this.playedCards[strongestAdut].number){
               strongestAdut = i
             }
           }
           if(this.deckPoints[this.playedCards[i].number] > this.deckPoints[this.playedCards[strongestAdut].number]){
             strongestAdut = i
           }
         }
       }
     }
 
     if(strongestAdut >= 0){
       return t[firstMove * 4 + strongestAdut]
     }
 
     let strongestCard = 0
 
     for(let i = 1; i < 4; i++){
       if(this.playedCards[i].color == this.playedCards[strongestCard].color){
         if(this.deckPoints[this.playedCards[i].number] == this.deckPoints[this.playedCards[strongestCard].number]){
           if(this.playedCards[i].number > this.playedCards[strongestCard].number){
             strongestCard = i;
           }
         }
         if(this.deckPoints[this.playedCards[i].number] > this.deckPoints[this.playedCards[strongestCard].number]){
           strongestCard = i;
         }
       }
     }
 
     return t[firstMove * 4 + strongestCard]
   }

  checkGameOver = () : number => {
    if(this.points[0] > 60){
      return 0
    }
    if(this.points[1] > 60){
      return 1
    }
    return -1
  }

  addPlayer = ( client: Client ) => {
    this.players.push(new Player(client))
  }

  getPlayerBySessionId = (sessionId: string) => {
    for(let i = 0; i < this.players.length; i++){
      if(this.players[i].client.sessionId === sessionId){
        return i
      }
    }
    return -1
  }
}