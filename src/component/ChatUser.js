import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  Button,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  useWindowDimensions,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import LocationTab from "./LocationTab";
import TopBar from "./TopBar";
import ListContainer from "./ListContainer";
import SearchBar from "./SearchBar";
import { auth, firestore } from "../db/firebase";
import firebase from "firebase/app";
import Icon from "react-native-vector-icons/Ionicons";
import Colors from "../assets/colors/Colors";

// linear-gradient(0deg, #FFFFFF 0%, #FFC1DD 78.9%)
const ChatUser = ({ route, ...props }) => {
  const { currentUserId, messageId, name, gender, messageImg } = route.params;
  // let [chatUser, setChatUser] = useState({})
  let [chats, setChats] = useState([]);
  let [message, setMessage] = useState("");
  let [userRequest, setUserRequest] = useState("none");
  let [messageRequest, setMessageRequest] = useState("none");

  const width = useWindowDimensions().width;

  useEffect(() => {
    let merge = uid_merge(currentUserId, messageId);
    get_messages(merge);

    {
      chats.length > 0 &&
        firestore
          .collection(`message`)
          .doc(merge)
          .get()
          .then((doc) => {
            if (doc.exists) {
              setUserRequest(doc.data()[currentUserId]);
              setMessageRequest(doc.data()[messageId]);

              console.log(doc.data());
            } else {
              console.log("not getting");
            }
          })
          .catch((error) => {
            console.log("Error getting document:", error);
          });
    }
  }, []);

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
          data: doc.data(),
          userid: doc.data().id,
          message: doc.data().message,
        }));
        {
          docs && setChats(docs);
          // console.log(docs)
        }
        // console.log(docs)
      });
  };

  let send_message = () => {
    if (message.length > 0) {
      let merge = uid_merge(currentUserId, messageId);
      setUserRequest("accept");
      firestore
        .collection(`message`)
        .doc(merge)
        .set({
          [currentUserId]: userRequest,
          [messageId]: messageRequest,
        });
      firestore.collection(`message`).doc(merge).collection(`chat`).add({
        message: message,
        id: currentUserId,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        img: firebase.firestore.FieldValue.serverTimestamp(),
      });
      setMessage("");
    }
  };
  return (
    <LinearGradient
      colors={["#FFC1DD", "#ffffff"]}
      style={styles.linearGradient}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        keyboardVerticalOffset={90}
      >
        <SafeAreaView>
          <View>
            <TopBar />
          </View>
          <View style={{ alignItems: "center", margin: 5 }}>
            <Text style={styles.ChatUserName}>Title</Text>
          </View>
          {route.params ? (
            <ScrollView style={{ marginTop: 15 }}>
              {chats && (
                // console.log(chats)

                <FlatList
                  data={chats}
                  keyExtractor={(item) => {
                    item.id;
                  }}
                  renderItem={({ item }) => (
                    // console.log(item)
                    <View
                      style={{
                        padding: 10,
                      }}
                    >
                      {item.userid == currentUserId ? (
                        <View style={styles.rMessage}>
                          <Text
                            style={{
                              color: "#fff",
                              direction: "rtl",
                            }}
                          >
                            {item.message}
                          </Text>
                        </View>
                      ) : (
                        <>
                          <View
                            style={{ display: "flex", flexDirection: "row" }}
                          >
                            <View>
                              {messageImg ? (
                                <Image
                                  style={{
                                    height: 35,
                                    width: 35,
                                    borderRadius: 35,
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
                            </View>
                            <View style={styles.sMessage}>
                              <Text
                                style={{
                                  color: "#fff",
                                }}
                              >
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

              {(userRequest == "none" || userRequest == "decline") && (
                <View>
                  <Button
                    title="accept"
                    onPress={async () => {
                      setUserRequest("accept");
                      await firestore
                        .collection(`message`)
                        .doc(uid_merge(currentUserId, messageId))
                        .update({
                          [currentUserId]: userRequest,
                        });
                    }}
                  ></Button>

                  <Button
                    title="decline"
                    onPress={() => {
                      setUserRequest("decline");
                    }}
                  ></Button>
                </View>
              )}

              {messageRequest != "decline" || userRequest != "decline" ? (
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                  <View style={styles.footer}>
                    <TextInput
                      style={{
                        position: "fixed",
                      }}
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
                      }}
                    >
                      <Icon name="arrow-up-circle" size={32} />
                    </TouchableOpacity>
                  </View>
                </TouchableWithoutFeedback>
              ) : (
                <Text>Request declined</Text>
              )}
            </ScrollView>
          ) : (
            <View />
          )}
        </SafeAreaView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default ChatUser;

const styles = StyleSheet.create({
  linearGradient: { flex: 1 },
  input: {
    width: "70%",
    borderRadius: 20,
    marginBottom: 19,
    height: 40,
    justifyContent: "space-between",
    paddingHorizontal: 60,
    backgroundColor: "#fff",
  },
  footer: {
    flex: 1,
    height: 50,
    display: "flex",
    bottom: 5,
    flexDirection: "row",
    marginHorizontal: 20,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 50,
    backgroundColor: "#fff",
    justifyContent: "space-between",
    ...Colors.customShadow,
  },
  sMessage: {
    backgroundColor: "#8250FE",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderTopLeftRadius: 0,
    width: "50%",
  },
  rMessage: {
    backgroundColor: "#FE3C72",
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignSelf: "flex-end",
    width: "50%",
    borderRadius: 20,
    borderTopRightRadius: 0,
    display: "flex",
  },
  ChatUserName: {
    fontFamily: "FredokaOne-Regular",
    fontSize: 30,
  },
});
