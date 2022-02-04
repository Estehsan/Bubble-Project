import React, { useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import Colors from "../assets/colors/Colors";
import H2 from "./basic/H2";
import P from "./basic/P";

const ListContainer = ({
  title,
  location,
  place,
  code,
  img,
  navigation,
  qrimage,
}) => {
  return (
    <View style={styles.Container}>
      <View style={styles.main}>
        <View style={styles.lContainer}>
          {img ? (
            <Image
              style={styles.cover}
              source={{ uri: img }}
            />
          ) : (
            <Image
              style={styles.cover}
              source={require("../assets/images/description.png")}
              // source={{ uri: img }}
            />
          )}
        </View>
        <View style={styles.rContainer}>
          <H2 ellipsizeMode="tail" numberOfLines={2}>
            {title}
          </H2>
          <P ellipsizeMode="tail" numberOfLines={1}>
            {location}
          </P>
          <P ellipsizeMode="tail" numberOfLines={3}>
            {place}
          </P>
          {/* <P ellipsizeMode="tail" numberOfLines={1}>
            {code}
          </P> */}
          <Image source={{ uri: qrimage }} />
          <TouchableOpacity
            onPress={() => {
              // navigation.navigate('UsersListPlace');
            }}></TouchableOpacity>
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
    paddingRight: 20,
    marginBottom: 20,
    height: 145,
    borderTopRightRadius: 100,
    borderBottomRightRadius: 100,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    display: "flex",
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
  rContainer: {
    paddingTop: 20,
    paddingBottom: 20,
    width: "50%",
  },
  lContainer: { paddingRight: 13 },
  cover:{
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    height: "100%",
    width: 150,
    resizeMode: "cover",
  }
});
