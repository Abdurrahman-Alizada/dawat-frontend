import React, {useState, useRef} from 'react';
import {Image, StyleSheet, Text, View, FlatList, Alert} from 'react-native';
import renderItem from './SingleTask';
// import {FAB} from 'react-native-elements';
import {useSelector, useDispatch} from 'react-redux';
import {Modalize} from 'react-native-modalize';
import {height} from '../../../../../GlobalStyles';
import {List, Avatar, FAB, Button} from 'react-native-paper';

const modalHeight = height * 0.7;

const Task = () => {
  const groupList = useSelector(state => state.groups);

  const modalizeRef = useRef(null);

  const FABHandler = () => {
    modalizeRef.current?.open();
  };
  const [expanded, setExpanded] = React.useState(true);

  return(
    <List.Section style={{flex: 1}}>
      <List.Accordion
        title="Invited"
        left={props => <List.Icon {...props} icon="check-circle" />}
        expanded={expanded}
        onPress={() => setExpanded(!expanded)}>
        <FlatList
          // numColumns={2}
          data={groupList.tasks}
          // style={styles.gridView}
          renderItem={({item, section, index}) => (
            <List.Item
              title="title"
              description="description"
              left={props => (
                <Avatar.Icon
                  size={30}
                  icon="account-circle-outline"
                  style={{alignSelf: 'center'}}
                />
              )}
              // right={props =>   <List.Icon {...props} icon="check-circle-outline" /> }
              right={props => <List.Icon {...props} icon="check-circle" />}
            />
          )}
        />
      </List.Accordion>

      <FAB
        icon="plus"
        size="medium"
        // variant='tertiary'
        style={styles.fab}
        onPress={() => FABHandler()}
      />

      <Modalize ref={modalizeRef} modalHeight={modalHeight}>
        {/* <AddInviti /> */}
      </Modalize>
    </List.Section>
  )

  // return (
  //   <View style={{backgroundColor: '#fff', flex: 1}}>
  //     <FlatList
  //       keyExtractor={item => item.id}
  //       data={groupList.tasks}
  //       renderItem={item => renderItem(item)}
  //     />

  //     <FAB
  //       onPress={() => FABHandler()}
  //       visible={true}
  //       placement="right"
  //       // title="Show"
  //       style={{
  //         position: 'absolute',
  //         zIndex: 1,
  //         paddingBottom: '5%',
  //       }}
  //       icon={{name: 'add', color: 'white'}}
  //       color="#334C8C"
  //     />
  
  //     <Modalize ref={modalizeRef} modalHeight={modalHeight}>
  //       {/* <AddInviti />    */}
  //     </Modalize>
  //   </View>
  // );
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
