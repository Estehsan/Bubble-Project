import React from 'react';
import {SafeAreaView, StyleSheet, Text, View, Image} from 'react-native';
import Colors from '../../assets/colors/Colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import ListContainer from '../../component/ListContainer';
import LocationTab from '../../component/LocationTab';
import TopBar from '../../component/TopBar';
import LinearGradient from 'react-native-linear-gradient';

const Home = () => {
  return (
    <LinearGradient
      colors={['#FFC1DD', '#ffffff']}
      style={styles.linearGradient}>
      <SafeAreaView style={styles.main}>
        <TopBar />
        <View style={{marginTop: 30}}>
          <LocationTab />
        </View>
        <View style={{alignItems: 'center', flex: 2, marginTop: -20}}>
          <Image
            style={{height: 400, width: '80%'}}
            resizeMode="contain"
            source={require('../../assets/images/map.png')}
          />
        </View>
        <View style={{marginBottom: 80}}>
          <ListContainer />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default Home;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    display: 'flex',
  },
  linearGradient: {flex: 1},
});
