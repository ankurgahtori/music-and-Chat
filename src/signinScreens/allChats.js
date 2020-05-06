import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import firestore from '@react-native-firebase/firestore';

const ChatHomepageScreen = ({route, navigation}) => {
  const [users, setUsers] = useState([]);
  const userId = route.params.phoneNumber;
  useEffect(() => {
    const subscriber = firestore()
      .collection('Users')
      .doc(userId)
      .onSnapshot(documentSnapshot => {
        let connections = documentSnapshot.data().connections;
        connections?.forEach(async element => {
          await element
            .get()
            .then(result => {
              let user = result.data();
              setUsers(data => {
                return [...data, {phoneNumber: result.id, name: user.name}];
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
    <>
      <SafeAreaView>
        <View
          style={{
            backgroundColor: '#1A4457',
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            style={{alignSelf: 'center'}}
            onPress={() => {
              navigation.openDrawer();
            }}>
            <Icon2 name="more-vert" size={30} color="white" />
          </TouchableOpacity>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 30,
              paddingHorizontal: 5,
              color: 'white',
            }}>
            MusicAndChat
          </Text>
        </View>
        <FlatList
          style={{backgroundColor: '#8FCED6'}}
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
      </SafeAreaView>
    </>
  );
};
export default ChatHomepageScreen;
const ContactComponent = ({user, navigation, currentUser}) => {
  return (
    <TouchableOpacity
      style={{height: Dimensions.get('screen').height / 9}}
      onPress={() => {
        navigation.navigate('singleChat', {
          user: user,
          currentUser: currentUser,
        });
      }}>
      <View style={{flexDirection: 'row'}}>
        <Icon name="account" size={50} />
        <View
          style={{
            borderBottomColor: 'white',
            borderBottomWidth: 1,
            flex: 1,
            marginHorizontal: 5,
          }}>
          <Text style={{justifyContent: 'center', fontSize: 20}}>
            {user.name}
          </Text>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text>Last message message sent...</Text>
            <Text> 1 hour ago</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
