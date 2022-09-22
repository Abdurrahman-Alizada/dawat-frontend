import React, {useEffect, useState} from 'react';
import {Text, StyleSheet, RefreshControl, View, FlatList} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import RenderItem from './SingleGroup';
import Header from './Header';
import {ActivityIndicator, AnimatedFAB} from 'react-native-paper';

import {useSelector, useDispatch} from 'react-redux';
import {allGroups} from '../../../redux/reducers/groups/groupThunk';
import {Provider} from 'react-native-paper';
const Groups = ({navigation}) => {
  const [userId, setuserId] = React.useState(null);
  // const [isSearch, setIsSearch] = React.useState(false);
  const groupList = useSelector(state => state.groups);
  const animating = useSelector(state => state.groups.groupLoader);
  const dispatch = useDispatch();

  const getUserInfo = async () => {
    let userId = await AsyncStorage.getItem('userId');
    setuserId(userId);
  };

  const getAllGroups = () => {
    dispatch(allGroups());
  };

  useEffect(() => {
    getUserInfo();
    getAllGroups();
  }, []);

  const onOpen = () => {
    navigation.navigate('AddGroup');
  };

  // fab

  const [isExtended, setIsExtended] = React.useState(true);

  const onScroll = ({nativeEvent}) => {
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;

    setIsExtended(currentScrollPosition <= 0);
  };

  const fabStyle = {['right']: 16};
  // end fab

  return (
    <View style={{backgroundColor: '#fff', flexGrow: 1}}>
      <Provider>
        {!animating ? (
          <View style={{flex:1}}>
            {groupList.totalgroups?.length > 0 ? (
              <FlatList
                onScroll={onScroll}
                keyExtractor={item => item._id}
                data={groupList.totalgroups}
                renderItem={item => RenderItem(item, navigation)}
                refreshControl={
                  <RefreshControl
                    //refresh control used for the Pull to Refresh
                    refreshing={animating}
                    onRefresh={getAllGroups}
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
