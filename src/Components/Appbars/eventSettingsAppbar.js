import React from 'react';
import {Appbar, useTheme} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import EventSettingsScreenAppbarGift from '../../adUnits/eventSettingsScreenAppbarGift';
const EventSettingsAppbar = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  return (
    <Appbar
      elevated={true}
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: theme.colors.background,
        marginBottom: 2,
      }}>
      <Appbar.BackAction onPress={() => navigation.goBack()} />
      <Appbar.Content
        title="Event settings"
        titleStyle={{
          color: theme.colors.onBackground,
        }}
      />
      <EventSettingsScreenAppbarGift />
    </Appbar>
  );
};

export default EventSettingsAppbar;
