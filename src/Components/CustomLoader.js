import { StyleSheet, Modal, ActivityIndicator, Text, View } from 'react-native'
import React from 'react'

const CustomLoader = ({animating}) => {
  return (
    <Modal
    transparent={true}
    animationType={'none'}
    visible={animating}
    onRequestClose={() => {console.log('close modal')}}>
    <View style={styles.modalBackground}>
      <View >
        <ActivityIndicator style={styles.activityIndicatorWrapper}
           color="#000"
           size="large"
          animating={animating} />
      </View>
    </View>
  </Modal>
)
}

export default CustomLoader

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-around',
        backgroundColor: '#00000040'
      },
      activityIndicatorWrapper: {
        backgroundColor: '#FFFFFF',
        height: 100,
        width: 100,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around'
      }
    
})