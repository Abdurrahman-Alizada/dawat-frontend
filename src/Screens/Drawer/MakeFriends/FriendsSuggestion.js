import {Text, FlatList, RefreshControl, View} from 'react-native';
import React, {useState} from 'react';
import {
  List,
  Button,
  useTheme,
  Avatar,
  Appbar,
  Searchbar,
} from 'react-native-paper';
import {
  useGetAllFriendsQuery,
  useSendFriendRequestMutation,
} from '../../../redux/reducers/Friendship/friendshipThunk';
import {useSelector} from 'react-redux';
import Skeleton from '../../Skeletons/InvitationsList';
const FriendsSuggestions = ({navigation}) => {
  const theme = useTheme();

  const currentLoginUser = useSelector(state => state.user?.currentLoginUser);
  const {data, isLoading, refetch, isFetching, isError, error} =
    useGetAllFriendsQuery(currentLoginUser?._id);

  const [sendFriendRequest, {isLoading: sendRequestLoading}] =
    useSendFriendRequestMutation();

  const handleSendFriendRequest = userB => {
    sendFriendRequest({userA: currentLoginUser?._id, userB: userB})
      .then(res => {
        console.log(res.data);
      })
      .catch(err => {
        console.log(err.message);
      });
  };

  // search
  const [search, setSearch] = useState('');
  const [isSearch, setIsSearch] = useState(false);
  const [listEmptyText, setListEmptyText] = useState('No Group yet');
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);

  const updateSearch = search => {
    setSearch(search);
    searchFilterFunction(search);
  };
  const BlurHandler = () => {
    setIsSearch(!isSearch);
  };

  const searchFilterFunction = text => {
    setMasterDataSource(data?.addFriend);
    setFilteredDataSource(data?.addFriend);
    if (text) {
      const newData = masterDataSource?.filter(item => {
        const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      if (!newData?.length) {
        setListEmptyText('Nothing find. Please enter some other text');
      }
      setFilteredDataSource(newData);
    } else {
      setFilteredDataSource(masterDataSource);
    }
  };

  const getHighlightedText = result =>
  result.split(new RegExp(`(${search})`, `gi`)).map((piece, index) => {
    return (
      <Text
        key={index}
        style={
          piece.toLocaleLowerCase() == search.toLocaleLowerCase()
            ? {backgroundColor: 'yellow', color: '#000'}
            : {}
        }>
        {piece}
      </Text>
    );
  });

  return (
    <View>
      {!isSearch ? (
        <Appbar.Header
          style={{backgroundColor: theme.colors.elevation.level2}}
          elevated={true}>
          <Appbar.BackAction
            onPress={() => {
              navigation.goBack();
            }}
          />
          <Appbar.Content title="Friends suggestions" />
          <Appbar.Action
            icon="magnify"
            color={theme.colors.onBackground}
            onPress={() => {
              setIsSearch(!isSearch);
            }}
          />
        </Appbar.Header>
      ) : (
        <Appbar.Header
          style={{backgroundColor: theme.colors.elevation.level2}}
          elevated={true}>
          <Searchbar
            placeholder="Search..."
            onChangeText={updateSearch}
            value={search}
            icon="close"
            onIconPress={BlurHandler}
            cancelButtonTitle="cancel"
            autoFocus
            iconColor={theme.colors.onSurface}
            inputStyle={{color: theme.colors.onSurface}}
            placeholderTextColor={theme.colors.onSurface}
            elevation={6}
            // loading={true}
            // onBlur={BlurHandler}
          />
        </Appbar.Header>
      )}

      {isLoading ? (
        <View style={{padding: '5%'}}>
          <Skeleton />
        </View>
      ) : (
        <FlatList
          data={isSearch ? filteredDataSource : data?.addFriend}
          ListEmptyComponent={() => (
            <View style={{marginTop: '60%', alignItems: 'center'}}>
              <Text>There isn't anything in Suggestions</Text>
              <Button
                icon="refresh"
                mode="contained"
                style={{marginTop: '5%'}}
                onPress={refetch}>
                Refresh
              </Button>
              <Button
                icon="home"
                mode="contained-tonal"
                style={{marginTop: '5%'}}
                onPress={() => {
                  navigation.navigate('HomeIndex');
                }}>
                Go to home
              </Button>
            </View>
          )}
          renderItem={({item}) => (
            <List.Item
              titleStyle={{fontWeight: '800'}}
              title={getHighlightedText(item.name)}
              description={() => (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: '5%',
                  }}>
                  <Button
                    style={{width: '48%'}}
                    mode="contained"
                    onPress={() => handleSendFriendRequest(item._id)}>
                    Add
                  </Button>
                  <Button
                    style={{width: '48%'}}
                    mode="outlined"
                    onPress={() => console.log('Pressed')}>
                    Delete
                  </Button>
                </View>
              )}
              left={props => (
                <Avatar.Image
                  size={80}
                  {...props}
                  source={
                    item.imageURL
                      ? {uri: item.imageURL}
                      : require('../../../assets/drawer/male-user.png')
                  }
                />
              )}
            />
          )}
          refreshControl={
            <RefreshControl refreshing={isFetching} onRefresh={refetch} />
          }
        />
      )}
    </View>
  );
};

export default FriendsSuggestions;
