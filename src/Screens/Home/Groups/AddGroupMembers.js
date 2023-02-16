import {
  View,
  FlatList,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
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

import {useSelector} from 'react-redux';

const AddGroup = ({navigation, onClose, route}) => {
  const {
    groupName,
    groupDescription,
    imageURL,
    isChat,
    isInvitations,
    isMute,
    isTasks,
  } = route.params;
  const theme = useTheme();
  const [isSearch, setIsSearch] = useState(false);

  const currentLoginUser = useSelector(state => state.user?.currentLoginUser);
  const {data, isLoading, refetch, isFetching, isError, error} =
    useGetAllFriendsQuery(currentLoginUser?._id);

  const [addGroup, {isLoading: addGroupLoading}] = useAddGroupMutation();

  const [users, setUsers] = useState([]);
  const [userIds, setUserIds] = useState([]);

  const submitHandler = async () => {
    if (route.params.data) {
      fetch('https://api.cloudinary.com/v1_1/dblhm3cbq/image/upload', {
        method: 'post',
        body: route.params.data,
      })
        .then(res => res.json())
        .then(async data => {
          await addGroup({
            groupName: groupName,
            groupDescription: groupDescription,
            imageURL: data.secure_url,
            isChat: isChat,
            isTasks: isTasks,
            isInvitations: isInvitations,
            isMute: isMute,
            members: userIds,
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
      })
        .then(res => {
          navigation.navigate('HomeIndex');
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
      <View>
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
                    : require('../../../assets/drawer/userImage.png')
                }
              />
            </View>
          )}
          right={props => (
            <Checkbox
              {...props}
              status={include ? 'checked' : 'unchecked'}
              onPress={add}
            />
          )}
        />
      </View>
    );
  };

  return (
    <View style={{flex: 1}}>
      {isSearch ? (
        <Appbar.Header elevated={true}>
          <Searchbar
            elevation={6}
            placeholder="Search"
            icon={'arrow-left'}
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
        <Appbar.Header elevated={true}>
          <Appbar.BackAction
            onPress={() => {
              navigation.goBack();
            }}
          />
          <Appbar.Content title="Add group members" />
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
                    <TouchableOpacity
                      style={{marginRight: 15, alignItems: 'center'}}
                      key={index}>
                      {user?.imageURL ? (
                        <Avatar.Image
                          size={50}
                          source={{uri: user?.imageURL}}
                        />
                      ) : (
                        <Avatar.Text size={50} label={user.name.charAt(0)} />
                      )}
                      <Text style={{}} maxLength={10}>
                        {user.name.length > 8
                          ? user.name.substring(0, 8) + '..'
                          : user.name}
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
              <Text>You don't have any friend yet</Text>
              <Text>Please refresh or search for new friends</Text>
              <Button
                icon="refresh"
                mode="contained"
                style={{marginTop: '5%', marginHorizontal: '2%'}}
                onPress={refetch}>
                Refresh
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
          refreshControl={
            <RefreshControl refreshing={isFetching} onRefresh={refetch} />
          }
        />
      )}

      <FAB
        icon="check"
        label="Add"
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
  images: {
    alignSelf: 'center',
    width: 150,
    height: 150,
    marginHorizontal: 30,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  error: {
    color: 'red',
  },

  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalView: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: '5%',
    // justifyContent: 'center',
  },
});
