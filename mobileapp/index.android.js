import { AppRegistry } from 'react-native';
import App from './src/components/App';

class Root extends App {
  // code specific to android
}

Root.defaultProps = {
  ...App.defaultProps,
  instructions: 'Shake or press menu button for dev menu',
};

AppRegistry.registerComponent('PaliDict', () => Root);
