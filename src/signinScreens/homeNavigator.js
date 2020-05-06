import React, {useCallback} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ChatHomepageScreen from './allChats';
import SingleChatScreen from './personToPersonChat';

const homeNavigator = createStackNavigator();
const HomeNavigator = ({route, navigation}) => {
  return (
    <homeNavigator.Navigator headerMode="none">
      <homeNavigator.Screen
        name="allChats"
        component={ChatHomepageScreen}
        initialParams={{
          phoneNumber: route.params.phoneNumber,
          navigation: navigation,
        }}
      />
      <homeNavigator.Screen name="singleChat" component={SingleChatScreen} />
    </homeNavigator.Navigator>
  );
};
export default HomeNavigator;
