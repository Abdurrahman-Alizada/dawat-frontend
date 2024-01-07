import React from 'react';
import {View} from 'react-native';
import {Appbar, ActivityIndicator} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {handleSelectedGroupLength} from '../redux/reducers/groups/groups';

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
          onPress={() => {
            deleteF();
          }}
        />
      )}
    </Appbar.Header>
  );
};

export default Header;
