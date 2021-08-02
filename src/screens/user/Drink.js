import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import LocationTab from "../../component/LocationTab";
import TopBar from "../../component/TopBar";
import ListContainer from "./../../component/ListContainer";
import SearchBar from "./../../component/SearchBar";
import { firestore } from "../../db/firebase";

// linear-gradient(0deg, #FFFFFF 0%, #FFC1DD 78.9%)

const data = [
  {
    id: "213213",
    title: "LE PERCHOIR DE L’EST",
    place: "10 place Paris",
    location: "Ouverte 18h",
    code: "01.98.97.96.95",
    img: require("./../../assets/images/description.png"),
  },
  {
    id: "2132131242",
    title: "Second",
    place: "Second place Paris",
    location: "Karachi 18h",
    code: "01.98.97.96.95",
    img: require("./../../assets/images/description.png"),
  },

  {
    id: "2132131247",
    title: "Second",
    place: "Second place Paris",
    location: "Karachi 18h",
    code: "01.98.97.96.95",
    img: require("./../../assets/images/description.png"),
  },

  {
    id: "2132131249",
    title: "Second",
    place: "Second place Paris",
    location: "Karachi 18h",
    code: "01.98.97.96.95",
    img: require("./../../assets/images/description.png"),
  },
];

const Drink = ({ navigation }) => {
  let [locationData, useLocationData] = useState([])

  useEffect(() => {
    firestore.collection("location").onSnapshot((querySnapshot) => {
      let docs = querySnapshot.docs.map((doc) => ({
        key: doc.id,
        title: doc.data().title,
        address: doc.data().address,
        description: doc.data().description,
        schedules: doc.data().schedules,
        photo: doc.data().photo
      }));
      useLocationData(docs)
    });


    // let gud = firestore.collection("location").doc("6sFYCoO5eIjYqIxxTtt8").get({
    //   setLocationData
    // })
  }, [])

  console.log(locationData)
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
        <View style={{ marginTop: 10 }}>

          {locationData &&
            <FlatList
              data={locationData}
              keyExtractor={(item) => item.key}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => navigation.navigate("AchatUser")}
                >
                  <ListContainer
                    title={item.title}
                    place={item.address}
                    location={item.description}
                    code={item.schedules}
                    img={item.photo}
                    navigation={navigation}
                  />
                </TouchableOpacity>
              )}
            />
          }
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default Drink;

const styles = StyleSheet.create({
  linearGradient: { flex: 1 },
});
