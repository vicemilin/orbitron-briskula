import createDeck from './Card'

const shuffleArray = (array) => {
  let currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

export default class Game{
  constructor(){
    this.deck = createDeck()
    shuffleArray(this.deck)
    this.cardsDealt = 0

    this.playerCards = []
    this.rivalCards = []
    this.playedCards = []

    this.adut = this.deck[this.deck.length - 1].color

    this.deckPoints = [11, 0, 10, 0, 0, 0, 0, 2, 3, 4]
    this.points = [0, 0]

    this.move = Math.random() < 0.5 ? 0 : 1
  }

  reset = () => {
    this.deck = createDeck()
    shuffleArray(this.deck)
    this.cardsDealt = 0

    this.playerCards = []
    this.rivalCards = []
    this.playedCards = []

    this.adut = this.deck[this.deck.length - 1].color

    this.deckPoints = [11, 0, 10, 0, 0, 0, 0, 2, 3, 4]
    this.points = [0, 0]
  }

  _dealCard = (player) => {
    if(player == 0){
      this.playerCards.push(this.deck[this.cardsDealt])
    }
    if(player == 1){
      this.rivalCards.push(this.deck[this.cardsDealt])
    }

    this.cardsDealt++
  }

  dealCards = () =>{
    if(this.cardsDealt == 40){
      return
    }
    let i = this.move
    while(this.playerCards.length < 4 || this.rivalCards.length < 4){
      this._dealCard(i)
      i = 1 - i
    }
  }

  playCard = (player, i) => {
    if(this.move != player || this.playedCards.length == 4) return

    if(player == 0){
      this.playedCards.push(this.playerCards[i])
      this.playerCards.splice(i, 1)
    }

    if(player == 1){
      this.playedCards.push(this.rivalCards[i])
      this.rivalCards.splice(i, 1)
    }

    this.move = 1 - this.move
  }

  setHandPoints = () => {
    this.points[this.move] += this.getHandPoints()
  }

  getHandPoints = () => {
    //Returns number of points of played hand
    let points = 0
    for(let i = 0; i < 4; i++){
      points += this.deckPoints[this.playedCards[i].number]
    }
    return points
  }

  checkWin = () => {
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

  checkGameOver = () => {
    if(this.points[0] > 60){
      return 0
    }
    if(this.points[1] > 60){
      return 1
    }
    return -1
  }
}