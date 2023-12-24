import {View} from 'react-native';
import React from 'react';
import {Card, Button, Text} from 'react-native-paper';
const LoginForMoreFeatures = ({token, isLoading, localLoading, navigation}) => {
  return (
    <View style={{marginTop: '2%', bottom: 0, width: '100%'}}>
      {!token && !isLoading && !localLoading && (
        <Card contentStyle={{bottom: 0, alignItems: 'center', padding: '3%'}}>
          <View style={{width: '90%'}}>
            <Text style={{fontSize: 20, textAlign: 'center'}}>
              Unlock more features
            </Text>
            <Text style={{textAlign: 'center'}}>
              Add other participant to your groups, Make backup and keep record
              remotly
            </Text>
          </View>
          <Card.Actions>
            <Button
              onPress={() => navigation.navigate('Auth', {screen: 'Login'})}>
              Login
            </Button>
            <Button
              onPress={() =>
                navigation.navigate('Auth', {screen: 'SignUpwithEmail'})
              }>
              Create account
            </Button>
          </Card.Actions>
        </Card>
       )} 
    </View>
  );
};

export default LoginForMoreFeatures;
