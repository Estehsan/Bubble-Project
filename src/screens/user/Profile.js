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
import { useIsFocused } from '@react-navigation/native';
import ImagePicker from 'react-native-image-crop-picker';

import LinearGradient from "react-native-linear-gradient";
import TopBar from "./../../component/TopBar";
import { auth, firestore, storage } from "../../db/firebase";
import firebase from "firebase/app";

const Profile = (props) => {
  let [image, setImage] = useState(null)
  let [selectedTeams, setSelectedTeams] = useState([])

  const [userProfileImage, setUserProfileImage] = useState(null);
  const [UserProfileImageConfig, setUserProfileImageConfig] = useState(null);

  const [gender, setGender] = useState("");
  const [candy, setCandy] = useState(0)
  const [FirstName, setFirstName] = useState(null);
  const [LastName, setLastName] = useState(null);
  const [contentType, setcontentType] = useState(null)
  const isFocused = useIsFocused();
  const [id, setId] = useState("");

  const TakeImgFromGallery = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then((image) => {
      console.log(image);
      setUserProfileImage(image.path);
      setUserProfileImageConfig(image);
      setcontentType(image.mime);
      setImage(image.path)

    });


  };


  useEffect(() => {
    let isMounted = true

    if (isMounted)
      auth.onAuthStateChanged((user) => {
        if (user) {
          var uid = user.uid;
          setId(uid)
          // console.log(id)
          firestore.collection("users").doc(uid)
            .get().then((doc) => {
              if (doc.exists) {
                setImage(doc.data().userProfileImageUrl)
                setSelectedTeams(doc.data().selectedTeams)
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

    // console.log(image)

    return () => { isMounted = false }
  }, [isFocused]);


  let updateInfo = async () => {
    const metadata = {
      contentType: contentType
    }

    const filename = userProfileImage.substring(userProfileImage.lastIndexOf('/') + 1);
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

    if (
      gender != "" &&
      FirstName != "" &&
      userProfileImage != null &&
      LastName != ""

    ) {

      if (id)

        storage
          .ref()
          .child(`userProfileImage/${id}/` + filename)
          .put(blob, metadata)
          .then((url) => {
            url.ref
              .getDownloadURL()
              .then((success) => {
                firestore.collection("users").doc(id).update({
                  userName: FirstName + LastName,
                  userGender: gender,
                  userProfileImageUrl: success,
                }).then(() => {
                  console.log("Document successfully written!");
                  Alert.alert("record has been successfully changed")
                  setGender("")
                  setFirstName("")
                  setLastName("")
                  setImage(success)
                })
                  .catch((error) => {
                    console.error("Error writing document: ", error);
                  });
              }).catch((e)=>{
                console.log(e)
              })
          })
          .catch((e) => {
            console.error(e);
          })
    }
    else {
      Alert.alert("All fields must been filled")
    }
  }

  const [number, setNumber] = useState("");
  return (
    <LinearGradient colors={["#DD488C", "#000"]} style={styles.linearGradient}>
      <ScrollView>
        <SafeAreaView style={styles.main}>
          <TopBar />
          <View style={styles.Profile}>

            <Text style={styles.h1}>MON PROFIL</Text>



            <TouchableOpacity onPress={TakeImgFromGallery} style={styles.Image}>

              {image ? (

                <View style={{ backgroundColor: 'silver', height: 70, width: 70, borderRadius: 70, marginVertical: 10 }}>

                  <Image
                    style={{ height: 70, width: 70, borderRadius: 70, }}
                    resizeMode='cover'
                    source={{ uri: image }}
                  />
                </View>
              )

                :
                <Image
                  style={{ height: 70, width: 70, borderRadius: 70, marginVertical: 10 }}
                  resizeMode='cover'

                  source={{ uri: "https://www.w3schools.com/howto/img_avatar.png" }}
                />
              }
            </TouchableOpacity>





          </View>
          <View style={styles.Form}>
            <TextInput
              style={styles.input}
              onChangeText={setFirstName}
              value={FirstName}
              placeholder="Prénom"
              keyboardType="default"
            />
            <TextInput
              style={styles.input}
              onChangeText={setLastName}
              value={LastName}
              placeholder="Nom"
              keyboardType="default"
            />
            <TextInput
              style={styles.input}
              onChangeText={setGender}
              value={gender}
              placeholder="Genre"
              keyboardType="default"
            />
            <TouchableOpacity
              onPress={() => {
                updateInfo()
              }}
            >
              <View style={styles.btn}>
                <Text style={styles.f}>MODIFIER</Text>
              </View>
            </TouchableOpacity>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Image
                style={{ height: 70, width: 70, borderRadius: 70 }}
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

                props.navigation.navigate("AchatUser")

              }}
            >
              <View style={styles.btnopacity}
              >
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
        </SafeAreaView>
      </ScrollView>
    </LinearGradient >
  );
};

export default Profile;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    display: "flex",
    paddingBottom: 100
  },
  h1: {
    fontFamily: "FredokaOne-Regular",

    color: "#fff",
    fontSize: 30,
  },
  h2: {
    fontFamily: "FredokaOne-Regular",
    color: "#fff",
    fontSize: 50,
    opacity: 0.5,
  },
  h3: {
    fontFamily: "FredokaOne-Regular",

    color: "#fff",
    fontSize: 15,
  },
  Profile: { alignItems: "center", marginVertical: 10 },

  linearGradient: { flex: 1 },
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
  badgeIconIos: { top: 20, backgroundColor: 'red', width: 30, height: 30, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
  badgeIconAndroid: { zIndex: 1, elevation: 1, top: 20, backgroundColor: 'red', width: 30, height: 30, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
  ImageIos: { zIndex: -1, elevation: -1 },
  ImageAndroid: {}
});
