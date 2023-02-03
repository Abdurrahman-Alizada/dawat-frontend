import React, {useEffect, useState, useContext} from 'react';
import {Text, StyleSheet, RefreshControl, View, FlatList, StatusBar} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import RenderItem from './SingleGroup';
import { AnimatedFAB, useTheme} from 'react-native-paper';
import  {
  useGetAllGroupsQuery,
  useDeleteGroupForUserMutation,
} from '../../../redux/reducers/groups/groupThunk';
import {Provider} from 'react-native-paper';
import Header from '../../../Components/Appbar';
import GroupCheckedHeader from '../../../Components/GroupCheckedHeader';
import GroupsList from '../../Skeletons/Groups';
import {PreferencesContext} from '../../../themeContext';

const Groups = ({navigation}) => {

  const  {data: allGroups, isError, isLoading, error, isFetching, refetch} = useGetAllGroupsQuery();
  const [deleteGroupForUser, {isLoading: deleteLoading}] = useDeleteGroupForUserMutation();

  // groups to delete
  const addGrouptoDelete1 = async () => {
    let userId = await AsyncStorage.getItem('userId');
    for (i = 0; i < checkedItems.length; i++) {
      let groupId = checkedItems[i];
      deleteGroupForUser({userId: userId , chatId: groupId});
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

  const fabStyle = {['right']: 16};
  // end fab

  // search - start
  const [listEmptyText, setListEmptyText] = useState("No Group yet")
  const [isSearch, setIsSearch] = useState(false);
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);
  
  const searchFilterFunction = (text) => {
    setMasterDataSource(allGroups)
    setFilteredDataSource(allGroups)
    if (text) {
      const newData = masterDataSource?.filter((item)=> {
          const itemData = item.groupName ? item.groupName.toUpperCase() : ''.toUpperCase();
          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
      });
      if(!newData?.length){
        setListEmptyText("Nothing find. Please enter some other text")
      }  
      setFilteredDataSource(newData);
    } else {
      setFilteredDataSource(masterDataSource);
    }
  };

  useEffect(()=>{
    searchFilterFunction(null)
  },[allGroups])
  // checked on long Press
  const [checked, setChecked] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]);
  const checkedBack = () => {
    setChecked(false);
    setCheckedItems([]);
  };

  const theme = useTheme()
  const {isThemeDark} = useContext(PreferencesContext);

  return (
    <View style={{flex: 1}}>
      <StatusBar backgroundColor={theme.colors.elevation.level2} barStyle={isThemeDark ? "light-content" : "dark-content"} />
    
      <Provider>
        {checked ? (
          <GroupCheckedHeader
            deleteF={addGrouptoDelete1}
            checkedBack={checkedBack}
          />
        ) : (
          <Header isSearch={isSearch} setIsSearch={setIsSearch} searchFilterFunction={searchFilterFunction} />
        )}

        {!isLoading ? (
          <View style={{flex: 1}}>
              <FlatList
                onScroll={onScroll}
                keyExtractor={item => item._id}
                data={isSearch ? filteredDataSource : allGroups}
                ListEmptyComponent={()=> 
                  <View style={{marginTop:"60%", alignItems: 'center'}}>
                  <Text>{listEmptyText}</Text>
                </View>
                }
                renderItem={item => (
                  <RenderItem
                    item={item.item}
                    navigation={navigation}
                    checked={checked}
                    setChecked={setChecked}
                    checkedItems={checkedItems}
                    setCheckedItems={setCheckedItems}
                    setIsSearch={setIsSearch}
                  />
                )}
                refreshControl={
                  <RefreshControl
                  refreshing={isFetching}
                  onRefresh={refetch}
                />
                }
              />
          </View>
        ) : (
          <View
            style={{
            margin:"3%"
            }}>
              <GroupsList />
          </View>
        )}
      </Provider>

      <AnimatedFAB
        icon={'plus'}
        label={'New Program'}
        extended={isExtended}
        onPress={() => onOpen()}
        visible={true}
        animateFrom={'right'}
        iconMode={'static'}
        style={[
          styles.fabStyle,
          {justifyContent: 'flex-end', alignItems: 'flex-end'},
          fabStyle,
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  fabStyle: {
    bottom: 16,
    right: 16,
    position: 'absolute',
  },
});

export default Groups;
