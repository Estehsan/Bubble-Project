import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import TopBar from "./../../component/TopBar";
import { auth, firestore } from "../../db/firebase";
import firebase from "firebase/app";

const Profile = (props) => {
  let [image, setImage] = useState(null)
  let [selectedTeams, setSelectedTeams] = useState([])

  const [gender, setGender] = useState("");
  const [FirstName, setFirstName] = useState(null);
  const [LastName, setLastName] = useState(null);
  const [id, setId] = useState("");



  useEffect(() => {
    let isMounted = true
    auth.onAuthStateChanged((user) => {
      if (user) {
        var uid = user.uid;
        setId(uid)

        console.log(id)

        firestore.collection("users").doc(uid)
          .get().then((doc) => {
            if (doc.exists && isMounted) {
              setImage(doc.data().userProfileImageUrl)
              setSelectedTeams(doc.data().selectedTeams)

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

    return () => { isMounted = false }
  }, []);


  let updateInfo = () => {
    if (
      gender != "" &&
      FirstName != "" &&
      LastName != ""
    ) {

      if (id)
        firestore.collection("users").doc(id).update({
          userName: FirstName + LastName,
          userGender: gender
        }).then(() => {
          console.log("Document successfully written!");
          Alert.alert("record has been successfully changed")
          setGender("")
          setFirstName("")
          setLastName("")
        })
          .catch((error) => {
            console.error("Error writing document: ", error);
          });
    }
    else {
      Alert.alert("All fields must been filled")
    }
  }

  const [number, setNumber] = useState("");
  return (
    <LinearGradient colors={["#DD488C", "#000"]} style={styles.linearGradient}>
      <SafeAreaView style={styles.main}>
        <TopBar />
        <View style={styles.Profile}>
          <Text style={styles.h1}>MON PROFIL </Text>


          {

            selectedTeams &&
            selectedTeams.length > 0 &&
            <Text>+{selectedTeams.length}</Text>
          }
          {image ? <Image
            style={{ height: 70, width: 70, borderRadius: 70 }}
            resizeMode='cover'
            source={{ uri: image }}
          />
            :
            <Image
              style={{ height: 70, width: 70, borderRadius: 70 }}
              resizeMode='cover'

              source={{ uri: "https://www.w3schools.com/howto/img_avatar.png" }}
            />
          }

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
          <TextInput
            style={styles.input}
            onChangeText={setGender}
            value={gender}
            placeholder="genre"
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
            <Text style={styles.h2}>3</Text>
          </View>
          <TouchableOpacity

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
            }}
          >
            <View style={styles.btnopacity}
            >
              <Text style={styles.f}>ACHETAR</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnopacity}
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
            }}
          >
            <Text style={styles.f}>LOGOUT</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient >
  );
};

export default Profile;

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
});
