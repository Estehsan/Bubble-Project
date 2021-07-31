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
import { auth, storage, firestore, signUp } from "../../db/firebase";

const handleSignUp = async (
  email,
  password,
  userProfileImage,
  gender,
  FirstName
) => { };

// This is register screen II

const MonProfil = ({ route, ...props }) => {
  const { email, password } = route.params;
  const [number, setNumber] = useState("");
  const [userProfileImage, setUserProfileImage] = useState(null);
  const [gender, setGender] = useState("");
  const [FirstName, setFirstName] = useState(null);
  const [LastName, setLastName] = useState(null);
  const [UserProfileImageConfig, setUserProfileImageConfig] = useState(null);
  const[contentType,setcontentType] = useState(null)

  const TakeImgFromGallery = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then((image) => {
      console.log(image);
      setUserProfileImage(image.path);
      setUserProfileImageConfig(image);
      setcontentType(image.mime)
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
            onChangeText={setFirstName}
            value={FirstName}
            placeholder="pseudo "
            keyboardType="default"
          />

          <TextInput
            style={styles.input}
            onChangeText={setLastName}
            value={LastName}
            placeholder="date de naissance"
            keyboardType="default"
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
            onPress={async () => {
              if (
                email != "" &&
                password != "" &&
                userProfileImage != null &&
                gender != "" &&
                FirstName != "" &&
                LastName != ""
              ) {
                var userDetails = {
                  email: email,
                  password: password,
                  userProfileImage: userProfileImage,
                  gender: gender,
                  FirstName: FirstName,
                  LastName: LastName,
                  UserProfileImageConfig : UserProfileImageConfig,
                  contentType : contentType,
                  navigation : props.navigation
                };

                try {
                  const SignUpReturn = await signUp(userDetails);
                  props.navigation.push("Home")
                  console.log(userDetails);
                }
                catch(err){
                  console.log(err)
                }
               
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
