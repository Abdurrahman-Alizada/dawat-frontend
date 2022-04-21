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
const SignupWithEmail = () => {
  return (
    <View style={{flex: 1, backgroundColor: '#fff', padding: '2%'}}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Text style={{fontSize: 18, margin: '2%', fontWeight: '500'}}>
        Enter your detail
      </Text>

      <ScrollView>
        <View style={{marginVertical: '2%'}}>
          <Input
            placeholder="name"
            label="Your user name"
            rightIcon={{type: 'font-awesome', name: 'user'}}
          />

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
          <Input
            placeholder="*******"
            label="Confir Password"
            type="password"
            secureTextEntry={true}
            rightIcon={{type: 'font-awesome', name: 'check'}}
          />

          <Button
            title={'Sign up'}
            containerStyle={{
              width: '95%',
              alignSelf: 'center',
            }}
            buttonStyle={{
              backgroundColor: '#334C8C',
              height: 50,
              borderRadius: 5,
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default SignupWithEmail;

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
