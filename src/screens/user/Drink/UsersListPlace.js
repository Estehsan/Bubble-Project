import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import LocationTab from "./../../../component/LocationTab";
import TopBar from "./../../../component/TopBar";
import ListContainer from "./../../../component/ListContainer";
import SearchBar from "./../../../component/SearchBar";
import UserChatInfo from "../../../component/UserChatInfo";
import { auth, firestore } from "../../../db/firebase";
import { getDistance } from 'geolib';

// linear-gradient(0deg, #FFFFFF 0%, #FFC1DD 78.9%)

const users = [
  {
    id: "123",
    name: "Shani",
    userImg:
      "data:image/png;base64,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",
    gender: "male",
  },
  {
    id: "1235",
    name: "Rasgud",
    userImg:
      "data:image/png;base64,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",
    gender: "Female",
  },
];

const UsersListPlace = ({ route, ...props }) => {
  const { id, title, place, location, code, img, latlng } = route.params;
  const [userData, setUserData] = useState([]);
  const [currentUserId, setCurrentUserId] = useState("");
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUserId(user.uid);
        firestore.collection("users").onSnapshot((querySnapshot) => {
          let docs = querySnapshot.docs
            .filter((datam) => datam.id != user.uid)
            .map((doc) => ({
              id: doc.id,
              name: doc.data().userName,
              gender: doc.data().userGender,
              userImg: doc.data().userProfileImageUrl,
              latlng: {
                longitude: doc.data().longitude,
                latitude: doc.data().latitude,
              },
            }));
          var data = [];
          for (var i = 0; i < docs.length; i++) {
            var dis = getDistance(
              latlng,
              docs[i].latlng,
            )

            dis = dis / 1000

            // console.log(dis)

            if (dis < 10000) {
              data.push(docs[i])
            }
          }

          setUserData(data);
          // console.log(data)

        });
      } else {
        // User is signed out
        // ...
      }
    });
  }, []);

  // console.log("gettinguserid =>", currentUserId);
  return (
    <LinearGradient
      colors={["#FFC1DD", "#ffffff"]}
      style={styles.linearGradient}
    >
      <SafeAreaView>
        <View>
          <TopBar />
        </View>
        <View style={{ marginTop: 30 }}>
          <LocationTab />
        </View>
        <SearchBar />
        <View style={{ marginTop: 10 }}>
          <TouchableOpacity
            onPress={() => props.navigation.navigate("UsersListPlace")}
          >
            <ListContainer
              id={id}
              title={title}
              place={place}
              location={location}
              code={code}
              img={img}
            />
          </TouchableOpacity>

          {userData && (
            <FlatList
              data={userData}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.ListOfUsers}
                  onPress={() => {
                    props.navigation.navigate("ChatUser", {
                      currentUserId: currentUserId,
                      messageId: item.id,
                      name: item.name,
                      gender: item.gender,
                      messageImg: item.userImg,
                    });
                  }}
                >
                  <UserChatInfo
                    id={item.id}
                    name={item.name}
                    gender={item.gender}
                    userImg={item.userImg}
                  />
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default UsersListPlace;

const styles = StyleSheet.create({
  linearGradient: { flex: 1 },
  ListOfUsers: {},
});
