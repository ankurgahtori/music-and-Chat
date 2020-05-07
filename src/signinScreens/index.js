import React from 'react';
import Logout from './logoutScreen';
import {createDrawerNavigator} from '@react-navigation/drawer';
import HomeNavigator from './homeNavigator';
import ContactsScreen from './contactScreen';
const Drawer = createDrawerNavigator();

const SignInScreens = ({route}) => {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen
        name="Home"
        component={HomeNavigator}
        initialParams={route.params}
      />
      <Drawer.Screen
        name="Contact"
        component={ContactsScreen}
        initialParams={route.params}
      />
      <Drawer.Screen name="Logout" component={Logout} />
    </Drawer.Navigator>
  );
};
export default SignInScreens;
