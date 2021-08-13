import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import Colors from "./../assets/colors/Colors";
import Entypo from "react-native-vector-icons/Entypo";
import Ionicons from "react-native-vector-icons/Ionicons";

const UserChatInfo = ({ id, gender, name, userImg }) => {
  return (
    <View style={styles.Container}>
      <View style={styles.main}>
        <View style={styles.lContainer}>
          {userImg ? (
            <Image
              style={{ height: 50, width: 50, borderRadius: 50 }}
              source={{ uri: userImg }}
            />
          ) : (
            <Image
              style={{ height: 50, width: 50, borderRadius: 50 }}
              source={{ uri: "https://www.w3schools.com/howto/img_avatar.png" }}
            />
          )}
        </View>

        <View style={styles.center}>
          <Text>{name}</Text>
          <Ionicons
            style={styles.position}
            name={gender === "male" ? "male" : "female"}
            size={20}
          />
          <Text>{gender}</Text>
        </View>
        <View style={styles.rContainer}>
          <Entypo color="red" name="flower" size={30} />
        </View>
      </View>
    </View>
  );
};

export default UserChatInfo;

const styles = StyleSheet.create({
  Container: {
    alignItems: "center",
    ...Colors.customShadow,
  },
  main: {
    backgroundColor: "#fff",
    width: "80%",
    padding: 20,
    marginBottom: 20,
    height: 80,
    borderRadius: 100,
    justifyContent: "space-between",
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
    borderRadius: 60,
    alignItems: "center",
  },
});
