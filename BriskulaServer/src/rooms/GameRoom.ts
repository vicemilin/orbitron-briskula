import { Room, Client } from 'colyseus'
import { Game } from '../schemas/Game'

const TURN_TIMEOUT = 10

export default class GameRoom extends Room{
  game: Game
  handWon: number
  gameOver: boolean
  gamesWon: Array<number>
  playersInfo: Array<any>
  gamesToWin: number
  firstMove: number

  constructor(props: any){
    super(props)
    this.maxClients = 2
    this.gamesToWin = 2

    this.game = new Game()
    this.handWon = -1
    this.gameOver = false

    this.firstMove = this.game.move
    this.gamesWon = [0, 0]
    this.playersInfo = []
  }
  // When room is initialized
  onInit (options: any) {
    console.log("New game created")
  }

  // Checks if a new client is allowed to join. (default: `return true`)
  requestJoin (options: any, isNew: boolean) { 
    return true
  }

  // Authorize client based on provided options before WebSocket handshake is complete
  //onAuth (options: any) { }

  // When client successfully join the room
  onJoin (client: Client, options: any, auth: any) { 
    this.game.addPlayer(client)
    console.log(client.sessionId)
    this.playersInfo.push(client.sessionId)

    if (this.game.players.length > 1) {
      //this.randomMoveTimeout = this.clock.setTimeout(this.doRandomMove.bind(this, client), TURN_TIMEOUT * 1000);

      // lock this room for new users
      console.log("Game ready")
      this.game.dealCards()
      this.lock()

      this.updateClients()
    }
  }

  updateClients = () => {
    let handWonPlayerOne, handWonPlayerTwo

    if(this.handWon == -1){
      handWonPlayerOne = -1
      handWonPlayerTwo = -1
    }
    else{
      handWonPlayerOne = this.handWon == 0? 0: 1
      handWonPlayerTwo = this.handWon == 1? 0: 1
    }

    if(this.game.cardsDealt == 40 && this.game.playerOneCards.length == 0 && this.game.playerTwoCards.length == 0){
      this.gameOver = true
    }

    this.send(this.clients[0], {
      playersInfo: this.playersInfo,
      gamesWon: this.gamesWon,
      move: this.game.move == 0? 0: 1,
      playerCards: this.game.playerOneCards,
      playedCards: this.game.playedCards,
      rivalCards: this.game.playerTwoCards.length,
      points: this.game.points,
      cardsDealt: this.game.cardsDealt,
      lastCard: this.game.deck[39],
      handWon: handWonPlayerOne,
      gameOver: this.gameOver
    })
    this.send(this.clients[1], {
      playersInfo: this.playersInfo.reverse(),
      gamesWon: this.gamesWon.reverse(),
      move: this.game.move == 1? 0: 1,
      playerCards: this.game.playerTwoCards,
      playedCards: this.game.playedCards,
      rivalCards: this.game.playerOneCards.length,
      points: this.game.points.reverse(),
      cardsDealt: this.game.cardsDealt,
      lastCard: this.game.deck[39],
      handWon: handWonPlayerTwo,
      gameOver: this.gameOver
    })

    if(this.gameOver){
      setTimeout(() => {
        this.goToNextGame()
      }, 4000)
    }

    this.handWon = -1
  }

  goToNextGame = () => {
    const winner = this.game.checkWin()
    this.game = new Game()
    if(winner > 0){
      this.gamesWon[winner]++
      this.game.move = 1-this.firstMove
    }
    this.handWon = -1
    this.gameOver = false
    this.game.dealCards()
    this.updateClients()
  }

  onMatchOver = () => {

  }

  onCardPlayed = (player: number, card: any) => {
    if(this.game.move != player){
      return
    }
    let index
    if(player == 0){
      index = this.getCardIndex(this.game.playerOneCards, card)
    }
    else{
      index = this.getCardIndex(this.game.playerTwoCards, card)
    }

    if(index < 0){
      //Bad Message
      return
    }

    this.game.playCard(player, index)
    if(this.game.playedCards.length == 4){
      const winner = this.game.checkGameOver()
      this.game.move = winner
      this.handWon = winner
      this.game.setHandPoints()
      this.game.playedCards = []
      this.game.dealCards()
    }
    this.updateClients()
  }

  getCardIndex = (hand: Array<any>, card: any) => {
    for(let i = 0; i < hand.length; i++){
      if(hand[i].number == card.number && hand[i].color == card.color) return i
    }

    return -1
  }

  // When a client sends a message
  onMessage (client: Client, message: any) { 
    console.log("Got message from " + client.sessionId + " : " + message)
    if(message.card){
      if(client.sessionId === this.clients[0].sessionId){
        this.onCardPlayed(0, message.card)
      }
      if(client.sessionId === this.clients[1].sessionId){
        this.onCardPlayed(1, message.card)
      }
    }
  }

  // When a client leaves the room
  async onLeave (client: Client, consented: boolean) { 
    // flag client as inactive for other users
    const index = client.sessionId === this.clients[0].sessionId ? 0 : 1
    if(index < 0) return
    this.game.players[index].connected = false

    try {
      if (consented) {
          throw new Error("consented leave");
      }

      // allow disconnected client to rejoin into this room until 20 seconds
      await this.allowReconnection(client, 20);

      // client returned! let's re-activate it.
      this.state.players[index].connected = true;

    } catch (e) {

      // 20 seconds expired. let's remove the client.
      delete this.clients[index]
    }
  }

  doRandomMove(){

  }

  // Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
  onDispose () { }
}