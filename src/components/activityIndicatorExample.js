import React, { Component } from 'react';
import {
   ActivityIndicator,
   View,
   StyleSheet
} from 'react-native';

export default ActivityIndicatorExample = (props) => {
   return (
      <View style = {styles.container}>
         <ActivityIndicator animating = {props.animating}
           style = {styles.activityIndicator} size = {150}
           color="#3a7edf"
         />
      </View>
   );
}

const styles = StyleSheet.create ({
   container: {
    //   flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      //height:90,
      marginTop:70,
      marginBottom: 90
   },
   activityIndicator: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      //height: 90
   }
})
