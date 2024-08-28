import {Image, View} from 'react-native';
import React from 'react';
import { Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

const PendingIcon = () => {
  const {t} = useTranslation();
  return (

      <View
        style={{
          flexDirection: 'row',
          paddingRight: '5%',
          paddingLeft: '2%',
          alignItems: 'center',
          backgroundColor: '#E8B119',
          borderRadius: 50,
          paddingVertical: '1.5%',
        }}>
        <Image
          style={{width: 20, height: 20, marginRight: 5}}
          source={require('../../assets/images/groupDetails/pending-approve-icon.png')}
        />
        <Text style={{color: '#fff'}}>{t("Pending")}</Text>
    </View>
  );
};

export default PendingIcon;
