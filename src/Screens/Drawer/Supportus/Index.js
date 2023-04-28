import React, {useEffect, useState} from 'react';
import {Button, ActivityIndicator, View} from 'react-native';
import {
  InterstitialAd,
  AdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';
import {Appbar} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
const adUnitId = __DEV__
  ? TestIds.INTERSTITIAL
  : 'ca-app-pub-9526618780177325/2035594601';

const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
});

export default function App() {
  const navigate = useNavigation();

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const unsubscribe = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        setLoaded(true);
      },
    );

    // Start loading the interstitial straight away
    interstitial.load();

    // Unsubscribe from events on unmount
    return unsubscribe;
  }, []);


  return (
    <View style={{flex:1}}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigate.goBack()} />
        <Appbar.Content title="Watch an ad" />
        {/* <Appbar.Action icon="calendar" onPress={() => {}} /> */}
        {/* <Appbar.Action icon="magnify" onPress={() => {}} /> */}
      </Appbar.Header>
      <View style={{flex:1, alignItems:"center", justifyContent:"center"}}>

      {loaded ? (
        <Button
          title="Show ad"
          onPress={() => {
            interstitial.show();
          }}
        />
      ) : (
        <ActivityIndicator
          size="large"
          style={{}}
        />
      )}
      </View>
    </View>
  );
}
