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
import {useGetInvitationsSummaryQuery} from '../../../../../redux/reducers/groups/invitations/invitaionThunk';
import {useTranslation} from 'react-i18next';

const InvitaionsSummary = ({onClose}) => {
  const {t} = useTranslation();
  const theme = useTheme();
  const currentViewingGroup = useSelector(state => state.groups?.currentViewingGroup);

  const {data, isError, isLoading, error, isFetching, refetch} = useGetInvitationsSummaryQuery({
    groupId: currentViewingGroup._id,
  });

  return (
    <View style={{padding: '5%'}}>
      <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
        <List.Item
          title={t('Guests summary of')}
          description={currentViewingGroup.groupName}
          style={{width: '90%'}}
        />
        <IconButton
          icon="close-circle"
          size={30}
          accessibilityLabel="Close guests summary"
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
            {isLoading ? <ActivityIndicator /> : data?.invited ? data?.invited : 0}
          </Text>
          <Text style={{paddingHorizontal: 10, alignSelf: 'flex-end'}} variant="bodyLarge">
            {t("Invited")}
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
              color: theme.colors.secondary,
            }}
            variant="headlineLarge">
            {isLoading ? <ActivityIndicator /> : data?.pending ? data?.pending : 0}
          </Text>
          <Text style={{paddingHorizontal: 10, alignSelf: 'flex-end'}} variant="bodyLarge">
            {t("Pending")}
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
              color: theme.colors.error,
            }}
            variant="headlineLarge">
            {isLoading ? <ActivityIndicator /> : data?.rejected ? data?.rejected : 0}
          </Text>
          <Text style={{paddingHorizontal: 10, alignSelf: 'flex-end'}} variant="bodyLarge">
            {t("Rejected")}
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
            {isLoading ? <ActivityIndicator /> : data?.other ? data?.other : 0}
          </Text>
          <Text style={{paddingHorizontal: 10, alignSelf: 'flex-end'}} variant="bodyLarge">
            {t("Other")}
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
              color: theme.colors.onBackground,
            }}
            variant="headlineLarge">
            {isLoading ? (
              <ActivityIndicator />
            ) : data ? (
              data?.invited + data?.pending + data?.rejected + data?.other
            ) : (
              0
            )}
          </Text>
          <Text style={{paddingHorizontal: 10, alignSelf: 'flex-end'}} variant="bodyLarge">
            {t("Total")}
          </Text>
        </Card>
      </View>
      <IconButton
        icon="refresh"
        size={30}
        disabled={isFetching}
        accessibilityLabel="refresh to-do summary"
        style={{marginTop: '5%'}}
        mode="contained"
        onPress={refetch}
      />
    </View>
  );
};

export default InvitaionsSummary;
