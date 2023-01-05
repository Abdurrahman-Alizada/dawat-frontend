import React, {useEffect, useState} from 'react';
import {Text, StyleSheet, RefreshControl, View, FlatList} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import RenderItem from './SingleGroup';
import {ActivityIndicator, AnimatedFAB} from 'react-native-paper';

import {useSelector, useDispatch} from 'react-redux';
import  {
  groupApi,
  useGetAllGroupsQuery,
  useDeleteGroupForUserMutation,
} from '../../../redux/reducers/groups/groupThunk';
import {Provider} from 'react-native-paper';
import Header from '../../../Components/Appbar';
import GroupCheckedHeader from '../../../Components/GroupCheckedHeader';
const Groups = ({navigation}) => {
  const animating = useSelector(state => state.groups.groupLoader);

  const  {data: allGroups, isError, isLoading, error} = useGetAllGroupsQuery();
  const [deleteGroupForUser, {isLoading: deleteLoading}] =
    useDeleteGroupForUserMutation();

  // groups to delete
  const addGrouptoDelete1 = async () => {
    let userId = await AsyncStorage.getItem('userId');

    for (i = 0; i < checkedItems.length; i++) {
      let groupId = checkedItems[i];
      deleteGroupForUser({userId, groupId});
    }
    setCheckedItems([]);
    setChecked(false);
  };

  const onOpen = () => {
    navigation.navigate('AddGroup');
  };

  //  const adkfj = groupApi.endpoints.getAllGroups.useQuery()
  // const onRefreshHandler = ()=>{
  // }

  // fab
  
  const [isExtended, setIsExtended] = React.useState(true);

  const onScroll = ({nativeEvent}) => {
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;

    setIsExtended(currentScrollPosition <= 0);
  };

  const fabStyle = {['right']: 16};
  // end fab
  const [isSearch, setIsSearch] = React.useState(false);

  const [checked, setChecked] = React.useState(false);
  const [checkedItems, setCheckedItems] = React.useState([]);
  const checkedBack = () => {
    setChecked(false);
    setCheckedItems([]);
  };

  return (
    <View style={{flex: 1}}>
      <Provider>
        {checked ? (
          <GroupCheckedHeader
            deleteF={addGrouptoDelete1}
            checkedBack={checkedBack}
          />
        ) : (
          <Header isSearch={isSearch} setIsSearch={setIsSearch} />
        )}

        {!isLoading ? (
          <View style={{flex: 1}}>
            {allGroups?.length > 0 ? (
              <FlatList
                onScroll={onScroll}
                keyExtractor={item => item._id}
                data={allGroups}
                renderItem={item => (
                  <RenderItem
                    item={item.item}
                    navigation={navigation}
                    checked={checked}
                    setChecked={setChecked}
                    checkedItems={checkedItems}
                    setCheckedItems={setCheckedItems}
                  />
                )}
                refreshControl={
                  <RefreshControl
                    //refresh control used for the Pull to Refresh
                    refreshing={isLoading}
                    // onRefresh={()=>adkfj()}
                  />
                }
              />
            ) : (
              <View
                style={{
                  alignSelf: 'center',
                  justifyContent: 'center',
                  flex: 1,
                }}>
                <Text>No group yet</Text>
              </View>
            )}
          </View>
        ) : (
          <View
            style={{
              alignSelf: 'center',
              justifyContent: 'center',
              flex: 1,
            }}>
            <ActivityIndicator animating={animating} />
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
