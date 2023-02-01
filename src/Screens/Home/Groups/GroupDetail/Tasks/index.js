// ==========================================
//  Title:  AddInviti
//  Author: Abdur Rahman
//  createdAt:   26 Oct, 2022
//  Modified by : -------
// ==========================================

import React, {useState, useRef} from 'react';
import {StyleSheet, FlatList, View, Text, RefreshControl} from 'react-native';
import RenderItem from './SingleTask';
import {useSelector, useDispatch} from 'react-redux';
import {Modalize} from 'react-native-modalize';
import {height} from '../../../../../GlobalStyles';
import {FAB, Provider} from 'react-native-paper';
import TaskBrief from './TaskBrief';
import {useNavigation} from '@react-navigation/native';
import TasksSkeleton from '../../../../Skeletons/Tasks';
import {useGetAllTasksQuery} from '../../../../../redux/reducers/groups/tasks/taskThunk';

const Task = ({route}) => {
  const {groupId} = route.params;

  const navigation = useNavigation();
  const [currentItem, setCurrentItem] = useState({});

  const {data, isError, isLoading, error, isFetching, refetch} =
    useGetAllTasksQuery({
      groupId,
    });

  const modalizeRef = useRef(null);
  const FABHandler = () => {
    navigation.navigate('AddTask', {groupId: groupId});
  };

  const cardHandler = item => {
    setCurrentItem(item);
    modalizeRef.current?.open();
  };
  const closeModalize = () => {
    modalizeRef.current?.close();
  };
  return (
    <Provider style={{flex: 1}}>
      {isLoading ? (
        <View style={{padding: '4%'}}>
          <TasksSkeleton />
        </View>
      ) : (
        <FlatList
          data={data}
          ListEmptyComponent={() => (
            <View style={{marginTop: '60%', alignItems: 'center'}}>
              <Text>No task yet</Text>
            </View>
          )}
          renderItem={({item}) => (
            <RenderItem item={item} cardHandler={cardHandler} />
          )}
          refreshControl={
            <RefreshControl refreshing={isFetching} onRefresh={refetch} />
          }
        />
      )}

      <FAB
        icon="plus"
        size="medium"
        // variant='tertiary'
        style={styles.fab}
        onPress={() => FABHandler()}
      />

      <Modalize ref={modalizeRef} adjustToContentHeight={true}>
        <TaskBrief
          item={currentItem}
          closeModalize={closeModalize}
          navigation={navigation}
        />
      </Modalize>
    </Provider>
  );
};

export default Task;

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
