import {View, ScrollView} from 'react-native';
import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {
  IconButton,
  List,
  useTheme,
  Text,
  Chip,
  Avatar,
  ActivityIndicator,
} from 'react-native-paper';
import {
  useDeleteInvitiMutation,
  useUpdateInvitiStatusMutation,
} from '../../../../../redux/reducers/groups/invitations/invitaionThunk';
const InvitiBrief = ({onClose}) => {
  const currentInviti = useSelector(state => state.invitations?.currentInviti);
  const currentViewingGroup = useSelector(
    state => state.groups?.currentViewingGroup,
  );

  const [deleteInviti, {isLoading: deleteLoading}] = useDeleteInvitiMutation();
  

  const [status, setStatus] = useState(currentInviti.lastStatus.invitiStatus);
  const [selectedstatus, setSelectedStatus] = useState(
    currentInviti?.lastStatus?.invitiStatus
  );
  const [statuses] = useState([
    {label: 'Invited', value: 'invited'},
    {label: 'Rejected', value: 'rejected'},
    {label: 'Pending', value: 'pending'},
    {label: 'Other', value: 'other'},
  ]);

  const [updateInviteStatus, {isLoading: updateStatusLoading}] =
    useUpdateInvitiStatusMutation();
  const updateHandler = async s => {
    await updateInviteStatus({
      id: currentInviti._id,
      lastStatus: s,
    })
      .then(response => {
        console.log(response)
        onClose();
      })
      .catch(e => {
        console.log('error in updateHandler', e);
      });
  };

  const theme = useTheme();

  return (
    <View style={{padding: '2%'}}>
      <View style={{flexDirection: 'row', justifyContent:"space-between"}}>
        <View style={{width: '80%'}}>
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

          <IconButton
            icon={"close"}
            mode="contained-tonal"
            containerColor={theme.colors.background}
            size={30}
            onPress={onClose}
          />
      </View>

      {/* <View style={{margin: '2%', flexWrap: 'wrap', flexDirection: 'row'}}>
        {statuses.map((statuse, index) => (
          <Chip
            key={index}
            selected={selectedstatus === statuse.value ? true : false}
            mode={selectedstatus === statuse.value ? 'flat' : 'outlined'}
            style={{marginRight: '2%', marginVertical: '2%'}}
            onPress={() => {
              setSelectedStatus(statuse.value);
              setStatus(statuse.value);
              updateHandler(statuse.value)
            }}>
            {statuse.label}
          </Chip>
        ))}
      </View> */}
      {/* <View style={{margin: '2%', flexDirection: 'row'}}>
        <IconButton
          icon="check"
          mode="outlined"
          size={25}
          onPress={() => console.log('Pressed')}
          style={{marginRight: '2%'}}
        />
        <IconButton
          icon="clock-outline"
          mode="outlined"
          size={25}
          onPress={() => console.log('Pressed')}
          style={{marginRight: '2%'}}
        />
        <IconButton
          icon="cancel"
          mode="outlined"
          size={25}
          onPress={() => console.log('Pressed')}
          style={{marginRight: '2%'}}
        />
      </View> */}
    </View>
  );
};

export default InvitiBrief;
