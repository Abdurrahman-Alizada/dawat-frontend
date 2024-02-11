import {
  View,
  FlatList,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Skeleton from '../../../../Skeletons/InvitationsList';
import {
  Text,
  FAB,
  Searchbar,
  Button,
  Appbar,
  List,
  Avatar,
  Divider,
  Checkbox,
  useTheme,
} from 'react-native-paper';
import {useGetAllFriendsQuery} from '../../../../../redux/reducers/Friendship/friendshipThunk';
import {handleCurrentViewingGroup} from '../../../../../redux/reducers/groups/groups';
import {useAddUserToGroupMutation} from '../../../../../redux/reducers/groups/groupThunk';
import {useSelector, useDispatch} from 'react-redux';
import ErrorSnackBar from '../../../../../Components/ErrorSnackBar';
import {useTranslation} from 'react-i18next';

const UpdateGroupMembers = ({navigation, onClose, route}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const {t} = useTranslation();

  const currentLoginUser = useSelector(state => state.user?.currentLoginUser);
  const currentViewingGroup = useSelector(state => state.groups?.currentViewingGroup);
  const {data, isLoading, refetch, isFetching, isError, error} = useGetAllFriendsQuery(
    currentLoginUser?._id,
  );

  const [friends, setFriends] = useState(data?.accepted);
  useEffect(() => {
    setFriends(data?.accepted);
  }, [data]);

  const [addUserToGroup, {isLoading: addUserLoading}] = useAddUserToGroupMutation();

  const [users, setUsers] = useState([]);
  const [userIds, setUserIds] = useState([]);

  const handleAddMember = async () => {
    addUserToGroup({
      chatId: currentViewingGroup._id,
      userId: users,
    })
      .then(res => {
        dispatch(handleCurrentViewingGroup(res.data));
        navigation.navigate('SingleGroupSettings');
      })
      .catch(e => {
        console.log('error in handleAddMember', e);
      });
  };

  const getResponsibles = () => {
    if (friends) {
      for (let i = 0; i < currentViewingGroup.users?.length; i++) {
        let foundUser = friends.find(e => e._id === currentViewingGroup?.users[i]?._id);
        if (foundUser) {
          setFriends(friends.filter(friend => friend._id !== foundUser._id));
        }
      }
    }
  };

  // search
  const [search, setSearch] = useState('');
  const [isSearch, setIsSearch] = useState(false);
  const [listEmptyText, setListEmptyText] = useState(
    "You don't have any friend left to add to event"
  );
  const [filteredDataSource, setFilteredDataSource] = useState([]);

  const updateSearch = search => {
    setSearch(search);
    searchFilterFunction(search);
  };

  const searchFilterFunction = text => {
    setFilteredDataSource(friends);
    if (text) {
      const newData = friends?.filter(item => {
        const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      if (!newData?.length) {
        setListEmptyText('Nothing found');
      }
      setFilteredDataSource(newData);
    } else {
      setFilteredDataSource(friends);
    }
  };

  const getHighlightedText = result =>
    result?.split(new RegExp(`(${search})`, `gi`)).map((piece, index) => {
      return (
        <Text
          key={index}
          style={
            piece.toLocaleLowerCase() == search.toLocaleLowerCase()
              ? {fontWeight: 'bold', color: theme.colors.primary}
              : {fontWeight: 'bold'}
          }>
          {piece}
        </Text>
      );
    });

  const Item = ({itemProps}) => {
    const [include, setInclude] = useState(userIds.includes(itemProps._id));
    const add = () => {
      if (include) {
        setUserIds(userIds.filter(userId => userId !== itemProps._id));
        setUsers(users.filter(user => user._id !== itemProps._id));
      } else {
        setUserIds([...userIds, itemProps._id]);
        setUsers([...users, itemProps]);
      }

      setInclude(!include);
    };
    return (
      <View>
        <List.Item
          onPress={add}
          title={getHighlightedText(itemProps.name)}
          // description={itemProps.email}
          left={props => (
            <View>
              <Avatar.Image
                {...props}
                variant="image"
                size={50}
                source={
                  itemProps?.imageURL
                    ? {uri: itemProps?.imageURL}
                    : require('../../../../../assets/drawer/male-user.png')
                }
              />
            </View>
          )}
          right={props => (
            <Checkbox {...props} status={include ? 'checked' : 'unchecked'} onPress={add} />
          )}
        />
      </View>
    );
  };

  // error snackbar
  const [snackbarVisible, setSnackBarVisible] = useState(false);

  return (
    <View style={{flex: 1}}>
      {isSearch ? (
        <Appbar.Header elevated style={{backgroundColor:isSearch? theme.colors.elevation.level3 : theme.colors.background}}>
          <Searchbar
            elevation={7}
            theme={{roundness: 0}}
            placeholder={t("Search...")}
            icon={'close'}
            autoFocus
            onIconPress={() => {
              setSearch('');
              setIsSearch(false);
            }}
            onChangeText={updateSearch}
            value={search}
          />
        </Appbar.Header>
      ) : (
        <Appbar.Header style={{backgroundColor: theme.colors.background}} elevated>
          <Appbar.BackAction
            onPress={() => {
              navigation.goBack();
            }}
          />
          <Appbar.Content title={t("Update event members")} />
          <Appbar.Action
            icon="magnify"
            onPress={() => {
              setFilteredDataSource(friends);
              setIsSearch(true);
            }}
          />
        </Appbar.Header>
      )}

      {isLoading ? (
        <Skeleton />
      ) : (
        <FlatList
          data={isSearch ? filteredDataSource : friends}
          onContentSizeChange={getResponsibles}
          stickyHeaderIndices={[0]}
          ListHeaderComponent={() => (
            <View style={{backgroundColor: theme.colors.background}}>
              {users.length > 0 ? (
                <ScrollView
                  horizontal={true}
                  contentContainerStyle={{
                    paddingHorizontal: '4%',
                    paddingVertical: '2%',
                  }}
                  // showsHorizontalScrollIndicator={false}
                >
                  {users.map((user, index) => (
                    <TouchableOpacity style={{marginRight: 15, alignItems: 'center'}} key={index}>
                      {user?.imageURL ? (
                        <Avatar.Image size={50} source={{uri: user?.imageURL}} />
                      ) : (
                        <Avatar.Text size={50} label={user.name.charAt(0)} />
                      )}
                      <Text style={{}} maxLength={10}>
                        {user.name.length > 8 ? user.name.substring(0, 8) + '..' : user.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              ) : null}
              <Divider />
            </View>
          )}
          ListEmptyComponent={() => (
            <View style={{marginTop: '40%', alignItems: 'center'}}>
              <Text>{t(listEmptyText)}</Text>
              <Button icon="refresh" mode="outlined" style={{marginTop: '5%'}} onPress={refetch}>
                {t("Refresh")}
              </Button>
            </View>
          )}
          renderItem={({item}) => <Item itemProps={item} />}
          refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
        />
      )}

      <FAB
        icon="check"
        label={t("Add")}
        style={{bottom: snackbarVisible ? 70 : 16, right: 16, position: 'absolute'}}
        disabled={addUserLoading}
        loading={addUserLoading}
        onPress={handleAddMember}
      />

      <ErrorSnackBar
        isVisible={snackbarVisible}
        text={t('Something went wrong')}
        onDismissHandler={setSnackBarVisible}
      />
    </View>
  );
};

export default UpdateGroupMembers;
