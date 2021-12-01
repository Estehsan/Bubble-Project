import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  TextInput,
} from "react-native";
import Colors from "../../assets/colors/Colors";
import Entypo from "react-native-vector-icons/Entypo";
import Ionicons from "react-native-vector-icons/Ionicons";
import EvilIcons from "react-native-vector-icons/EvilIcons";

import { auth, firestore } from "../../db/firebase";
import LinearGradient from "react-native-linear-gradient";
import TopBar from "../../component/TopBar";
import H1 from "./../../component/basic/H1";
const Message = ({ ...props }) => {
  let [currentId, setcurrentId] = useState("");
  let [currentName, setcurrentName] = useState("");
  let [currentGender, setcurrentGender] = useState("");
  let [currentImage, setcurrentImage] = useState("");
  let [status, setstatus] = useState("");

  let [data, setData] = useState([]);
  let [accepted, setAccepted] = useState([]);
  let [accepted2, setAccepted2] = useState([]);

  let [searchAccepted, setSearchAccepted] = useState([]);

  let [userId, setuserId] = useState([]);
  let [loading, setLoading] = useState(true);
  let [imageLoad, SetImageLoad] = useState(true);
  let [renderSearch, setRenderSearch] = useState(false);
  let [renderAccepted, setRenderAccepted] = useState(true);
  const [defaultSearchValue, setDefaultSearchValue] = useState("");

  useEffect(async () => {
    let isMounted = true;
    var data2;

    if (isMounted)
      auth.onAuthStateChanged(async (user) => {
        if (user) {
          var uid = user.uid;
          setuserId(user.uid);

          // console.log(uid)
          let data = await firestore
            .collection("users")
            .doc(uid)
            .collection("friends")
            .where("requestGetter", "==", true)
            .where("status", "==", "pending")

            .onSnapshot(async (querySnapshot) => {
              let docs = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                name: doc.data().name,
                gender: doc.data().gender,
                image: doc.data().image,
                // status: doc.data().status
              }));

              await setData(docs);
              console.log(data);
              setLoading(false);
            });

          data2 = await firestore
            .collection("users")
            .doc(uid)
            .collection("friends")
            .orderBy("createdAt", "desc")
            .onSnapshot(async (querySnapshot) => {
              let docs = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                name: doc.data().name,
                gender: doc.data().gender,
                image: doc.data().image,
                // status: doc.data().status
              }));
              await setAccepted(docs);
              console.log(data);
              setLoading(false);
            });

          // ...
        } else {
          // User is signed out
          // ...
        }
      });

    console.log(accepted);

    return () => {
      isMounted = false;
      data2();
      data();
    };
  }, []);

  let handleSearchBar = (event) => {
    const searchText = event;
    if (accepted) {
      // Object.keys(accepted).map((val) => {
      //   console.log(accepted[val].name)
      // });
      const result = accepted.filter((val) => {
        return (
          val.name
            .toString()
            .toLowerCase()
            .indexOf(searchText.toString().toLowerCase()) !== -1 ||
          val.gender
            .toString()
            .toLowerCase()
            .indexOf(searchText.toString().toLowerCase()) !== -1
        );
      });
      if (searchText.length > 0) {
        setRenderAccepted(false);
        setRenderSearch(true);
        setDefaultSearchValue(searchText);
        setSearchAccepted(result);
      } else {
        setRenderAccepted(true);
        setRenderSearch(false);
        setDefaultSearchValue(searchText);
        setSearchAccepted(result);
      }
    }
  };

  return (
    <LinearGradient
      colors={["#FFC1DD", "#ffffff"]}
      style={styles.linearGradient}>
      <SafeAreaView>
        <View style={styles.Logo}>
          <Image
            style={{ height: 100, width: 130 }}
            resizeMode="contain"
            source={require("./../../assets/images/logo-bubble.png")}
          />
        </View>
        <ScrollView>
          <View
            style={{
              alignItems: "center",
              marginTop: 30,
            }}>
            {/* <Text style={styles.ChatUserName}>MES CONVERSATIONS</Text> */}
          </View>
          <View style={styles.searchIcon}>
            <TextInput
              placeholder="Rechercher"
              onChangeText={(e) => handleSearchBar(e)}
              value={defaultSearchValue}
              style={styles.inputField}
            />
            <EvilIcons name="search" size={30} color={"#000"} />
          </View>
          <View>
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
                {/* {data ? (
                <>
                  <H1>Message Request </H1>
                  <FlatList
                    data={data}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                      // console.log(item)
                      <View style={styles.Container}>
                        <View style={styles.Icons}>
                          <TouchableOpacity
                            onPress={() => {
                              props.navigation.navigate("ChatUser", {
                                currentUserId: userId,
                                messageId: item.id,
                                name: item.name,
                                gender: item.gender,
                                messageImg: item.image,
                              });
                            }}>
                            <View
                              style={{
                                backgroundColor: "silver",
                                height: 50,
                                width: 50,
                                borderRadius: 50,
                              }}>
                              <Image
                                style={{
                                  height: 50,
                                  width: 50,
                                  borderRadius: 50,
                                }}
                                source={{ uri: item.image }}
                                onLoadStart={SetImageLoad(true)}
                                onLoadEnd={SetImageLoad(false)}
                              />
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  />
                </>
              ) : (
                <>
                  <H1>No Request</H1>
                </>
              )} */}


                {accepted.length == 0 && <Text style={{textAlign:"center"}}>Aucune conversation</Text>}

                {renderAccepted && (
                  <FlatList
                    data={accepted}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                      // console.log(item)
                      <View style={styles.Container}>
                        <TouchableOpacity
                          style={styles.main}
                          onPress={() => {
                            props.navigation.navigate("ChatUser", {
                              currentUserId: userId,
                              messageId: item.id,
                              name: item.name,
                              gender: item.gender,
                              messageImg: item.image,
                            });
                          }}>
                          <View style={styles.lContainer}>
                            {item.image ? (
                              <View
                                style={{
                                  backgroundColor: "silver",
                                  height: 55,
                                  width: 55,
                                  borderRadius: 55,
                                }}>
                                <Image
                                  style={{
                                    height: 55,
                                    width: 55,
                                    borderRadius: 55,
                                  }}
                                  source={{ uri: item.image }}
                                />
                              </View>
                            ) : (
                              <View
                                style={{
                                  backgroundColor: "silver",
                                  height: 50,
                                  width: 50,
                                  borderRadius: 50,
                                }}>
                                <Image
                                  style={{
                                    height: 50,
                                    width: 50,
                                    borderRadius: 50,
                                  }}
                                  source={{
                                    uri: "https://www.w3schools.com/howto/img_avatar.png",
                                  }}
                                />
                              </View>
                            )}

                            <View style={styles.HeadingView}>
                              <View>
                                <Text
                                  style={styles.heading}
                                  numberOfLines={1}
                                  ellipsizeMode={"tail"}>
                                  {item.name}
                                </Text>
                              </View>

                              <View>
                                <Ionicons
                                  style={styles.position}
                                  name={
                                    item.gender === "male"
                                      ? "male"
                                      : item.gender === "female"
                                      ? "female"
                                      : "male-female"
                                  }
                                  size={30}
                                  color={"#000"}
                                />
                              </View>
                            </View>
                            {/* <View style={styles.rContainer}>
                        <View style={styles.btn}>
                          <Text>Content</Text>
                        </View>
                      </View> */}
                          </View>
                        </TouchableOpacity>
                      </View>
                    )}
                  />
                )}
                {renderSearch && (
                  <FlatList
                    data={searchAccepted}
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
                            }}>
                            <View style={styles.lContainer}>
                              {item.image ? (
                                <View
                                  style={{
                                    backgroundColor: "silver",
                                    height: 55,
                                    width: 55,
                                    borderRadius: 55,
                                  }}>
                                  <Image
                                    style={{
                                      height: 55,
                                      width: 55,
                                      borderRadius: 55,
                                    }}
                                    source={{ uri: item.image }}
                                  />
                                </View>
                              ) : (
                                <View
                                  style={{
                                    backgroundColor: "silver",
                                    height: 50,
                                    width: 50,
                                    borderRadius: 50,
                                  }}>
                                  <Image
                                    style={{
                                      height: 50,
                                      width: 50,
                                      borderRadius: 50,
                                    }}
                                    source={{
                                      uri: "https://www.w3schools.com/howto/img_avatar.png",
                                    }}
                                  />
                                </View>
                              )}

                              <View style={styles.HeadingView}>
                                <View>
                                  <Text
                                    style={styles.heading}
                                    numberOfLines={1}
                                    ellipsizeMode={"tail"}>
                                    {item.name}
                                  </Text>
                                </View>

                                <View>
                                  <Ionicons
                                    style={styles.position}
                                    name={
                                      item.gender === "male"
                                        ? "male"
                                        : item.gender === "female"
                                        ? "female"
                                        : "male-female"
                                    }
                                    size={30}
                                    color={"#000"}
                                  />
                                </View>
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
              </>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default Message;

const styles = StyleSheet.create({
  linearGradient: {
    paddingBottom: 20,
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
    alignItems: "center",
    flex: 1,
  },
  HeadingView: {
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "69%",
    display: "flex",
    flexDirection: "row",
    paddingHorizontal: 30,
  },
  ChatUserName: {
    fontFamily: "FredokaOne-Regular",
    fontSize: 25,
  },
  Icons: {
    padding: 5,
    backgroundColor: "white",
    borderRadius: 30,
    marginHorizontal: 10,
    marginVertical: 5,
  },
  Logo: {
    justifyContent: "center",
    alignItems: "center",
  },
  searchIcon: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 30,
    alignItems: "center",
    alignItems: "center",
    width: "90%",
    paddingHorizontal: 20,
    marginHorizontal: "3%",
    height: 50,
    marginVertical: 10,
  },
  inputField: {
    width: "90%",
    color: "black",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 20,
  },
});
