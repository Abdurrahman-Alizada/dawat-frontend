import React, {useEffect, useState} from 'react';

import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import GlobalStyles, {height, width, COLORS} from '../../../GlobalStyles';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Button, Input} from 'react-native-elements';
import LoginWithFacebook from './LoginWithFacebook';
import LoginWithGoogle from './LoginWithGoogle';

const LoginScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{alignItems: 'flex-end', marginTop: 5, width: width * 0.9}}>
          <Icon size={28} name="times" />
        </View>

        <Text
          style={{
            alignSelf: 'center',
            fontSize: 18,
            marginVertical: '2%',
            fontWeight: '500',
            width: '70%',
            textAlign: 'center',
          }}>
          Welcome back! Sign in to continue!{' '}
        </Text>

        <View>
          <LoginWithGoogle />

          <LoginWithFacebook />

          <Button
            title="Sign in With Apple"
            icon={{
              name: 'apple',
              type: 'font-awesome',
              size: 30,
              color: '#fff',
            }}
            iconContainerStyle={{width: '20%'}}
            titleStyle={{fontWeight: 'bold', width: '70%'}}
            buttonStyle={{
              backgroundColor: '#1E293B',
              borderRadius: 10,
              borderColor: '#C1C2B8',
              borderWidth: 0.5,
              height: 50,
            }}
          />
        </View>

        <Text
          style={{
            fontSize: 18,
            fontWeight: 'bold',
            alignSelf: 'center',
            marginVertical: '2%',
          }}>
          or
        </Text>

        <View style={{marginVertical: '2%'}}>
          <Input
            placeholder="abc@domin.com"
            label="Enter your Email"
            rightIcon={{type: 'font-awesome', name: 'envelope'}}
          />
          <Input
            placeholder="*******"
            label="Password"
            type="password"
            secureTextEntry={true}
            rightIcon={{type: 'font-awesome', name: 'lock'}}
          />
          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword')}
            style={{
              alignSelf: 'flex-end',
              paddingRight: '5%',
              marginVertical: '2%',
            }}>
            <Text style={{color: '#F04438', fontSize: 18, fontWeight: 'bold'}}>
              Forgot Password
            </Text>
          </TouchableOpacity>

          <Button
            onPress={() => navigation.navigate('Drawer')}
            title="Sign in "
            titleStyle={{fontWeight: 'bold', width: '70%'}}
            buttonStyle={{
              backgroundColor: '#334C8C',
              borderRadius: 10,
              borderColor: '#C1C2B8',
              borderWidth: 0.5,
              height: 50,
            }}
          />

          <TouchableOpacity
            onPress={() => navigation.navigate('Register')}
            style={{
              alignSelf: 'flex-end',
              paddingRight: '2%',
              marginVertical: '2%',
            }}>
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>
              Don't have an account?{' '}
              <Text style={{color: '#F04438'}}>Sign Up</Text>{' '}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: '2%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  img: {
    width: 100,
    alignSelf: 'center',
    height: 100,
    borderRadius: 400,
  },

  buttonStyle: {
    height: 60,
    justifyContent: 'flex-start',
    paddingHorizontal: 50,
    alignItems: 'center',
    borderRadius: 10,
    flexDirection: 'row',
    marginVertical: '2%',
    backgroundColor: '#EDEEF0',
  },
  buttonTextStyle: {
    fontSize: 17,
    fontWeight: 'bold',
  },
});
