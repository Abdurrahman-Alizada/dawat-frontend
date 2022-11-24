import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {Input, Button} from 'react-native-elements';

const ForgotPassword = ({navigation}) => {
  return (
    <View style={{flex: 1, backgroundColor: '#fff', padding: '2%'}}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={{justifyContent: 'center', flex: 1}}>
        <Input
          placeholder="abc@domin.com"
          label="Enter your Email"
          rightIcon={{type: 'font-awesome', name: 'envelope'}}
        />

        <Button
          onPress={() => navigation.navigate('CheckEmail')}
          title={'Sent Varification Cade'}
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
      </View>
    </View>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
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
