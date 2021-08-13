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
import LocationTab from "../../component/LocationTab";
import TopBar from "../../component/TopBar";
import ListContainer from "./../../component/ListContainer";
import SearchBar from "./../../component/SearchBar";
import { auth, firestore } from "../../db/firebase";
import { getDistance } from 'geolib';

// linear-gradient(0deg, #FFFFFF 0%, #FFC1DD 78.9%)

const data = [
  {
    id: "213213",
    title: "LE PERCHOIR DE L’EST",
    place: "10 place Paris",
    location: "Ouverte 18h",
    code: "01.98.97.96.95",
    img: require("./../../assets/images/description.png"),
  },
  {
    id: "2132131242",
    title: "Second",
    place: "Second place Paris",
    location: "Karachi 18h",
    code: "01.98.97.96.95",
    img: require("./../../assets/images/description.png"),
  },

  {
    id: "2132131247",
    title: "Second",
    place: "Second place Paris",
    location: "Karachi 18h",
    code: "01.98.97.96.95",
    img: require("./../../assets/images/description.png"),
  },

  {
    id: "2132131249",
    title: "Second",
    place: "Second place Paris",
    location: "Karachi 18h",
    code: "01.98.97.96.95",
    img: require("./../../assets/images/description.png"),
  },
];

const Drink = ({ navigation }) => {
  let [locationData, setLocationData] = useState([]);
  const [userMarker, setUserMarker] = useState({});

  
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        var uid = user.uid;
        // console.log(uid)
        firestore.collection("users").doc(uid)
          .onSnapshot(async (doc) => {

            let docs = {
              key: user.uid,
              title: doc.data().userName,
              latlng: {
                longitude: doc.data().longitude,
                latitude: doc.data().latitude,
              },
            }

            await setUserMarker(docs)
            // console.log(docs)

          })

      } else {
        // User is signed out
        // ...
      }
    });
  }, [])

  useEffect(async () => {
    firestore.collection("location").onSnapshot(async (querySnapshot) => {
      let docs = querySnapshot.docs.map((doc) => ({
        key: doc.id,
        title: doc.data().title,
        address: doc.data().address,
        description: doc.data().description,
        schedules: doc.data().schedules,
        img: doc.data().photo,
        latlng: {
          longitude: doc.data().longitude,
          latitude: doc.data().latitude,
        },
      }));

      // setLocationData(docs);
      // console.log(docs);

      // if (userMarker.length) {
      var data = [];
      for (var i = 0; i < docs.length; i++) {
        var dis = await getDistance(
          userMarker.latlng,
          docs[i].latlng,
        )

        dis = dis / 1000

        // console.log(dis)

        if (dis < 10000) {
          data.push(docs[i])
        }

      }
      setLocationData(data);
      // console.log(data);
      // }
    });

  }, [userMarker]);

  // console.log(locationData);
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
          {/* {locationData && (
            <FlatList
              data={data}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("UsersListPlace", {
                      id: item.id,
                      title: item.title,
                      place: item.place,
                      location: item.location,
                      code: item.code,
                      img: item.img,
                    })
                  }
                >
                  <ListContainer
                    title={item.title}
                    place={item.place}
                    location={item.location}
                    code={item.code}
                    img={item.img}
                  />
                </TouchableOpacity>
              )}
            />
          )} */}
          {locationData && (
            <FlatList
              data={locationData}
              keyExtractor={(item) => item.key}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("UsersListPlace", {
                      id: item.key,
                      title: item.title,
                      place: item.address,
                      location: item.description,
                      code: item.schedules,
                      img: item.photo,
                      latlng : item.latlng
                    })
                  }
                >
                  <ListContainer
                    title={item.title}
                    place={item.address}
                    location={item.description}
                    code={item.schedules}
                    img={item.photo}
                    navigation={navigation}
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

export default Drink;

const styles = StyleSheet.create({
  linearGradient: { flex: 1 },
});
