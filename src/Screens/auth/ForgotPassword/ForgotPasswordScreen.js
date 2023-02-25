import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {TextInput, Button} from 'react-native-paper';

const ForgotPassword = ({navigation}) => {
  return (
    <View style={{flex: 1, backgroundColor: '#fff', padding: '2%'}}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={{justifyContent: 'center', flex: 1}}>
        <TextInput
          placeholder="abc@domin.com"
          label="Enter your Email"
          mode="outlined"
        />

        <Button
          // icon="camera"
          mode="contained"
          theme={{roundness: 2}}
          style={{marginVertical: '4%'}}
          onPress={() => console.log('Pressed')}>
          Sent Varification Code
        </Button>
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
