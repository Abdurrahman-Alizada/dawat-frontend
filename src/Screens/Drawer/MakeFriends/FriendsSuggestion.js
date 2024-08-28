import {FlatList, RefreshControl, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {List, Button, useTheme, Avatar, Appbar, Searchbar, Text} from 'react-native-paper';
import {
  useDeleteFriendsSeggestionMutation,
  useGetAllFriendsQuery,
  useSendFriendRequestMutation,
} from '../../../redux/reducers/Friendship/friendshipThunk';
import {useSelector} from 'react-redux';
import Skeleton from '../../Skeletons/InvitationsList';
import {useTranslation} from 'react-i18next';

const FriendsSuggestions = ({navigation}) => {
  const theme = useTheme();
  const {t} = useTranslation();

  const currentLoginUser = useSelector(state => state.user?.currentLoginUser);
  const [selectedItems, setSelectedItems] = useState([]);

  const {data, isLoading, refetch, isFetching, isError, error} = useGetAllFriendsQuery(
    currentLoginUser?._id,
  );

  // single item to render
  const RenderItem = ({item}) => {
    const [sendFriendRequest, {isLoading: sendRequestLoading}] = useSendFriendRequestMutation();

    const [deleteFriendsSeggestion, {isLoading: deleteFriendsSeggestionLoading}] =
      useDeleteFriendsSeggestionMutation();

    const [clicked, setClicked] = useState(false);
    const [textAfterAction, setTextAfterAction] = useState('');

    const handledeleteFriendsSeggestion = userB => {
      setSelectedItems([...selectedItems, item._id]);
      setTextAfterAction(`Suggestion of ${item.name} has been deleted`);
      setClicked(true);

      deleteFriendsSeggestion({userA: currentLoginUser?._id, userB: userB})
        .then(res => {
          // console.log(res.data);
        })
        .catch(err => {
          console.log(err.message);
        });
    };
    const handleSendFriendRequest = userB => {
      setSelectedItems([...selectedItems, item._id]);
      setTextAfterAction(`Your request has been sent to ${item.name}`);
      setClicked(true);

      sendFriendRequest({userA: currentLoginUser?._id, userB: userB})
        .then(res => {
          console.log(res.data);
        })
        .catch(err => {
          console.log(err.message);
        });
    };
    return (
      <List.Item
        titleStyle={{fontWeight: '800'}}
        title={getHighlightedText(item.name)}
        description={() => (
          <View>
            {/* <Text>@username</Text> */}
            {clicked || selectedItems.includes(item._id) ? (
              <Text>{textAfterAction}</Text>
            ) : (
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: '4%',
                }}>
                <TouchableOpacity
                  onPress={() => handleSendFriendRequest(item._id)}
                  style={{
                    borderRadius: 5,
                    width: '45%',
                    paddingVertical: '2%',
                    backgroundColor: theme.colors.primary,
                  }}>
                  <Text style={{color: theme.colors.onPrimary, textAlign: 'center'}}>
                    {t('Add')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handledeleteFriendsSeggestion(item._id)}
                  style={{
                    borderRadius: 5,
                    width: '45%',
                    paddingVertical: '2%',
                    backgroundColor: theme.colors.background,
                    borderColor: theme.colors.tertiary,
                    borderWidth: 1,
                    marginHorizontal: '4%',
                  }}>
                  <Text style={{color: theme.colors.tertiary, textAlign: 'center'}}>{t("Delete")}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
        left={props => (
          <Avatar.Image
            size={70}
            {...props}
            source={
              item.imageURL ? {uri: item.imageURL} : require('../../../assets/drawer/male-user.png')
            }
          />
        )}
      />
    );
  };

  // search
  const [search, setSearch] = useState('');
  const [isSearch, setIsSearch] = useState(false);
  const [listEmptyText, setListEmptyText] = useState('No event yet');
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

  return (
    <View style={{flex: 1}}>
      {!isSearch ? (
        <Appbar.Header style={{backgroundColor: theme.colors.background}} elevated={true}>
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
        <Appbar.Header style={{backgroundColor: theme.colors.elevation.level2}} elevated={true}>
          <Searchbar
            placeholder={t("Search...")}
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
              <Text>{t("There isn't anything in Suggestions")}</Text>
              <Button icon="refresh" mode="contained" style={{marginTop: '5%'}} onPress={refetch}>
                Refresh
              </Button>
            </View>
          )}
          renderItem={({item}) => <RenderItem item={item} />}
          refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
        />
      )}
    </View>
  );
};

export default FriendsSuggestions;
