import {View} from 'react-native';
import React from 'react';
import {Card, Button, Text} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
const LoginForMoreFeatures = ({token, isLoading, localLoading, navigation}) => {
  const {t} = useTranslation();
  return (
    <View style={{marginTop: '2%', bottom: 0, width: '100%'}}>
      {!token && !isLoading && !localLoading && (
        <Card contentStyle={{bottom: 0, alignItems: 'center', padding: '3%'}}>
          <View style={{width: '90%'}}>
            <Text style={{fontSize: 20, textAlign: 'center'}}>{t('Unlock more features')}</Text>
            <Text style={{textAlign: 'center'}}>
              {t("Add other participants to your events, Make backup and keep record remotely")}
            </Text>
          </View>
          <Card.Actions>
            <Button onPress={() => navigation.navigate('Auth', {screen: 'Login'})}>{t("Login")}</Button>
            <Button onPress={() => navigation.navigate('Auth', {screen: 'SignUpwithEmail'})}>
              {t("Create account")}
            </Button>
          </Card.Actions>
        </Card>
      )}
    </View>
  );
};

export default LoginForMoreFeatures;
