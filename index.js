/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

// import i18n (needs to be bundled ;))
import './src/translations/index';

AppRegistry.registerComponent(appName, () => App);
