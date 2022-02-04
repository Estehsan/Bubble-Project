import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  FlatList,
  Image,
  Alert,
  TouchableOpacity,
  Button,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  useWindowDimensions,
  Keyboard,
  Dimensions,
  ActivityIndicator,
  Modal,
  Pressable,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import OneSignal from "react-native-onesignal";

import LinearGradient from "react-native-linear-gradient";
import LocationTab from "./LocationTab";
import TopBar from "./TopBar";
import ListContainer from "./ListContainer";
import SearchBar from "./SearchBar";
import { auth, firestore, messaging } from "../db/firebase";
import firebase from "firebase/app";
import { set } from "react-native-reanimated";
import Colors from "../assets/colors/Colors";
import H2 from "./basic/H2";
import WP from "./basic/WP";

// linear-gradient(0deg, #FFFFFF 0%, #FFC1DD 78.9%)
const ChatUser = ({ navigation, route, ...props }) => {
  const { currentUserId, messageId, name, gender, age, messageImg, candy } = route.params;
  // let [chatUser, setChatUser] = useState({})
  let [chats, setChats] = useState([]);
  let [message, setMessage] = useState("");

  let [currentName, setcurrentName] = useState("");
  let [currentGender, setcurrentGender] = useState("");
  let [currentImage, setcurrentImage] = useState("");
  

  let [request, setRequest] = useState("");
  let [getRequest, setGetRequest] = useState("");
  let [checker, setChecker] = useState(false);

  let [loading, setLoading] = useState(null);

  let [check, setCheck] = useState(0);

  let [notificationId, setNotificationId] = useState("");
  let [hasRecievedMessage, setHasRecievedMessage] = useState(false);
  let [messageCounter, setMessageCounter] = useState(0);
  let [showContinueButton, setShowContinueButton] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [quitmodal, setQuitModal] = useState(false);
  const [notification, setNotification] = useState([]);

  const [notificationModel, setNotificationModel] = useState(false)

  const scrollViewRef = useRef();
  const width = useWindowDimensions().width;
  useLayoutEffect(() => {
    navigation.setOptions({
      tabBarVisible: false,
      headerStyle: {
        backgroundColor: "#000",
      },
      headerTitle: () => (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}>
            {messageImg && (
                <Image
                  style={{
                    height: 35,
                    width: 35,
                    borderRadius: 35,
                    marginRight: 10,
                  }}
                  source={{ uri: messageImg }}
                />
              ) 
            }
          <Text style={styles.ChatUserName}>{name}</Text>
        </View>
      ),
      headerLeft: () => (
        <View style={{ 
          marginLeft: 10
         }}>
          <TouchableOpacity onPress={() => {
            navigation.goBack()
          }}>
            <Icon name="chevron-back" size={30} color="#fff" />
          </TouchableOpacity>
        </View>
      ),
      headerRight: () => (
        <View style={{ 
          marginRight: 10,
          display: "flex",
          flexDirection: "row"
         }}>
          <Text style={{ 
            // fontFamily: "FredokaOne-Regular",
            color: "white",
            fontSize: 16,
            marginRight: 5,
            marginTop: 5
           }}>{age}</Text>
          {gender == "female" && (
            <Icon
              style={styles.position}
              name="female"
              size={30}
              color={"#fff"}
            />
          )}
          {gender == "male" && (
            <Icon
              style={styles.position}
              name="male"
              size={30}
              color={"#fff"}
            />
          )}
          
          {gender != "female" && gender != "male" && (
            <Icon
              style={styles.position}
              name="male-female"
              size={30}
              color={"#fff"}
            />
          )}
        </View>
      ),
    });
  }, [navigation]);

  useEffect(async () => {
    setLoading(true);
    let merge = uid_merge(currentUserId, messageId);
    get_messages(merge);

    firestore
      .collection("users")
      .doc(currentUserId)
      .onSnapshot((doc) => {
        setNotification(doc.data().notification);
      });

    let datum = await firestore
      .collection("users")
      .doc(currentUserId)
      .get()
      .then((doc) => {
        setcurrentName(doc.data().userName);
        setcurrentGender(doc.data().userGender);
        setcurrentImage(doc.data().userProfileImageUrl);
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });

    let messagedatum = await firestore
      .collection("users")
      .doc(messageId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          setNotificationId(doc.data().notificationId);
        }
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });

    let dataMessenger = await firestore
      .collection("users")
      .doc(messageId)
      .collection("friends")
      .doc(currentUserId)
      .onSnapshot(async (doc) => {
        if (doc.exists) {
          setGetRequest(doc.data().status);
        }

        // console.log(doc.data())
      });

    let dataUser = await firestore
      .collection("users")
      .doc(currentUserId)
      .collection("friends")
      .doc(messageId)
      .onSnapshot(async (doc) => {
        if (doc.exists) {
          await setRequest(doc.data().status);
          await setChecker(doc.data().requestGetter);
          console.log("This ==> ", doc.data());
        }
      });
    await setModalVisible(checker);
    setLoading(false);
  }, [checker]);

  useEffect(() => {}, [check]);

  let uid_merge = (uid1, uid2) => {
    if (uid1 < uid2) {
      // console.log(uid1 + uid2)
      return uid1 + uid2;
    } else {
      // console.log(uid2 + uid1)
      return uid2 + uid1;
    }
  };

  let get_messages = (uid) => {
    console.log("CHAT UID: ", uid)
    firestore
      .collection("message")
      .doc(uid)
      .collection(`chat`)
      .orderBy("createdAt", "desc")
      .onSnapshot((querySnapshot) => {
        let docs = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          userid: doc.data().id,
          message: doc.data().message,
        }));
        {
          if(docs){
            console.log("Messages length: ", docs.length)

            if(docs.length >= 10){
              setShowContinueButton(true)
            }
            setHasRecievedMessage(true)
            setMessageCounter(0)
            setChats(docs)
          }
          // console.log(docs)
        }
        // console.log(docs)
      });
    console.log(checker);
  };
  let leaveChat = async () => {
    // await firestore
    //   .collection("users")
    //   .doc(messageId)
    //   .collection("friends")
    //   .doc(currentUserId)
    //   .delete();

    // await firestore
    //   .collection("users")
    //   .doc(currentUserId)
    //   .collection("friends")
    //   .doc(messageId)
    //   .delete();

    // let merger = uid_merge(currentUserId, messageId);

    // let deleteuser = await firestore
    //   .collection(`message`)
    //   .doc(merger)
    //   .collection(`chat`);
    // deleteuser.get().then(function (querySnapshot) {
    //   querySnapshot.forEach(function (doc) {
    //     doc.ref.delete();
    //   });
    // });

    setMessage("");
    setGetRequest("");
    setRequest("");
    setQuitModal(!quitmodal);
    Alert.alert("Vous avez quitté la conversation");
    navigation.navigate("Home");
  };

  let send_candy = async () => {
    if(candy > 0){
      Alert.alert('Bonbon envoyé !')
      addNotification();
    }
    else{
      Alert.alert("Vous n'avez plus de bonbon")
    }
  }

  let addNotification = async () => {

    if (candy > 0) {
      await firestore.collection("users").doc(currentUserId).update({
        // notification: firebase.firestore.FieldValue.arrayUnion(id),
        candy: firebase.firestore.FieldValue.increment(-1)
      })

      let externalUserId = notificationId; // You will supply the external user id to the OneSignal SDK

      // Setting External User Id with Callback Available in SDK Version 3.9.3+
      // OneSignal.setExternalUserId(externalUserId, (results) => {
      //   // The results will contain push and email success statuses
      //   console.log("Results of setting external user id");
      //   console.log(results);

      //   // Push can be expected in almost every situation with a success status, but
      //   // as a pre-caution its good to verify it exists
      //   if (results.push && results.push.success) {
      //     console.log("Results of setting external user id push status:");
      //     console.log(results.push.success);
      //   }
      // });


      const notification = {
        contents: {
          en: `${currentName} vous propose de discuter`,
        },
        include_player_ids: [externalUserId],
      };

      const jsonStri = JSON.stringify(notification);

      await OneSignal.postNotification(
        jsonStri,
        (success) => {
          console.log("Success:", success);
        },
        (error) => {
          console.log("Error:", error);
        }
      );



      setNotificationModel(false)
    }

    else {
      Alert.alert("Vous n'avez plus de bonbon")
      setNotificationModel(false)

    }



  }

  let send_message = async () => {
    if (message.length > 0) {

      let msg = message;
      setMessage("");

      let merge = uid_merge(currentUserId, messageId);
      console.log('SEND MESSAGE: ', msg, " => ", merge, '('+ merge.length +')')
      
      // await firestore.collection('message').doc(merge).set({
      //   createdAt: firebase.firestore.FieldValue.serverTimestamp()
      // })  
      
      await firestore.collection('message').doc(merge).collection('chat').add({
        message: msg,
        id: currentUserId,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });

      console.log(messageCounter)

      if(messageCounter == 5){
        setShowContinueButton(true)
      }
      setMessageCounter(messageCounter + 1)

      // firestore
      //   .collection("users")
      //   .doc(messageId)
      //   .collection("friends")
      //   .doc(currentUserId)
      //   .update({
      //     createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      //   });

      // firestore
      //   .collection("users")
      //   .doc(currentUserId)
      //   .collection("friends")
      //   .doc(messageId)
      //   .update({
      //     createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      //   });

      const { userId } = await OneSignal.getDeviceState();
      

      if (notification && notification.includes(messageId)) {
        if (
          notificationId != "" ||
          notificationId != undefined ||
          notificationId != userId
        ) {
          let externalUserId = notificationId; // You will supply the external user id to the OneSignal SDK

          // Setting External User Id with Callback Available in SDK Version 3.9.3+
          // OneSignal.setExternalUserId(externalUserId, (results) => {
          //   // The results will contain push and email success statuses
          //   console.log("Results of setting external user id");
          //   console.log(results);

          //   // Push can be expected in almost every situation with a success status, but
          //   // as a pre-caution its good to verify it exists
          //   if (results.push && results.push.success) {
          //     console.log("Results of setting external user id push status:");
          //     console.log(results.push.success);
          //   }
          // });

          const notification = {
            contents: {
              en: `${currentName} :  ${msg}`,
            },
            include_player_ids: [externalUserId],
          };

          const jsonStri = JSON.stringify(notification);

          await OneSignal.postNotification(
            jsonStri,
            (success) => {
              console.log("Success:", success);
            },
            (error) => {
              console.log("Error:", error);
            }
          );
        }
      }
      
    }
  };
  return (
    <LinearGradient
      colors={ ["#FFC1DD", "#FFE5F1"] }
      style={[styles.linearGradient, {
        marginBottom: 200
      }]}>
      {!loading ? (
        <KeyboardAvoidingView
          behavior={Platform.OS == "ios" ? "padding" : "height"}
          keyboardVerticalOffset={90}
          style={styles.container}>
          {route.params ? (
            <>
              {chats && (
                // console.log(chats)
                <FlatList
                  data={chats}
                  inverted
                  keyExtractor={(item, index) => {
                    return item.id;
                  }}
                  renderItem={({ item }) => (
                    // console.log(item)
                    <View
                      style={{
                        padding: 10,
                      }}>
                      {item.userid == currentUserId ? (
                        <View style={styles.rMessage}>
                          <Text
                            style={{
                              color: "#fff",
                              direction: "rtl",
                            }}>
                            {item.message}
                          </Text>
                        </View>
                      ) : (
                        <>
                          <View
                            style={{
                              display: "flex",
                              marginVertical: 5,
                            }}>
                            {/* {messageImg ? (
                              <Image
                                style={{
                                  height: 35,
                                  width: 35,
                                  borderRadius: 35,
                                  marginRight: 10,
                                }}
                                source={{ uri: messageImg }}
                              />
                            ) : (
                              <Image
                                style={{
                                  height: 35,
                                  width: 35,
                                  borderRadius: 35,
                                }}
                                source={{
                                  uri: "https://www.w3schools.com/howto/img_avatar.png",
                                }}
                              />
                            )} */}
                            <View style={styles.sMessage}>
                              <Text
                                style={{
                                  color: "#fff",
                                }}>
                                {item.message}
                              </Text>
                            </View>
                          </View>
                        </>
                      )}
                    </View>
                  )}
                />
              )}
            </>
          ) : (
            <View />
          )}

          <View style={styles.Footer}>
            {getRequest != "decline" && request != "decline" ? (
              // getRequest != "accept" &&
              <View>
                {(!loading && chats.length == 0) && (
                  <View style={{ 
                    backgroundColor: "white",
                    opacity: .7,
                    padding: 10,
                    borderRadius: 5,
                    marginBottom: 10,
                    marginLeft: 30,
                    marginRight: 30,
                   }}>
                     <Text style={{ 
                      //  fontFamily: "FredokaOne-Regular",
                       fontSize: 16,
                       color: "#000"
                      }}>
                        Vous pouvez envoyer votre premier message. Utilisez le bonbon pour envoyer une notification à {name}.
                     </Text>
                  </View>
                )}
                <View style={styles.fieldContainer}>
                  <TextInput
                    style={styles.input}
                    onChangeText={setMessage}
                    value={message}
                    placeholder="Message ..."
                    keyboardType="default"
                  />

                  <TouchableOpacity
                    style={{ alignContent: "center" }}
                    onPress={() => {
                      send_candy();
                    }}>
                    <Image
                      style={{ height: 30, width: 30, marginRight: 10 }}
                      resizeMode="contain"
                      source={require("./../assets/images/rose.png")}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{ alignContent: "center" }}
                    onPress={() => {
                      send_message();
                      Keyboard.dismiss();
                    }}>
                    <Icon name="arrow-up-circle" size={32} />
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <Text style={{ textAlign: "center", fontSize: 20 }}>
                Demande refusée. Renvoyer une demande pour continuer.
              </Text>
            )}
            {/* Add Activity  */}
              {showContinueButton &&
                <View>
                  {getRequest != "accept" || request != "accept" ? (
                    <View style={styles.bottombtn}>
                      {/* <View style={styles.btn}>
                        <TouchableOpacity
                          onPress={() => {
                            setQuitModal(true);
                          }}>
                          {loading ? <WP style={{ color: Colors.darkPink }}>Chargement</WP> : <WP style={{ color: Colors.darkPink }}>Quitter</WP>}
                        </TouchableOpacity>
                      </View> */}
                      <View style={styles.btn}>
                        <TouchableOpacity
                          onPress={() => {
                            if (getRequest != "pending") {
                              firestore
                                .collection("users")
                                .doc(messageId)
                                .collection("friends")
                                .doc(currentUserId)
                                .set({
                                  friendId: currentUserId,
                                  status: "pending",
                                  requestGetter: true,
                                  name: currentName,
                                  gender: currentGender,
                                  image: currentImage,
                                });

                              firestore
                                .collection("users")
                                .doc(currentUserId)
                                .collection("friends")
                                .doc(messageId)
                                .set({
                                  friendId: messageId,
                                  status: "accept",
                                  requestGetter: false,
                                  name: name,
                                  gender: gender,
                                  image: messageImg,
                                });
                              setGetRequest("pending");
                              setRequest("accept");

                              Alert.alert(
                                "Vous avez accepté, attendez que l'autre personne accepte."
                              );
                            } else {
                              Alert.alert(
                                "Vous avez accepté, attendez que l'autre personne accepte."
                              );
                            }
                          }}>
                          <WP style={{ color: Colors.darkPink, fontSize: 18 }}>Ajouter le contact</WP>
                        </TouchableOpacity>
                      </View>
                  </View>
                ) : (
                  <View />
                )}
              </View>
            }
          </View>
        </KeyboardAvoidingView>
      ) : (
        <View style={styles.centerpe}>
          <ActivityIndicator
            //visibility of Overlay Loading Spinner
            visible={loading}
            //Text with the Spinner
            textContent={"Loading..."}
            //Text style of the Spinner Text
            textStyle={styles.spinnerTextStyle}
          />
        </View>
      )}
      <Modal
        animationType="fade"
        transparent={true}
        visible={quitmodal}
        onRequestClose={() => {
          setQuitModal(!quitmodal);
        }}
        contentContainerStyle={styles.modalStyle}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.Headinghai}>Êtes-vous sur(e) ?</Text>
            <Text style={styles.Headinghai}></Text>

            <Text style={styles.modalText}>
              Voulez-vous quitter définitivement cette conversation ?{" "}
            </Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => leaveChat()}>
              <Text style={styles.textStyle}>Oui</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                setQuitModal(!quitmodal);
              }}>
              <Text style={styles.textStyle}>Non</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          navigation.goBack();
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Voulez-vous continuer la conversation ?
            </Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={async () => {
                await firestore
                  .collection("users")
                  .doc(currentUserId)
                  .collection("friends")
                  .doc(messageId)
                  .update({
                    friendId: messageId,
                    status: "accept",
                    requestGetter: false,
                  })
                  .then(() => {
                    Alert.alert("Demande acceptée");
                    setGetRequest("accept");
                    setChecker(false);
                    setCheck(check + 1);
                  });
              }}>
              <Text style={styles.textStyle}>Accepter</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                firestore
                  .collection("users")
                  .doc(currentUserId)
                  .collection("friends")
                  .doc(messageId)
                  .update({
                    friendId: messageId,
                    status: "decline",
                    requestGetter: false,
                  });
                Alert.alert("Demande refusée");
                setGetRequest("decline");
                setChecker(false);
                setCheck(check + 1);
              }}>
              <Text style={styles.textStyle}>Refuser</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

export default ChatUser;

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    marginBottom: 15,
  },
  input: {
    borderRadius: 20,
    width: "90%",
    height: 30,
    padding: 0,
    backgroundColor: "#fff",
    bottom: 0,
    paddingHorizontal: 15,
    color: "black",
  },
  fieldContainer: {
    display: "flex",
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    paddingRight: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: "white",
    justifyContent: "space-between",
    ...Colors.customShadow,
  },
  sMessage: {
    backgroundColor: "#8250FE",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderTopLeftRadius: 0,
    maxWidth: "70%",
    alignSelf: "flex-start",
  },
  rMessage: {
    backgroundColor: "#FE3C72",
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignSelf: "flex-end",
    maxWidth: "70%",

    borderRadius: 20,
    borderTopRightRadius: 0,
    display: "flex",
  },
  ChatUserName: {
    fontFamily: "FredokaOne-Regular",
    fontSize: 25,
    color: "white"
  },
  bottombtn: {
    justifyContent: "space-evenly",
    flexDirection: "row",
    display: "flex",
    width: "100%",
  },
  btn: {
    height: 40,
    width: "80%",
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "white",
    
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    backgroundColor: Colors.darkPink,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    elevation: 2,
    margin: 10,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "white",
  },
  textStyle: {
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    color: "white",
  },
  modalStyle: {
    backgroundColor: Colors.darkPink,
  },
  Headinghai: {
    fontFamily: "FredokaOne-Regular",
    fontSize: 25,
    color: "#fff",
  },
  centerpe: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
