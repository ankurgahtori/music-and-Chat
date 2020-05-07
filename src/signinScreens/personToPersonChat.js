import React, {memo, useEffect, useCallback, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  StyleSheet,
} from 'react-native';
import moment from 'moment';
import firestore, {firebase} from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SingleChatScreen = ({route}) => {
  const [chatId, setchatId] = useState();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState();
  const [loading, setLoading] = useState(true);
  const {user} = route.params;
  const {currentUser} = route.params;
  const makeConnection = useCallback((currentUser, otherUser) => {
    firestore()
      .doc(`Users/${otherUser}`)
      .update({
        connections: firestore.FieldValue.arrayUnion(
          firebase.firestore().doc(`Users/${currentUser}`),
        ),
      })
      .then(result => {
        console.log('sucess');
      })
      .catch(err => {
        console.log('*****', err, '********');
      });
  }, []);
  const generateCommonChatDocument = useCallback((user1, user2) => {
    for (let i in user1) {
      if (user1[i] > user2[i]) {
        firestore()
          .collection('Users')
          .doc(user1 + user2)
          .set({}, {merge: true})
          .then(() => setchatId(user1 + user2));
        break;
      } else if (user1[i] < user2[i]) {
        firestore()
          .collection('Users')
          .doc(user2 + user1)
          .set({}, {merge: true})
          .then(() => setchatId(user2 + user1));
        break;
      }
    }
  }, []);
  useEffect(() => {
    generateCommonChatDocument(currentUser, user.phoneNumber);
    if (chatId) {
      const subscriber = firestore()
        .collection(`Users/${chatId}/messages`)
        .orderBy('time', 'desc')
        .onSnapshot(querySnapshot => {
          setInputMessage();
          const tempDoc = querySnapshot.docs.map(doc => {
            return {key: doc.id, ...doc.data()};
          });
          setMessages(tempDoc);
          setLoading(false);
        });
      return () => subscriber();
    }
  }, [chatId, currentUser, generateCommonChatDocument, user.phoneNumber]);
  if (loading) {
    return (
      <View style={styles.inidicator}>
        <ActivityIndicator size={40} color="#8FCED6" />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name="account" size={50} color="white" />
        <Text style={styles.userName}>{user?.name}</Text>
      </View>
      <View style={styles.chatPanel}>
        <KeyboardAvoidingView>
          <FlatList
            keyExtractor={item => {
              return item.key;
            }}
            inverted={-1}
            data={messages}
            renderItem={({item}) => {
              if (item.from === currentUser) {
                return (
                  <View style={styles.sentMessageBox}>
                    <Text style={styles.sentMessage}>{item?.message}</Text>
                    <Text style={styles.sentMessageTiming}>
                      {moment(item?.time?.toDate())
                        .startOf('second')
                        .fromNow()}
                    </Text>
                  </View>
                );
              } else {
                return (
                  <View style={styles.receivedMessageBox}>
                    <Text style={styles.receivedMessageText}>
                      {item?.message}
                    </Text>
                    <Text style={styles.receivedMessageTiming}>
                      {moment(item?.time?.toDate())
                        .startOf('second')
                        .fromNow()}
                    </Text>
                  </View>
                );
              }
            }}
          />
        </KeyboardAvoidingView>
      </View>
      <View style={styles.messageInputPanel}>
        <TextInput
          placeholder="Enter your comment"
          style={styles.messageTextInput}
          value={inputMessage}
          onChangeText={text => {
            setInputMessage(text);
          }}
        />
        <TouchableOpacity
          style={styles.sendButton}
          disabled={!inputMessage}
          onPress={() => {
            if (inputMessage) {
              makeConnection(currentUser, user.phoneNumber);
              makeConnection(user.phoneNumber, currentUser);

              firestore()
                .doc(`Users/${chatId}`)
                .collection('messages')
                .add({
                  from: currentUser,
                  to: user.phoneNumber,
                  message: inputMessage,
                  time: firestore.FieldValue.serverTimestamp(),
                })
                .then(function(docRef) {
                  console.log('Document written with ID: ', docRef.id);
                })
                .catch(function(error) {
                  console.error('Error adding document: ', error);
                });
            }
          }}>
          <Icon name="send" size={40} color="#1A4457" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default memo(SingleChatScreen);
const styles = StyleSheet.create({
  container: {flex: 1},
  header: {
    flex: 1,
    backgroundColor: '#1A4457',
    flexDirection: 'row',
  },
  userName: {
    alignSelf: 'center',
    fontSize: 30,
    paddingHorizontal: 5,
    color: 'white',
  },
  sentMessageBox: {
    alignSelf: 'flex-end',
    backgroundColor: '#476F86',
    margin: 3,
    padding: 10,
    borderBottomStartRadius: 20,
    borderBottomEndRadius: 20,
    borderTopStartRadius: 20,
    maxWidth: '80%',
  },
  chatPanel: {
    flex: 8,
    justifyContent: 'flex-end',
    backgroundColor: '#8FCED6',
  },
  sentMessage: {
    fontSize: 22,
    textAlignVertical: 'center',
    textAlign: 'left',
  },
  sentMessageTiming: {
    paddingStart: '10%',
    color: '#8FCED6',
    textAlign: 'right',
  },
  receivedMessageBox: {
    alignSelf: 'flex-start',
    backgroundColor: 'gray',
    margin: 3,
    padding: 10,
    borderBottomStartRadius: 20,
    borderBottomEndRadius: 20,
    borderTopEndRadius: 20,
    maxWidth: '80%',
  },
  receivedMessageText: {
    fontSize: 22,
    textAlignVertical: 'center',
    textAlign: 'left',
  },
  receivedMessageTiming: {
    paddingStart: '10%',
    color: '#8FCED6',
    textAlign: 'right',
  },
  messageInputPanel: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#1A4457',
  },
  messageTextInput: {
    backgroundColor: 'white',
    width: '70%',
    alignSelf: 'center',
    justifyContent: 'flex-start',
    borderRadius: 10,
    paddingLeft: 10,
  },
  sendButton: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    width: 50,
    borderRadius: 50 / 2,
  },
  inidicator: {justifyContent: 'center', alignItems: 'center', flex: 1},
});
