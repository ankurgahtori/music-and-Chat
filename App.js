import React, {useState, useEffect, useMemo} from 'react';
import {ActivityIndicator} from 'react-native';
import auth from '@react-native-firebase/auth';
import SignOutScreens from './src/signoutscreens/index';
import SignInScreens from './src/signinScreens/index';
import 'react-native-gesture-handler';
import SplashScreen from 'react-native-splash-screen';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';

const Stack = createStackNavigator();
const App = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(userInfo => {
      if (userInfo) {
        setUser(userInfo);
      } else {
        setUser();
      }
      SplashScreen.hide();
      setInitializing(false);
    });
    return subscriber;
  }, []);
  if (initializing) {
    return <ActivityIndicator size="large" />;
  }
  return (
    <NavigationContainer>
      <Stack.Navigator headerMode="none">
        {user ? (
          <Stack.Screen
            name="SignInScreens"
            component={SignInScreens}
            initialParams={{phoneNumber: user.phoneNumber}}
          />
        ) : (
          <Stack.Screen name="SignOutScreens" component={SignOutScreens} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
