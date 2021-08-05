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
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import LocationTab from "../../component/LocationTab";
import TopBar from "../../component/TopBar";
import ListContainer from "./../../component/ListContainer";
import SearchBar from "./../../component/SearchBar";
import { auth, firestore } from "../../db/firebase"
import firebase from "firebase/app"

// linear-gradient(0deg, #FFFFFF 0%, #FFC1DD 78.9%)
const Message = ({ route, ...props }) => {


  const { currentUserId, messageId, name, gender, messageImg } = route.params
  // let [chatUser, setChatUser] = useState({})
  let [chats, setChats] = useState()
  let [message, setMessage] = useState("")

  useEffect(() => {
    let merge = uid_merge(currentUserId, messageId)
    get_messages(merge)
  }, [])


  let uid_merge = (uid1, uid2) => {
    if (uid1 < uid2) {
      // console.log(uid1 + uid2)
      return uid1 + uid2
    }
    else {
      // console.log(uid2 + uid1)
      return uid2 + uid1
    }
  }

  let get_messages = (uid) => {
    firestore.collection("message").doc(uid).collection(`chat`).orderBy("createdAt").onSnapshot((querySnapshot) => {

      let docs = querySnapshot.docs.map((doc) => (
        {
          id: doc.id,
          userid: doc.data().id,
          message: doc.data().message

        }));



      {
        docs &&
          setChats(docs)

        // console.log(docs)

      }
      // console.log(docs)
    });
  }

  let send_message = () => {
    let merge = uid_merge(currentUserId, messageId)
    firestore.collection(`message`).doc(merge).collection(`chat`).add({
      message: message,
      id: currentUserId,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    })
    setMessage("")
  }
  return (
    <LinearGradient
      colors={["#FFC1DD", "#ffffff"]}
      style={styles.linearGradient}
    >
      <SafeAreaView>
        <View>
          <TopBar />
        </View>
        <View style={{ marginTop: 30 }}>
          <LocationTab />
        </View>
        <SearchBar />
      </SafeAreaView>

      {route.params ?
        <ScrollView style={{ marginTop: 15 }}>

          {chats &&

            // console.log(chats)
            <FlatList
              data={chats}
              keyExtractor={(item) => { item.id }}
              renderItem={({ item }) => (
                // console.log(item)
                <View style={{ flex: 1, padding: 10, backgroundColor: "white", margin: 10 }}>
                  {item.userid == currentUserId ? <Text style={{ color: "red", alignSelf: "flex-end", direction: "rtl" }}>{item.message}</Text>
                    :
                    <>
                      <Image style={{ height: 20, width: 20, borderRadius: 20, marginRight: 5 }} source={{ uri: messageImg }} />
                      <Text style={{ color: "blue", backgroundColor: "white" }}>{item.message}</Text>
                    </>
                  }
                </View>

              )}
            />
          }
          <TextInput
            style={{
              position: "fixed",
              bottom: 0
            }}
            style={styles.input}
            onChangeText={setMessage}
            value={message}
            placeholder="date de naissance"
            keyboardType="default"
          />
          <Button
            title="send"
            onPress={() => {
              send_message()
            }}
          ></Button>

        </ScrollView>
        : <View></View>}
    </LinearGradient>
  );
};

export default Message;

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
});
