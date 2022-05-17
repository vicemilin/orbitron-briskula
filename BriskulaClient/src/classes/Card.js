const cardImages = [
  require('../../assets/cards/b0.jpg'),
  require('../../assets/cards/b1.jpg'),
  require('../../assets/cards/b2.jpg'),
  require('../../assets/cards/b3.jpg'),
  require('../../assets/cards/b4.jpg'),
  require('../../assets/cards/b5.jpg'),
  require('../../assets/cards/b6.jpg'),
  require('../../assets/cards/b7.jpg'),
  require('../../assets/cards/b8.jpg'),
  require('../../assets/cards/b9.jpg'),

  require('../../assets/cards/d0.jpg'),
  require('../../assets/cards/d1.jpg'),
  require('../../assets/cards/d2.jpg'),
  require('../../assets/cards/d3.jpg'),
  require('../../assets/cards/d4.jpg'),
  require('../../assets/cards/d5.jpg'),
  require('../../assets/cards/d6.jpg'),
  require('../../assets/cards/d7.jpg'),
  require('../../assets/cards/d8.jpg'),
  require('../../assets/cards/d9.jpg'),

  require('../../assets/cards/k0.jpg'),
  require('../../assets/cards/k1.jpg'),
  require('../../assets/cards/k2.jpg'),
  require('../../assets/cards/k3.jpg'),
  require('../../assets/cards/k4.jpg'),
  require('../../assets/cards/k5.jpg'),
  require('../../assets/cards/k6.jpg'),
  require('../../assets/cards/k7.jpg'),
  require('../../assets/cards/k8.jpg'),
  require('../../assets/cards/k9.jpg'),

  require('../../assets/cards/s0.jpg'),
  require('../../assets/cards/s1.jpg'),
  require('../../assets/cards/s2.jpg'),
  require('../../assets/cards/s3.jpg'),
  require('../../assets/cards/s4.jpg'),
  require('../../assets/cards/s5.jpg'),
  require('../../assets/cards/s6.jpg'),
  require('../../assets/cards/s7.jpg'),
  require('../../assets/cards/s8.jpg'),
  require('../../assets/cards/s9.jpg')
]

export class Card{
  constructor(number, color){
    this.number = number
    this.color = color
    this.image = CardToImage(this)
  }
}

const CardToImage = (card) => {
  if(card.color == 'b'){
    return cardImages[card.number]
  }
  if(card.color == 'd'){
    return cardImages[card.number + 10]
  }
  if(card.color == 'k'){
    return cardImages[card.number + 20]
  }
  if(card.color == 's'){
    return cardImages[card.number + 30]
  }
}

export const createDeck = () => {
  const colors = ['b', 'd', 'k', 's']
  const temp = []
  colors.forEach((color) => {
    for(let i = 0; i < 10; i++){
      temp.push(new Card(i, color))
    }
  })

  return temp
}
