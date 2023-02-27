import {StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';
import {Button} from 'react-native-paper';
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
          theme={{roundness: 2}}
          // icon="camera"
          mode="contained"
          style={{marginVertical:"2%"}}
          onPress={() => console.log('Pressed')}>
          Open Email App
        </Button>
        <Button
          theme={{roundness: 2}}
          // icon="camera"
          mode="outlined"
          onPress={() => console.log('Pressed')}>
          Will do it later
        </Button>
      </View>
    </View>
  );
};

export default CheckEmail;

const styles = StyleSheet.create({});
