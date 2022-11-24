import {StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';
import {Button} from 'react-native-elements';
const CheckEmail = () => {
  return (
    <View style={{backgroundColor: '#fff', flex: 1, padding: '5%'}}>
      <Text
        style={{
          alignSelf: 'center',
          fontSize: 24,
          marginVertical: '5%',
          fontWeight: '500',
          width: '70%',
          textAlign: 'center',
        }}>
        Check Your Email
      </Text>
      <Text style={{fontSize: 14, fontWeight: '500', textAlign: 'center'}}>
        We’ve sent a password recover instruction to your email. Please check
        your indox.
      </Text>

      <View>
        <Image
          style={{
            width: '100%',
            height: '50%',
            marginVertical: '5%',
            alignSelf: 'center',
          }}
          source={require('../../../assets/images/auth/checkInbox.png')}
        />
      </View>

      <View>
        <Button
          title={'Open Email App'}
          containerStyle={{
            width: '95%',
            alignSelf: 'center',
          }}
          buttonStyle={{
            height: 50,
            borderRadius: 5,
            backgroundColor: '#334C8C',
          }}
        />

        <Button
          title={'Will do it Later'}
          type="outline"
          containerStyle={{
            width: '95%',
            alignSelf: 'center',
          }}
          titleStyle={{color: '#334C8C'}}
          buttonStyle={{
            height: 50,
            borderColor: '#334C8C',
            borderRadius: 5,
          }}
        />
      </View>
    </View>
  );
};

export default CheckEmail;

const styles = StyleSheet.create({});
