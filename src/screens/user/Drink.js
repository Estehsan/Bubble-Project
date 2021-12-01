import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  FlatList,
  ScrollView,
  TextInput,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import LocationTab from "../../component/LocationTab";
import TopBar from "../../component/TopBar";
import ListContainer from "./../../component/ListContainer";
import SearchBar from "./../../component/SearchBar";
import { auth, firestore } from "../../db/firebase";
import { getDistance } from "geolib";
import EvilIcons from "react-native-vector-icons/EvilIcons";

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
  let [locations, setLocations] = useState([]);

  const [userMarker, setUserMarker] = useState({});
  const [kilo, setKilo] = useState(true);
  const [light, setLight] = useState(true);
  const [city, setCity] = useState("");

  useEffect(() => {
    let isMounted = true;
    if (isMounted)
      auth.onAuthStateChanged((user) => {
        if (user) {
          var uid = user.uid;
          // console.log(uid)
          firestore
            .collection("users")
            .doc(uid)
            .onSnapshot(async (doc) => {
              let docs = {
                key: user.uid,
                title: doc.data().userName,
                // selectedTeams : doc.data().selectedTeams,
                latlng: {
                  longitude: doc.data().longitude,
                  latitude: doc.data().latitude,
                },
              };

              await setUserMarker(docs);
              // console.log(docs)
            });
        } else {
          // User is signed out
          // ...
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(async () => {
    let isMounted = true;

    if (isMounted)
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
        if (kilo === true) {
          for (var i = 0; i < docs.length; i++) {
            var dis = await getDistance(userMarker.latlng, docs[i].latlng);

            dis = dis / 1000;

            // console.log(dis)
            if (dis < 10) {
              data.push(docs[i]);
            }
          }
        } else {
          for (var i = 0; i < docs.length; i++) {
            var dis = await getDistance(userMarker.latlng, docs[i].latlng);

            dis = dis / 1000;

            // console.log(dis)
            if (dis < 1) {
              data.push(docs[i]);
            }
          }
        }

        setLocationData(data);
        setLocations(data)
        console.log(data);
        // }
      });

    return () => {
      isMounted = false;
    };
  }, [userMarker, kilo]);

  let handleSearchBar = (event) => {
    const searchText = event;
    if (locationData) {
      // Object.keys(accepted).map((val) => {
      //   console.log(accepted[val].name)
      // });
      let locations = locationData.filter((val) => {
        if(val.address != undefined && val.address){
          return (
            val.title
              .toString()
              .toLowerCase()
              .indexOf(searchText.toString().toLowerCase()) !== -1 ||
            val.address
              .toString()
              .toLowerCase()
              .indexOf(searchText.toString().toLowerCase()) !== -1
          );
        }
        else{
          return (
            val.title
              .toString()
              .toLowerCase()
              .indexOf(searchText.toString().toLowerCase()) !== -1
          );
        }
      });

      setLocations(locations)
      console.log(locations)
    }
  };

  // console.log(locationData);
  return (
    <LinearGradient
      colors={["#FFC1DD", "#ffffff"]}
      style={styles.linearGradient}>
      <ScrollView>
        <SafeAreaView>
          <View>
            <TopBar />
          </View>
          {/* <View style={{ marginTop: 30 }}>
            <LocationTab
              ChangeKilo={(e) => setKilo(e)}
              ChangeLight={(e) => setLight(e)}
            />
          </View> */}
          <View style={styles.searchIcon}>
            <TextInput
              placeholder="Rechercher"
              onChangeText={(e) => handleSearchBar(e)}
              // value={defaultSearchValue}
              style={styles.inputField}
            />
            <EvilIcons name="search" size={30} color={"#000"} />
          </View>

          <View style={{ marginTop: 10, paddingBottom: 100 }}>
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
            {locations && (
              <FlatList
                data={locations}
                keyExtractor={(item) => item.key}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {

                      navigation.navigate("PlacesDetails", {
                        id: item.key,
                        title: item.title,
                        place: item.address,
                        location: item.description,
                        code: item.schedules,
                        img: item.img,
                        latlng: item.latlng,
                      })

                      // navigation.navigate("UsersListPlace", {
                      //   id: item.key,
                      //   title: item.title,
                      //   place: item.address,
                      //   location: item.description,
                      //   code: item.schedules,
                      //   img: item.photo,
                      //   latlng: item.latlng,
                      // })
                    }
                    }>
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
      </ScrollView>
    </LinearGradient>
  );
};

export default Drink;

const styles = StyleSheet.create({
  linearGradient: { flex: 1 },
  inputField: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 15,
    color: "black",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 20,
  },
  searchIcon: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 30,
    alignItems: "center",
    alignItems: "center",
    width: "90%",
    paddingHorizontal: 20,
    marginHorizontal: "3%",
    height: 50,
    marginTop: 20,
  },
  inputField: {
    width: "90%",
    color: "black",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 20,
  },
});
