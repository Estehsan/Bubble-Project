import React, { useState, useEffect } from 'react';
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
import { auth, firestore } from "../../db/firebase";
import Purchases from 'react-native-purchases';



// linear-gradient(0deg, #FFFFFF 0%, #FFC1DD 78.9%)
const AchatUser = ({ ...props }) => {
  const [total, setTotal] = useState(0);
  const [id, setId] = useState("");
  const [candy, setCandy] = useState(0);
  const [count, setCount] = useState(0);
  const [packages, setPackages] = useState([])
  const [modalVisible, setModalVisible] = useState(false);


  useEffect(() => {
    let isMounted = true
    auth.onAuthStateChanged((user) => {
      if (user) {
        var uid = user.uid;
        setId(uid)


        firestore.collection("users").doc(uid)
          .get().then((doc) => {
            if (doc.exists && isMounted) {
              setCandy(doc.data().candy)
              // console.log(info)

            } else {
              // doc.data() will be undefined in this case
              console.log("No such document!");
            }
          })
      }

      else {

      }
    })


    let displayProduct = async () => {
      try {
        const offerings = await Purchases.getOfferings();
        if (offerings.current !== null) {
          console.log(offerings.current)
          // Display current offering with offerings.current
          // setPackages(offerings.current.availablepackages)  
        }
      } catch (e) { }
    }
    // displayProduct()

    return () => { isMounted = false }
  }, []);


  let dummyBuy = async () => {
    if (total > 0)
      await firestore.collection("users").doc(id).update({
        candy: candy + count
      }).then(() => {
        Alert.alert("Purchase has been successful")
        props.navigation.goBack()
        console.log("success")
      })
    else {
      Alert.alert("Nothing to pay")
    }
  }



  let realPurchase = async () => {
    try {
      const { purchaserInfo, productIdentifier } = await Purchases.purchasePackage(candy);
      if (typeof purchaserInfo.entitlements.active.my_entitlement_identifier !== "undefined" ||
        typeof purchaserInfo.entitlements.active.my_entitlement_identifier != null ||
        typeof purchaserInfo.entitlements.active.my_entitlement_identifier.length != 0) {
        // Unlock that great "pro" content
        // if (total > 0)
        //   await firestore.collection("users").doc(id).update({
        //     candy: count
        //   }).then(() => {
        //     Alert.alert("Purchase has been successful")
        //     props.navigation.goBack()
        //     console.log("success")
        //   })
        // else {
        //   Alert.alert("Nothing to pay")
        // }
      }
    } catch (e) {
      if (!e.userCancelled) {
        showError(e);
      }
    }
  }

  <View style={styles.centeredView} >
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
  </View >;

  return (
    <LinearGradient
      colors={['#FFC1DD', '#ffffff']}
      style={styles.linearGradient}>
      <SafeAreaView>
        <View>
          <TopBar />
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: 'center', marginVertical: 10, }}>
          <Text style={styles.ChatUserName}>MON FLEURISTE BUBBLE</Text>
        </View>
        <View style={styles.TopBarExtra}>
          <Image
            style={{ height: 70, width: 70, borderRadius: 70, marginRight: 10 }}
            resizeMode="contain"
            source={require('./../../assets/images/rose.png')}
          />
          <Text style={styles.topFont}>
            Mon solde de des sucreries
            {'\n'} disponibles :
          </Text>
          <Text style={styles.threeFont}>{candy}</Text>
        </View>
        <View style={styles.mainBox}>
          <View style={styles.boxes}>
            <Text style={styles.BoxText}>1 DES BONBONS</Text>
            <Text> {''}</Text>

            <View style={styles.BoxImage}>
              <Image
                style={{ height: 35, width: 35, borderRadius: 35, }}
                resizeMode="contain"
                source={require('./../../assets/images/rose.png')}
              />
            </View>
          </View>
          <View style={styles.boxes}>
            <Text style={styles.BoxText}>PACK DE 5 DES SUCRERIES
            </Text>
            <View style={styles.BoxImage}>
              <Image
                style={{ height: 35, width: 35, borderRadius: 35, }}
                resizeMode="contain"
                source={require('./../../assets/images/rose.png')}
              />
              <Image
                style={{ height: 35, width: 35, borderRadius: 35, }}
                resizeMode="contain"
                source={require('./../../assets/images/rose.png')}
              />
              <Image
                style={{ height: 35, width: 35, borderRadius: 35, }}
                resizeMode="contain"
                source={require('./../../assets/images/rose.png')}
              />

            </View>
          </View>
          <View style={styles.boxes}>
            <Text style={styles.BoxText}>PACK DE 10 DES SUCRERIES
            </Text>
            <View style={styles.BoxImage}>
              <Image
                style={{ height: 35, width: 35, borderRadius: 35, }}
                resizeMode="contain"
                source={require('./../../assets/images/rose.png')}
              />
              <Image
                style={{ height: 35, width: 35, borderRadius: 35, }}
                resizeMode="contain"
                source={require('./../../assets/images/rose.png')}
              />
              <Image
                style={{ height: 35, width: 35, borderRadius: 35, }}
                resizeMode="contain"
                source={require('./../../assets/images/rose.png')}
              />
            </View>
          </View>
        </View>

        <View style={styles.mainBoxExtra}>
          <View style={styles.part}>
            <Text style={styles.BoxText}>0,99 €</Text>
            <View>
              <TouchableOpacity
                onPress={() => {
                  setTotal(total + (0.99))
                  setCount(count + (+1))
                }}>
                <View style={styles.priceBtn}>
                  <Text>+</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setTotal(() => {
                    // let num = total - (0.99)

                    // if (num > 0) {
                    //   return num
                    // }

                    // else {
                    //   return 0
                    // }
                    return 0
                  })
                  setCount(0)
                }}>
                <View style={styles.priceBtn}>
                  <Text>-</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.part}>
            <Text style={styles.BoxText}>2,99 €</Text>
            <View>
              <TouchableOpacity
                onPress={() => {
                  setTotal(total + (+2.99))
                  setCount(count + (+5))

                }}>
                <View style={styles.priceBtn}>
                  <Text>+</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setTotal(0)
                  setCount(0)

                }}>
                <View style={styles.priceBtn}>
                  <Text>-</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.part}>
            <Text style={styles.BoxText}>4,99 €</Text>
            <View>
              <TouchableOpacity onPress={() => {
                setTotal(total + (+4.99))
                setCount(count + (+10))

              }}>
                <View style={styles.priceBtn}>
                  <Text>+</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => {
                setTotal(0)
                setCount(0)

              }}>
                <View style={styles.priceBtn}>
                  <Text>-</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
          <TouchableOpacity style={styles.btnMontant}>
            <Text>Montant total : </Text>
            <Text style={styles.montantText}>{Math.round(total * 100) / 100} €</Text>
          </TouchableOpacity>
        </View>

        <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => {
            dummyBuy()
          }}>

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
    </LinearGradient >
  );
};

export default AchatUser;

const styles = StyleSheet.create({
  linearGradient: { flex: 1 },
  TopBarExtra: {
    marginTop: 20,
    marginBottom: 50,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  topFont: { fontFamily: 'Montserrat-Bold' },
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
  ChatUserName: {
    fontFamily: "FredokaOne-Regular",
    fontSize: 25,
  },
});
