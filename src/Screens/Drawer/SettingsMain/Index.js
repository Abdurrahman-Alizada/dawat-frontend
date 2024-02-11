import {Alert, I18nManager, Linking, Platform, TouchableOpacity, View} from 'react-native';
import React, {useContext} from 'react';
import {Card, Text, Avatar, List, Switch} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSelector} from 'react-redux';
import SettingsScreenBanner from '../../../adUnits/settingsScreenBanner';
import {ThemeContext} from '../../../themeContext';
import {useTranslation} from 'react-i18next';

const GOOGLE_PACKAGE_NAME = 'com.softcodes.eventplanner';
const APPLE_STORE_ID = 'id284882215';

const Index = ({navigation}) => {
  const {t} = useTranslation();
  const {toggleTheme, isThemeDark} = useContext(ThemeContext);

  const currentLoginUser = useSelector(state => state.user.currentLoginUser);
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
    <View style={{flex: 1, justifyContent: 'space-between'}}>
      <View>
        <Card
          style={{
            backgroundColor: '#6288EF',
            margin: '2%',
          }}
          onPress={async () => {
            navigation.navigate('Profile', {
              id: await AsyncStorage.getItem('id'),
            });
          }}
          theme={{roundness: 2}}>
          <Card.Content
            style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Avatar.Image
                size={55}
                style={{marginRight: '6%'}}
                source={
                  currentLoginUser?.imageURL
                    ? {uri: currentLoginUser.imageURL}
                    : require('../../../assets/drawer/male-user.png')
                }
              />
              <View style={{maxWidth: '80%'}}>
                <Text style={{fontWeight: 'bold', fontSize: 18, color: '#fff'}}>
                  {currentLoginUser?.name ? currentLoginUser?.name : '****'}
                </Text>
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
                color="#fff"
                icon={I18nManager.isRTL ? 'chevron-left' : 'chevron-right'}
                style={{backgroundColor: '#6288EF'}}
              />
            </TouchableOpacity>
          </Card.Content>
        </Card>

        {/* <Card
          style={{
            backgroundColor: theme.colors.secondaryContainer,
            margin: '2%',
          }}
          theme={{roundness: 2}}>
     
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
        </Card> */}

        <List.Section>
          <List.Subheader style={{}}>{t('Preferences')}</List.Subheader>

          <List.Item
            title={t('Choose language')}
            onPress={() => {
              navigation.navigate('ChooseLanguage');
            }}
            left={props => <List.Icon {...props} icon="translate" />}
            right={props => (
              <List.Icon {...props} icon={I18nManager.isRTL ? 'chevron-left' : 'chevron-right'} />
            )}
          />

          <List.Item
            title={t('Dark theme')}
            onPress={() => {
              toggleTheme();
            }}
            left={props => <List.Icon {...props} icon="weather-night" />}
            right={props => (
              <Switch {...props} value={isThemeDark} onValueChange={() => toggleTheme()} />
            )}
          />
        </List.Section>

        <List.Section>
          <List.Subheader style={{}}>{t('About')}</List.Subheader>

          <List.Item
            title={t('Rate this app')}
            onPress={openStore}
            left={props => <List.Icon {...props} icon="star" />}
            right={props => (
              <List.Icon {...props} icon={I18nManager.isRTL ? 'chevron-left' : 'chevron-right'} />
            )}
          />

          <List.Item
            title={t('Privacy policy')}
            onPress={handlePrivacyPolicyPress}
            left={props => <List.Icon {...props} icon="clipboard-text" />}
            right={props => (
              <List.Icon {...props} icon={I18nManager.isRTL ? 'chevron-left' : 'chevron-right'} />
            )}
          />
        </List.Section>
      </View>

      <SettingsScreenBanner />
    </View>
  );
};

export default Index;
