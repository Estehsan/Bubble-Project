import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Modal,
  Pressable,
  FlatList,
  Alert,
} from "react-native";
import Colors from "./../assets/colors/Colors";
import Entypo from "react-native-vector-icons/Entypo";
import Ionicons from "react-native-vector-icons/Ionicons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { block } from "react-native-reanimated";
import { firestore } from "../db/firebase";
import firebase from "firebase/app";
import OneSignal from "react-native-onesignal";


const UserChatInfo = ({
  currentUserData,
  id,
  gender,
  name,
  userImg,
  selectedTeams,
}) => {
  const [quitmodal, setQuitModal] = useState(false);
  const [notificationModel, setNotificationModel] = useState(false)
  const [candy, setCandy] = useState(0)
  const [commonTeams, setCommonTeams] = useState([]);
  const [notification, setNotification] = useState([]);
  const [notificationId, setNotificationId] = useState("")
  const navigation = useNavigation();


  useEffect(() => {
    firestore.collection("users").doc(currentUserData.id).onSnapshot((doc) => {
      // setNotification(doc.data().notification)
      setCandy(doc.data().candy)
    })
    firestore.collection("users").doc(id).onSnapshot((doc) => {
      setNotificationId(doc.data().notificationId)
    })
    // console.log(notification)
  }, [])


  let mutualInterest = () => {
    let count = 0;
    let i = 0;
    let j = 0;

    for (i in selectedTeams) {
      for (j in currentUserData.selectedTeams) {
        if (currentUserData.selectedTeams[j].id === selectedTeams[i].id) {
          count++;
        }
      }
    }

    return count;
  };

  let renderTeamModal = () => {
    let i = 0;
    let j = 0;

    for (i in selectedTeams) {
      for (j in currentUserData.selectedTeams) {
        if (currentUserData.selectedTeams[j].id === selectedTeams[i].id) {
          commonTeams.push(currentUserData.selectedTeams[j].item);
        }
      }
    }
    setQuitModal(true);
  };


  let addNotification = async () => {

    if (candy > 0) {
      await firestore.collection("users").doc(currentUserData.id).update({
        // notification: firebase.firestore.FieldValue.arrayUnion(id),
        candy: firebase.firestore.FieldValue.increment(-1)
      })

      let externalUserId = notificationId; // You will supply the external user id to the OneSignal SDK

      // Setting External User Id with Callback Available in SDK Version 3.9.3+
      OneSignal.setExternalUserId(externalUserId, (results) => {
        // The results will contain push and email success statuses
        console.log("Results of setting external user id");
        console.log(results);

        // Push can be expected in almost every situation with a success status, but
        // as a pre-caution its good to verify it exists
        if (results.push && results.push.success) {
          console.log("Results of setting external user id push status:");
          console.log(results.push.success);
        }
      });

      const notification = {
        contents: {
          en: `Dear ${name}, ${currentUserData.userName} has invited you to have a Chat`,
        },
        include_player_ids: [externalUserId],
      };

      const jsonStri = JSON.stringify(notification);

      await OneSignal.postNotification(
        jsonStri,
        (success) => {
          console.log("Success:", success);
        },
        (error) => {
          console.log("Error:", error);
        }
      );



      setNotificationModel(false)
    }

    else {
      Alert.alert("You Don't have enough candy")
      setNotificationModel(false)

    }



  }

  return (
    <View style={styles.Container}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={quitmodal}
        onRequestClose={() => {
          setQuitModal(!quitmodal);
          setCommonTeams([]);
        }}
        contentContainerStyle={styles.modalStyle}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.Headinghai}>COMMON</Text>
            <Text style={styles.Headinghai}></Text>

            {/* <FlatList
              data={commonTeams}
              renderItem={({ item }) => <Text>{commonTeams}</Text>}
            /> */}
            <Text style={[styles.modalText, {}]}>{commonTeams}</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                setQuitModal(!quitmodal);
                setCommonTeams([]);
              }}>
              <Text style={styles.textStyle}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        visible={notificationModel}
        onRequestClose={() => {
          setNotificationModel(!notificationModel);
        }}
        contentContainerStyle={styles.modalStyle}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>En envoyant un bonbon vous pouvez envoyer une notification à cette personne. Souhaitez-vous continuer ?
            </Text>

            {/* <FlatList
              data={commonTeams}
              renderItem={({ item }) => <Text>{commonTeams}</Text>}
            /> */}
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                addNotification()
              }}>
              <Text style={styles.textStyle}>Yes</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                setNotificationModel(!notificationModel);
              }}>
              <Text style={styles.textStyle}>No</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      {selectedTeams && mutualInterest() > 0 && (
        <View style={styles.Badge}>
          <TouchableOpacity onPress={() => renderTeamModal()}>
            <Text style={{ color: "white" }}>{mutualInterest()}</Text>
          </TouchableOpacity>
        </View>
      )}
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
          <View style={{ display: "flex", flexDirection: "row" }}>
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
          {/* {
          notification && notification.includes(id) ? <View style={{ flex: 1 }}></View>
            : */}
          <TouchableOpacity
            style={styles.ListOfUsers}
            onPress={() => {
              setNotificationModel(true)
            }}>
            <Image
              style={{ height: 50, width: 50, borderRadius: 50 }}
              resizeMode="contain"
              source={require("./../assets/images/rose.png")}
            />
          </TouchableOpacity>
          {/* } */}
          <TouchableOpacity onPress={() => {
            navigation.navigate("ChatUser", {
              currentUserId: currentUserData.id,
              messageId: id,
              name: name,
              gender: gender,
              messageImg: userImg,
            });
          }}>
            <Text style={styles.messageButton}>Bubbler</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default UserChatInfo;

const styles = StyleSheet.create({
  Container: {
    flexDirection: "row",
    justifyContent: "center",
    color: "red",
    alignItems: "center",
    ...Colors.customShadow,
  },
  main: {
    zIndex: -1,
    elevation: -1,
    backgroundColor: "#fff",
    width: "90%",
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
  rContainer: {
    flex: 2
    , flexDirection: "row",
    alignItems: "center",
  },
  Badge: {
    height: 30,
    width: 30,
    backgroundColor: Colors.darkPink,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    left: 20,
    top: 2,
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
    padding: 10,
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
  messageButton: {
    padding: 5,
    borderWidth: 1,
    borderRadius: 20,
    textAlign: "center",
  },
  Headinghai: {
    fontFamily: "FredokaOne-Regular",
    fontSize: 25,
    color: "#fff",
  },
});
