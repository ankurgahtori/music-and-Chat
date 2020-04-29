import React, {useState, useEffect, useMemo} from 'react';
import {View, Text, Button, TextInput, ActivityIndicator} from 'react-native';
import auth from '@react-native-firebase/auth';
import {AuthContext} from './src/Contexts/context';
import SignOutScreen from './src/signoutscreens/index';
import SignInScreens from './src/signinScreens/index';
const App = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const authContext = useMemo(
    () => ({
      signIn: data => {
        setUser(data);
      },
      signOut: () => {
        setUser();
      },
    }),
    [],
  );
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(user => {
      if (user) {
        console.log('user');
        setUser(user);
      } else {
        console.log('signout');
      }
      setInitializing(false);
    });
    return subscriber;
  }, []);
  if (initializing) {
    return <ActivityIndicator size="large" />;
  }
  console.log(user, 'user');
  return (
    <AuthContext.Provider value={authContext}>
      {user ? <SignInScreens /> : <SignOutScreen />}
    </AuthContext.Provider>
  );
};

export default App;
