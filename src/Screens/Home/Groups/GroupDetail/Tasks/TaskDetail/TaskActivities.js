import {View, FlatList, RefreshControl} from 'react-native';
import React, {useRef} from 'react';
import {Text, Button, Avatar, List} from 'react-native-paper';

import {useAllLogsForTaskQuery} from '../../../../../../redux/reducers/groups/tasks/taskThunk';
import {useSelector} from 'react-redux';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {useTranslation} from 'react-i18next';

const TaskActivities = () => {
  const {t} = useTranslation();
  
  const flatlistRef = useRef();

  const currentViewingTask = useSelector(state => state?.tasks?.currentViewingTask);

  const currentLoginUser = useSelector(state => state.user.currentLoginUser);
  const {data, isError, isLoading, error, isFetching, refetch} = useAllLogsForTaskQuery({
    taskId: currentViewingTask._id,
  });
  const scrollToEndHandler = () => {
    flatlistRef.current?.scrollToEnd();
  };
  scrollToEndHandler();

  return (
    <View style={{flexGrow: 1}}>
      {isLoading ? (
        <View style={{margin: '5%'}}>
          {[1, 2, 3, 4].map((item, index) => (
            <View key={index} style={{marginTop: '3%'}}>
              <SkeletonPlaceholder height="100%" borderRadius={4}>
                <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
                  <SkeletonPlaceholder.Item width={50} height={50} borderRadius={50} />
                  <SkeletonPlaceholder.Item width="100%" marginLeft={20}>
                    <SkeletonPlaceholder.Item width="60%" height={10} />
                    <SkeletonPlaceholder.Item marginTop={7} width="30%" height={8} />
                  </SkeletonPlaceholder.Item>
                </SkeletonPlaceholder.Item>
              </SkeletonPlaceholder>
            </View>
          ))}
        </View>
      ) : (
        <FlatList
          data={data}
          ref={flatlistRef}
          onContentSizeChange={() => flatlistRef.current?.scrollToEnd({animated: false})}
          ListEmptyComponent={() => (
            <View style={{marginTop: '60%', alignItems: 'center'}}>
              <Text>There isn't any activity</Text>
              <Button icon="refresh" mode="contained" style={{marginTop: '5%'}} onPress={refetch}>
                {t('Refresh')}
              </Button>
            </View>
          )}
          renderItem={({item}) => (
            <List.Item
              title={`${
                currentLoginUser.name === item?.addedBy?.name ? 'You' : item?.addedBy?.name
              } ${item?.logDescription}`}
              titleStyle={{fontSize: 15}}
              titleNumberOfLines={3}
              //   description={"item.email"}
              left={props => (
                <Avatar.Image
                  {...props}
                  size={35}
                  source={
                    item?.addedBy?.imageURL
                      ? {uri: item?.addedBy?.imageURL}
                      : require('../../../../../../assets/drawer/male-user.png')
                  }
                />
              )}
            />
          )}
          refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
        />
      )}
    </View>
  );
};

export default TaskActivities;
