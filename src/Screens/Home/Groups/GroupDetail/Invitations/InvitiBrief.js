import {View, ScrollView} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';
import {IconButton, List,Text, Avatar, ActivityIndicator} from 'react-native-paper';
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

        {/* <List.Accordion title="More">
          <List.Subheader>Added by</List.Subheader>
          <View
            style={{
              borderRadius: 10,
              borderColor: '#C1C2B8',
              borderWidth: 0.5,
              padding: '2%',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View>
                <Avatar.Icon size={30} icon="account-circle-outline" />
              </View>
              <Text style={{marginHorizontal: '4%'}}>
                {currentInviti?.addedBy?.name}
              </Text>
            </View>
            <Text style={{}}>{moment(currentInviti?.createdAt).fromNow()}</Text>
          </View>

          <List.Subheader>History</List.Subheader>
          <ScrollView>
          {currentInviti?.statuses?.map((Status, index) => (
            <View
              key={index}
              style={{
                borderRadius: 10,
                borderColor: '#C1C2B8',
                borderWidth: 0.5,
                padding: '2%',
                marginVertical: '2%',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <View style={{}}>
                  <Text style={{padding: '2%'}}>{Status.invitiStatus} by</Text>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Avatar.Icon size={30} icon="account-circle-outline" />
                    <Text style={{marginHorizontal: '4%'}}>
                      {Status.addedBy.name}
                    </Text>
                  </View>
                </View>
                <View style={{alignItems: 'center'}}>
                  {Status.invitiStatus === 'rejected' && (
                    <List.Icon style={{margin: 0, padding: 0}} icon="cancel" />
                  )}
                  {Status.invitiStatus === 'pending' && (
                    <List.Icon
                      style={{margin: 0, padding: 0}}
                      icon="clock-outline"
                    />
                  )}
                  {Status.invitiStatus === 'invited' && (
                    <List.Icon style={{margin: 0, padding: 0}} icon="check" />
                  )}

                  <Text style={{alignSelf: 'flex-end'}}>
                    {moment(Status?.createdAt).fromNow()}{' '}
                  </Text>
                </View>
              </View>
            </View>
          ))}
          </ScrollView>

        </List.Accordion> */}


    </View>
  );
};

export default InvitiBrief;
