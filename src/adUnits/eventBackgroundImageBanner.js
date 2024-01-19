import React from 'react'
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-9526618780177325/6907763472';

const EventBackgroundImageBanner = () => {
  return (
    <BannerAd
    unitId={adUnitId}
    size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
  />
  )
}

export default EventBackgroundImageBanner