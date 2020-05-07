import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import firestore from '@react-native-firebase/firestore';
import ContactComponent from '../components/contactRow';

const ChatHomepageScreen = ({route, navigation}) => {
  const [users, setUsers] = useState([]);
  const userId = route.params.phoneNumber;
  useEffect(() => {
    const subscriber = firestore()
      .collection('Users')
      .doc(userId)
      .onSnapshot(documentSnapshot => {
        setUsers([]);
        let connections = documentSnapshot.data().connections;
        connections?.forEach(async element => {
          await element
            .get()
            .then(result => {
              let user = result.data();
              setUsers(data => {
                return [
                  ...data,
                  {phoneNumber: result.id, name: user.name, image: user?.image},
                ];
              });
            })
            .catch(err => {
              console.log(err);
            });
        });
      });

    // Stop listening for updates when no longer required
    return () => subscriber();
  }, [userId]);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            navigation.openDrawer();
          }}>
          <Icon2 name="more-vert" size={30} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>MusicAndChat</Text>
      </View>
      <View style={styles.content}>
        <FlatList
          style={{}}
          data={users}
          renderItem={({item}) => (
            <ContactComponent
              user={item}
              navigation={navigation}
              currentUser={userId}
            />
          )}
          keyExtractor={item => item.phoneNumber}
          key={item => {
            item.phoneNumber;
          }}
        />
      </View>
    </View>
  );
};
export default ChatHomepageScreen;
const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#8FCED6'},
  header: {
    backgroundColor: '#1A4457',
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    textAlign: 'center',
    fontSize: 30,
    paddingHorizontal: 5,
    color: 'white',
  },
  content: {flex: 9},
});
