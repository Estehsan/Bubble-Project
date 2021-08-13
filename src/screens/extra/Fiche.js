import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import LocationTab from '../../component/LocationTab';
import TopBar from '../../component/TopBar';
import ListContainer from './../../component/ListContainer';

// linear-gradient(0deg, #FFFFFF 0%, #FFC1DD 78.9%)
const Fiche = ({...props}) => {
  const [images, setimages] = useState([
    require('./../../assets/images/description.png'),
    require('./../../assets/images/description.png'),
    require('./../../assets/images/description.png'),
    require('./../../assets/images/description.png'),
    require('./../../assets/images/description.png'),
  ]);
  return (
    <LinearGradient
      colors={['#FFC1DD', '#ffffff']}
      style={styles.linearGradient}>
      <SafeAreaView>
        <View>
          <TopBar />
        </View>
        <View style={{marginTop: 30}}>
          <LocationTab />
        </View>
        <View style={{marginTop: 40}}>
          <View style={styles.content}>
            <Image
              style={{height: 200, width: 200, justifyContent: 'center'}}
              source={require('./../../assets/images/description.png')}
            />
            <FlatList
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              data={images}
              renderItem={({item, index}) => (
                <Image
                  source={item} /* Use item to set the image source */
                  key={index} /* Important to set a key for list items,
                       but it's wrong to use indexes as keys, see below */
                  style={{
                    width: 100,
                    height: 100,
                    borderColor: '#d35647',
                    resizeMode: 'contain',
                    margin: 8,
                  }}
                />
              )}
            />
            <View style={styles.TextContent}>
              <Text style={styles.f}>LE PERCHOIR DE L’EST</Text>
              <Text style={styles.fextra}>
                10 place du 11 novembre 1918, 75010 Paris Ouvert tous les soirs
                à partir de 18h
              </Text>
              <Text style={styles.fextra}>01.98.97.96.95</Text>
            </View>

            <View style={{justifyContent: 'center', flexDirection: 'row'}}>
              <TouchableOpacity
                style={{alignItems: 'center'}}
                onPress={() => props.navigation.navigate('Fiche')}>
                <View style={styles.btn}>
                  <Text style={styles.btnText}>
                    Voir les Bubbles connectés dans ce lieux
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default Fiche;

const styles = StyleSheet.create({
  linearGradient: {flex: 1},
  content: {
    alignItems: 'center',
  },
  TextContent: {
    width: '60%',
    alignItems: 'center',
    alignContent: 'center',
  },
  f: {
    fontFamily: 'FredokaOne-Regular',
    fontSize: 20,
    paddingVertical: 15,
  },
  fextra: {
    fontFamily: 'Montserrat-Light',
    textAlign: 'center',
    fontSize: 16,
  },
  btn: {
    width: '70%',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#DD488C',
    borderRadius: 30,
    marginVertical: 12,
    marginTop: 20,
  },
  btnText: {
    color: '#fff',
    textAlign: 'center',
  },
});
