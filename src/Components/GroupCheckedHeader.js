import React from 'react';
import {View} from 'react-native';
import {Appbar, ActivityIndicator} from 'react-native-paper';
import { useSelector} from 'react-redux';

const Header = ({deleteF, deleteLoading, pinHandler, groupName, checkedBack, theme}) => {
  const pinGroupLoading = useSelector(state => state.groups?.pinGroupLoading);
  const selectedGroupLength = useSelector(state => state.groups?.selectedGroupLength);

  return (
    <Appbar.Header elevated style={{backgroundColor: theme.colors.background}}>
      <Appbar.Action
        color={theme.colors.onBackground}
        icon="close"
        onPress={() => {
          checkedBack();
        }}
      />
      <Appbar.Content title={groupName} titleStyle={{alignSelf: 'center'}} />
      {selectedGroupLength == 1 && (
        <View>
          {pinGroupLoading ? (
            <ActivityIndicator />
          ) : (
            <Appbar.Action
              color={theme.colors.onBackground}
              icon="pin"
              disabled={deleteLoading || pinGroupLoading}
              onPress={() => pinHandler()}
            />
          )}
        </View>
      )}

      {deleteLoading ? (
        <ActivityIndicator />
      ) : (
        <Appbar.Action
          color={theme.colors.error}
          icon="delete"
          disabled={deleteLoading || pinGroupLoading}
          onPress={() => {
            deleteF();
          }}
        />
      )}
    </Appbar.Header>
  );
};

export default Header;
