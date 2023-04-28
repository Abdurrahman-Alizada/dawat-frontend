import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Snackbar } from 'react-native-paper'
const ErrorSnackBar = ({isVisible, text, onDismissHandler, duration, actions}) => {
  return (
    <Snackbar
    visible={isVisible}
    // duration={1000}
    onDismiss={() => onDismissHandler(false)}>
    {text}
  </Snackbar>
  )
}

export default ErrorSnackBar

const styles = StyleSheet.create({})