import {View, Text} from 'react-native';
import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {Card} from 'react-native-paper';

export default function GroupsList() {
  return (
    <View>
      
      {
        [1,2,3].map((item,index)=>(
      <Card  
    //   mode="outlined"
      style={{
        marginTop: '3%',
        paddingVertical:"2%"
      }} key={index} >
      <Card.Content>
          
      <SkeletonPlaceholder height="100%" borderRadius={4}>
        <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
         
          <SkeletonPlaceholder.Item width="100%" marginLeft={20}>
            <SkeletonPlaceholder.Item width="40%" height={10} />
            <SkeletonPlaceholder.Item marginTop={7} width="60%" height={10} />
            <View style={{flexDirection:"row",width:"100%", marginTop:"5%", justifyContent:"space-between"}}>
               <SkeletonPlaceholder.Item width="40%" height={10} />
               <View style={{flexDirection:"row",}}>
                <SkeletonPlaceholder.Item width={20} height={20} borderRadius={50} />
                <SkeletonPlaceholder.Item width={20} height={20} borderRadius={50} />
                <SkeletonPlaceholder.Item width={20} height={20} borderRadius={50} />
               </View>    
            </View>

          </SkeletonPlaceholder.Item>

        
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
     </Card.Content>
      </Card>
        ))
      }

<View style={{marginTop:"7%"}} >
      <SkeletonPlaceholder borderRadius={4} >
        <SkeletonPlaceholder.Item alignItems="center" justifyContent="center" >
            <SkeletonPlaceholder.Item width="30%" height={10} />
            <SkeletonPlaceholder.Item marginTop={7} width="10%" height={10} />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
      </View>

    </View>
  );
}
