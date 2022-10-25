import React, {useState, useRef} from 'react';
import {StyleSheet, FlatList, Pressable} from 'react-native';
import RenderItem from './SingleTask';
import {useSelector, useDispatch} from 'react-redux';
import {Modalize} from 'react-native-modalize';
import {height} from '../../../../../GlobalStyles';
import {FAB, Provider} from 'react-native-paper';
import TaskBrief from './TaskBrief';
import { useNavigation } from '@react-navigation/native';

const modalHeight = height * 0.7;

const Task = () => {
  const navigation = useNavigation();
  const [currentItem, setCurrentItem] = useState({});

  const groupList = useSelector(state => state.groups);
  const modalizeRef = useRef(null);
  const FABHandler = () => {
    navigation.navigate('AddTask');
  };

  const cardHandler = (item)=>{
    setCurrentItem(item)
    modalizeRef.current?.open();
  }

  return (
    <Provider style={{flex: 1}}>
      <FlatList
        data={groupList.tasks}
        renderItem={({item}) => (
          <Pressable onPress={() => cardHandler(item)}>
            <RenderItem item={item} />
          </Pressable>
        )}
      />

      <FAB
        icon="plus"
        size="medium"
        // variant='tertiary'
        style={styles.fab}
        onPress={() => FABHandler()}
      />

      <Modalize ref={modalizeRef} modalHeight={modalHeight}>
        <TaskBrief item={currentItem} />
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
