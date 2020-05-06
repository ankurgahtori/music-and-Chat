/* eslint-disable react-native/no-inline-styles */
import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef,
} from 'react';
import {
  View,
  Text,
  TextInput,
  Dimensions,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from 'react-native';
import {AuthContext} from '../Contexts/context';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';
const PhoneSignIn = () => {
  const [confirm, setConfirm] = useState(null);
  const [code, setCode] = useState();
  const [number, setNumber] = useState('');
  const [sendingOTP, setSendingOTP] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [verifyingOTP, setVerifyingOTP] = useState(false);
  const [popUpVisibility, setPopUpVisibility] = useState(false);
  const intervalRef = useRef(null);
  const startTimer = useCallback(() => {
    intervalRef.current = setInterval(() => {
      setTimeLeft(data =>
        data > 0 ? data - 1 : clearInterval(intervalRef.current),
      );
    }, 1000);
  }, []);
  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);
  const signInWithPhoneGivenNumber = useCallback(
    async phoneNumber => {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      startTimer();

      setConfirm(confirmation);
    },
    [startTimer],
  );

  const confirmCode = useCallback(async () => {
    try {
      let user = await confirm.confirm(code);
      firestore()
        .collection('Users')
        .doc(user.phoneNumber)
        .set({}, {merge: true})
        .then(() => {
          console.log('User added!');
        })
        .catch(err => {
          console.log('Error on adding user', err);
        });
    } catch (error) {
      setPopUpVisibility(true);
    }
  }, [code, confirm]);

  if (!confirm) {
    return (
      <>
        <View style={{backgroundColor: '#1A4457', flex: 1}}>
          <View
            style={{
              flex: 5,
              backgroundColor: '#BFCED6',
              borderTopRightRadius: 100,
              borderBottomRightRadius: 300,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                backgroundColor: '#1A4457',
                width: Dimensions.get('screen').width / 2,
                height: Dimensions.get('screen').width / 2,
                margin: 5,
                borderRadius: Dimensions.get('screen').width / 4,
              }}
            />
            <TextInput
              style={{
                textAlign: 'center',
                backgroundColor: 'white',
                width: Dimensions.get('screen').width / 2,
                height: 30,
                padding: 0,
              }}
              placeholder="10 Digit Mobile number"
              onChangeText={text => {
                setNumber(text);
              }}
            />
          </View>
          <View
            style={{
              flex: 2,
              backgroundColor: '#476F86',
              borderTopStartRadius: 600,
              alignItems: 'center',
              paddingTop: 10,
            }}>
            <TouchableOpacity
              disabled={sendingOTP || number.length !== 10}
              activeOpacity="0.1"
              style={{
                backgroundColor: '#BFCED6',
                padding: 2,
                width: 80,
                borderRadius: 80 / 2,
                height: 80,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => {
                signInWithPhoneGivenNumber('+91' + number);
                setSendingOTP(true);
              }}>
              {sendingOTP ? (
                <ActivityIndicator size={50} />
              ) : (
                <Icon
                  name={'forward'}
                  size={50}
                  color={
                    number.length === 10 && !sendingOTP ? '#1A4457' : 'gray'
                  }
                />
              )}
            </TouchableOpacity>
            <Text style={{fontSize: 20}}>Send OTP</Text>
          </View>
        </View>
      </>
    );
  }
  return (
    <>
      <View style={{backgroundColor: '#1A4457', flex: 1}}>
        <View
          style={{
            flex: 5,
            backgroundColor: '#BFCED6',
            borderTopRightRadius: 100,
            borderBottomRightRadius: 300,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              backgroundColor: '#1A4457',
              width: Dimensions.get('screen').width / 2,
              height: Dimensions.get('screen').width / 2,
              margin: 5,
              borderRadius: Dimensions.get('screen').width / 4,
            }}
          />
          <TextInput
            style={{
              textAlign: 'center',
              backgroundColor: 'white',
              width: Dimensions.get('screen').width / 2,
              height: 30,
              padding: 0,
            }}
            placeholder="Enter OTP"
            value={code}
            onChangeText={text => setCode(text)}
          />
          {timeLeft ? (
            <Text style={{fontSize: 30}}>{timeLeft}</Text>
          ) : (
            <TouchableOpacity
              style={{backgroundColor: '#BFCED6'}}
              onPress={() => {
                signInWithPhoneGivenNumber('+91' + number);
                setTimeLeft(30);
              }}>
              <Icon name="refresh" size={30} />
            </TouchableOpacity>
          )}
        </View>
        <View
          style={{
            flex: 2,
            backgroundColor: '#476F86',
            borderTopStartRadius: 600,
            alignItems: 'center',
            paddingTop: 10,
          }}>
          <TouchableOpacity
            disabled={!code || verifyingOTP}
            activeOpacity="0.1"
            style={{
              backgroundColor: '#BFCED6',
              padding: 2,
              width: 80,
              borderRadius: 80 / 2,
              height: 80,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => {
              setVerifyingOTP(true);
              confirmCode();
            }}>
            {verifyingOTP ? (
              <ActivityIndicator size={50} />
            ) : (
              <Icon
                name="forward"
                size={50}
                color={code && !verifyingOTP ? '#1A4457' : 'gray'}
              />
            )}
          </TouchableOpacity>
          <Text style={{fontSize: 20, color: '#1A4457', textAlign: 'center'}}>
            Login
          </Text>
          <TouchableOpacity
            style={{
              justifyContent: 'flex-end',
              padding: 10,
              backgroundColor: '#476F86',
            }}
            onPress={() => {
              setConfirm();
              setSendingOTP(false);
              setTimeLeft(30);
              setNumber('');
              setVerifyingOTP(false);
              setCode();
            }}>
            <Text style={{textDecorationLine: 'underline'}}>
              Change Mobile Number
            </Text>
          </TouchableOpacity>
        </View>
        <Modal
          visible={popUpVisibility}
          animationType="fade"
          transparent={true}
          onRequestClose={() => {
            console.log('onRequestClose');
          }}>
          <View
            style={{
              marginTop: Dimensions.get('window').height / 3,
              height: Dimensions.get('window').height / 3,
              width: Dimensions.get('window').height / 3,
              backgroundColor: 'white',
              alignSelf: 'center',
            }}>
            <Icon
              name="close"
              style={{alignSelf: 'flex-end'}}
              size={30}
              onPress={() => {
                setPopUpVisibility(!popUpVisibility);
                console.log('close model function fired');
                setCode(null);
                setVerifyingOTP(false);
              }}
            />
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{textAlign: 'center', fontSize: 30}}>
                Invalid OTP
              </Text>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
};
export default PhoneSignIn;
