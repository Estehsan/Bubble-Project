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
import InputF from "../../component/InputF";
import { nameValidator } from "../../helpers/nameValidator";


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
  const [FirstName, setFirstName] = useState({ value: '', error: '' });
  const [LastName, setLastName] = useState({ value: '', error: '' });
  const [UserProfileImageConfig, setUserProfileImageConfig] = useState(null);
  const [contentType, setcontentType] = useState(null);
  const [selectedTeams, setSelectedTeams] = useState([]);

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

  return (
    <LinearGradient colors={["#DD488C", "#000"]} style={styles.linearGradient}>
      <View style={styles.main}>
        <TopBar />
        <View style={styles.Profile}>
          <Text style={styles.h1}>MON PROFIL</Text>
        </View>
        <View style={styles.Form}>


          <InputF onChangeText={(e) => setFirstName({ value: e, error: '' })}
            value={FirstName.value}
            error={FirstName.error}
            errorText={FirstName.error}
            placeholder="pseudo"
            keyboardType="default" />

          <InputF onChangeText={(e) => setLastName({ value: e, error: '' })}
            value={LastName.value}
            error={LastName.error}
            errorText={LastName.error}
            placeholder="date de naissance"

            keyboardType="default" />
          <TouchableOpacity style={styles.input} onPress={toggleModal}>
            <P>Selecte Interest</P>
            {/* <FlatList
              data="selectedTeams"
              keyExtractor={(item) => item.id}
              horizontal
              renderItem={({ item }) => <H2 key={item}>{console.log(item)}</H2>}
            /> */}
            {/* {selectedTeams.map((item) => (
              <Text key={id}>{item}</Text>
            ))} */}
          </TouchableOpacity>
          <Modal isVisible={isModalVisible}>
            <View
              style={{
                paddingHorizontal: 10,
                paddingVertical: 50,
                backgroundColor: "#fff",
              }}
            >
              <SelectBox
                label="Select multiple"
                options={K_OPTIONS}
                selectedValues={selectedTeams}
                onMultiSelect={onMultiChange()}
                onTapClose={onMultiChange()}
                isMulti
              />
              <TouchableOpacity onPress={toggleModal}>
                <Text>close</Text>
              </TouchableOpacity>
            </View>
          </Modal>

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


              const firstNameError = nameValidator(FirstName.value)
              const lastNameError = nameValidator(LastName.value)

              if (firstNameError || lastNameError) {
                setFirstName({ ...FirstName, error: firstNameError })
                setLastName({ ...LastName, error: lastNameError })
              }


              if (
                email != "" &&
                password != "" &&
                userProfileImage != null &&
                gender != "" &&
                FirstName != "" &&
                LastName != "" &&
                selectedTeams.length > 0
              ) {
                var userDetails = {
                  email: email,
                  password: password,
                  userProfileImage: userProfileImage,
                  gender: gender,
                  FirstName: FirstName,
                  LastName: LastName,
                  UserProfileImageConfig: UserProfileImageConfig,
                  contentType: contentType,
                  selectedTeams: selectedTeams,
                  navigation: props.navigation,
                };

                try {
                  const SignUpReturn = await signUp(userDetails);
                  props.navigation.push("Home");
                  console.log(userDetails);
                } catch (err) {
                  console.log(err);
                }
              }

              else {
                Alert.alert("fields can not be empty")
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
      </View>
    </LinearGradient>
  );
  function onMultiChange() {
    console.log(selectedTeams.length)
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
    color: "black"
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
