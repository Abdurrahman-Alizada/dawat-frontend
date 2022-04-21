import React from 'react';

import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import { width } from '../../../GlobalStyles';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Button,} from 'react-native-elements';
const SignUp = ({navigation}) => {
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
            fontWeight: '500',
            width: '70%',
            textAlign: 'center',
          }}>
          Welcome! Sign up to continue!
        </Text>

        <View>
          <Button
            title="Sign Up With Google"
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

          <Button
            title="Sign Up With Facebook"
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

          <Button
            title="Sign Up With Apple"
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
          <Button
            onPress={() => navigation.replace('SignUpwithEmail')}
            title="Sign Up With Email"
            titleStyle={{fontWeight: 'bold', color: '#333', width: '70%'}}
            buttonStyle={{
              backgroundColor: '#EDEEF0',
              borderRadius: 10,
              borderColor: '#C1C2B8',
              borderWidth: 0.5,
              height: 50,
            }}
          />

          <Text style={{textAlign: 'center', marginVertical: '4%'}}>
            By signing up you are agreed with our{' '}
            <Text style={{color: 'blue'}}> terms and condition</Text>.
          </Text>
          <Text style={{fontSize: 18, fontWeight: 'bold', alignSelf: 'center'}}>
            Already have an account?{' '}
          </Text>
          <TouchableOpacity
            onPress={() => {
              navigation.replace('Login');
            }}
            style={{
              alignSelf: 'center',
              paddingRight: '2%',
              marginVertical: '2%',
            }}>
            <Text
              style={{
                alignSelf: 'center',
                fontSize: 18,
                fontWeight: 'bold',
                marginVertical: '5%',
                color: '#F04438',
              }}>
              Sign in
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default SignUp;

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
