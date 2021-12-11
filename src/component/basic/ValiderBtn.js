import React from "react";
import { ImageBackground, StyleSheet, Text, View } from "react-native";

const ValiderBtn = () => {
  return (
    <ImageBackground
      source={require("./../../assets/images/BtnShape.png")}
      resizeMode="contain"
      style={{ height: 39, width: 126 }}>
      <View
        style={{
          paddingTop: 9,
          paddingLeft: 21,
        }}>
        <Text style={styles.f}>VALIDER</Text>
      </View>
    </ImageBackground>
  );
};

export default ValiderBtn;

const styles = StyleSheet.create({
  f: {
    fontFamily: "FredokaOne-Regular",
  },
});
