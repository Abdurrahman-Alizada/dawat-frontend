import {View, Text} from 'react-native';
import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {Card} from 'react-native-paper';

export default function GroupsList() {
  return (
    <View style={{marginVertical:"5%"}}>
      
      {
        [1,2,3,4].map((item,index)=>(
          
      <SkeletonPlaceholder  key={index} height="100%" borderRadius={4}>
        <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
         
          <SkeletonPlaceholder.Item width="100%" marginLeft={10}>
            <SkeletonPlaceholder.Item width="60%" height={10} />
            <SkeletonPlaceholder.Item width="50%" marginTop={10}  height={10} />
            <SkeletonPlaceholder.Item marginTop={10} width="80%" marginBottom={30} height={10} />
          </SkeletonPlaceholder.Item>

        
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
        ))
      }

    </View>
  );
}
