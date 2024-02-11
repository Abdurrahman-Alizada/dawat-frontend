import React from 'react';
import {Appbar, useTheme} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {isConfirmDialogVisibleHandler} from '../../redux/reducers/groups/chat/chatSlice';
import {useDispatch, useSelector} from 'react-redux';

const Header = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {t} = useTranslation();

  const isMessagesSelected = useSelector(state => state.chat?.isMessagesSelected);

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
        title={t('Chat')}
        titleStyle={{
          color: theme.colors.onBackground,
        }}
      />
      {isMessagesSelected && (
        <Appbar.Action
          icon="delete"
          iconColor={theme.colors.error}
          onPress={() => dispatch(isConfirmDialogVisibleHandler(true))}
        />
      )}
    </Appbar>
  );
};

export default Header;
