import React, { useState } from "react";
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
    id: "213213124",
    title: "Second",
    place: "Second place Paris",
    location: "Karachi 18h",
    code: "01.98.97.96.95",
    img: require("./../../assets/images/description.png"),
  },

  {
    id: "213213124",
    title: "Second",
    place: "Second place Paris",
    location: "Karachi 18h",
    code: "01.98.97.96.95",
    img: require("./../../assets/images/description.png"),
  },

  {
    id: "213213124",
    title: "Second",
    place: "Second place Paris",
    location: "Karachi 18h",
    code: "01.98.97.96.95",
    img: require("./../../assets/images/description.png"),
  },
];

const Drink = ({ navigation }) => {
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
          <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => navigation.navigate("AchatUser")}
              >
                <ListContainer
                  title={item.title}
                  place={item.place}
                  location={item.location}
                  code={item.code}
                  img={item.img}
                />
              </TouchableOpacity>
            )}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default Drink;

const styles = StyleSheet.create({
  linearGradient: { flex: 1 },
});
