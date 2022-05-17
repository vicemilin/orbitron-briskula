import { Server } from "colyseus"
import { createServer } from "http"
const port = Number(process.env.port || 3000)

import GameRoom from './src/rooms/GameRoom'
import TournamentRoom from './src/rooms/TournamentRoom'

const gameServer = new Server({
  server: createServer()
})

gameServer.register("game", GameRoom)
gameServer.register("tour", TournamentRoom)

gameServer.listen(port)