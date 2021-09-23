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
  const { currentUserId, messageId, name, gender, messageImg } = route.params;
  // let [chatUser, setChatUser] = useState({})
  let [chats, setChats] = useState([]);
  let [message, setMessage] = useState("");

  let [currentName, setcurrentName] = useState("");
  let [currentGender, setcurrentGender] = useState("");
  let [currentImage, setcurrentImage] = useState("");

  let [request, setRequest] = useState("");
  let [getRequest, setGetRequest] = useState("");
  let [checker, setChecker] = useState(false);

  let [loading, setLoading] = useState(true);

  let [check, setCheck] = useState(0);

  const [modalVisible, setModalVisible] = useState(false);
  const [quitmodal, setQuitModal] = useState(false);

  const scrollViewRef = useRef();
  const width = useWindowDimensions().width;
  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: "#fFC1DD",
      },
      headerTitle: () => (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}>
          <Text style={styles.ChatUserName}>{name}</Text>
        </View>
      ),
      headerLeft: () => <View />,
      headerRight: () => <View />,
    });
  }, [navigation]);

  useEffect(async () => {
    let merge = uid_merge(currentUserId, messageId);
    get_messages(merge);
    let datum = await firestore
      .collection("users")
      .doc(currentUserId)
      .get()
      .then((doc) => {
        setLoading(true);

        setcurrentName(doc.data().userName);
        setcurrentGender(doc.data().userGender);
        setcurrentImage(doc.data().userProfileImageUrl);
        setLoading(false);
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
        setLoading(true);

        if (doc.exists) {
          setGetRequest(doc.data().status);
        }
        setLoading(false);

        // console.log(doc.data())
      });

    let dataUser = await firestore
      .collection("users")
      .doc(currentUserId)
      .collection("friends")
      .doc(messageId)
      .onSnapshot(async (doc) => {
        setLoading(true);

        if (doc.exists) {
          await setRequest(doc.data().status);
          await setChecker(doc.data().requestGetter);
          console.log(doc.data());
        }
        setLoading(false);
      });
    await setModalVisible(checker);
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
    firestore
      .collection("message")
      .doc(uid)
      .collection(`chat`)
      .orderBy("createdAt")
      .onSnapshot((querySnapshot) => {
        let docs = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          userid: doc.data().id,
          message: doc.data().message,
        }));
        {
          setLoading(true);

          docs && setChats(docs);
          // console.log(docs)
          setLoading(false);
        }
        // console.log(docs)
      });
    console.log(checker);
  };
  const leaveChat = () => {
    async () => {
      await firestore
        .collection("users")
        .doc(messageId)
        .collection("friends")
        .doc(currentUserId)
        .delete();

      await firestore
        .collection("users")
        .doc(currentUserId)
        .collection("friends")
        .doc(messageId)
        .delete();

      let merger = uid_merge(currentUserId, messageId);

      let deleteuser = await firestore
        .collection(`message`)
        .doc(merger)
        .collection(`chat`);
      deleteuser.get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          doc.ref.delete();
        });
      });

      setMessage("");
      setGetRequest("");
      setRequest("");
      setQuitModal(!quitmodal);
      Alert.alert("You have leaved the room");
    };
  };
  let send_message = () => {
    if (message.length > 0) {
      let merge = uid_merge(currentUserId, messageId);

      firestore.collection(`message`).doc(merge).collection(`chat`).add({
        message: message,
        id: currentUserId,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      setLoading(true);

      setMessage("");
      setLoading(false);
    }
  };
  return (
    <LinearGradient
      colors={["#FFC1DD", "#ffffff"]}
      style={styles.linearGradient}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={quitmodal}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
        contentContainerStyle={styles.modalStyle}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.Headinghai}>FELICITATIONS</Text>
            <Text style={styles.Headinghai}></Text>

            <Text style={styles.modalText}>
              Are you sure you want to leave all room messages and request will
              be deleted ?
            </Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={leaveChat}>
              <Text style={styles.textStyle}>Yes</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                setQuitModal(!quitmodal);
              }}>
              <Text style={styles.textStyle}>No</Text>
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
              Request Continue to chat with this user ?
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
                    Alert.alert("Request Accepted");
                    setGetRequest("accept");
                    setChecker(false);
                    setCheck(check + 1);
                  });
              }}>
              <Text style={styles.textStyle}>Accept</Text>
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
                Alert.alert("user declined");
                setGetRequest("decline");
                setChecker(false);
                setCheck(check + 1);
              }}>
              <Text style={styles.textStyle}>Reject</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS == "ios" ? "padding" : "height"}
          keyboardVerticalOffset={90}>
          {loading ? (
            <ActivityIndicator
              style={{
                alignItems: "center",
                alignContent: "center",
                justifyContent: "center",
                top: 200,
              }}
              size="large"
              color="#000"
            />
          ) : (
            <>
              <View style={styles.Top}>
                {route.params ? (
                  <>
                    <View>
                      {chats && (
                        // console.log(chats)
                        <FlatList
                          data={chats}
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
                                    {messageImg ? (
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
                                    )}
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

                      {/* {request == "" && (
                        <View>
                          <Button
                            title="Send Friend Request"
                            onPress={() => {
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
                              Alert.alert("Request has been send");
                            }}></Button>
                        </View>
                      )} */}

                      {/* {getRequest == "pending" && (
                        <View>
                          <Text>Request has been send</Text>
                        </View>
                      )} */}

                      {/* {checker && (
                        <>
                          <View>
                            <Button
                              title="accept"
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
                                    Alert.alert("Request Accepted");
                                    setGetRequest("accept");
                                    setChecker(false);
                                    setCheck(check + 1);

                                  });
                              }}></Button>

                            <Button
                              title="decline"
                              onPress={() => {
                                firestore
                                  .collection("users")
                                  .doc(currentUserId)
                                  .collection("friends")
                                  .doc(messageId)
                                  .update({
                                    friendId: messageId,
                                    status: "decline",
                                  });
                                Alert.alert("user declined");
                                setGetRequest("decline");
                                setChecker(false);
                                setCheck(check + 1);

                              }}></Button>
                          </View>
                        </>

                      )} */}
                    </View>
                  </>
                ) : (
                  <View />
                )}
              </View>
              <View style={styles.Footer}>
                {getRequest != "decline" && request != "decline" ? (
                  // getRequest != "accept" &&
                  <View>
                    <View style={styles.fieldContainer}>
                      <TextInput
                        style={styles.input}
                        onChangeText={setMessage}
                        value={message}
                        placeholder="date de naissance"
                        keyboardType="default"
                      />

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
                    Request declined send request again to continue
                  </Text>
                )}
                {getRequest != "accept" || request != "accept" ? (
                  <View style={styles.bottombtn}>
                    <View style={styles.btn}>
                      <TouchableOpacity
                        onPress={() => {
                          setQuitModal(true);
                        }}>
                        <WP>Quitter la conversation</WP>
                      </TouchableOpacity>
                    </View>
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
                              "You have continue the chat wait for other user to continue"
                            );
                          } else {
                            Alert.alert(
                              "You have Already continue a Chat wait for other user"
                            );
                          }
                        }}>
                        <WP>Continuer</WP>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <View></View>
                )}
              </View>
            </>
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default ChatUser;

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
  },
  container: {
    justifyContent: "flex-end",
    flex: 1,
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
  },
  bottombtn: {
    justifyContent: "space-evenly",
    flexDirection: "row",
    display: "flex",
    width: "100%",
  },
  btn: {
    height: 40,
    width: 150,
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: Colors.darkPink,
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
    padding: 10,
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
});
