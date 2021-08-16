import React, { useState, useEffect, Component, useRef } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  PermissionsAndroid,
  Dimensions,
  Button,
  BackHandler,
  DeviceEventEmitter,
  ActivityIndicator,
  FlatList,
  useWindowDimensions,
} from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { getDistance } from 'geolib';

import Colors from "../../assets/colors/Colors";
import MapCorousel from "../../component/MapCorousel";
import LocationTab from "../../component/LocationTab";
import TopBar from "../../component/TopBar";
import LinearGradient from "react-native-linear-gradient";
import Geolocation from "@react-native-community/geolocation";
import { auth, firestore } from "../../db/firebase";
import Entypo from "react-native-vector-icons/Entypo";

import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

// import haversine from "haversine";

const { width, height } = Dimensions.get('window')

const SCREEN_HEIGHT = height
const SCREEN_WIDTH = width
const ASPECT_RATIO = width / height
const LATITUDE_DELTA = 0.0922
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO

const Home = (props) => {
  const [marker, setMarker] = useState([]);
  const [selectedPlaceId, setSelectedPlaceId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userMarker, setUserMarker] = useState(
    {
      latlng: {
        latitude: null,
        longitude: null,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },

    }
  );

  const width = useWindowDimensions().width;

  const flatlist = useRef();



  useEffect(() => {
    let isMounted = true;

    auth.onAuthStateChanged((user) => {
      if (user) {
        var uid = user.uid;
        // console.log(uid)
        firestore.collection("users").doc(uid)
          .onSnapshot(async (doc) => {

            var docs = {
              key: user.uid,
              title: doc.data().userName,
              latlng: {
                longitude: doc.data().longitude,
                latitude: doc.data().latitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              },
            }

            await setTimeout(() => {
              let location = Geolocation.getCurrentPosition((position) => {
                var lat = parseFloat(position.coords.latitude)
                var long = parseFloat(position.coords.longitude)

                var initialRegion = {
                  latlng: {
                    latitude: lat,
                    longitude: long,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  },
                }
                console.log("initial region=> ", initialRegion.latlng.latitude)
                console.log("docs=> ", docs.latlng.latitude)


                // var hos = {
                //   latitude: 24.931407349950064,
                //   longitude: 67.03798921789368,
                // }
                // var dis = getDistance(
                //   initialRegion.latlng,
                //   hos
                // )
                // dis = dis / 1000
                // console.log(dis, "Km")

                if (docs.latlng.latitude != initialRegion.latlng.latitude ||
                  docs.latlng.longitude != initialRegion.latlng.longitude) {
                  setUserMarker(initialRegion)

                  firestore.collection("users").doc(uid).update({
                   latitude : initialRegion.latlng.latitude,
                   longitude : initialRegion.latlng.longitude
                  })
                    .then(() => {
                      console.log("Document successfully written!");
                    })
                    .catch((error) => {
                      console.error("Error writing document: ", error);
                    });
                }
                else {
                  setUserMarker(docs)
                }
              },
                (error) => alert(JSON.stringify(error)),
                { enableHighAccuracy: false, timeout: 5000 });
            }, 1000)



          })

      } else {
        // User is signed out
        // ...
      }

    });

    firestore.collection("location").onSnapshot((querySnapshot) => {
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

      // 24.93986404097375, 67.04325282594995

      if (isMounted) {
        setMarker(docs);
        setLoading(false);
      }
    });


    if (!selectedPlaceId || !flatlist) {
      return;
    }
    const index = marker.findIndex((marker) => marker.key == selectedPlaceId);
    flatlist.current.scrollToIndex({ index });

    return () => { isMounted = false };
  }, [selectedPlaceId]);


  useEffect(() => {


  }, [])

  // console.log(marker);

  return (
    <LinearGradient
      colors={["#FFC1DD", "#ffffff"]}
      style={styles.linearGradient}
    >
      <SafeAreaView style={styles.main}>
        <TopBar />
        <View style={{ marginTop: 30 }}>
          <LocationTab />
        </View>

        {userMarker.latlng.latitude &&
          <MapView
            style={styles.mapContainer}
            provider={PROVIDER_GOOGLE}
            initialRegion={userMarker.latlng}
          >
            {marker.map((marker, key) => (
              <Marker
                key={key}
                coordinate={marker.latlng}
                title={marker.title}
                description={marker.description}
                onPress={() => setSelectedPlaceId(marker.key)}
              >
                <Entypo
                  color={marker.key == selectedPlaceId ? "black" : "red"}
                  name="drink"
                  size={40}
                />
              </Marker>
            ))}

            {userMarker &&
              <Marker
                coordinate={userMarker.latlng}
              >
              </Marker>
            }
          </MapView>
        }
        {loading ? (
          <ActivityIndicator
            //visibility of Overlay Loading Spinner
            visible={loading}
            //Text with the Spinner
            textContent={"Loading..."}
            //Text style of the Spinner Text
            textStyle={styles.spinnerTextStyle}
          />
        ) : (
          <View style={styles.Corousel}>
            <FlatList
              ref={flatlist}
              data={marker}
              showsHorizontalScrollIndicator={false}
              snapToInterval={width - 60}
              horizontal
              snapToAlignment={"center"}
              decelerationRate={"fast"}
              renderItem={({ item }) => (
                <MapCorousel
                  title={item.title}
                  place={item.description}
                  location={item.location}
                  code={item.code}
                />
              )}
            />
          </View>
        )}
      </SafeAreaView>
    </LinearGradient >
  );
};

export default Home;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    display: "flex",
  },
  linearGradient: { flex: 1 },
  container: {
    ...StyleSheet.absoluteFillObject,
    height: 400,
    width: 400,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    height: 400,
  },
  bubble: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.7)",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  latlng: {
    width: 200,
    alignItems: "stretch",
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: "center",
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    marginVertical: 20,
    backgroundColor: "transparent",
  },
  boldText: {
    fontSize: 25,
    color: "red",
    marginVertical: 16,
  },
  mapContainer: {
    alignItems: "center",
    flex: 4,
    marginBottom: 100,
    marginTop: 30,
    marginHorizontal: 15,
    borderRadius: 40,
    ...Colors.customShadow,
  },
  Corousel: {
    position: "absolute",
    bottom: 80,
  },
});
