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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
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
        <View style={{padding: '2%'}}>
          <View style={{padding: '2%'}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icon name="account-group-outline" size={25} color="#BABABA" />

              <Text style={{fontSize: 18, marginLeft: '1%', color: '#BABABA'}}>
                Responsible
              </Text>
            </View>
            <View></View>
          </View>

          <View style={{flexDirection:"row",alignItems:"center", justifyContent:"space-between", padding: '2%'}}>
            <View style={{flexDirection: 'row', alignItems: "flex-end", justifyContent:"space-evenly"}}>
              <Icon name="checkbox-intermediate" size={25} color="#BABABA" />
              <Text style={{fontFamily:"Poppins-Regular", fontSize: 14, marginLeft: '1%', color: '#BABABA'}}>
                Status
              </Text>
            </View>
            <View>
              <Chip icon="check" onPress={() => console.log('Pressed')}>
                Done
              </Chip>
            </View>
          </View>

          <View style={{ padding: '2%'}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icon name="timelapse" size={25} color="#BABABA" />
              <Text style={{fontFamily:"Poppins", fontSize: 18, marginLeft: '1%', color: '#BABABA'}}>
                Time Remaining
              </Text>
            </View>
            <View>
            </View>
          </View>
        </View>
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
