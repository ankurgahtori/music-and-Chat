import React, {useEffect, useState} from 'react';
import {FlatList} from 'react-native';
import {PermissionsAndroid} from 'react-native';
import Contacts from 'react-native-contacts';
import firestore from '@react-native-firebase/firestore';
import ContactComponent from '../components/contactRow';
const ContactsScreen = ({route, navigation}) => {
  const [users, setUsers] = useState([]);
  const userId = route.params.phoneNumber;
  useEffect(() => {
    try {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
        title: 'Contacts',
        message: 'This app would like to view your contacts.',
      })
        .then(() => {
          let allContactNumbers = [];
          Contacts.getAllWithoutPhotos((err, contacts) => {
            if (err) {
              console.log('error in reading contact', err);
            } else {
              for (let i in contacts) {
                let phoneNumbers = contacts[i].phoneNumbers;
                for (let j in phoneNumbers) {
                  let number = phoneNumbers[j].number.split(' ').join('');

                  number = number[0] === '0' ? number.slice(1) : number;
                  number = number.length === 10 ? '+91' + number : number;
                  if (
                    number !== allContactNumbers[allContactNumbers.length - 1]
                  ) {
                    allContactNumbers.push(number);
                  }
                }
              }
              allContactNumbers.forEach(async element => {
                if (element !== userId) {
                  await firestore()
                    .collection('Users')
                    .doc(element)
                    .get()
                    .then(result => {
                      if (result.exists) {
                        let user = result.data();
                        console.log({phoneNumber: result.id, name: user.name});
                        setUsers(data => {
                          return [
                            ...data,
                            {phoneNumber: result.id, name: user.name},
                          ];
                        });
                      }
                    })
                    .catch(err => {
                      console.log(err);
                    });
                  console.log('wait over for : ', element);
                }
              });
            }
          });
        })
        .catch(err => {
          console.log('here error is :', err);
        });
    } catch (err) {
      console.log(err);
    }
  }, [userId]);
  return (
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
  );
};
export default ContactsScreen;
