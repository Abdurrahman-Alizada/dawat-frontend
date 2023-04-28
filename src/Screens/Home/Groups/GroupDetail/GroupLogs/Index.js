import {View, RefreshControl} from 'react-native';
import React, {useRef} from 'react';
import {Text, Avatar, List} from 'react-native-paper';
import {useAllLogsForGroupQuery} from '../../../../../redux/reducers/groups/groupThunk';
import {useSelector} from 'react-redux';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {FlashList} from '@shopify/flash-list';
const GroupLogs = ({navigation}) => {

  const currentLoginUser = useSelector(state => state?.user?.currentLoginUser);
  const currentViewingGroup = useSelector(
    state => state.groups.currentViewingGroup,
  );

  const {data, isError, isLoading, error, isFetching, refetch} =
    useAllLogsForGroupQuery({
      groupId: currentViewingGroup._id,
    });

  const listRef = useRef();

  return (
    <View style={{flexGrow: 1}}>
      {isLoading ? (
        <View style={{margin: '5%'}}>
          {[1, 2, 3, 4].map((item, index) => (
            <View key={index} style={{marginTop: '3%'}}>
              <SkeletonPlaceholder height="100%" borderRadius={4}>
                <SkeletonPlaceholder.Item
                  flexDirection="row"
                  alignItems="center">
                  <SkeletonPlaceholder.Item
                    width={50}
                    height={50}
                    borderRadius={50}
                  />
                  <SkeletonPlaceholder.Item width="100%" marginLeft={20}>
                    <SkeletonPlaceholder.Item width="60%" height={10} />
                    <SkeletonPlaceholder.Item
                      marginTop={7}
                      width="30%"
                      height={8}
                    />
                  </SkeletonPlaceholder.Item>
                </SkeletonPlaceholder.Item>
              </SkeletonPlaceholder>
            </View>
          ))}
        </View>
      ) : (
        <FlashList
          // data={isInvitaionSearch ? invitaionsForSearch : data}
          data={data}
          ref={listRef}
          estimatedItemSize={100}
          ListEmptyComponent={() => (
            <View style={{marginTop: '50%', alignItems: 'center'}}>
              <Text>No activity</Text>
            </View>
          )}
          renderItem={({item}) => (
            <List.Item
              title={`${
                currentLoginUser.name === item?.addedBy?.name
                  ? 'You'
                  : item?.addedBy?.name
              } ${item?.logDescription}`}
              titleStyle={{fontSize: 15}}
              titleNumberOfLines={3}
              left={props => (
                <Avatar.Image
                  {...props}
                  size={35}
                  source={
                    item?.addedBy?.imageURL
                      ? {uri: item?.addedBy?.imageURL}
                      : require('../../../../../assets/drawer/male-user.png')
                  }
                />
              )}
            />
          )}
          refreshControl={
            <RefreshControl refreshing={isFetching} onRefresh={refetch} />
          }
        />
      )}

      {/* {
        isError && 
      } */}
    </View>
  );
};

export default GroupLogs;
