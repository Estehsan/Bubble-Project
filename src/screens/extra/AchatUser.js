import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  Modal,
  TouchableOpacity,
  Pressable,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Colors from '../../assets/colors/Colors';
import LocationTab from '../../component/LocationTab';
import TopBar from '../../component/TopBar';
import ListContainer from './../../component/ListContainer';
import SearchBar from './../../component/SearchBar';
import Icon from 'react-native-vector-icons/Entypo';
import Home from '../user/Home';
import Fiche from '../extra/Fiche';
import Color from './../../assets/colors/Colors';

// linear-gradient(0deg, #FFFFFF 0%, #FFC1DD 78.9%)
const AchatUser = ({...props}) => {
  const [modalVisible, setModalVisible] = useState(false);

  <View style={styles.centeredView}>
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        Alert.alert('Modal has been closed.');
        setModalVisible(!modalVisible);
      }}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Hello World!</Text>
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() => setModalVisible(!modalVisible)}>
            <Text style={styles.textStyle}>Hide Modal</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
    <Pressable
      style={[styles.button, styles.buttonOpen]}
      onPress={() => setModalVisible(true)}>
      <Text style={styles.textStyle}>Show Modal</Text>
    </Pressable>
  </View>;

  return (
    <LinearGradient
      colors={['#FFC1DD', '#ffffff']}
      style={styles.linearGradient}>
      <SafeAreaView>
        <View>
          <TopBar />
        </View>
        <View style={styles.TopBarExtra}>
          <Image
            style={{height: 70, width: 70, borderRadius: 70, marginRight: 10}}
            resizeMode="contain"
            source={require('./../../assets/images/rose.png')}
          />
          <Text style={styles.topFont}>
            Mon solde de roses{'\n'} disponibles :
          </Text>
          <Text style={styles.threeFont}>3</Text>
        </View>
        <View style={styles.mainBox}>
          <View style={styles.boxes}>
            <Text style={styles.BoxText}>1 ROSE</Text>
            <Text> {''}</Text>

            <View style={styles.BoxImage}>
              <Icon
                style={styles.position}
                name="flower"
                size={30}
                color={Colors.darkPink}
              />
            </View>
          </View>
          <View style={styles.boxes}>
            <Text style={styles.BoxText}>PACK DE 5 ROSES</Text>
            <View style={styles.BoxImage}>
              <Icon
                style={styles.position}
                name="flower"
                size={30}
                color={Colors.darkPink}
              />
              <Icon
                style={styles.position}
                name="flower"
                size={30}
                color={Colors.darkPink}
              />
              <Icon
                style={styles.position}
                name="flower"
                size={30}
                color={Colors.darkPink}
              />
            </View>
          </View>
          <View style={styles.boxes}>
            <Text style={styles.BoxText}>PACK DE 10 ROSES</Text>
            <View style={styles.BoxImage}>
              <Icon
                style={styles.position}
                name="flower"
                size={30}
                color={Colors.darkPink}
              />
              <Icon
                style={styles.position}
                name="flower"
                size={30}
                color={Colors.darkPink}
              />
              <Icon
                style={styles.position}
                name="flower"
                size={30}
                color={Colors.darkPink}
              />
            </View>
          </View>
        </View>

        <View style={styles.mainBoxExtra}>
          <View style={styles.part}>
            <Text style={styles.BoxText}>XX,XX €</Text>
            <View>
              <TouchableOpacity
                onPress={() => props.navigation.navigate('Home')}>
                <View style={styles.priceBtn}>
                  <Text>+</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.part}>
            <Text style={styles.BoxText}>XX,XX €</Text>
            <View>
              <TouchableOpacity
                onPress={() => props.navigation.navigate('Home')}>
                <View style={styles.priceBtn}>
                  <Text>+</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.part}>
            <Text style={styles.BoxText}>XX,XX €</Text>
            <View>
              <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                <View style={styles.priceBtn}>
                  <Text>+</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={{justifyContent: 'center', flexDirection: 'row'}}>
          <TouchableOpacity style={styles.btnMontant}>
            <Text>Montant total : </Text>
            <Text style={styles.montantText}>XX,XX €</Text>
          </TouchableOpacity>
        </View>

        <View style={{justifyContent: 'center', flexDirection: 'row'}}>
          <TouchableOpacity onPress={() => props.navigation.navigate('Fiche')}>
            <View style={styles.btn}>
              <Text style={styles.f}>Payer</Text>
            </View>
          </TouchableOpacity>
        </View>
        {/* <View style={{justifyContent: 'center', flexDirection: 'row'}}>
          <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
            <View style={styles.btn}>
              <Text style={styles.f}>Payer</Text>
            </View>
          </TouchableOpacity>
        </View> */}
      </SafeAreaView>
    </LinearGradient>
  );
};

export default AchatUser;

const styles = StyleSheet.create({
  linearGradient: {flex: 1},
  TopBarExtra: {
    marginTop: 50,
    marginBottom: 50,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  topFont: {fontFamily: 'Montserrat-Bold'},
  threeFont: {
    fontFamily: 'FredokaOne-Regular',
    fontSize: 40,
    marginLeft: 10,
    color: Colors.darkPink,
  },
  BoxText: {
    fontFamily: 'FredokaOne-Regular',
    fontSize: 15,
    marginTop: 15,
    alignContent: 'center',
  },
  montantText: {
    fontFamily: 'FredokaOne-Regular',
    fontSize: 15,
    alignContent: 'center',
  },
  BoxImage: {
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    marginTop: 30,
    alignItems: 'center',
  },
  boxes: {
    height: 180,
    borderRadius: 28,
    backgroundColor: '#fff',
    width: '29%',
    alignItems: 'center',
  },
  mainBox: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
  },
  mainBoxExtra: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',

    justifyContent: 'space-around',
  },
  part: {
    display: 'flex',
  },
  priceBtn: {
    backgroundColor: '#fff',
    paddingVertical: 3,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  btnMontant: {
    backgroundColor: '#fff',
    width: '60%',
    paddingVertical: 10,
    paddingHorizontal: 10,
    justifyContent: 'center',
    flexDirection: 'row',

    alignItems: 'center',
    borderRadius: 20,
    marginTop: 30,
  },
  btn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#DD488C',
    borderRadius: 10,
    marginVertical: 12,
    marginTop: 20,
  },
  f: {
    fontFamily: 'FredokaOne-Regular',
    color: '#fff',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },

  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
