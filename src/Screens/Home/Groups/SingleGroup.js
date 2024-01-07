import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {
  List,
  Avatar,
  Appbar,
  Menu,
  Checkbox,
  ActivityIndicator,
  IconButton,
  Text,
} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {
  handleCurrentViewingGroup,
  handlePinGroup,
  handleSelectedGroupLength,
} from '../../../redux/reducers/groups/groups';

const SingleGroup = ({
  item,
  navigation,
  checked,
  setChecked,
  checkedItems,
  setCheckedItems,
  deleteLoading,
  setIsSearch,
  theme,
}) => {
  const dispatch = useDispatch();
  const groupSearchText = useSelector(state => state.groups.groupSearchText);
  const selectedGroupLength = useSelector(state => state.groups?.selectedGroupLength);

  const onPressHandler = async () => {
    setIsSearch(false);
    dispatch(handleCurrentViewingGroup(item));
    navigation.navigate('GroupDetail', {
      group: item,
      groupId: item._id,
      groupName: item.groupName,
    });
  };

  const pinHandler = async () => {
    dispatch(handlePinGroup(JSON.stringify(item)));
    await AsyncStorage.setItem('pinGroup', JSON.stringify(item));
  };
  const unPinHandler = async () => {
    dispatch(handlePinGroup(JSON.stringify(null)));
    await AsyncStorage.setItem('pinGroup', JSON.stringify(''));
  };

  // logic for checked on longPress
  const [include, setInclude] = useState(checkedItems?.includes(item._id));
  const index = checkedItems?.indexOf(item._id);

  const onLongPressHandler = () => {
    setChecked(true);
    if (include) {
      if (index !== -1 && index !== 0) {
        checkedItems.splice(include, 1);
        dispatch(handleSelectedGroupLength(selectedGroupLength - 1));
      } else if (index == 0) {
        checkedItems.shift();
        dispatch(handleSelectedGroupLength(selectedGroupLength - 1));
      }
    } else {
      setCheckedItems([...checkedItems, item._id]);
      dispatch(handleSelectedGroupLength(selectedGroupLength + 1));
    }
    setInclude(!include);
  };

  const [pinGroup, setPinGroup] = useState(null);
  useEffect(() => {
    const getData = async () => {
      const p = await AsyncStorage.getItem('pinGroup');
      const pp = JSON.parse(p);
      setPinGroup(pp);
    };
    getData();
  }, []);

  const getHighlightedText = result =>
    result?.split(new RegExp(`(${groupSearchText})`, `gi`)).map((piece, index) => {
      return (
        <Text
          key={index}
          style={
            piece.toLocaleLowerCase() == groupSearchText.toLocaleLowerCase()
              ? {color: theme.colors.primary, fontWeight: 'bold'}
              : {}
          }>
          {piece}
        </Text>
      );
    });

  return (
    <List.Item
      onLongPress={() => onLongPressHandler()}
      title={getHighlightedText(item.groupName)}
      description={item.groupDescription}
      titleStyle={{color: theme.colors.onBackground}}
      onPress={() => (checked ? onLongPressHandler() : onPressHandler())}
      left={props => (
        <View>
          {item.imageURL ? (
            <Avatar.Image style={props.style} source={{uri: item?.imageURL}} size={50} />
          ) : (
            <Avatar.Text
              style={props.style}
              // label={item.groupName?.charAt(0).toUpperCase()}
              label={item.groupName?.match(/\b\w/g)?.join('')?.toUpperCase()?.slice(0, 2)}
              size={50}
            />
          )}
        </View>
      )}
      right={() => (
        <View>
          {checked ? (
            <View>
              {!deleteLoading ? (
                <Checkbox
                  color={theme.colors.onBackground}
                  uncheckedColor={theme.colors.onSurface}
                  status={checked && include ? 'checked' : 'unchecked'}
                  onPress={onLongPressHandler}
                />
              ) : (
                <ActivityIndicator animating={deleteLoading} />
              )}
            </View>
          ) : (
            <View style={{flexDirection: 'row'}}>
              {pinGroup?._id == item._id && (
                <IconButton
                  icon="pin"
                  iconColor={theme.colors.blueBG}
                  onPress={() => alert('This group is pin')}
                />
              )}
              {/* <Menu
                visible={visible}
                onDismiss={closeMenu}
                contentStyle={{backgroundColor: theme.colors.background}}
                anchor={
                  <IconButton
                    icon="dots-horizontal"
                    color={theme.colors.onBackground}
                    onPress={() => openMenu()}
                    size={30}
                  />
                }>

                {pinGroup?._id == item?._id ? (
                  <Menu.Item
                    leadingIcon="pin-off-outline"
                    title="Un Pin"
                    onPress={async () => {
                      closeMenu();
                      unPinHandler();
                      navigation.navigate('PinnedGroup');
                    }}
                  />
                ) : (
                  <Menu.Item
                    leadingIcon="pin-outline"
                    title="Pin"
                    onPress={async () => {
                      closeMenu();
                      pinHandler();
                      navigation.navigate('PinnedGroup');
                    }}
                  />
                )}

                <Menu.Item
                  leadingIcon="checkbox-marked-outline"
                  title="Select"
                  titleStyle={{color: theme.colors.onBackground}}
                  onPress={async () => {
                    closeMenu();
                    onLongPressHandler();
                  }}
                />

                <Menu.Item
                  leadingIcon="cog-outline"
                  title="Settings"
                  titleStyle={{color: theme.colors.onBackground}}
                  onPress={async () => {
                    closeMenu();
                    settingHandler();
                  }}
                />
                {!item.isSyncd && item.isSyncd !== undefined && (
                  <Menu.Item
                    leadingIcon={() => (
                      <List.Icon
                        icon="delete-outline"
                        color={theme.colors.textRed}
                      />
                    )}
                    title="Delete"
                    titleStyle={{color: theme.colors.textRed}}
                    onPress={async () => {
                      closeMenu();
                      deleteGroupHandler();
                    }}
                  />
                )}
              </Menu> */}
            </View>
          )}
        </View>
      )}
    />
  );
};

export default SingleGroup;
