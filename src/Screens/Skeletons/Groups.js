import {View, Text} from 'react-native';
import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

export default function GroupsList() {
  return (
    <View>

      {
        [1,2,3].map((item,index)=>(
      <View style={{marginTop:"4%"}} key={index} >
      <SkeletonPlaceholder borderRadius={4}>
        <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
          <SkeletonPlaceholder.Item width={60} height={60} borderRadius={50} />
          <SkeletonPlaceholder.Item width="100%" marginLeft={20}>
            <SkeletonPlaceholder.Item width="60%" height={20} />
            <SkeletonPlaceholder.Item marginTop={7} width="30%" height={20} />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
      </View>
        ))
      }

{/* <View style={{marginTop:"7%"}} >
      <SkeletonPlaceholder borderRadius={4} >
        <SkeletonPlaceholder.Item alignItems="center" justifyContent="center" >
            <SkeletonPlaceholder.Item width="30%" height={10} />
            <SkeletonPlaceholder.Item marginTop={7} width="10%" height={10} />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
      </View> */}

    </View>
  );
}
