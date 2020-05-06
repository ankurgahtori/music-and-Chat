import React, {useState, useEffect, useContext} from 'react';
import {View, Text, Button, TextInput} from 'react-native';
import auth from '@react-native-firebase/auth';

const Logout = () => {
  return (
    <Button
      title="logout"
      onPress={() => {
        auth().signOut();
      }}
    />
  );
};

export default Logout;
