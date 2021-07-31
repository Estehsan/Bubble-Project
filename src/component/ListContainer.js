import React, { useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import Colors from "../assets/colors/Colors";

const ListContainer = ({ title, locations, place, code, img, ...props }) => {
  return (
    <View style={styles.Container}>
      <View style={styles.main}>
        <View style={styles.lContainer}>
          <Image style={{ height: 100, width: 110 }} source={img} />
        </View>
        <View style={styles.rContainer}>
          <Text>{title}</Text>
          <Text>{locations}</Text>
          <Text>{place}</Text>
          <Text>{code}</Text>
          <TouchableOpacity>
            <View style={styles.btn}>
              <Text>Hello</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ListContainer;

const styles = StyleSheet.create({
  Container: {
    alignItems: "center",
    ...Colors.customShadow,
  },
  main: {
    backgroundColor: "#fff",
    width: "90%",
    padding: 20,
    marginBottom: 20,
    height: 145,
    borderRadius: 100,
    justifyContent: "space-around",
    display: "flex",
    alignContent: "center",
    flexDirection: "row",
  },
  btn: {
    height: 40,
    width: 70,
    backgroundColor: "#D8D8D8",
    marginStart: 70,
    marginTop: 10,
    justifyContent: "center",
    borderRadius: 60,
    alignItems: "center",
  },
});
