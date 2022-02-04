import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import ImagePicker from "react-native-image-crop-picker";
import Ionicons from "react-native-vector-icons/Ionicons";

import LinearGradient from "react-native-linear-gradient";
import TopBar from "./../../component/TopBar";
import { auth, firestore, storage } from "../../db/firebase";
import firebase from "firebase/app";
import DateTimePicker from "@react-native-community/datetimepicker";

const Profile = (props) => {
  let [image, setImage] = useState(null);
  let [selectedTeams, setSelectedTeams] = useState([]);

  const [userProfileImage, setUserProfileImage] = useState(null);
  const [UserProfileImageConfig, setUserProfileImageConfig] = useState(null);

  const [pseudo, setPseudo] = useState("");
  const [gender, setGender] = useState("");
  const [candy, setCandy] = useState(0);
  const [FirstName, setFirstName] = useState(null);
  const [LastName, setLastName] = useState(null);
  const [contentType, setcontentType] = useState(null);
  const isFocused = useIsFocused();
  const [id, setId] = useState("");

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [showDate, setShowDate] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const formatDate = (d) => {
    let day = date.getDate().toString()
    let month = (date.getMonth()+1).toString()
    let year = date.getFullYear().toString()

    if(month.length == 1){
      month = "0"+month
    }

    if(day.length == 1){
      day = "0"+day
    }

    return day + "/" + month + "/" + year 
  }

  const showDatepicker = () => {
    showMode("date");
    setShowDate(true);
  };

  const TakeImgFromGallery = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then((image) => {
      setUserProfileImage(image.path);
      setUserProfileImageConfig(image);
      setcontentType(image.mime);
      setImage(image.path);

      const metadata = {
        contentType: contentType,
      };
      const filename = image.path.substring(
        image.path.lastIndexOf("/") + 1
      );
      console.log(filename)
      new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function () {
          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", userProfileImage, true);
        xhr.send(null);
      }).then((blob) => {
        storage
          .ref()
          .child(`userProfileImage/${id}/` + filename)
          .put(blob, metadata)
          .then((url) => {
            url.ref
              .getDownloadURL()
              .then((success) => {
                firestore
                  .collection("users")
                  .doc(id)
                  .update({
                    userProfileImageUrl: success,
                  })
                  .then(() => {
                    console.log("PROFILE: Document successfully written!");
                  })
                  .catch((error) => {
                    console.error("Error writing document: ", error);
                  });
              })
              .catch((e) => {
                console.log(e);
              });
          })
          .catch((e) => {
            console.error(e);
          });
        });
      });

      
  };

  useEffect(() => {
    let isMounted = true;

    if (isMounted) var sub2;
    auth.onAuthStateChanged((user) => {
      if (user) {
        var uid = user.uid;
        setId(uid);
        // console.log(id)
        sub2 = firestore
          .collection("users")
          .doc(uid)
          .get()
          .then((doc) => {
            if (doc.exists) {
              const timestamp = doc.data().userDateOfBirth.seconds
              setImage(doc.data().userProfileImageUrl);
              setSelectedTeams(doc.data().selectedTeams);
              setCandy(doc.data().candy);
              setPseudo(doc.data().userName);
              setGender(doc.data().userGender);
              setDate(new Date(timestamp * 1000));
              // console.log(info)
            } else {
              // doc.data() will be undefined in this case
              console.log("No such document!");
            }
          });
      } else {
      }
    });

    // console.log(image)

    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  let updateInfo = async () => {
    const metadata = {
      contentType: contentType,
    };

    console.log(gender, FirstName, userProfileImage, date);

    if (
      gender != "" &&
      FirstName != "" &&
      userProfileImage != null &&
      date != ""
    ) {
      const filename = userProfileImage.substring(
        userProfileImage.lastIndexOf("/") + 1
      );
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function () {
          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", userProfileImage, true);
        xhr.send(null);
      });

      if (id)
        storage
          .ref()
          .child(`userProfileImage/${id}/` + filename)
          .put(blob, metadata)
          .then((url) => {
            url.ref
              .getDownloadURL()
              .then((success) => {
                firestore
                  .collection("users")
                  .doc(id)
                  .update({
                    userName: FirstName,
                    userGender: gender,
                    userProfileImageUrl: success,
                    userDateOfBirth: date,
                  })
                  .then(() => {
                    console.log("PROFILE: Document successfully written!");
                    Alert.alert("record has been successfully changed");
                    setGender("");
                    setFirstName("");
                    setDate(date);
                    setImage(success);
                  })
                  .catch((error) => {
                    console.error("Error writing document: ", error);
                  });
              })
              .catch((e) => {
                console.log(e);
              });
          })
          .catch((e) => {
            console.error(e);
          });
    } else {
      Alert.alert("All fields must been filled");
    }
  };

  const [number, setNumber] = useState("");
  return (
    <LinearGradient colors={["#000", "#DD488C"]} style={styles.linearGradient}>
      <SafeAreaView style={styles.main}>

          <View style={{ 
            marginTop: 10
           }}>
            <TopBar />
          </View>

        <ScrollView style={{
          //backgroundColor: "red",
          marginBottom: 110
        }}>
          
          <View style={[styles.Profile, {
            
          }]}>
            {/* <Text style={styles.h1}>MON PROFIL</Text> */}

            <TouchableOpacity onPress={TakeImgFromGallery} style={styles.Image}>
              {image ? (
                <View
                  style={{
                    backgroundColor: "white",
                    height: 110,
                    width: 110,
                    borderRadius: 0,
                    marginVertical: 5,
                    borderColor: "white",
                    borderBottomWidth: 20,
                    borderTopWidth: 6,
                    borderLeftWidth: 6,
                    borderRightWidth: 6,
                  }}>
                  <Image
                    style={{ height: 83, width: 98, borderRadius: 0 }}
                    resizeMode="cover"
                    source={{ uri: image }}
                  />
                </View>
              ) : (
                <Image
                  style={{
                    height: 110,
                    width: 110,
                    borderRadius: 110,
                    marginVertical: 10,
                  }}
                  resizeMode="cover"
                  source={{
                    uri: "https://www.w3schools.com/howto/img_avatar.png",
                  }}
                />
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.profileData}>
            <Text style={{
                color:"#fff",
                textAlign:"center",
                marginTop: 0,
                fontWeight: "bold",
                fontSize: 28,
                fontFamily: "FredokaOne-Regular",
              }}>
              {pseudo}
            </Text>

            {gender == "female" && (
              <View style={{
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
                flexDirection: "row",
              }}>
                <Ionicons
                    style={{
                      marginTop: 20,
                      marginRight: 10
                    }}
                    name="female"
                    size={30}
                    color={"#fff"}
                  />
                <Text style={{
                  color:"#fff",
                  textAlign:"center",
                  marginTop: 20,
                  fontWeight: "normal",
                  fontSize: 20,
                  fontFamily: "FredokaOne-Regular",
                }}>
                  Femme
                </Text>
              </View>    
            )}

            {gender == "male" && (
              <View style={{
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
                flexDirection: "row",
              }}>
                <Ionicons
                    style={{
                      marginTop: 20,
                      marginRight: 10
                    }}
                    name="male"
                    size={30}
                    color={"#fff"}
                  />
                <Text style={{
                  color:"#fff",
                  textAlign:"center",
                  marginTop: 20,
                  fontWeight: "normal",
                  fontSize: 20,
                  fontFamily: "FredokaOne-Regular",
                }}>
                  Homme
                </Text>
              </View>    
            )}

            {gender == "mix" && (
              <View style={{
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
                flexDirection: "row",
              }}>
                <Ionicons
                    style={{
                      marginTop: 20,
                      marginRight: 10
                    }}
                    name="male-female"
                    size={30}
                    color={"#fff"}
                  />
                <Text style={{
                  color:"#fff",
                  textAlign:"center",
                  marginTop: 20,
                  fontWeight: "normal",
                  fontSize: 20,
                  fontFamily: "FredokaOne-Regular",
                }}>
                  Autre
                </Text>
              </View>    
            )}

            <View style={{
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
                flexDirection: "row",
              }}>
                <Ionicons
                    style={{
                      marginTop: 20,
                      marginRight: 10,
                    }}
                    name="calendar"
                    size={30}
                    color={"#fff"}
                  />
                <Text style={{
                  color:"#fff",
                  textAlign:"center",
                  marginTop: 20,
                  fontWeight: "normal",
                  fontSize: 20,
                  fontFamily: "FredokaOne-Regular",
                }}>
                  {formatDate(date)}
                </Text>
              </View>  
            
          </View>
          <View style={styles.Form}>
            {/* <TextInput
              style={styles.input}
              onChangeText={setFirstName}
              value={FirstName}
              placeholder="Pseudo"
              keyboardType="default"
            />
            {show ? (
              <View
                style={{
                  width: "100%",
                  color: "black",
                }}>
                <DateTimePicker
                  style={{
                    marginHorizontal: "15%",
                    backgroundColor: "white",
                    color: "black",
                  }}
                  testID="dateTimePicker"
                  value={date}
                  mode={mode}
                  is24Hour={true}
                  display="default"
                  onChange={onChange}
                />
              </View>
            ) : (
              <View
                style={{
                  width: "100%",
                  alignItems: "center",
                }}>
                <TouchableOpacity
                  style={{
                    width: "70%",
                    borderRadius: 20,
                    marginBottom: 19,
                    height: 40,
                    justifyContent: "space-between",
                    paddingHorizontal: 60,
                    alignContent: "center",
                    justifyContent: "center",
                    backgroundColor: "#fff",
                    color: "black",
                  }}
                  onPress={showDatepicker}>
                  <Text style={{ opacity: 0.5 }}>
                    {showDate ? (
                      date.toDateString()
                    ) : (
                      <Text>Date de naissance</Text>
                    )}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <TextInput
              style={styles.input}
              onChangeText={setGender}
              value={gender}
              placeholder="Genre"
              keyboardType="default"
            /> */}
            {/* <TouchableOpacity
              onPress={() => {
                updateInfo();
              }}>
              <View style={styles.btn}>
                <Text style={styles.f}>MODIFIER</Text>
              </View>
            </TouchableOpacity> */}
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginTop: 20
              }}>
              <Image
                style={{ height: 50, width: 50, borderRadius: 70 }}
                resizeMode="contain"
                source={require("./../../assets/images/rose.png")}
              />
              <Text style={styles.h2}>{candy}</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                // auth
                //   .signOut()
                //   .then(() => {
                //     // Sign-out successful.
                //     props.navigation.replace("Flow");
                //   })
                //   .catch(() => {
                //     // An error happened.
                //   });

                props.navigation.navigate("AchatUser");
              }}>
              <View style={styles.btnopacity}>
                <Text style={styles.f}>ACHETER</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ marginVertical: 10 }}
              onPress={() => {
                auth
                  .signOut()
                  .then(() => {
                    // Sign-out successful.
                    props.navigation.replace("Flow");
                  })
                  .catch(() => {
                    // An error happened.
                  });
              }}>
              <Text style={styles.h3}>Déconnexion</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default Profile;

const styles = StyleSheet.create({
  linearGradient: { flex: 1 },

  main: {
    flex: 1,
  },
  h1: {
    fontFamily: "FredokaOne-Regular",
    color: "#fff",
    fontSize: 30,
  },
  h2: {
    fontFamily: "FredokaOne-Regular",
    color: "#fff",
    fontSize: 30,
    opacity: 0.5,
  },
  h3: {
    fontFamily: "FredokaOne-Regular",

    color: "#fff",
    fontSize: 15,
  },
  Profile: {
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10
  },

  Form: {
    alignItems: "center",
  },
  input: {
    width: "70%",
    borderRadius: 20,
    marginBottom: 19,
    height: 40,
    justifyContent: "space-between",
    paddingHorizontal: 60,
    backgroundColor: "#fff",
    color: "black",
  },
  btn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginVertical: 12,
  },
  btnopacity: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginVertical: 12,
    opacity: 0.5,
  },
  f: {
    fontFamily: "FredokaOne-Regular",
  },
  Badge: {},
  badgeIconIos: {
    top: 20,
    backgroundColor: "red",
    width: 30,
    height: 30,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeIconAndroid: {
    zIndex: 1,
    elevation: 1,
    top: 20,
    backgroundColor: "red",
    width: 30,
    height: 30,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  ImageIos: { zIndex: -1, elevation: -1 },
  ImageAndroid: {},
});
