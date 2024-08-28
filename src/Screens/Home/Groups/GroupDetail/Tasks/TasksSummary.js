import React from 'react';
import {View} from 'react-native';
import {
  IconButton,
  List,
  Card,
  Text,
  ActivityIndicator,
  useTheme,
  Divider,
} from 'react-native-paper';
import {useSelector} from 'react-redux';
import {useGetTaskSummaryQuery} from '../../../../../redux/reducers/groups/tasks/taskThunk';
import {useTranslation} from 'react-i18next';

const TaskSummary = ({onClose}) => {
  const {t} = useTranslation();
  const theme = useTheme();
  const currentViewingGroup = useSelector(state => state.groups?.currentViewingGroup);

  const {data, isError, isLoading, error, isFetching, refetch} = useGetTaskSummaryQuery({
    groupId: currentViewingGroup._id,
  });

  return (
    <View style={{padding: '5%'}}>
      <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
        <List.Item
          title={t('To-do summary of')}
          description={currentViewingGroup.groupName}
          style={{width: '90%'}}
        />
        <IconButton
          icon="close-circle"
          size={30}
          accessibilityLabel="Close todo summary"
          style={{}}
          onPress={onClose}
        />
      </View>
      <Divider />

      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}>
        <Card
          style={{marginVertical: '5%', width: '48%', padding: '2%'}}
          theme={{roundness: 1}}
          mode="elevated">
          <Text
            style={{
              paddingHorizontal: 10,
              fontWeight: 'bold',
              color: theme.colors.primary,
            }}
            variant="headlineLarge">
            {isLoading ? <ActivityIndicator /> : data?.isCompleted ? data?.isCompleted : 0}
          </Text>
          <Text style={{paddingHorizontal: 10, alignSelf: 'flex-end'}} variant="bodyLarge">
            {t('Completed')}
          </Text>
        </Card>

        <Card
          style={{marginVertical: '5%', width: '48%', padding: '2%'}}
          theme={{roundness: 1}}
          mode="elevated">
          <Text
            style={{
              paddingHorizontal: 10,
              fontWeight: 'bold',
              color: theme.colors.tertiary,
            }}
            variant="headlineLarge">
            {isLoading ? <ActivityIndicator /> : data?.notCompleted ? data?.notCompleted : 0}
          </Text>
          <Text style={{paddingHorizontal: 10, alignSelf: 'flex-end'}} variant="bodyLarge">
            {t('Not completed')}
          </Text>
        </Card>

        <Card
          style={{marginVertical: '5%', width: '48%', padding: '2%'}}
          theme={{roundness: 1}}
          mode="elevated">
          <Text
            style={{
              paddingHorizontal: 10,
              fontWeight: 'bold',
              color: theme.colors.tertiary,
            }}
            variant="headlineLarge">
            {isLoading ? (
              <ActivityIndicator />
            ) : data?.notCompleted || data?.isCompleted ? (
              data?.notCompleted + data?.isCompleted
            ) : (
              0
            )}
          </Text>
          <Text style={{paddingHorizontal: 10, alignSelf: 'flex-end'}} variant="bodyLarge">
            {'Total'}
          </Text>
        </Card>
      </View>
      <IconButton
        icon="refresh"
        disabled={isFetching}
        size={30}
        accessibilityLabel="refresh to-do summary"
        style={{marginTop: '5%'}}
        mode="contained"
        onPress={refetch}
      />
    </View>
  );
};

export default TaskSummary;
