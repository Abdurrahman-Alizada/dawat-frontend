import {Image, View} from 'react-native';
import React from 'react';
import {Text} from 'react-native-paper';
import { useTranslation } from 'react-i18next';

const OtherIcon = () => {
  const {t} = useTranslation()
  return (
    <View
      style={{
        flexDirection: 'row',
        paddingRight: '5%',
        paddingLeft: '2%',
        alignItems: 'center',
        backgroundColor: '#653B3B',
        borderRadius: 50,
        paddingVertical: '1.5%',
      }}>
      <Image
        style={{width: 20, height: 20, marginRight: 5}}
        source={require('../../assets/images/groupDetails/other-approve-icon.png')}
      />
      <Text style={{color: '#fff'}}>{t("Other")}</Text>
    </View>
  );
};

export default OtherIcon;
