import { HomeScreen, LoginScreen, GameScreen } from './src/screens'
import MultiPlayerGame from './src/multiPlayer/MultiPlayerGame'

import { createStackNavigator, createAppContainer } from 'react-navigation'

import { AsyncStorage } from 'react-native';
import { Buffer } from "buffer";

window.localStorage = AsyncStorage
global.Buffer = Buffer;

const MainNavigator = createStackNavigator({
  Home: {screen: HomeScreen},
  Login: {screen: LoginScreen},
  Game: {screen: GameScreen},
  MultiPlayer: {screen: MultiPlayerGame}
})

const App = createAppContainer(MainNavigator)

export default App