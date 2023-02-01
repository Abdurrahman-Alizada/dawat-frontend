import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'
const UserInDrawer = () => {
  return (
    <View style={{marginTop:"4%"}} >
    <SkeletonPlaceholder borderRadius={4}>
      <SkeletonPlaceholder.Item flexDirection="column" alignItems="flex-start">
        <SkeletonPlaceholder.Item width={60} marginLeft={20} height={60} borderRadius={50} />
        <SkeletonPlaceholder.Item width="100%" marginTop={10} marginLeft={20}>
          <SkeletonPlaceholder.Item width="60%" height={20} />
          <SkeletonPlaceholder.Item marginTop={7} width="30%" height={20} />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>


<SkeletonPlaceholder  borderRadius={4} >
  <SkeletonPlaceholder.Item marginLeft={20} marginTop={20} flexDirection="row" >
      <SkeletonPlaceholder.Item width="5%" marginRight={3}  height={10} />
      <SkeletonPlaceholder.Item width="20%" marginRight={5} height={10} />

      <SkeletonPlaceholder.Item width="5%" marginLeft={10} marginRight={3} height={10} />
      <SkeletonPlaceholder.Item width="20%" marginRight={5} height={10} />

  </SkeletonPlaceholder.Item>
</SkeletonPlaceholder>

    </View>
  )
}

export default UserInDrawer

const styles = StyleSheet.create({})