import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Snackbar, Text, useTheme, Card} from 'react-native-paper';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import GeneralAppbar from '../../../../../Components/GeneralAppbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import InvitedIcon from '../../../../../Components/invitations/invitedIcon';
import OtherIcon from '../../../../../Components/invitations/otherIcon';
import PendingIcon from '../../../../../Components/invitations/pendingIcon';
import RejectedIcon from '../../../../../Components/invitations/rejectedIcon';
import PinPageBanner from '../../../../../adUnits/summaryScreenBanner';

const Index = ({group, onClose}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const theme = useTheme();

  const currentViewingGroup = useSelector(state => state.groups?.currentViewingGroup);

  const [guestsData, setGuestsData] = useState({
    pendingGuests: 0,
    invitedGuests: 0,
    rejectedGuests: 0,
    otherGuests: 0,
    totalGuest: 0,
  });

  const getData = async () => {
    let guests = JSON.parse(await AsyncStorage.getItem(`guests_${currentViewingGroup?._id}`));
    let invitedGuests = 0;
    let pendingGuests = 0;
    let rejectedGuests = 0;
    let otherGuests = 0;

    for (let i = 0; i < guests?.length; i++) {
      if (guests[i]?.lastStatus?.invitiStatus === 'pending') {
        pendingGuests++;
      } else if (guests[i]?.lastStatus?.invitiStatus === 'invited') {
        invitedGuests++;
      } else if (guests[i]?.lastStatus?.invitiStatus === 'rejected') {
        rejectedGuests++;
      } else {
        otherGuests++;
      }
    }
    setGuestsData({
      pendingGuests: pendingGuests,
      invitedGuests: invitedGuests,
      rejectedGuests: rejectedGuests,
      otherGuests: otherGuests,
      totalGuest: guests.length,
    });
    pendingGuests = null;
    invitedGuests = null;
    rejectedGuests = null;
    otherGuests = null;
    guests = null;
  };

  useEffect(() => {
    getData();
  }, []);

  const goBack = () => navigation.goBack();

  return (
    <View style={{flex: 1}}>
      <GeneralAppbar title={'Summary'} back={goBack} navigation={navigation} />

      <ScrollView contentContainerStyle={{}}>
        <Text
          style={{
            paddingHorizontal: '5%',
            marginVertical: '3%',
            color: theme.colors.textGray,
            fontWeight: '600',
          }}
          variant="bodyMedium">
          Event: '{currentViewingGroup?.groupName}'
        </Text>

        <View
          style={{
            marginVertical: '2%',
          }}>
          <Text
            style={{paddingVertical: '3%', paddingHorizontal: '5%', fontWeight: '700'}}
            variant="headlineSmall">
            Guests
          </Text>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              paddingHorizontal: '5%',
            }}>
            <Card
              style={{marginVertical: '2%', width: '48%', padding: '2%'}}
              theme={{roundness: 1}}
              mode="contained">
              <Text
                style={{
                  paddingHorizontal: 10,
                  color: theme.colors.error,
                }}
                variant="headlineLarge">
                {guestsData?.pendingGuests}
              </Text>

              <View style={{alignItems: 'flex-end'}}>
                <PendingIcon />
              </View>
            </Card>

            <Card
              style={{marginVertical: '2%', width: '48%', padding: '2%'}}
              theme={{roundness: 1}}
              mode="contained">
              <Text
                style={{
                  paddingHorizontal: 10,
                  color: theme.colors.primary,
                }}
                variant="headlineLarge">
                {guestsData?.invitedGuests}
              </Text>
              <View style={{alignItems: 'flex-end'}}>
                <InvitedIcon />
              </View>
            </Card>

            <Card
              style={{marginVertical: '2%', width: '48%', padding: '2%'}}
              theme={{roundness: 1}}
              mode="contained">
              <Text
                style={{
                  paddingHorizontal: 10,
                  color: theme.colors.tertiary,
                }}
                variant="headlineLarge">
                {guestsData?.otherGuests}
              </Text>
              <View style={{alignItems: 'flex-end'}}>
                <OtherIcon />
              </View>
            </Card>

            <Card
              style={{marginVertical: '2%', width: '48%', padding: '2%'}}
              theme={{roundness: 1}}
              mode="contained">
              <Text
                style={{
                  paddingHorizontal: 10,
                  color: theme.colors.tertiary,
                }}
                variant="headlineLarge">
                {guestsData?.rejectedGuests}
              </Text>
              <View style={{alignItems: 'flex-end'}}>
                <RejectedIcon />
              </View>
            </Card>
            <Card
              style={{marginVertical: '2%', width: '100%', padding: '2%'}}
              theme={{roundness: 1}}
              mode="contained">
              <Text
                style={{
                  paddingHorizontal: 10,
                  fontWeight: 'bold',
                  color: theme.colors.secondary,
                }}
                variant="headlineLarge">
                {guestsData?.totalGuest}
              </Text>

              <Text style={{paddingHorizontal: 10, alignSelf: 'flex-end'}} variant="bodyLarge">
                Total
              </Text>
            </Card>
          </View>
        </View>

        {/* <View
          style={{
            marginVertical: '2%',
          }}>
          <Text
            style={{paddingVertical: '3%', paddingHorizontal: '5%', fontWeight: '700'}}
            variant="headlineSmall">
            Tasks
          </Text>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              paddingHorizontal: '5%',
            }}>
            <Card
              style={{marginVertical: '2%', width: '48%', padding: '2%'}}
              theme={{roundness: 1}}
              mode="contained">
              <Text
                style={{
                  paddingHorizontal: 10,
                  fontWeight: 'bold',
                  color: theme.colors.error,
                }}
                variant="headlineLarge">
                20
              </Text>

              <Text style={{paddingHorizontal: 10, alignSelf: 'flex-end'}} variant="bodyLarge">
                Not completed
              </Text>
            </Card>

            <Card
              style={{marginVertical: '2%', width: '48%', padding: '2%'}}
              theme={{roundness: 1}}
              mode="contained">
              <Text
                style={{
                  paddingHorizontal: 10,
                  fontWeight: 'bold',
                  color: theme.colors.primary,
                }}
                variant="headlineLarge">
                34
              </Text>
              <Text style={{paddingHorizontal: 10, alignSelf: 'flex-end'}} variant="bodyLarge">
                Completed
              </Text>
            </Card>

            <Card
              style={{marginVertical: '2%', width: '100%', padding: '2%'}}
              theme={{roundness: 1}}
              mode="contained">
              <Text
                style={{
                  paddingHorizontal: 10,
                  fontWeight: 'bold',
                  color: theme.colors.secondary,
                }}
                variant="headlineLarge">
                20
              </Text>

              <Text style={{paddingHorizontal: 10, alignSelf: 'flex-end'}} variant="bodyLarge">
                Total
              </Text>
            </Card>
          </View>
        </View> */}

      </ScrollView>
        <PinPageBanner />
    </View>
  );
};

export default Index;
