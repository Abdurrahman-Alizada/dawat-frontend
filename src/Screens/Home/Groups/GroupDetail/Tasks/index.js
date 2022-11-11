// ==========================================
//  Title:  AddInviti
//  Author: Abdur Rahman
//  createdAt:   26 Oct, 2022
//  Modified by : -------
// ==========================================

import React, {useState, useRef} from 'react';
import {
  StyleSheet,
  FlatList,
  Pressable,
  View,
  Text,
  ActivityIndicator,
} from 'react-native';
import RenderItem from './SingleTask';
import {useSelector, useDispatch} from 'react-redux';
import {Modalize} from 'react-native-modalize';
import {height} from '../../../../../GlobalStyles';
import {FAB, Provider} from 'react-native-paper';
import TaskBrief from './TaskBrief';
import {useNavigation} from '@react-navigation/native';

import {useGetAllTasksQuery} from '../../../../../redux/reducers/groups/tasks/taskThunk';

const modalHeight = height * 0.7;

const Task = ({route}) => {
  const {groupId} = route.params;

  const navigation = useNavigation();
  const [currentItem, setCurrentItem] = useState({});

  const {data, isError, isLoading, error} = useGetAllTasksQuery({
    groupId,
  });

  const modalizeRef = useRef(null);
  const FABHandler = () => {
    navigation.navigate('AddTask',{groupId:groupId});
  };

  const cardHandler = item => {
    setCurrentItem(item);
    modalizeRef.current?.open();
  };
 const closeModalize = ()=>{
  modalizeRef.current?.close();
 }
 return (
    <Provider style={{flex: 1}}>
      {isLoading ? (
        <View
          style={{
            alignSelf: 'center',
            justifyContent: 'center',
            flex: 1,
          }}>
          <ActivityIndicator animating={isLoading} />
        </View>
      ) : data.length > 0 ? (
        <FlatList
          data={data}
          renderItem={({item}) => (
            <Pressable onPress={() => cardHandler(item)}>
              <RenderItem item={item} />
            </Pressable>
          )}
        />
      ) : (
        <View
          style={{
            alignSelf: 'center',
            justifyContent: 'center',
            flex: 1,
          }}>
          <Text>No Task yet</Text>
        </View>
      )}

      <FAB
        icon="plus"
        size="medium"
        // variant='tertiary'
        style={styles.fab}
        onPress={() => FABHandler()}
      />

      <Modalize ref={modalizeRef} modalHeight={modalHeight}>
        <TaskBrief item={currentItem} closeModalize={closeModalize} navigation={navigation} />
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
