import React, {useEffect, useState, useContext, useLayoutEffect, useRef} from 'react';
import {RefreshControl, View, FlatList, StatusBar} from 'react-native';
import ErrorSnackBar from '../../../Components/ErrorSnackBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RenderItem from './SingleGroup';
import {Text, useTheme} from 'react-native-paper';
import {useGetAllGroupsQuery, useDeleteGroupForUserMutation} from '../../../redux/reducers/groups/groupThunk';
import Header from '../../../Components/Appbars/Appbar';
import GroupCheckedHeader from '../../../Components/GroupCheckedHeader';
import {ThemeContext} from '../../../themeContext';
import {useSelector} from 'react-redux';
import LoginForMoreFeatures from '../../../Components/LoginForMoreFeatures';

const Groups = ({navigation}) => {
  const theme = useTheme();
  const {isThemeDark} = useContext(ThemeContext);

  const PG = useSelector(state => state.groups?.pinGroup);
  const groupsFlag = useSelector(state => state.groups?.groupsFlag);

  const [localLoading, setLoacalLoading] = useState(true);
  const {data, isError, isLoading, error, isFetching, refetch} = useGetAllGroupsQuery();

  const [groups, setGroups] = useState([]);
  const [filterdGroups, setFilterdGroups] = useState([]);

  const groupHandler = async () => {
    setLoacalLoading(true);
    let localGroups = await getLocalGroups();
    if (data) {
      let ids = new Set(localGroups?.map(d => d._id));
      let updatedGroups = [...localGroups, ...data?.filter(d => !ids.has(d._id))];
      setGroups(updatedGroups);
      setFilterdGroups(updatedGroups);
      await AsyncStorage.setItem('groups', JSON.stringify(updatedGroups));
    } else {
      setGroups(localGroups);
      setFilterdGroups(localGroups);
    }
    setLoacalLoading(false);
  };
  useEffect(() => {
    groupHandler();
  }, [data, groupsFlag, PG]);

  const getLocalGroups = async () => {
    let retString = await AsyncStorage.getItem('groups');
    let aa = JSON.parse(retString);
    return aa ? aa : [];
  };

  // search - start
  const [listEmptyText, setListEmptyText] = useState('No Group yet');
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
      deleteGroupForUser({userId: userId, chatId: groupId});
    }
    setCheckedItems([]);
    setChecked(false);
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
  };

  // snackebar
  const [snackbarVisible, setSnackBarVisible] = useState(false);
  useEffect(() => {
    setSnackBarVisible(isError);
  }, [isError]);

  return (
    <View style={{flex: 1}}>
      <StatusBar barStyle={isThemeDark ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.background} />

      {checked ? (
        <GroupCheckedHeader deleteF={addGrouptoDelete1} checkedBack={checkedBack} theme={theme} />
      ) : (
        <Header isSearch={isSearch} setIsSearch={setIsSearch} searchFilterFunction={searchFilterFunction} theme={theme} onOpen={onOpen} />
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
          refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
        />
        <LoginForMoreFeatures token={token} isLoading={isLoading} localLoading={localLoading} navigation={navigation} />
      </View>

      <ErrorSnackBar isVisible={snackbarVisible && token} text={'Something went wrong'} onDismissHandler={() => setSnackBarVisible(false)} />
    </View>
  );
};

export default Groups;
