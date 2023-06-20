import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {
  IconButton,
  Avatar,
  List,
  Card,
  Button,
  Text,
  Menu,
  ActivityIndicator,
  useTheme,
  Divider,
} from 'react-native-paper';
import {useSelector, useDispatch} from 'react-redux';
import {useGetInvitationsSummaryQuery} from '../../../../../redux/reducers/groups/invitations/invitaionThunk';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const InvitaionsSummary = ({onClose}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const theme = useTheme();
  const currentViewingGroup = useSelector(
    state => state.groups?.currentViewingGroup,
  );

  const {data, isError, isLoading, error, isFetching, refetch} =
    useGetInvitationsSummaryQuery({
      groupId: currentViewingGroup._id,
    });

  return (
    <View style={{padding: '5%'}}>
      <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
      <List.Item
          title={"Invitations summary of"}
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
          <Text
            style={{paddingHorizontal: 10, alignSelf: 'flex-end'}}
            variant="bodyLarge">
            Invited
          </Text>
          {/* <Divider style={{marginVertical: '2%'}} />
          <TouchableOpacity onPress={refetch} style={{width:"100%",justifyContent:"flex-end",padding:"4%", flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{marginHorizontal: '2%'}} variant="bodyLarge">
              View
            </Text>
            <Icon name="arrow-right" size={20} />
          </TouchableOpacity> */}
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
          <Text
            style={{paddingHorizontal: 10, alignSelf: 'flex-end'}}
            variant="bodyLarge">
            Pending
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
          <Text
            style={{paddingHorizontal: 10, alignSelf: 'flex-end'}}
            variant="bodyLarge">
            Rejected
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
          <Text
            style={{paddingHorizontal: 10, alignSelf: 'flex-end'}}
            variant="bodyLarge">
            Others
          </Text>
        </Card>

        <IconButton
          icon="refresh"
          size={30}
          disabled={isFetching}
          accessibilityLabel="refresh tasks summary"
          style={{marginTop:"5%"}}
          mode="contained"
          onPress={refetch}
        />

      </View>
    </View>
  );
};

export default InvitaionsSummary;
