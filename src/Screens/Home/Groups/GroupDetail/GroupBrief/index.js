import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Avatar, List, Snackbar, Text, useTheme} from 'react-native-paper';
import RNFS from 'react-native-fs';
import {jsonToCSV, readString} from 'react-native-csv';
import {useSelector, useDispatch} from 'react-redux';
import {
  useGetAllInvitationsQuery,
  useAddMultipleInvitiMutation,
} from '../../../../../redux/reducers/groups/invitations/invitaionThunk';
import {handleIsExportBanner} from '../../../../../redux/reducers/groups/invitations/invitationSlice';
import moment from 'moment';
import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';
import DocumentPicker, {types} from 'react-native-document-picker';
import { useNavigation } from '@react-navigation/native';

const Index = ({group, onClose}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const theme = useTheme()
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

  const [addMultipleInviti, {isLoading: addMultipleInvitiLoading}] =
    useAddMultipleInvitiMutation();

  const importCSV = () => {
    check(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE)
      .then(result => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            console.log(
              'This feature is not available (on this device / in this context)',
            );
            break;
          case RESULTS.DENIED:
            console.log(
              'The permission has not been requested / is denied but requestable',
            );
            request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE)
              .then(result => {
                console.log(result);
                if (result.data) uploadCSV();
              })
              .catch(error => {
                console.log(error.message);
              });
            break;
          case RESULTS.LIMITED:
            console.log('The permission is limited: some actions are possible');
            break;
          case RESULTS.GRANTED:
            uploadCSV();
            break;
          case RESULTS.BLOCKED:
            console.log('The permission is denied and not requestable anymore');
            break;
        }
      })
      .catch(error => {
        console.log('error is=>', error.message);
      });
  };

  const uploadCSV = async () => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: types.csv
      });
      if (res.type === 'text/comma-separated-values') {
        RNFS.readFile(res.uri, 'ascii')
          .then(response => {
            const results = readString(response);
            onClose();
            navigation.navigate("AddMultipleInviti", {data:results.data})
           })
          .catch(e => {
            console.log(e);
          });
      } else {
        alert('Please select .csv file');
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        onClose();
        alert('You did not pick any file');
      } else {
        alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  };

  const [exportLoading, setExportLoading] = useState(false);
  const exportCSV = () => {
    //  saveCSV();
    check(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE)
      .then(result => {
        console.log(result);
        switch (result) {
          case RESULTS.UNAVAILABLE:
            console.log(
              'This feature is not available (on this device / in this context)',
            );
            break;
          case RESULTS.DENIED:
            console.log(
              'The permission has not been requested / is denied but requestable',
            );
            request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE)
              .then(result => {
                console.log(result);
                if (result.data) saveCSV();
              })
              .catch(error => {
                console.log(error.message);
              });
            break;
          case RESULTS.LIMITED:
            console.log('The permission is limited: some actions are possible');
            break;
          case RESULTS.GRANTED:
            saveCSV();
            break;
          case RESULTS.BLOCKED:
            console.log('The permission is denied and not requestable anymore');
            break;
        }
      })
      .catch(error => {
        console.log('error is=>', error.message);
      });
  };

  const saveCSV = async () => {
    const jsonData = data.map(user => {
      return {
        'Inviti name': user.invitiName,
        'Inviti Description': user.invitiDescription,
        'Inviti contact': user.contact,
        'Added by': user?.addedBy?.name,
        'Last status': user?.lastStatus?.invitiStatus,
        'Last status updated by': user?.lastStatus?.addedBy?.name,
        'Image URL of inviti': user.invitiImageURL,
      };
    });
    const results = jsonToCSV(jsonData);
    const date = moment(new Date()).format(' d_MMM_YYYY_hh_mm_ss_A');
    const path =
      RNFS.DownloadDirectoryPath +
      `/${currentViewingGroup.groupName}${date}.csv`;

    RNFS.writeFile(path, results, 'utf8')
      .then(success => {
        console.log('FILE WRITTEN!',success);
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
        contentStyle={{padding:"1%"}}
        style={{marginTop: '5%'}}
        buttonColor={theme.colors.secondary}
        >
        Downlaod Invitations list
      </Button>
      <Button
        loading={addMultipleInvitiLoading}
        onPress={importCSV}
        mode="contained"
        icon={'upload'}
        contentStyle={{padding: '1%'}}
        style={{marginTop: '5%'}}>
        Upload Invitations list to add in this group
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
