import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import Colors from "../assets/colors/Colors";

const MapCorousel = ({
  title,
  onPress,
  isSelected,
  location,
  place,
  code,
  img,
  navigation,
}) => {
  const width = useWindowDimensions().width;

  return (
    <View style={([styles.Container], { width: width - 60 })}>
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
          <Text numberOfLines={2}>{title}</Text>
          <Text style={{ flexWrap: "wrap" }}>{location}</Text>
          <Text>{place}</Text>
          <Text>{code}</Text>
          <TouchableOpacity
            onPress={() => {
              // navigation.navigate('UsersListPlace');
            }}
          ></TouchableOpacity>
        </View>
      </View>
    </View>
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
  },
  main: {
    backgroundColor: "#fff",
    width: "90%",
    marginBottom: 20,
    height: 145,
    borderRadius: 20,
    flex: 1,

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
    borderBottomStartRadius: 40,
  },
});
