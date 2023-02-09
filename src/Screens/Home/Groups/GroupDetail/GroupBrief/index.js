import React, {useCallback, useState} from 'react';
import {TouchableOpacity, StyleSheet, Text, View} from 'react-native';
import {Button, Avatar, List, Snackbar} from 'react-native-paper';
import RNFS from 'react-native-fs';
import {jsonToCSV} from 'react-native-csv';
import {useSelector, useDispatch} from 'react-redux';
import {useGetAllInvitationsQuery} from '../../../../../redux/reducers/groups/invitations/invitaionThunk';
import {handleIsExportBanner} from '../../../../../redux/reducers/groups/invitations/invitationSlice';
import moment from 'moment';
import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';

const Index = ({group, onClose}) => {
  const dispatch = useDispatch();

  const [textShown, setTextShown] = useState(false); //To show ur remaining Text
  const [lengthMore, setLengthMore] = useState(false); //to show the "Read more & Less Line"
  const toggleNumberOfLines = () => {
    //To toggle the show text or hide it
    setTextShown(!textShown);
    console.log('clicked');
  };

  const onTextLayout = useCallback(
    e => {
      setLengthMore(e.nativeEvent.lines.length >= 2); //to check the text is more than 4 lines or not
      // console.log(e.nativeEvent);
    },
    [textShown],
  );

  const currentViewingGroup = useSelector(
    state => state.groups?.currentViewingGroup,
  );

  const {
    data,
    isError,
    isLoading,
    error,
    isFetching,
    refetch,
    getAllInvitations,
  } = useGetAllInvitationsQuery({
    groupId: currentViewingGroup._id,
  });

  const [exportLoading, setExportLoading] = useState(false);
  const exportCSV = () => {
     saveCSV();
    // check(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE)
    //   .then(result => {
    //     switch (result) {
    //       case RESULTS.UNAVAILABLE:
    //         console.log(
    //           'This feature is not available (on this device / in this context)',
    //         );
    //         break;
    //       case RESULTS.DENIED:
    //         console.log(
    //           'The permission has not been requested / is denied but requestable',
    //         );
    //         request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE)
    //           .then(result => {
    //             console.log(result)
    //             if(result.data)
    //             saveCSV()
    //           })
    //           .catch(error => {
    //             console.log(error.message);
    //           });
    //         break;
    //       case RESULTS.LIMITED:
    //         console.log('The permission is limited: some actions are possible');
    //         break;
    //       case RESULTS.GRANTED:
    //         saveCSV();
    //         break;
    //       case RESULTS.BLOCKED:
    //         console.log('The permission is denied and not requestable anymore');
    //         break;
    //     }
    //   })
    //   .catch(error => {
    //     console.log(error.message);
    //   });
  };

  const saveCSV = async () => {
    const jsonData = data.map(user => {
      return {
        'Inviti name': user.invitiName,
        'Inviti contact': user.email,
        'Added by': user.addedBy.name,
        'Last status': user.lastStatus.invitiStatus,
        'Last status updated by': user.lastStatus.addedBy.name,
      };
    });
    const results = jsonToCSV(jsonData);
    const date = moment(new Date()).format(' d_MMM_YYYY_hh_mm_ss_A')
    const path = RNFS.DownloadDirectoryPath + `/${currentViewingGroup.groupName}${date}.csv`;

   console.log(await RNFS.exists(path))

    RNFS.writeFile(path, results, 'utf8')
      .then(success => {
        console.log('FILE WRITTEN!');
        setExportLoading(false);
        onClose();
        dispatch(handleIsExportBanner(true));
      })
      .catch(err => {
        setSnackbarMessage('something went wrong');
        setShowSnackbar(true);
        console.log(err.message);
      });
  };

  const [SnackbarMessage, setSnackbarMessage] = useState('');
  const [showSnackBar, setShowSnackbar] = useState(false);

  return (
    <View style={{padding: '5%'}}>
      <List.Item
        title={currentViewingGroup.groupName}
        description={currentViewingGroup.groupDescription}
        left={props => (
          <Avatar.Image
            {...props}
            size={45}
            source={
              currentViewingGroup.imageURL
                ? {uri: currentViewingGroup.imageURL}
                : require('../../../../../assets/drawer/male-user.png')
            }
          />
        )}
      />

      <Button
        loading={exportLoading}
        onPress={exportCSV}
        mode="contained"
        icon={'download'}
        style={{marginTop: '5%'}}>
        Downlaod Invitations list
      </Button>

      <Snackbar
        visible={showSnackBar}
        duration={3000}
        onDismiss={() => setShowSnackbar(false)}
        action={{
          label: 'Ok',
          onPress: () => {
            setShowSnackbar(false);
          },
        }}>
        {SnackbarMessage}
      </Snackbar>
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  postDescription: {
    fontFamily: 'DM Sans',
    fontSize: 16,
    fontWeight: 'normal',
  },
  seeMore: {
    fontFamily: 'DM Sans',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
