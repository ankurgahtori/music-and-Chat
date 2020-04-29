import React, {useState} from 'react';
import {
  GoogleSignin,
  statusCodes,
  GoogleSigninButton,
} from '@react-native-community/google-signin';
import auth from '@react-native-firebase/auth';
import {CLIENT_ID} from './config/keys';
import {StyleSheet, Button, TextInput} from 'react-native';
import {LoginButton, AccessToken} from 'react-native-fbsdk';
const App = () => {
  // GoogleSignin.configure({
  //   webClientId: CLIENT_ID, // From Firebase Console Settings
  // });
  // const [userInfo, setUserInfo] = useState();
  // const onGoogleButtonPress = async () => {
  //   const {idToken} = await GoogleSignin.signIn();
  //   console.log(idToken, 'ID token is');
  //   const googleCredential = auth.GoogleAuthProvider.credential(idToken);
  //   console.log(googleCredential, 'here credential');
  //   return auth().signInWithCredential(googleCredential);
  // };

  return (
    <>
      {/* <GoogleSigninButton
        style={styles.googelButton}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        // disabled={this.state.isSigninInProgress}
        onPress={() =>
          onGoogleButtonPress()
            .then(res => {
              console.log('sucessfully LoggedIn');
            })
            .catch(error => {
              if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                console.log('user cancelled the login flow');
              } else if (error.code === statusCodes.IN_PROGRESS) {
                console.log('operation (e.g. sign in) is in progress already');
              } else if (
                error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE
              ) {
                console.log('play services not available or outdated');
              } else {
                console.log('error', error);
              }
            })
        }
      />
      <LoginButton
        onLoginFinished={(error, result) => {
          if (error) {
            console.log('login has error: ' + result.error);
          } else if (result.isCancelled) {
            console.log('login is cancelled.');
          } else {
            AccessToken.getCurrentAccessToken().then(data => {
              console.log(data);
              const facebookCredential = auth.FacebookAuthProvider.credential(
                data.accessToken,
              );
              auth()
                .signInWithCredential(facebookCredential)
                .then(result => {
                  console.log('final result is : ', result);
                })
                .catch(err => {
                  console.log('error', err, 'error');
                });
            });
          }
        }}
        onLogoutFinished={() => console.log('logout.')}
      />
      <Button
        title="Logout"
        onPress={async () => {
          try {
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();
            // this.setState({user: null}); // Remember to remove the user from your app's state as well
          } catch (error) {
            console.error(error);
          }
        }}
      /> */}
      <PhoneSignIn />
    </>
  );
};
function PhoneSignIn() {
  // If null, no SMS has been sent
  const [confirm, setConfirm] = useState(null);

  const [code, setCode] = useState('');

  // Handle the button press
  async function signInWithPhoneNumber(phoneNumber) {
    const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
    console.log(confirmation);

    setConfirm(confirmation);
  }

  async function confirmCode() {
    try {
      let data = await confirm.confirm(code);
      console.log('successuful', data);
    } catch (error) {
      console.log('Invalid code.');
    }
  }

  if (!confirm) {
    return (
      <Button
        title="Phone Number Sign In"
        onPress={() => signInWithPhoneNumber('+918958123310')}
      />
    );
  }

  return (
    <>
      <TextInput value={code} onChangeText={text => setCode(text)} />
      <Button title="Confirm Code" onPress={() => confirmCode()} />
    </>
  );
}
export default App;
const styles = StyleSheet.create({googelButton: {width: 192, height: 48}});
