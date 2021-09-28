import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, ScrollView, Image, Modal, Pressable } from "react-native";
import Colors from "./../assets/colors/Colors";
import Entypo from "react-native-vector-icons/Entypo";
import Ionicons from "react-native-vector-icons/Ionicons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from '@react-navigation/native';
import { block } from "react-native-reanimated";


const UserChatInfo = ({ currentUserData, id, gender, name, userImg, selectedTeams }) => {

  const [quitmodal, setQuitModal] = useState(false);
  const [commonTeams, setCommonTeams] = useState([])
  const navigation = useNavigation();



  let mutualInterest = () => {
    let count = 0
    let i = 0
    let j = 0

    for (i in selectedTeams) {
      for (j in currentUserData.selectedTeams) {
        if (currentUserData.selectedTeams[j].id === selectedTeams[i].id) {
          count++

        }
      }
    }

    return count
  }

  let renderTeamModal = () => {
    let i = 0
    let j = 0

    for (i in selectedTeams) {
      for (j in currentUserData.selectedTeams) {
        if (currentUserData.selectedTeams[j].id === selectedTeams[i].id) {
          commonTeams.push(currentUserData.selectedTeams[j].item)
        }
      }
    }

    // console.log(currentUserData.id , id , name , gender)

    setQuitModal(true)
  }


  return (
    <View style={styles.Container}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={quitmodal}
        onRequestClose={() => {
          setQuitModal(!quitmodal);
          setCommonTeams([])

        }}
        contentContainerStyle={styles.modalStyle}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.Headinghai}>COMMON</Text>
            <Text style={styles.Headinghai}></Text>

            <Text style={styles.modalText}>
              {commonTeams}
            </Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                setQuitModal(!quitmodal);
                setCommonTeams([])
              }}>
              <Text style={styles.textStyle}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      {selectedTeams &&
        mutualInterest() > 0 &&
        <View style={styles.Badge}>
          <TouchableOpacity onPress={() => renderTeamModal()}>
            <Text style={{ color: 'white' }}>{mutualInterest()}</Text>
          </TouchableOpacity>
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
          <TouchableOpacity
            style={styles.ListOfUsers}
            onPress={() => {
              navigation.navigate("ChatUser", {
                currentUserId: currentUserData.id,
                messageId: id,
                name: name,
                gender: gender,
                messageImg: userImg,
              });
            }}>
            <Entypo color="red" name="flower" size={30} />
          </TouchableOpacity>

        </View>
      </View>
    </View >
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
  modalText: {
    margin: 15,
    textAlign: "center",
    color: "white",
    padding: 5,
    justifyContent: "center",
  },
  modalStyle: {
    backgroundColor: Colors.darkPink,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    flexDirection: "column",
    padding: 10
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    backgroundColor: Colors.darkPink,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    margin: 10,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "white",
  },
  ListOfUsers: {},
});
