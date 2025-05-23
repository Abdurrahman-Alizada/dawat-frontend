import {
  View,
  FlatList,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  I18nManager,
} from 'react-native';
import React, {useState} from 'react';
import Skeleton from '../../Skeletons/InvitationsList';
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
import {useGetAllFriendsQuery} from '../../../redux/reducers/Friendship/friendshipThunk';
import {useAddGroupMutation} from '../../../redux/reducers/groups/groupThunk';
import {handleGroupsFlag, handlePinGroup} from '../../../redux/reducers/groups/groups';
import {useSelector, useDispatch} from 'react-redux';
import {groupApi} from '../../../redux/reducers/groups/groupThunk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createRandomId from '../../../utils/createRandomId';
import {useTranslation} from 'react-i18next';

const AddGroup = ({navigation, route}) => {
  const dispatch = useDispatch();
  const {t} = useTranslation();

  const {groupName, groupDescription, imageURL, isChat, isInvitations, isMute, isTasks, time} =
    route.params;
  const theme = useTheme();
  const [isSearch, setIsSearch] = useState(false);

  const currentLoginUser = useSelector(state => state.user?.currentLoginUser);
  const groupsFlag = useSelector(state => state.groups?.groupsFlag);

  const {data, isLoading, refetch, isFetching, isError, error} = useGetAllFriendsQuery(
    currentLoginUser?._id,
  );

  const [addGroup, {isLoading: addGroupLoading}] = useAddGroupMutation();

  const [users, setUsers] = useState([]);
  const [userIds, setUserIds] = useState([]);

  const createLocalGroup = async values => {
    let group = values
      ? values
      : {
          _id: createRandomId(12),
          isSyncd: false,
          groupName: groupName,
          groupDescription: groupDescription,
          time: JSON.parse(time),
        };

    let groups = await AsyncStorage.getItem('groups');
    if (groups) {
      let data = JSON.parse(groups);
      let newGroups = [...data, group];
      await AsyncStorage.setItem('groups', JSON.stringify(newGroups));
      data = newGroups = null;
    } else {
      let newGroups = [group];
      await AsyncStorage.setItem('groups', JSON.stringify(newGroups));
      newGroups = null;
    }
    dispatch(handleGroupsFlag(!groupsFlag));
    group = groups = null;
    navigation.navigate('HomeIndex');
  };

  const submitHandler = async () => {
    if (route.params.data) {
      fetch('https://api.cloudinary.com/v1_1/dblhm3cbq/image/upload', {
        method: 'post',
        body: route.params.data,
      })
        .then(res => res.json())
        .then(async data => {
          addGroup({
            groupName: groupName,
            groupDescription: groupDescription,
            imageURL: data.secure_url,
            isChat: isChat,
            isTasks: isTasks,
            isInvitations: isInvitations,
            isMute: isMute,
            members: userIds,
            time: JSON.parse(time),
          })
            .then(res => {
              navigation.navigate('HomeIndex');
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log('An Error Occured While Uploading group image', err);
          return;
        });
    } else {
      await addGroup({
        groupName: groupName,
        groupDescription: groupDescription,
        imageURL: imageURL,
        isChat: isChat,
        isTasks: isTasks,
        isInvitations: isInvitations,
        isMute: isMute,
        members: userIds,
        time: JSON.parse(time),
      })
        .then(res => {
          if (res.data?._id) {
            createLocalGroup(res.data);
          } else {
            createLocalGroup();
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

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
      <List.Item
        onPress={add}
        title={itemProps.name}
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
                  : require('../../../assets/drawer/male-user.png')
              }
            />
          </View>
        )}
        right={props => (
          <Checkbox {...props} status={include ? 'checked' : 'unchecked'} onPress={add} />
        )}
      />
    );
  };

  return (
    <View style={{flex: 1}}>
      {isSearch ? (
        <Appbar.Header elevated={true}>
          <Searchbar
            elevation={6}
            placeholder={t("Search...")}
            icon={I18nManager.isRTL ? "arrow-right" : 'arrow-left'}
            autoFocus
            // loading={true}
            onIconPress={() => {
              setIsSearch(false);
            }}
            // onChangeText={onChangeSearch}
            // value={searchQuery}
          />
        </Appbar.Header>
      ) : (
        <Appbar.Header style={{backgroundColor: theme.colors.background}} elevated={true}>
          <Appbar.BackAction
            onPress={() => {
              navigation.goBack();
            }}
          />
          <Appbar.Content title={t("Add event members")} />
          <Appbar.Action
            icon="magnify"
            onPress={() => {
              setIsSearch(true);
            }}
          />
        </Appbar.Header>
      )}

      {isLoading ? (
        <Skeleton />
      ) : (
        <FlatList
          data={data?.accepted}
          // stickyHeaderHiddenOnScroll
          stickyHeaderIndices={[0]}
          ListHeaderComponent={() => (
            <View style={{backgroundColor: theme.colors.background}}>
              {users?.length > 0 ? (
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
            <View style={{marginTop: '60%', alignItems: 'center'}}>
              <Text>{t("You don't have any friend left to add in this event")}</Text>
              <Text>{t("But still you can create event by clicking on Add button")}</Text>
              <Button
                icon="refresh"
                mode="contained"
                style={{marginTop: '5%', marginHorizontal: '2%'}}
                onPress={refetch}>
                {t("Refresh")}
              </Button>
              {/* <Button
              icon="account-search"
              mode="text"
              style={{marginTop: '5%',marginHorizontal:"2%"}}
              onPress={()=>navigation.navigate('FriendsSuggestions')}
              >
              Search for friends
            </Button> */}
            </View>
          )}
          renderItem={({item}) => <Item itemProps={item} />}
          refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
        />
      )}

      <FAB
        icon="check"
        label={t("Add")}
        style={styles.fab}
        disabled={addGroupLoading}
        loading={addGroupLoading}
        onPress={submitHandler}
      />
    </View>
  );
};

export default AddGroup;

const styles = StyleSheet.create({
  
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  error: {
    color: 'red',
  }
});
