import React, {useEffect, useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {
  InterstitialAd,
  RewardedInterstitialAd,
  RewardedAd,
  RewardedAdEventType,
  AdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';
import {Appbar, Button, Text, Card, useTheme} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
const adUnitIdINTERSTITIAL = __DEV__
  ? TestIds.INTERSTITIAL
  : 'ca-app-pub-9526618780177325/5862732310';

const adUnitIdREWARDED = __DEV__ ? TestIds.REWARDED : 'ca-app-pub-9526618780177325/6696531327';

const interstitial = InterstitialAd.createForAdRequest(adUnitIdINTERSTITIAL, {
  requestNonPersonalizedAdsOnly: true,
});

const rewarded = RewardedAd.createForAdRequest(adUnitIdREWARDED, {
  requestNonPersonalizedAdsOnly: true,
});

export default function App() {
  const navigate = useNavigation();
  const theme = useTheme();

  const [loaded, setLoaded] = useState(false);
  const [isInterstitialWatched, setIsInterstitialWatched] = useState(false);

  useEffect(() => {
    const unsubscribe = interstitial.addAdEventListener(AdEventType.LOADED, () => {
      setLoaded(true);
    });

    // Start loading the interstitial straight away
    interstitial.load();
    // Unsubscribe from events on unmount
    return unsubscribe;
  }, []);

  const [loaded1, setLoaded1] = useState(false);
  const [isrewardedWatched, setIsrewardedWatched] = useState(false);

  useEffect(() => {
    const unsubscribeLoaded = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
      setLoaded1(true);
    });
    const unsubscribeEarned = rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      reward => {
        console.log('User earned reward of ', reward);
      },
    );

    // Start loading the rewarded ad straight away
    rewarded.load();
    // Unsubscribe from events on unmount
    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
    };
  }, []);

  return (
    <View style={{flex: 1}}>
      <Appbar.Header style={{backgroundColor:theme.colors.background}}>
        <Appbar.BackAction onPress={() => navigate.goBack()} />
        <Appbar.Content title="Watch ad" />
      </Appbar.Header>

      <Card theme={{roundness:0}} style={{margin: '0%', backgroundColor:theme.colors.background}}>
        <Card.Content>
          <Text variant="headlineMedium">Thank you for coming here.</Text>
          <Text style={{marginVertical: '5%'}} variant="bodyLarge">
            We greatly appreciate your patience and willingness to watch an Ad. Your support through
            watching this Ad helps us continue to provide our app for free.
          </Text>
        </Card.Content>
      </Card>

      <View style={{flex: 1, alignItems: 'center', justifyContent: 'flex-start'}}>
        {!isInterstitialWatched ? (
          <View style={{width: '90%', marginVertical: '5%'}}>
            {loaded ? (
              <Button
                icon="image-filter-vintage"
                mode="contained"
                onPress={() => {
                  interstitial.show();
                  setIsInterstitialWatched(true);
                }}
                style={{paddingVertical: '1%'}}>
                Watch Image Ad
              </Button>
            ) : (
              <ActivityIndicator size="large" style={{}} />
            )}
          </View>
        ) : (
          <Text style={{marginVertical: '5%'}}>You have watched the ad</Text>
        )}

        {!isrewardedWatched ? (
          <View style={{width: '90%'}}>
            {loaded1 ? (
              <Button
                icon="motion-play"
                mode="outlined"
                onPress={() => {
                  rewarded.show();
                  setIsrewardedWatched(true);
                }}
                style={{paddingVertical: '1%'}}>
                Watch Rewarded Ad
              </Button>
            ) : (
              <ActivityIndicator size="large" style={{}} />
            )}
          </View>
        ) : (
          <Text>You have watched the ad</Text>
        )}

        {isInterstitialWatched && isrewardedWatched && (
          <Text style={{marginVertical: '10%'}}>
            You can watch ad again when you re-open the app.
          </Text>
        )}
      </View>
    </View>
  );
}
