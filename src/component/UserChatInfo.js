import React from "react";
import { StyleSheet, Text, View, ScrollView, Image } from "react-native";
import Colors from "./../assets/colors/Colors";
import Entypo from "react-native-vector-icons/Entypo";
import Ionicons from "react-native-vector-icons/Ionicons";

const UserChatInfo = ({ currentUserData, id, gender, name, userImg, selectedTeams }) => {

  let mutualInterest = () => {
    let count = 0
    for (var i in selectedTeams) {
      if (currentUserData.selectedTeams[i].id === selectedTeams[i].id) {
        count++
      }
      return count
    }
  }
  return (
    <View style={styles.Container}>
      {selectedTeams &&
        mutualInterest() > 0 &&
        <View style={styles.Badge}>
          <Text style={{ color: 'white' }}>{mutualInterest()}</Text>
        </View>

      }
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

          <View style={{ display: 'flex', flexDirection: 'row' }}>

            <Text>{name}</Text>
            <Ionicons
              style={styles.position}
              name={gender === "male" ? "male" : "female"}
              size={20}
            />
          </View>
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
    flexDirection: 'row',
    justifyContent: 'center',
    color: 'red',
    alignItems: "center",
    ...Colors.customShadow,
  },
  main: {
    zIndex: -1,
    elevation: -1,
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
  lContainer: { flex: 1 },
  center: { flex: 2 },
  rContainer: { flex: 1, alignItems: 'flex-end' },
  Badge: {
    height: 30, width: 30, backgroundColor: Colors.darkPink, borderRadius: 30, justifyContent: 'center', alignItems: 'center', position: 'absolute', left: 25,
    top: 3
  },
});
