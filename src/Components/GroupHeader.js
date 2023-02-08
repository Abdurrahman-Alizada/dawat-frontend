import React, {useState} from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {
  Menu,
  Divider,
  Appbar,
  Searchbar,
  Avatar,
  Text,
} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';

const Header = ({isSearch, setIsSearch, onOpen, group}) => {
  const currentViewingGroup = useSelector(
    state => state.groups?.currentViewingGroup,
  );

  const getMembersOfGroup = () => {
    let membersText = currentViewingGroup.users?.map(user => {
      return user.name;
    });
    return membersText.toString().length < 25
      ? membersText.toString()
      : `${membersText.toString().substring(0, 25)}...`;
  };

  const navigation = useNavigation();
  //search
  const [search, setSearch] = useState('');
  const updateSearch = search => {
    setSearch(search);
  };
  const BlurHandler = () => {
    setIsSearch(!isSearch);
  };
  // end search

  // "more menu"
  const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';
  const [visible, setVisible] = React.useState(false);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);
  // end more menu
  return (
    <>
      {!isSearch ? (
        <Appbar
          elevated={true}
          style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
         <View>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
         </View>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate('SingleGroupSettings', {group: group});
            }}
            style={{
              flexDirection: 'row',
              width: '70%',
              alignItems: "flex-end",
              justifyContent: 'flex-start',
            }}>
            <Avatar.Image
              size={40}
              source={currentViewingGroup.imageURL ? {uri: currentViewingGroup.imageURL} : require('../assets/drawer/male-user.png')}
            />
            <View style={{marginLeft: 5}}>
              <Text style={{fontSize: 18, fontWeight: '700'}}>
                {currentViewingGroup.groupName}
              </Text>
              <Text
                style={{
                  width: '100%',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                  flexDirection: 'row',
                  // marginLeft: 5,
                }}>
                {getMembersOfGroup()}
              </Text>
            </View>
          </TouchableOpacity>

          <View
            style={{
              maxWidth: '20%',
              alignSelf: 'flex-end',
              justifyContent: 'flex-end',
            }}>
            <Appbar.Action
              icon="briefcase-outline"
              onPress={() => {
                onOpen();
              }}
            />
          </View>

        </Appbar>
      ) : (
        <View>
          <Searchbar
            placeholder="Search anything"
            onChangeText={updateSearch}
            value={search}
            cancelButtonTitle="cancel"
            autoFocus
            onBlur={BlurHandler}
            cancel={() => {
              console.log('hello');
            }}
          />
        </View>
      )}
    </>
  );
};

export default Header;
