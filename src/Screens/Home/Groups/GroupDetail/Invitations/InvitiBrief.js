import {View, Text} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';
import {IconButton, List, Avatar, ActivityIndicator} from 'react-native-paper';
import {useDeleteInvitiMutation} from '../../../../../redux/reducers/groups/invitations/invitaionThunk';

const InvitiBrief = ({FABHandler, onClose}) => {
  const currentInviti = useSelector(state => state.invitations?.currentInviti);
  const currentViewingGroup = useSelector(
    state => state.groups?.currentViewingGroup,
  );

  const [deleteInviti, {isLoading: deleteLoading}] = useDeleteInvitiMutation();
  const deleteHandler = async () => {
    console.log(currentViewingGroup._id, currentInviti?._id);
    await deleteInviti({
      groupId: currentViewingGroup._id,
      invitiId: currentInviti?._id,
    })
      .then(response => {
        onClose();
      })
      .catch(e => {
        console.log('error in deleteHandler', e);
      });
  };

  return (
    <View style={{padding: '2%'}}>
      <View style={{flexDirection: 'row', alignSelf: 'flex-end'}}>
        <IconButton
          icon="square-edit-outline"
          mode="contained-tonal"
          size={30}
          onPress={() => {
            onClose();
            FABHandler(currentInviti);
          }}
        />
        {deleteLoading ? (
          <ActivityIndicator size={40} style={{marginHorizontal: '2%'}} />
        ) : (
          <IconButton
            icon="delete-outline"
            mode="contained-tonal"
            size={30}
            onPress={deleteHandler}
          />
        )}
      </View>

      <List.Item
        title={currentInviti.invitiName}
        description={currentInviti.invitiDescription}
        left={props => (
          <Avatar.Image
            {...props}
            size={45}
            source={
              currentInviti.invitiImageURL
                ? {uri: currentInviti.invitiImageURL}
                : require('../../../../../assets/drawer/male-user.png')
            }
          />
        )}
      />
    </View>
  );
};

export default InvitiBrief;
