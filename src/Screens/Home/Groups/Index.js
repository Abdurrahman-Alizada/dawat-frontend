import React, {useEffect, useState, useContext, useLayoutEffect, useRef} from 'react';
import {RefreshControl, View, FlatList, StatusBar, BackHandler} from 'react-native';
import ErrorSnackBar from '../../../Components/ErrorSnackBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RenderItem from './SingleGroup';
import {Text, useTheme} from 'react-native-paper';
import {
  useGetAllGroupsQuery,
  useDeleteGroupForUserMutation,
  useAddMultipleGroupMutation,
} from '../../../redux/reducers/groups/groupThunk';
import Header from '../../../Components/Appbars/Appbar';
import GroupCheckedHeader from '../../../Components/GroupCheckedHeader';
import {ThemeContext} from '../../../themeContext';
import {useDispatch, useSelector} from 'react-redux';
import LoginForMoreFeatures from '../../../Components/LoginForMoreFeatures';
import {
  handleGroupsFlag,
  handlePinGroup,
  handlePinGroupFlag,
  handlePinGroupLoading,
  handleSelectedGroupLength,
} from '../../../redux/reducers/groups/groups';

const Groups = ({navigation}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const {isThemeDark} = useContext(ThemeContext);

  const PG = useSelector(state => state.groups?.pinGroup);
  const groupsFlag = useSelector(state => state.groups?.groupsFlag);
  const pinGroupFlag = useSelector(state => state.groups?.pinGroupFlag);

  const [localLoading, setLoacalLoading] = useState(true);
  const {data, isError, isLoading, error, isFetching, refetch} = useGetAllGroupsQuery();

  const [groups, setGroups] = useState([]);
  const [filterdGroups, setFilterdGroups] = useState([]);

  const groupHandler = async () => {
    setLoacalLoading(true);
    let localGroups = await getLocalGroups();
    if (data) {
      // let ids = new Set(localGroups?.map(d => d._id));
      // let updatedGroups = [...localGroups, ...data?.filter(d => !ids.has(d._id))];
      let ids = new Set(data?.map(d => d._id));
      let updatedGroups = [...data, ...localGroups?.filter(d => !ids.has(d._id))];
      setGroups(updatedGroups);
      setFilterdGroups(updatedGroups);
      await AsyncStorage.setItem('groups', JSON.stringify(updatedGroups));
    } else {
      setGroups(localGroups);
      setFilterdGroups(localGroups);
    }
    setLoacalLoading(false);
  };
  const getLocalGroups = async () => {
    let retString = await AsyncStorage.getItem('groups');
    let aa = JSON.parse(retString);
    return aa ? aa : [];
  };

  useEffect(() => {
    groupHandler();
    notSyncGroupHandler();
  }, [data, groupsFlag, PG, pinGroupFlag]);

  // sync with database if event is not uploaded to DB
  const [addMultipleGroup, {isLoading: addGroupLoading}] = useAddMultipleGroupMutation();

  const notSyncGroupHandler = async () => {
     let localGroups = await getLocalGroups();
    const notSyncGroupsArray = localGroups.filter(item => item.isSyncd == false);
    if (notSyncGroupsArray?.length && token) {
      addMultipleGroup({
        groups: notSyncGroupsArray,
      })
        .then(async res => {
          if (res.data) {
            let ids = new Set([
              ...res.data?.map(d => d._id),
              ...notSyncGroupsArray?.map(d => d._id),
            ]);
            let updatedGroups = [...res.data, ...localGroups?.filter(d => !ids.has(d._id))];
            setGroups(updatedGroups);
            setFilterdGroups(updatedGroups);
            await AsyncStorage.setItem('groups', JSON.stringify(updatedGroups));
            dispatch(handleGroupsFlag(!groupsFlag));
          }
        })
        .catch(err => {
          console.log('error in addMultipleGroup =>', err);
        });
    }
  };

  // search - start
  const [listEmptyText, setListEmptyText] = useState('No event yet');
  const [isSearch, setIsSearch] = useState(false);

  const searchFilterFunction = async text => {
    setLoacalLoading(true);
    if (text) {
      const newData = groups?.filter(item => {
        const itemData = item.groupName ? item.groupName.toUpperCase() : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      if (!newData?.length) {
        setListEmptyText('Nothing find. Please enter some other text');
      }
      setFilterdGroups(newData);
    } else {
      setFilterdGroups(groups);
    }
    setLoacalLoading(false);
  };

  // groups to delete
  const [deleteGroupForUser, {isLoading: deleteLoading}] = useDeleteGroupForUserMutation();
  const addGrouptoDelete1 = async () => {
    let userId = await AsyncStorage.getItem('userId');
    for (i = 0; i < checkedItems.length; i++) {
      let groupId = checkedItems[i];
      deleteGroupForUser({userId: userId, chatId: groupId}).then(res => {
        handleGroupDeleteLocal(groupId, i);
      });
    }
  };

  const handleGroupDeleteLocal = async (groupId, index) => {
    let groups = JSON.parse(await AsyncStorage.getItem('groups'));
    const newArr = groups.filter(object => {
      return object._id !== groupId;
    });
    await AsyncStorage.setItem('groups', JSON.stringify(newArr));

    let pg = JSON.parse(await AsyncStorage.getItem('pinGroup'));
    if (pg?._id === groupId) {
      await AsyncStorage.setItem('pinGroup', JSON.stringify(newArr?.length ? newArr[0] : null));
      dispatch(handlePinGroup(newArr?.length ? newArr[0] : {}));
      dispatch(handlePinGroupFlag(!pinGroupFlag));
    }
    if (index == checkedItems.length - 1) {
      dispatch(handleGroupsFlag(!groupsFlag));
    }
    checkedBack();
  };

  const pinHandler = async () => {
    dispatch(handlePinGroupLoading(true));
    let localGroups = await getLocalGroups();
    localGroups = localGroups.filter(object => {
      return object._id == checkedItems[0];
    });
    dispatch(handlePinGroup(JSON.stringify(localGroups[0])));
    await AsyncStorage.setItem('pinGroup', JSON.stringify(localGroups[0]));
    await AsyncStorage.setItem('pinGroupId', JSON.stringify(localGroups[0]?._id));
    dispatch(handlePinGroupFlag(!pinGroupFlag));
    localGroups = null;
    navigation.navigate('PinnedGroup');
    dispatch(handlePinGroupLoading(false));
  };
  const onOpen = () => {
    navigation.navigate('AddGroup');
  };

  const [token, setToken] = useState(null);
  useEffect(() => {
    const getToken = async () => {
      setToken(await AsyncStorage.getItem('token'));
    };
    getToken();
  }, []);

  // checked on long Press
  const [checked, setChecked] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]);
  const checkedBack = () => {
    setChecked(false);
    setCheckedItems([]);
    dispatch(handleSelectedGroupLength(0));
  };

  // snackebar
  const [snackbarVisible, setSnackBarVisible] = useState(false);
  useEffect(() => {
    setSnackBarVisible(isError);
  }, [isError]);

  useEffect(() => {
    const backAction = () => {
      if (checkedItems.length > 0) {
        checkedBack();
        return true;
      } else {
        return false;
      }
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      return backAction();
    });
    return () => {
      backHandler.remove();
    };
  }, [checkedItems]);

  return (
    <View style={{flex: 1}}>
      <StatusBar
        barStyle={isThemeDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />

      {checked ? (
        <GroupCheckedHeader
          deleteF={addGrouptoDelete1}
          pinHandler={pinHandler}
          checkedBack={checkedBack}
          checkedItemsLength={checkedItems.length}
          deleteLoading={deleteLoading}
          theme={theme}
        />
      ) : (
        <Header
          isSearch={isSearch}
          setIsSearch={setIsSearch}
          searchFilterFunction={searchFilterFunction}
          theme={theme}
          onOpen={onOpen}
        />
      )}
      <View
        style={{
          flex: 1,
          marginTop: 2,
          backgroundColor: theme.colors.background,
        }}>
        <FlatList
          keyExtractor={item => item?._id}
          data={filterdGroups}
          ListEmptyComponent={() => (
            <View style={{marginTop: '60%', alignItems: 'center'}}>
              {isLoading || localLoading ? <Text>Loading...</Text> : <Text>{listEmptyText}</Text>}
            </View>
          )}
          renderItem={item => (
            <RenderItem
              item={item.item}
              navigation={navigation}
              checked={checked}
              setChecked={setChecked}
              checkedItems={checkedItems}
              setCheckedItems={setCheckedItems}
              setIsSearch={setIsSearch}
              theme={theme}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={isFetching}
              onRefresh={() => {
                refetch();
                groupHandler();
              }}
            />
          }
        />
        <LoginForMoreFeatures
          token={token}
          isLoading={isLoading}
          localLoading={localLoading}
          navigation={navigation}
        />
      </View>

      <ErrorSnackBar
        isVisible={snackbarVisible && token}
        text={'Something went wrong'}
        onDismissHandler={() => setSnackBarVisible(false)}
      />
    </View>
  );
};

export default Groups;
