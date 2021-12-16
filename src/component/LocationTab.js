import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Colors from "./../assets/colors/Colors";
import Entypo from "react-native-vector-icons/Entypo";
import Fontisto from "react-native-vector-icons/Fontisto";

const LocationTab = (props) => {
  const [range, setRange] = useState(true);
  const [lightRange, setLightRange] = useState(true);


  return (
    <View style={styles.container}>
      <View style={styles.lBox}>
        <View style={{ justifyContent: "center" }}>
          <TouchableOpacity onPress={() => { props.ChangeKilo(true); setRange(true); }}>
            <View style={[range ? styles.highlight : styles.wow]}>
              <Text style={styles.fstyle}>MOINS DE 10 KM</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ justifyContent: "center" }}>
          <TouchableOpacity onPress={() => { props.ChangeKilo(false); setRange(false); }}>
            <View style={[!range ? styles.highlight : styles.wow]}>
              <Text style={styles.fstyle}>MOINS DE 1 KM</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.rBox}>
        <TouchableOpacity onPress={() => { props.ChangeLight(true); setLightRange(true); }}>
          <View style={lightRange ? styles.shiglight : { justifyContent: "center" }}>
            <Entypo color="#f9d71c" name="moon" size={20} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { props.ChangeLight(false); setLightRange(false); }}>
          <View style={!lightRange ? styles.shiglight : { justifyContent: "center" }}>
            <Fontisto color="#f9d71c" name="sun" size={20} />
          </View>
        </TouchableOpacity>
      </View>
    </View >
  );
};

export default LocationTab;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  lBox: {
    width: "60%",
    height: "auto",
    paddingHorizontal: 0,
    paddingVertical: 5,
    justifyContent: "space-around",
    display: "flex",
    flexDirection: "row",
    shadowColor: "box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.5)",

    backgroundColor: "#fff",
    borderRadius: 18,
    ...Colors.customShadow,
  },
  rBox: {
    width: "25%",
    height: "auto",
    flexDirection: "row",
    justifyContent: "space-around",
    shadowColor: "box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    backgroundColor: "#fff",
    ...Colors.customShadow,
    borderRadius: 17,
  },
  highlight: {
    backgroundColor: Colors.darkPink,
    paddingHorizontal: 15,
    borderRadius: 18,
    justifyContent: "center",
    ...Colors.customShadow,
    paddingVertical: 8,
  },
  shiglight: {
    backgroundColor: Colors.darkPink,
    paddingVertical: 8,
    borderRadius: 17,
    ...Colors.customShadow,
    paddingHorizontal: 12,
  },
  fstyle: { fontSize: 12 },
  wow: {
    justifyContent: "center",
    alignContent: "center",
    alignContent: "center",
  },
});
