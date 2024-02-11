import React, {useEffect, useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {InterstitialAd, AdEventType, TestIds} from 'react-native-google-mobile-ads';
import {Appbar, useTheme} from 'react-native-paper';
const adUnitIdINTERSTITIAL = __DEV__
  ? TestIds.INTERSTITIAL
  : 'ca-app-pub-9526618780177325/2233225131';

const interstitial = InterstitialAd.createForAdRequest(adUnitIdINTERSTITIAL, {
  requestNonPersonalizedAdsOnly: true,
});

export default function PinScreenAppbarGift({istransparent}) {
  const theme = useTheme()
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

  return (
    <View>
      {!isInterstitialWatched && (
        <View>
          {loaded && (
            <Appbar.Action
              icon="gift-outline"
              color={istransparent ? '#fff' : theme.colors.onBackground}
              onPress={() => {
                interstitial.show();
                setIsInterstitialWatched(true);
              }}
            />
          )}
        </View>
      )}
    </View>
  );
}
