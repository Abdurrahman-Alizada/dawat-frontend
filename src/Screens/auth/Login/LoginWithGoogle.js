import {StyleSheet, Text, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Button} from 'react-native-elements';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  // scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  scopes: ['https://www.googleapis.com/auth/userinfo.profile'], // what API you want to access on behalf of the user, default is email and profile
  webClientId:
    '620618098267-8qvuqr0pn196km1kuhpb9ovh21a3hii6.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access
  androidClientId:
    '620618098267-sh2qnkog21svti0vjjqms1gra008s77l.apps.googleusercontent.com',
  offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
  hostedDomain: '', // specifies a hosted domain restriction
  loginHint: '', // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
  forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
  accountName: '', // [Android] specifies an account name on the device that should be used
  iosClientId: '<FROM DEVELOPER CONSOLE>', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
  googleServicePlistPath: '', // [iOS] optional, if you renamed your GoogleService-Info file, new name here, e.g. GoogleService-Info-Staging
});

const LoginWithGoogle = () => {
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const signInWithGoogle = async () => {
    try {
      // await GoogleSignin.hasPlayServices();
      let userInfo = await GoogleSignin.signIn();
      // const userInfo = await GoogleSignin.signInSilently();
      setUser(userInfo);
      console.log(userInfo);
      // console.log(userInfo)
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        console.log('cancel', user);
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
        console.log('progress', user);
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        console.log('not available', user);
      } else {
        // some other error happened
        console.log('some other error', error);
      }
    }
  };

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      setUser(null); // Remember to remove the user from your app's state as well
    } catch (error) {
      console.error(error);
    }
  };

  const getCurrentUser = async () => {
    const currentUser = await GoogleSignin.getCurrentUser();
    {
      currentUser
        ? setCurrentUser(currentUser.user.name)
        : setCurrentUser(null);
    }
    // console.log(currentUser.user.name)
  };

  return (
    <View>
      <Button
        onPress={signInWithGoogle}
        title="Sign in With Google"
        icon={{
          name: 'google',
          type: 'font-awesome',
          size: 30,
        }}
        iconContainerStyle={{width: '20%'}}
        titleStyle={{fontWeight: 'bold', color: '#333', width: '70%'}}
        buttonStyle={{
          backgroundColor: '#EDEEF0',
          borderRadius: 10,
          borderColor: '#C1C2B8',
          borderWidth: 0.5,
          height: 50,
        }}
      />
    </View>
  );
};

export default LoginWithGoogle;

const styles = StyleSheet.create({});
