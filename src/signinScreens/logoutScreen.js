import React, {useState, useEffect, useContext} from 'react';
import {View, Text, Button, TextInput} from 'react-native';
import {AuthContext} from '../Contexts/context';
import auth from '@react-native-firebase/auth';

const Logout = () => {
  const {signOut} = useContext(AuthContext);
  return (
    <Button
      title="logout"
      onPress={() => {
        auth().signOut();
        signOut();
      }}
    />
  );
};

export default Logout;
