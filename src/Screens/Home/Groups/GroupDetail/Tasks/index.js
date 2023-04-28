// ==========================================
//  Title:  AddInviti
//  Author: Abdur Rahman
//  createdAt:   26 Oct, 2022
//  Modified by : -------
// ==========================================

import React, {useState, useRef, useEffect} from 'react';
import {StyleSheet, FlatList, View, RefreshControl} from 'react-native';
import RenderItem from './SingleTask';
import {Text} from 'react-native-paper'
import {FAB, useTheme} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import TasksSkeleton from '../../../../Skeletons/Tasks';
import {useGetAllTasksQuery} from '../../../../../redux/reducers/groups/tasks/taskThunk';
import { handleTasks } from '../../../../../redux/reducers/groups/tasks/taskSlice';
import { useSelector, useDispatch } from 'react-redux';
import ErrorSnackBar from '../../../../../Components/ErrorSnackBar';
const Task = ({route}) => {
  const {groupId} = route.params;

  const navigation = useNavigation();
  const theme = useTheme();
  const dispatch = useDispatch();
  const [snackbarVisible, setSnackBarVisible] = useState(false)

  const {data, isError, isLoading, error, isFetching, refetch} =
    useGetAllTasksQuery({
      groupId,
    });
  
  const tasksFromRedux = useSelector(state => state.tasks.tasks);
  const isTaskSearch = useSelector(state => state.tasks.isTasksSearch);

  const FABHandler = () => {
    navigation.navigate('AddTask', {groupId: groupId});
  };

  useEffect(()=>{
      dispatch(handleTasks(data))
  },[data])

  return (
    <View style={{flex:1, backgroundColor:theme.colors.background}}>
      {isLoading ? (
        <View style={{padding: '4%'}}>
          <TasksSkeleton />
        </View>
      ) : (
        <FlatList
          data={isTaskSearch ? tasksFromRedux : data}
          ListEmptyComponent={() => (
            <View style={{marginTop: '60%', alignItems: 'center'}}>
              <Text>No task yet</Text>
            </View>
          )}
          renderItem={({item}) => (
            <RenderItem item={item} setSnackBarVisible={setSnackBarVisible} />
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
        style={{bottom: snackbarVisible ? 70 : 16, right: 16, position:"absolute"}}
        onPress={() => FABHandler()}
      />

      <ErrorSnackBar
        isVisible={snackbarVisible}
        text={'Something went wrong'}
        onDismissHandler={setSnackBarVisible}
      />
    </View>
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
