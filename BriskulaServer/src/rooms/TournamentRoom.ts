import { Room, Client } from 'colyseus'

export default class TournamentRoom extends Room{
  constructor(props: any){
    super(props)
    this.maxClients = 2
  }
  // When room is initialized
  onInit (options: any) { 
    console.log("initedRoom")
  }

  // Checks if a new client is allowed to join. (default: `return true`)
  requestJoin (options: any, isNew: boolean) { 
    return true
  }

  // Authorize client based on provided options before WebSocket handshake is complete
  //onAuth (options: any) { }

  // When client successfully join the room
  onJoin (client: Client, options: any, auth: any) { 
    console.log(client.sessionId)
  }

  // When a client sends a message
  onMessage (client: Client, message: any) { 
    
  }

  // When a client leaves the room
  async onLeave (client: Client, consented: boolean) { 

      await this.allowReconnection(client, 20);
  }

  doRandomMove(){

  }

  // Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
  onDispose () { }
}