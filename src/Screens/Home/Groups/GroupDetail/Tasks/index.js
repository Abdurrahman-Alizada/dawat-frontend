import React, {useState, useRef} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  FlatList,
  Alert,
  Pressable,
} from 'react-native';
import RenderItem from './SingleTask';
import {useSelector, useDispatch} from 'react-redux';
import {Modalize} from 'react-native-modalize';
import {height} from '../../../../../GlobalStyles';
import {
  FAB,
  Portal,
  Provider,
  List,
  Avatar,
  Button,
  Chip,
} from 'react-native-paper';
import TaskBrief from './TaskBrief';

const modalHeight = height * 0.7;

const Task = () => {
  const [currentItem, setCurrentItem] = useState({});

  const groupList = useSelector(state => state.groups);
  const modalizeRef = useRef(null);
  const FABHandler = item => {
    setCurrentItem(item);
    modalizeRef.current?.open();
    console.log(item);
  };

  const [state, setState] = React.useState({open: false});
  const onStateChange = ({open}) => setState({open});
  const {open} = state;

  return (
    <Provider style={{flex: 1}}>
      <FlatList
        data={groupList.tasks}
        renderItem={({item}) => (
          <Pressable onPress={() => FABHandler(item)}>
            <RenderItem item={item} />
          </Pressable>
        )}
      />
      <FAB.Group
        open={open}
        icon={open ? 'calendar-today' : 'plus'}
        actions={[
          {icon: 'plus', onPress: () => console.log('Pressed add')},
          {
            icon: 'star',
            label: 'Star',
            onPress: () => console.log('Pressed star'),
          },
          {
            icon: 'email',
            label: 'Email',
            onPress: () => console.log('Pressed email'),
          },
          {
            icon: 'bell',
            label: 'Remind',
            onPress: () => console.log('Pressed notifications'),
          },
        ]}
        onStateChange={onStateChange}
        onPress={() => {
          if (open) {
            // do something if the speed dial is open
          }
        }}
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
