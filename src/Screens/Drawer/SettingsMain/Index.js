import {Alert, Linking, Platform, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {Card, Text, Avatar, useTheme} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
import SettingsScreenBanner from '../../../adUnits/settingsScreenBanner';

const GOOGLE_PACKAGE_NAME = 'com.softcodes.eventplanner';
const APPLE_STORE_ID = 'id284882215';

const Index = ({navigation}) => {
  const theme = useTheme();

  const currentLoginUser = useSelector(state => state.user.currentLoginUser)
  const obscureEmail = email => {
    if (!email) return '*******';
    const [name, domain] = email?.split('@');
    return `${name[0]}${name[1]}${new Array(name.length - 3).join('*')}@${domain}`;
  };


  const openStore = () => {
    //This is the main trick
    if (Platform.OS != 'ios') {
      Linking.openURL(`market://details?id=${GOOGLE_PACKAGE_NAME}`).catch(err =>
        alert('Please check for Google Play Store'),
      );
    } else {
      Linking.openURL(`itms://itunes.apple.com/in/app/apple-store/${APPLE_STORE_ID}`).catch(err =>
        alert('Please check for the App Store'),
      );
    }
  };


  const handlePrivacyPolicyPress = async () => {
    const supported = await Linking.canOpenURL(
      'https://eventplannerapp.netlify.app/privacy-policy',
    );

    if (supported) {
      await Linking.openURL('https://eventplannerapp.netlify.app/privacy-policy');
    } else {
      Alert.alert(`Something went wrong`);
    }
  };


  return (
    <View style={{flex:1, justifyContent:"space-between"}}>
      <View>

      <Card
        style={{
          backgroundColor: '#6288EF',
          margin: '2%',
        }}
        theme={{roundness: 2}}>
        <Card.Content style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Avatar.Image
              size={55}
              style={{marginRight: '6%'}}
              source={require('../../../assets/drawer/male-user.png')}
            />
            <View style={{maxWidth: '80%'}}>
              <Text style={{fontWeight: 'bold', fontSize: 18, color: '#fff'}}>{currentLoginUser?.name ? currentLoginUser?.name : "****"}</Text>
              <Text style={{color: '#fff'}}>{obscureEmail(currentLoginUser?.email)}</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={async () => {
              navigation.navigate('Profile', {
                id: await AsyncStorage.getItem('id'),
              });
            }}>
            <Avatar.Icon
              size={35}
              icon="pencil"
              mode=""
              style={{backgroundColor: theme.colors.cardBG}}
            />
          </TouchableOpacity>
        </Card.Content>
      </Card>

      <Card
        style={{
          backgroundColor: theme.colors.secondaryContainer,
          margin: '2%',
        }}
        theme={{roundness: 2}}>
        <TouchableOpacity
          onPress={() => navigation.navigate('MakeFriends', {screen: 'MakeFriendsMain'})}
          style={{
            marginHorizontal: '4%',
            marginTop: '4%',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Avatar.Icon
              size={35}
              icon="account-multiple"
              style={{marginRight: '6%', backgroundColor: theme.colors.secondaryContainer}}
            />
            <View style={{maxWidth: '80%'}}>
              <Text style={{color: theme.colors.onSecondaryContainer}}>Friends</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => {}}>
            <Avatar.Icon
              size={35}
              icon="chevron-right"
              style={{backgroundColor: theme.colors.secondaryContainer}}
            />
          </TouchableOpacity>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Preferences')}
          style={{flexDirection: 'row', padding: '4%', justifyContent: 'space-between'}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Avatar.Icon
              size={35}
              icon="cog"
              style={{marginRight: '6%', backgroundColor: theme.colors.secondaryContainer}}
              // style={{}}
              // source={require('../../../assets/drawer/male-user.png')}
            />
            <View style={{maxWidth: '80%'}}>
              <Text style={{color: theme.colors.onSecondaryContainer}}>Preferences</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => {}}>
            <Avatar.Icon
              size={35}
              icon="chevron-right"
              style={{backgroundColor: theme.colors.secondaryContainer}}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </Card>

      <Card
        style={{
          backgroundColor: theme.colors.secondaryContainer,
          margin: '2%',
        }}
        theme={{roundness: 2}}>
      
        <TouchableOpacity
          onPress={openStore}
          style={{
            flexDirection: 'row',
            marginVertical: '4%',
            paddingHorizontal: '4%',
            justifyContent: 'space-between',
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Avatar.Icon
              size={35}
              icon="star"
              style={{marginRight: '6%', backgroundColor: theme.colors.secondaryContainer}}
            />

            <Text style={{color: theme.colors.onSecondaryContainer}}>Rate this app</Text>
          </View>
          <Avatar.Icon
            size={35}
            icon="chevron-right"
            style={{backgroundColor: theme.colors.secondaryContainer}}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handlePrivacyPolicyPress}
          style={{
            flexDirection: 'row',
            marginBottom: '4%',
            paddingHorizontal: '4%',
            justifyContent: 'space-between',
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Avatar.Icon
              size={35}
              icon="clipboard-text"
              style={{marginRight: '6%', backgroundColor: theme.colors.secondaryContainer}}
            />

            <Text style={{color: theme.colors.onSecondaryContainer}}>Privacy policy</Text>
          </View>
          <Avatar.Icon
            size={35}
            icon="chevron-right"
            style={{backgroundColor: theme.colors.secondaryContainer}}
          />
        </TouchableOpacity>


      </Card>
      </View>

<SettingsScreenBanner />

    </View>
  );
};

export default Index;
