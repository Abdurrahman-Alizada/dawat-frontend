import React, {useEffect, useState, useContext} from 'react';
import {
  RefreshControl,
  ImageBackground,
  View,
  Image,
  FlatList,
  StatusBar,
  StyleSheet,
} from 'react-native';
import ErrorSnackBar from '../../../Components/ErrorSnackBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RenderItem from './SingleGroup';
import {AnimatedFAB, Text, useTheme, Button, Divider, Card} from 'react-native-paper';
import {
  useGetAllGroupsQuery,
  useDeleteGroupForUserMutation,
} from '../../../redux/reducers/groups/groupThunk';
import {Provider} from 'react-native-paper';
import Header from '../../../Components/Appbars/Appbar';
import GroupCheckedHeader from '../../../Components/GroupCheckedHeader';
import GroupsList from '../../Skeletons/Groups';
import {PreferencesContext} from '../../../themeContext';
import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';

const Groups = ({navigation}) => {
  const [token, setToken] = useState(null);

  const [allGroups, setAllGroups] = useState([]);

  const [localLoading, setLoacalLoading] = useState(true);
  const {data, isError, isLoading, error, isFetching, refetch} =
    useGetAllGroupsQuery();
  const [deleteGroupForUser, {isLoading: deleteLoading}] =
    useDeleteGroupForUserMutation();

  // groups to delete
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
  const [isExtended, setIsExtended] = React.useState(true);

  const onScroll = ({nativeEvent}) => {
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;

    setIsExtended(currentScrollPosition <= 0);
  };

  // search - start
  const [listEmptyText, setListEmptyText] = useState('No Group yet');
  const [isSearch, setIsSearch] = useState(false);
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);

  const searchFilterFunction = async text => {
    setLoacalLoading(true);
    let localGroups = await getLocalGroups();
    if (data) {
      let ids = new Set(localGroups.map(d => d._id));
      setAllGroups([...localGroups, ...data.filter(d => !ids.has(d._id))]);
      // setAllGroups([...data, ...localGroups]);
    } else {
      setAllGroups(localGroups);
    }
    setMasterDataSource(allGroups);
    setFilteredDataSource(allGroups);
    if (text) {
      const newData = masterDataSource?.filter(item => {
        const itemData = item.groupName
          ? item.groupName.toUpperCase()
          : ''.toUpperCase();
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
    setLoacalLoading(false);
  };

  const getLocalGroups = async () => {
    let retString = await AsyncStorage.getItem('groups');
    let aa = JSON.parse(retString);
    return aa ? aa : [];
  };

  const PG = useSelector(state => state.groups?.pinGroup);

  useEffect(() => {
    searchFilterFunction(null);
  }, [data, PG]);

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

  const theme = useTheme();
  const {isThemeDark} = useContext(PreferencesContext);

  // snackebar
  const [snackbarVisible, setSnackBarVisible] = useState(false);
  const [snackebarText, setSnackBarText] = useState('');
  useEffect(() => {
    setSnackBarVisible(isError);
  }, [isError]);

  return (
    <View style={{flex: 1}}>
      <StatusBar
        barStyle={isThemeDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />

      <Provider>
        {checked ? (
          <GroupCheckedHeader
            deleteF={addGrouptoDelete1}
            checkedBack={checkedBack}
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
            flex:1,
            marginTop: 2,
            backgroundColor: theme.colors.background,
          }}>
          <FlatList
            onScroll={onScroll}
            keyExtractor={item => item?._id}
            data={isSearch ? filteredDataSource : allGroups}
            ListEmptyComponent={() => (
              <View style={{marginTop: '60%', alignItems: 'center'}}>
                {isLoading || localLoading ? (
                  <Text>Loading...</Text>
                ) : (
                  <Text>{listEmptyText}</Text>
                )}
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
              <RefreshControl refreshing={isFetching} onRefresh={refetch} />
            }
            // ListFooterComponent={() => (
            //   <View>
            //     {true && (
            //       <Card contentStyle={{bottom:0, alignItems:"center", padding:"3%"}}>
            //          <View style={{width:"90%"}}>
            //           <Text style={{fontSize:20, textAlign:"center"}}>Unlock more features</Text>
            //           <Text style={{textAlign:"center"}} >Add other participant to your groups, Make backup and keep record remotly</Text>
            //          </View>
            //         <Card.Actions >
            //           <Button onPress={()=>navigation.navigate("Auth", {screen :"Login"})}>Login</Button>
            //           <Button onPress={()=>navigation.navigate("Auth", {screen :"SignUpwithEmail"})}>Create account</Button>
            //         </Card.Actions>
            //       </Card>
            //     )}
            //     {/* {isError && (
            //         <View style={{alignItems: 'center', marginTop: 10}}>
            //           <Divider />
            //           <View
            //             style={{
            //               flexDirection: 'row',
            //               alignItems: 'center',
            //               marginTop: 10,
            //               justifyContent: 'space-between',
            //             }}>
            //             <Text style={{fontSize: 20}}>Something went wrong</Text>
            //             <Button
            //               icon="refresh"
            //               mode="text"
            //               style={{marginHorizontal: '5%'}}
            //               onPress={refetch}>
            //               Refresh
            //             </Button>
            //           </View>
            //         </View>
            //       )} */}
            //   </View>
            // )}
          />
           <View style={{position:"absolute", bottom:0, width:"100%"}}>
                {!token && !isLoading && !localLoading && (
                  <Card contentStyle={{bottom:0, alignItems:"center", padding:"3%"}}>
                     <View style={{width:"90%"}}>
                      <Text style={{fontSize:20, textAlign:"center"}}>Unlock more features</Text>
                      <Text style={{textAlign:"center"}} >Add other participant to your groups, Make backup and keep record remotly</Text>
                     </View>
                    <Card.Actions >
                      <Button onPress={()=>navigation.navigate("Auth", {screen :"Login"})}>Login</Button>
                      <Button onPress={()=>navigation.navigate("Auth", {screen :"SignUpwithEmail"})}>Create account</Button>
                    </Card.Actions>
                  </Card>
                )}
              </View>
        </View>
      </Provider>

      {/* <AnimatedFAB
        icon={'plus'}
        label={'Add New Event'}
        extended={isExtended}
        onPress={() => onOpen()}
        visible={true}
        animateFrom={'right'}
        iconMode="static"
        style={{bottom: snackbarVisible && token? 70 : 16, right: 16}}
      /> */}

      <ErrorSnackBar
        isVisible={snackbarVisible && token}
        text={'Something went wrong'}
        onDismissHandler={() => setSnackBarVisible(false)}
      />
    </View>
  );
};

export default Groups;
