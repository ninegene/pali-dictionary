import { AppRegistry } from 'react-native';
import App from './src/components/App';

class Root extends App {
  // code specific to ios
}

Root.defaultProps = {
  ...App.defaultProps,
  instructions: 'Press Cmd+R to reload,\nCmd+D or shake for dev menu',
};

AppRegistry.registerComponent('PaliDict', () => Root);
