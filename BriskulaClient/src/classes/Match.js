import Game from './Game'
import AI from './AI'

export default class Match{
  constructor(){
    this.players = []
    this.gamesWon = [0, 0]
    this.game = new Game()
    this.dealing = 0 
    this.AI = new AI(this.game)
  }

  reset = () => {
    this.players = []
    this.gamesWon = [0, 0]
    this.game = new Game()
    this.dealing = 0
    this.AI = new AI(this.game)
  }

  nextGame = () => {
    const winner = this.game.checkGameOver()

    if(winner >= 0){
      this.gamesWon[winner]++
      this.game.reset()
      this.dealing = 1-this.dealing
      this.game.move = this.dealing
    }
    else{
      this.game.reset()
      this.game.move = this.dealing
    }
  }

  playAIMove = () => {
    return this.AI.makeMove()
  }
}