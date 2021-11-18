import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useWindowDimensions,
} from "react-native";
import Colors from "../assets/colors/Colors";
import H2 from "./basic/H2";
import P from "./basic/P";
import { useNavigation } from "@react-navigation/native";

const MapCorousel = ({
  props,
  onPress,
  isSelected,
  title,
  key,
  location,
  place,
  code,
  img,
  latlng,
  UsersListPlace,
}) => {
  const width = useWindowDimensions().width;
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={([styles.Container], { width: width - 60 })}
      onPress={() =>
        navigation.navigate("UsersListPlace", {
          id: key,
          title: title,
          place: place,
          location: location,
          code: code,
          img: img,
          latlng: latlng,
        })
      }>
      <View style={styles.main}>
        <View style={styles.lContainer}>
          {img ? (
            <Image style={styles.cover} source={{ uri: img }} />
          ) : (
            <Image
              style={styles.cover}
              source={require("../assets/images/description.png")}
            />
          )}
        </View>
        <View style={styles.rContainer}>
          <H2 numberOfLines={2}>{title}</H2>
          <P style={{ flexWrap: "wrap" }}>{location}</P>
          <P>{place.substring(0, 50)}...</P>
          <P>{code}</P>
          {/* <TouchableOpacity
            onPress={() => {
              // navigation.navigate('UsersListPlace');
            }}></TouchableOpacity> */}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default MapCorousel;

const styles = StyleSheet.create({
  Container: {
    height: 10,
    alignItems: "center",

    ...Colors.customShadow,
  },
  rContainer: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 15
  },
  main: {
    backgroundColor: "#fff",
    width: "90%",
    marginBottom: 20,
    height: 100,
    borderRadius: 50,
    flex: 1,
    ...Colors.customShadow,

    justifyContent: "space-around",
    display: "flex",
    alignContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  btn: {
    height: 40,
    width: 70,
    backgroundColor: "#D8D8D8",
    marginStart: 70,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  cover: {
    height: "100%",
    width: 110,
    resizeMode: "cover",
    borderBottomStartRadius: 10,
    borderTopStartRadius: 10,
  },
});
