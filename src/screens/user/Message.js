import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import Colors from "../../assets/colors/Colors";
import Entypo from "react-native-vector-icons/Entypo";
import Ionicons from "react-native-vector-icons/Ionicons";
import { auth, firestore } from "../../db/firebase";
import LinearGradient from "react-native-linear-gradient";
import TopBar from "../../component/TopBar";

const Message = ({ ...props }) => {
  let [currentId, setcurrentId] = useState("");
  let [currentName, setcurrentName] = useState("");
  let [currentGender, setcurrentGender] = useState("");
  let [currentImage, setcurrentImage] = useState("");
  let [status, setstatus] = useState("");

  let [data, setData] = useState([]);
  let [userId, setuserId] = useState([]);
  let [loading, setLoading] = useState(true);

  useEffect(async () => {

    let isMounted = true
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        var uid = user.uid;

        if (isMounted) {
          setuserId(user.uid);
        }
        // console.log(uid)
        await firestore
          .collection("users")
          .doc(uid)
          .collection("friends")
          .onSnapshot(async (querySnapshot) => {
            let docs = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              name: doc.data().name,
              gender: doc.data().gender,
              image: doc.data().image,
              // status: doc.data().status
            }));

            if (isMounted) {
              await setData(docs);
              console.log(data);
              setLoading(false);
            }
          })
         
        // ...
      } else {
        // User is signed out
        // ...
      }
    });

    return () => { 
      isMounted = false
    }
  }, []);


  return (
    <LinearGradient
      colors={["#FFC1DD", "#ffffff"]}
      style={styles.linearGradient}
    >
      <SafeAreaView>
        <TopBar />
        <View>
          {loading ? (
            <ActivityIndicator
              style={{ alignItems: "center" }}
              size="large"
              color="#000"
            />
          ) : (
            <FlatList
              data={data}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                // console.log(item)
                <View style={styles.Container}>
                  <View style={styles.main}>
                    <TouchableOpacity
                      onPress={() => {
                        props.navigation.navigate("ChatUser", {
                          currentUserId: userId,
                          messageId: item.id,
                          name: item.name,
                          gender: item.gender,
                          messageImg: item.image,
                        });
                      }}
                    >
                      <View style={styles.lContainer}>
                        {item.image ? (
                          <Image
                            style={{ height: 50, width: 50, borderRadius: 50 }}
                            source={{ uri: item.image }}
                          />
                        ) : (
                          <Image
                            style={{ height: 50, width: 50, borderRadius: 50 }}
                            source={{
                              uri: "https://www.w3schools.com/howto/img_avatar.png",
                            }}
                          />
                        )}

                        <View style={styles.HeadingView}>
                          <Text
                            style={styles.heading}
                            numberOfLines={1}
                            ellipsizeMode={"tail"}
                          >
                            {item.name}
                          </Text>
                          <Text style={styles.heading}>{item.gender}</Text>
                        </View>
                        {/* <View style={styles.rContainer}>
                        <View style={styles.btn}>
                          <Text>Content</Text>
                        </View>
                      </View> */}
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          )}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default Message;

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
  },
  Container: {
    alignItems: "center",
    ...Colors.customShadow,
  },
  main: {
    backgroundColor: "#fff",
    width: "80%",
    padding: 20,
    marginBottom: 20,
    height: 80,
    borderRadius: 100,
    justifyContent: "space-between",
    display: "flex",
    alignContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  btn: {
    paddingHorizontal: 19,
    paddingVertical: 8,
    backgroundColor: Colors.background,
    justifyContent: "center",
    borderRadius: 60,
    alignItems: "center",
  },
  headng: {
    fontFamily: "FredokaOne-Bold",
    fontSize: 40,
    fontWeight: "bold",
  },
  lContainer: {
    display: "flex",
    flexDirection: "row",
    flex: 1,
  },
  HeadingView: {
    justifyContent: "center",
    width: "60%",
    paddingHorizontal: 30,
  },
});
