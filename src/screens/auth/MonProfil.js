import React, { useState } from "react";
import ImagePicker from "react-native-image-crop-picker";
import CheckBox from "@react-native-community/checkbox";

import { AsyncStorage } from "@react-native-async-storage/async-storage";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  Image,
  TextInput,
  TouchableOpacity,
  Touchable,
  FlatList,
  Alert,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import TopBar from "./../../component/TopBar";
import Ionicons from "react-native-vector-icons/Ionicons";
import SelectBox from "react-native-multi-selectbox";
import H2 from "./../../component/basic/H2";
import { xorBy } from "lodash";
import { auth, storage, firestore, signUp } from "../../db/firebase";
import Modal from "react-native-modal";
import P from "../../component/basic/P";
import WP from "../../component/basic/WP";

import InputF from "../../component/InputF";
import { passwordValidator } from "../../helpers/passwordValidator";
import { emailValidator } from "../../helpers/emailValidator";

import Colors from "../../assets/colors/Colors";

// This is register screen II

const MonProfil = ({ route, ...props }) => {
  const { name, date } = route.params;
  const [email, setEmail] = useState({ value: "", error: "" });
  const [number, setNumber] = useState("");
  const [userProfileImage, setUserProfileImage] = useState(null);
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState({ value: "", error: "" });
  const [UserProfileImageConfig, setUserProfileImageConfig] = useState(null);
  const [contentType, setcontentType] = useState(null);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [isSelected, setSelection] = useState(false);
  const [toggleCheckBox, setToggleCheckBox] = useState(false);

  const [errorText, setErrorText] = useState("");

  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const K_OPTIONS = [
    {
      item: "Juventus",
      id: "JUVE",
    },
    {
      item: "Real Madrid",
      id: "RM",
    },
    {
      item: "Barcelona",
      id: "BR",
    },
    {
      item: "PSG",
      id: "PSG",
    },
    {
      item: "FC Bayern Munich",
      id: "FBM",
    },
    {
      item: "Manchester United FC",
      id: "MUN",
    },
    {
      item: "Manchester City FC",
      id: "MCI",
    },
    {
      item: "Everton FC",
      id: "EVE",
    },
    {
      item: "Tottenham Hotspur FC",
      id: "TOT",
    },
    {
      item: "Chelsea FC",
      id: "CHE",
    },
    {
      item: "Liverpool FC",
      id: "LIV",
    },
    {
      item: "Arsenal FC",
      id: "ARS",
    },

    {
      item: "Leicester City FC",
      id: "LEI",
    },
  ];

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
    });
  };
  const TakeImgFromCamera = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    }).then((image) => {
      console.log(image);
    });
  };

  return (
    <LinearGradient colors={["#000", "#DD488C"]} style={styles.linearGradient}>
      <ScrollView style={styles.main}>
        <TopBar />
        <View style={styles.Profile}>
          <Text style={styles.h1}>MON PROFIL</Text>
        </View>
        <View style={styles.Form}>
          <InputF
            onChangeText={(e) => setEmail({ value: e, error: "" })}
            value={email.value}
            error={email.error}
            errorText={email.error}
            placeholder="Email"
            keyboardType="default"
          />

          <InputF
            onChangeText={(e) => setEmail({ value: e, error: "" })}
            secureTextEntry={true}
            onChangeText={(e) => setPassword({ value: e, error: "" })}
            value={password.value}
            error={password.error}
            errorText={password.error}
            placeholder="Mot de passe"
            keyboardType="default"
          />

          <View
            style={{
              backgroundColor: "white",
              width: "70%",
              borderRadius: 30,
              paddingHorizontal: 10,
              marginBottom: 15,
              paddingVertical: 0,
            }}>
            <SelectBox
              label=""
              inputPlaceholder="Centres d'intéret"
              options={K_OPTIONS}
              selectedValues={selectedTeams}
              onMultiSelect={onMultiChange()}
              onTapClose={onMultiChange()}
              containerStyle={{ paddingHorizontal: 20, marginBottom: 2 }}
              optionsLabelStyle={{ paddingHorizontal: 10 }}
              labelStyle={{ height: 6 }}
              multiOptionContainerStyle={{ backgroundColor: Colors.darkPink }}
              isMulti
            />
          </View>

          <View style={styles.SelectGender}>
            <TouchableOpacity onPress={() => setGender("mix")}>
              <View>
                <Ionicons
                  style={styles.position}
                  name="male-female"
                  size={60}
                  color={gender === "mix" ? "pink" : "#000"}
                />
                <Text>Autre</Text>
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
                <Text>Femme</Text>
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
                <Text>Homme</Text>
              </View>
            </TouchableOpacity>
          </View>

          {userProfileImage === null ? (
            <View style={{ display: "flex", flexDirection: "row" }}>
              <TouchableOpacity
                onpress={TakeImgFromCamera}
                style={styles.uploadImg}>
                <Ionicons style={styles.position} name="md-camera" size={60} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={TakeImgFromGallery}
                style={styles.uploadImg}>
                <Ionicons
                  style={styles.position}
                  name="md-download-outline"
                  size={50}
                />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.uploadImg}>
              <TouchableOpacity onPress={TakeImgFromGallery}>
                <Image
                  style={{
                    height: 80,
                    width: 80,
                    borderRadius: 50,
                    ...Colors.customShadow,
                  }}
                  resizeMode="cover"
                  source={{
                    uri: userProfileImage,
                  }}
                />
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.CB}>
            <View>
              <CheckBox
                disabled={false}
                onFillColor={Colors.darkPink}
                onTintColor="white"
                onCheckColor="white"
                tintColor={Colors.textB}
                value={toggleCheckBox}
                onValueChange={(newValue) => setToggleCheckBox(newValue)}
              />
            </View>
            <View>
              <Text style={{ color: "white", marginHorizontal: 10 }}>
                Accepter les termes et conditions
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={async () => {
              const emailError = emailValidator(email.value);

              const passwordError = passwordValidator(password.value);

              if (emailError || passwordError) {
                setEmail({ ...email, error: emailError });
                setPassword({ ...password, error: passwordError });
              }

              if (
                email.value != "" &&
                password.value != "" &&
                userProfileImage != null &&
                gender != "" &&
                name != "" &&
                date != "" &&
                toggleCheckBox != "false" &&
                selectedTeams.length > 0
              ) {
                var userDetails = {
                  email: email.value,
                  password: password.value,
                  userProfileImage: userProfileImage,
                  gender: gender,
                  name: name,
                  DOB: date,
                  UserProfileImageConfig: UserProfileImageConfig,
                  contentType: contentType,
                  selectedTeams: selectedTeams,
                  navigation: props.navigation,
                };

                try {
                  setLoading(true);
                  const SignUpReturn = await signUp(userDetails);
                  console.log(userDetails);
                  props.navigation.push("Home");
                  setLoading(false);
                } catch (err) {
                  console.log(err);
                }
              } else {
                Alert.alert("fields can not be empty");
              }
            }}>
            <View style={styles.btn}>
              <Text style={styles.f}>VALIDER MON PROFIL</Text>
            </View>
          </TouchableOpacity>

          {/* <TouchableOpacity onPress={() => props.navigation.navigate("FlowB")}>
            <View style={styles.btnopacity}>
              <Text style={styles.f}>VALIDER</Text>
            </View>
          </TouchableOpacity> */}
        </View>
      </ScrollView>
    </LinearGradient>
  );
  function onMultiChange() {
    console.log(selectedTeams.length);
    return (item) => setSelectedTeams(xorBy(selectedTeams, [item], "id"));
  }

  function onChange() {
    return (val) => setSelectedTeam(val);
  }
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
    color: "black",
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
    width: "33%",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    margin: 5,
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 17,
    marginTop: 10,
  },
  CB: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    flexDirection: "row",
  },
});
