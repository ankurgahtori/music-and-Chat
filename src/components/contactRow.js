import React from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const ContactComponent = ({user, navigation, currentUser}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        navigation.navigate('singleChat', {
          user: user,
          currentUser: currentUser,
        });
      }}>
      <View style={styles.contactRow}>
        <Icon name="account" size={50} />
        <View style={styles.connectionInfo}>
          <Text style={styles.connectionName}>{user.name}</Text>
          <View style={styles.previousMessageInfo}>
            <Text>Last message message sent...</Text>
            <Text> 1 hour ago</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
export default ContactComponent;
const styles = StyleSheet.create({
  container: {height: Dimensions.get('screen').height / 9},
  contactRow: {flexDirection: 'row'},
  connectionInfo: {
    borderBottomColor: 'white',
    borderBottomWidth: 1,
    flex: 1,
    marginHorizontal: 5,
  },
  connectionName: {justifyContent: 'center', fontSize: 20},
  previousMessageInfo: {flexDirection: 'row', justifyContent: 'space-between'},
});
