import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import { 
  LoginScreen, 
  RegistrationScreen,
  ForgotPasswordScreen,
  OTPScreen,
  ResetPasswordScreen,
  SignupWithEmail,
  CheckEmail
} from '../Screens/auth/Index';

const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator initialRouteName="LoginScreen"  >
     <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{headerShown:false, presentation:"modal"}}
       />
      <Stack.Screen
        name="Register"
        options={{headerShown:false, presentation:"modal"}}
        component={RegistrationScreen}
       
      />
       <Stack.Screen
        name="SignUpwithEmail"
        options={{presentation:"modal", title: 'Sign Up with Email'}}
        component={SignupWithEmail}
       
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
      />
      <Stack.Screen
        name="CheckEmail"
        component={CheckEmail}
      />
      <Stack.Screen
        name="OTPScreen"
        component={OTPScreen}

      />
      <Stack.Screen
        name="ResetPasswordScreen"
        component={ResetPasswordScreen}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
