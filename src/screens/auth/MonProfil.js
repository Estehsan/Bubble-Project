import React, { useState } from "react";
import ImagePicker from "react-native-image-crop-picker";

import { AsyncStorage } from "@react-native-async-storage/async-storage";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TextInput,
  TouchableOpacity,
  Touchable,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import TopBar from "./../../component/TopBar";
import Ionicons from "react-native-vector-icons/Ionicons";
import { auth, storage, firestore } from "../../db/firebase";

const handleSignUp = async (
  email,
  password,
  userProfileImage,
  gender,
  FullName
) => {};

// This is register screen II

const MonProfil = ({ route, ...props }) => {
  const { email, password } = route.params;
  const [number, setNumber] = useState("");
  const [userProfileImage, setUserProfileImage] = useState(null);
  const [gender, setGender] = useState("");
  const [FullName, setFullName] = useState(null);

  const TakeImgFromGallery = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then((image) => {
      console.log(image);
      setUserProfileImage(image.path);
    });
  };

  return (
    <LinearGradient colors={["#DD488C", "#000"]} style={styles.linearGradient}>
      <SafeAreaView style={styles.main}>
        <TopBar />
        <View style={styles.Profile}>
          <Text style={styles.h1}>MON PROFIL</Text>
        </View>
        <View style={styles.Form}>
          <TextInput
            style={styles.input}
            onChangeText={setNumber}
            value={number}
            placeholder="pseudo "
            keyboardType="numeric"
          />

          <TextInput
            style={styles.input}
            onChangeText={setNumber}
            value={number}
            placeholder="date de naissance"
            keyboardType="numeric"
          />

          <View style={styles.SelectGender}>
            <TouchableOpacity onPress={() => setGender("mix")}>
              <View>
                <Ionicons
                  style={styles.position}
                  name="male-female"
                  size={60}
                  color={gender === "mix" ? "pink" : "#000"}
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setGender("male")}>
              <View>
                <Ionicons
                  style={styles.position}
                  name="female"
                  size={60}
                  color={gender === "male" ? "pink" : "#000"}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setGender("female")}>
              <View>
                <Ionicons
                  style={styles.position}
                  name="male"
                  size={60}
                  color={gender === "female" ? "pink" : "#000"}
                />
              </View>
            </TouchableOpacity>
          </View>

          {userProfileImage === null ? (
            <TouchableOpacity
              onPress={TakeImgFromGallery}
              style={styles.uploadImg}
            >
              <Ionicons style={styles.position} name="md-camera" size={60} />
            </TouchableOpacity>
          ) : (
            <View style={styles.uploadImg}>
              <Image
                style={{ height: 80, width: 80, borderRadius: 50 }}
                resizeMode="contain"
                source={{
                  uri: userProfileImage,
                }}
              />
            </View>
          )}

          <TouchableOpacity
            onPress={() => {
              if (
                email != "" &&
                password != "" &&
                userProfileImage != null &&
                gender != "null" &&
                FullName != ""
              ) {
                var userDetails = {
                  email: email,
                  password: password,
                  userProfileImage: userProfileImage,
                  gender: gender,
                  FullName: FullName,
                };

                const SignUpReturn = signUp(userDetails);
                console.log(userDetails);
                auth
                  .createUserWithEmailAndPassword(email, password)
                  .then((userCredential) => {
                    // Signed in
                    var userInfo = userCredential.user;
                    props.navigation.push("Home");
                    console.log("userinfo =>", userInfo);
                    let user = auth.currentUser;
                    var uid;
                    if (user != null) {
                      uid = user.uid;
                    }
                    storage
                      .ref()
                      .child(`userProfileImage/${uid}/` + userProfileImage.name)
                      .put(userProfileImage)
                      .then((url) => {
                        url.ref
                          .getDownloadURL()
                          .then((success) => {
                            const userProfileImageUrl = success;
                            console.log(userProfileImageUrl);
                            const userDetailsForDb = {
                              userName: FullName,
                              userEmail: email,
                              userPassword: password,
                              userGender: gender,
                              userUid: uid,
                              userProfileImageUrl: userProfileImageUrl,
                              //   userMapLink: userMapLink,
                            };
                            firestore
                              .collection("users")
                              .doc(uid)
                              .set(userDetailsForDb)
                              .then((docRef) => {
                                // console.log("Document written with ID: ", docRef.id);
                                console.log("userAdded =>", docRef.id);
                                props.navigation.push("Home");

                                resolve(userDetailsForDb);
                              })
                              .catch(function (error) {
                                console.error("Error adding document: ", error);
                                // reject(error)
                              });
                          })
                          .catch((error) => {
                            // Handle Errors here.
                            let errorCode = error.code;
                            let errorMessage = error.message;
                            console.log(
                              "Error in getDownloadURL function",
                              errorMessage
                            );
                            // reject(errorMessage)
                          });
                      })
                      .catch((error) => {
                        // Handle Errors here.
                        let errorCode = error.code;
                        let errorMessage = error.message;
                        console.log("Error in Image Uploading", errorMessage);
                        // reject(errorMessage)
                      });
                  })
                  .catch((error) => {
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    console.log(error);
                    // ..
                  });
              }
            }}
          >
            <View style={styles.btn}>
              <Text style={styles.f}>MODIFIER</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => props.navigation.navigate("FlowB")}>
            <View style={styles.btnopacity}>
              <Text style={styles.f}>VALIDER</Text>
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default MonProfil;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    display: "flex",
  },
  h1: {
    fontFamily: "FredokaOne-Regular",

    color: "#fff",
    marginBottom: 15,
    fontSize: 30,
  },
  h2: {
    fontFamily: "FredokaOne-Regular",
    color: "#fff",
    fontSize: 50,
    opacity: 0.5,
  },
  Profile: { alignItems: "center", marginVertical: 30 },

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
  },
  btn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginVertical: 12,
    marginTop: 20,
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
  SelectGender: {
    height: 100,
    width: "70%",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 17,
  },
  uploadImg: {
    height: 100,
    width: "70%",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 17,
    marginTop: 10,
  },
});
