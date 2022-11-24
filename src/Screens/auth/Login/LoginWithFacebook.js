import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Button} from 'react-native-elements';
import {
  LoginButton,
  LoginManager,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk-next';

const LoginWithFacebook = () => {
  const loginWithFacebook = () => {
    LoginManager.logInWithPermissions(['email']).then(
      function (result) {
        if (result.isCancelled) {
          console.log('Login cancelled');
        } else {
          console.log(
            'Login success with permissions: ' +
              result.grantedPermissions.toString(),
          );

          AccessToken.getCurrentAccessToken().then(data => {
            let accessToken = data.accessToken;
            alert(accessToken.toString());

            const responseInfoCallback = (error, result) => {
              if (error) {
                console.log(error);
                alert('Error fetching data: ' + error.toString());
              } else {
                console.log(result);

                // Here's my code
                // alert('Success fetching data: ' + result["name"].toString() +
                // ", " + result["email"].toString());
                /*  
                      if(your DB already got this email or something unique) {
                        // SignIn()
                      } 
                      // when your DB doesn't have this email
                      else {
                        // Do signUp() with this infomation and SignIn()
                      }
                      */
              }
            };

            const infoRequest = new GraphRequest(
              '/me',
              {
                accessToken: accessToken,
                parameters: {
                  fields: {
                    string: 'email,name,first_name,middle_name,last_name',
                  },
                },
              },
              responseInfoCallback,
            );

            // Start the graph request.
            new GraphRequestManager().addRequest(infoRequest).start();
          });
        }
      },
      function (error) {
        console.log('Login fail with error: ' + error);
      },
    );
  };

  return (
    <View>
      <Button
        onPress={() => loginWithFacebook()}
        title="Sign in With Facebook"
        icon={{
          name: 'facebook',
          type: 'font-awesome',
          size: 30,
          color: 'white',
        }}
        iconContainerStyle={{width: '20%'}}
        titleStyle={{fontWeight: 'bold', width: '70%'}}
        buttonStyle={{
          backgroundColor: '#334C8C',
          borderRadius: 10,
          borderColor: '#C1C2B8',
          borderWidth: 0.5,
          height: 50,
        }}
      />
    </View>
  );
};

export default LoginWithFacebook;

const styles = StyleSheet.create({});
