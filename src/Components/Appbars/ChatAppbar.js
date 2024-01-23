import React from 'react';
import {Appbar, useTheme} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';

const Header = () => {
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
        title="Chat"
        titleStyle={{
          color: theme.colors.onBackground,
        }}
      />
    </Appbar>
  );
};

export default Header;
