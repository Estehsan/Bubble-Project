import React from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';

const TopBar = () => {
  return (
    <View style={styles.container}>
      <Image
        style={{height: 400, width: 130}}
        resizeMode="contain"
        source={require('./../assets/images/logo-bubble.png')}
      />
    </View>
  );
};

export default TopBar;

const styles = StyleSheet.create({
  container: {
    height: 110,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
