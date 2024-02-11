import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
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
  Portal,
  Dialog,
  Paragraph,
  Button,
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
  const {t} = useTranslation();
  const [visible, setVisible] = useState(false);

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

  const [pinGroupId, setPinGroupId] = useState(null);
  useEffect(() => {
    const getData = async () => {
      setPinGroupId(JSON.parse(await AsyncStorage.getItem('pinGroupId')));
    };
    getData();
  }, []);

  const getHighlightedText = result => {
    var rtlChars = '\u0591-\u07FF\u200F\u202B\u202E\uFB1D-\uFDFD\uFE70-\uFEFC',
    rtlDirCheck = new RegExp('^[^' + rtlChars + ']*?[' + rtlChars + ']');

    return rtlDirCheck.test(result) ? result:
    result?.split(new RegExp(`(${groupSearchText})`, `gi`)).map((piece, index) => {
      return (
        <Text
          key={index}
          style={
            piece.toLocaleLowerCase() == groupSearchText.toLocaleLowerCase()
              ? {fontWeight: 'bold', color: theme.colors.primary}
              : {}
          }>
          {piece}
        </Text>
      );
    });
  };

  const unPinHandler = async () => {
    setPinGroupId(null);
    await AsyncStorage.removeItem('pinGroupId');
    dispatch(handlePinGroup(null));
    navigation.goBack();
  };

  return (
    <>
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
                {pinGroupId == item._id && (
                  <IconButton
                    icon="pin"
                    iconColor={theme.colors.blueBG}
                    onPress={() => setVisible(true)}
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

      <Portal>
        <Dialog visible={visible} onDismiss={() => setVisible(false)}>
          <Dialog.Title>{t('Pin group')}</Dialog.Title>

          <Dialog.Content>
            <Paragraph> {t("This event is pin")} </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => {
                setVisible(false);
              }}
              textColor={theme.colors.error}>
              {t("close")}
            </Button>
            <Button
              icon={'pin-off'}
              onPress={() => {
                setVisible(false);
                unPinHandler();
              }}>
              {t("Unpin")}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

export default SingleGroup;
