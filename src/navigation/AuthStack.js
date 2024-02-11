import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {
  LoginScreen,
  ForgotPasswordScreen,
  OTPScreen,
  ResetPasswordScreen,
  SignupWithEmail,
  CheckEmail,
} from '../Screens/auth/Index';
import WelcomePage from '../Screens/WelcomePage';
import SyncDataIndex from '../Screens/Home/syncData/syncDataIndex';
const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator initialRouteName="WelcomePage">
      <Stack.Screen
        name="WelcomePage"
        component={WelcomePage}
        options={{headerShown: false, presentation: 'modal'}}
      />

      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerShown: false,
          presentation: 'modal',
        }}
      />

      <Stack.Screen
        name="SignUpwithEmail"
        options={{
          presentation: 'modal',
          headerShown: false,
          title: 'Sign up with email',
        }}
        component={SignupWithEmail}
      />

      <Stack.Screen
        name="SyncData"
        options={{
          presentation: 'modal',
          headerShown: false,
          title: 'Sync your data',
        }}
        component={SyncDataIndex}
      />
      
      <Stack.Screen
        name="ForgotPassword"
        options={{
          title: 'Forgot password',
          headerShown:false
        }}
        component={ForgotPasswordScreen}
      />
      <Stack.Screen name="CheckEmail" component={CheckEmail} />
      <Stack.Screen
        name="OTPScreen"
        component={OTPScreen}
        options={{
          title: 'OTP',
          headerShown:false
        }}
      />
      <Stack.Screen
        name="ResetPasswordScreen"
        component={ResetPasswordScreen}
        options={{
          title: 'Reset password',
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
