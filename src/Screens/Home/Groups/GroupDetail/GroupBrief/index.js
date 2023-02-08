import React, {useCallback, useState} from 'react';
import {TouchableOpacity, StyleSheet, Text, View} from 'react-native';
import {Button, Avatar, List} from 'react-native-paper';
import RNFS from 'react-native-fs';
import {jsonToCSV} from 'react-native-csv';
import {useSelector, useDispatch} from 'react-redux';
import {useGetAllInvitationsQuery} from '../../../../../redux/reducers/groups/invitations/invitaionThunk';
import {handleIsExportBanner} from '../../../../../redux/reducers/groups/invitations/invitationSlice';

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
    const path =
      RNFS.DownloadDirectoryPath + `/${currentViewingGroup.groupName}.csv`;
    RNFS.writeFile(path, results, 'utf8')
      .then(success => {
        console.log('FILE WRITTEN!');
        setExportLoading(false);
        onClose();
        dispatch(handleIsExportBanner(true));
      })
      .catch(err => {
        console.log(err.message);
      });
  };
  return (
    <View style={{paddingHorizontal: '5%', paddingVertical: '5%'}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: '5%',
        }}>
        {/* <Avatar.Image
          size={40}
          style={{marginRight: '3%'}}
          source={
            currentViewingGroup.imageURL
              ? {uri: currentViewingGroup.imageURL}
              : require('../../../../../assets/drawer/male-user.png')
          }
        /> */}

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
        {/* <View style={{}}>
          <Text
            style={{fontSize: 16, fontWeight: 'bold', marginVertical: '1%'}}>
            {currentViewingGroup.groupName}
          </Text>

          <Text
            onTextLayout={onTextLayout}
            numberOfLines={textShown ? undefined : 2}
            style={{}}>
            {currentViewingGroup.groupDescription}
          </Text>

          {lengthMore ? (
            <TouchableOpacity onPress={() => toggleNumberOfLines()}>
              <Text style={styles.seeMore}>
                {textShown ? 'Read less...' : 'Read more...'}
              </Text>
            </TouchableOpacity>
          ) : (
            <></>
          )}
        </View> */}
      </View>

      {/* <Divider />

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          marginBottom: '2%',
        }}>
        <Card>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{fontSize: 16, fontWeight: 'bold'}}> Invitations</Text>
          </View>

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon name="check" color="#000" />
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>
              {' '}
              83
              <Text style={{fontSize: 10, fontWeight: 'bold'}}>
                {' '}
                Invited
              </Text>{' '}
            </Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon name="radio-button-unchecked" color="#000" />
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>
              {' '}
              83
              <Text style={{fontSize: 10, fontWeight: 'bold'}}>
                {' '}
                Remaining
              </Text>{' '}
            </Text>
          </View>
        </Card>

        <Card>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{fontSize: 16, fontWeight: 'bold'}}> Tasks</Text>
          </View>

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon name="check" color="#000" />
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>
              {' '}
              83
              <Text style={{fontSize: 10, fontWeight: 'bold'}}>
                {' '}
                Completed
              </Text>{' '}
            </Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon name="pending" color="#000" />
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>
              {' '}
              83
              <Text style={{fontSize: 10, fontWeight: 'bold'}}>
                {' '}
                pending
              </Text>{' '}
            </Text>
          </View>
        </Card>
      </View> */}
      {/* <Divider /> */}
      <Button
        loading={exportLoading}
        onPress={exportCSV}
        mode="contained"
        icon={'download'}
        style={{marginTop: '5%'}}>
        Downlaod Invitations list
      </Button>
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
