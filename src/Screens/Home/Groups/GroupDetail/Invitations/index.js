import React, {useState, useRef, useEffect} from 'react';
import {StyleSheet, View, FlatList, RefreshControl, Button} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import AddInviti from './AddInviti';
import {Modalize} from 'react-native-modalize';
import {height} from '../../../../../GlobalStyles';
import {allInvitations} from '../../../../../redux/reducers/groups/invitations/invitaionThunk';
import {List, Avatar, FAB, Modal, ActivityIndicator} from 'react-native-paper';
import AddCategory from './AddCategory';
const modalHeight = height * 0.7;

export default function Example() {
  const invitationList = useSelector(state => state.invitations.invitations);
  const animating = useSelector(state => state.invitations.invitationLoader);
  const modalizeRef = useRef(null);
  const dispatch = useDispatch();
  const getAllInvitations = () => {
    dispatch(allInvitations());
    console.log("asdf", animating)
  };
  useEffect(() => {
    getAllInvitations();
  }, []);

  const FABHandler = () => {
    modalizeRef.current?.open();
  };
  const close = () => {
    modalizeRef.current?.close();
  };
  const [expanded, setExpanded] = React.useState(true);
  const [visible, setVisible] = React.useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  return (
    <View style={{flex: 1}}>
      <Button
        title="Add Category"
        style={{marginHorizontal: '0%', padding: '2%'}}
        icon="format-list-bulleted"
        mode="contained-tonal"
        onPress={() => showModal()}
      />

      {animating ? (
        <View
          style={{
            alignSelf: 'center',
            justifyContent: 'center',
            flex: 1,
          }}>
          <ActivityIndicator animating={animating} />
        </View>
      ) : (
        <List.Accordion
          title="Invited"
          left={props => <List.Icon {...props} icon="check-circle" />}
          expanded={expanded}
          onPress={() => setExpanded(!expanded)}>
          <FlatList
            data={invitationList}
            keyExtractor={item => item._id}
            renderItem={({item, section, index}) => (
              <List.Item
                title={item.invitiName}
                description={item.invitiDescription}
                left={props => (
                  <Avatar.Icon
                    size={30}
                    icon="account-circle-outline"
                    style={{alignSelf: 'center'}}
                  />
                )}
                right={props => <List.Icon {...props} icon="check-circle" />}
              />
            )}
            refreshControl={
              <RefreshControl
                refreshing={animating}
                onRefresh={getAllInvitations}
              />
            }
          />
        </List.Accordion>
      )}

      <FAB
        icon="plus"
        size="medium"
        // variant='tertiary'
        style={styles.fab}
        onPress={() => FABHandler()}
      />

      <Modalize ref={modalizeRef} modalHeight={modalHeight}>
        <AddInviti close={close} />
      </Modalize>

      <Modal
        visible={visible}
        onDismiss={hideModal}
        contentContainerStyle={styles.containerStyle}>
        <AddCategory />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: 'white',
    padding: 20,
    margin: '5%',
    // flex:1,
    // justifyContent: 'flex-start',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    alignSelf: 'center',
  },
});
