export default class AI{
  constructor(game){
    this.game = game
  }

  makeMove = () => {
    return Math.floor(Math.random() * 100000) % this.game.rivalCards.length
  }
}