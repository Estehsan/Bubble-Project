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
  StatusBar,
  Alert,
} from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { getDistance } from "geolib";

import Colors from "../../assets/colors/Colors";
import MapCorousel from "../../component/MapCorousel";
import LocationTab from "../../component/LocationTab";
import TopBar from "../../component/TopBar";
import LinearGradient from "react-native-linear-gradient";
import Geolocation from "@react-native-community/geolocation";
import { auth, firestore } from "../../db/firebase";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Entypo from "react-native-vector-icons/Entypo";

import MapStyleNight from "./MapStyles/MapStyleNight";
import MapStyleDay from "./MapStyles/MapStyleDay";

import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { distanceGPS } from "./../../helpers/distanceGPS";
import { distanceGPSReverse } from "./../../helpers/distanceGPSReverse";


// import haversine from "haversine";

const { width, height } = Dimensions.get("window");

const SCREEN_HEIGHT = height;
const SCREEN_WIDTH = width;
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const Home = ({ ...props }) => {
  const [marker, setMarker] = useState([]);
  const [selectedPlaceId, setSelectedPlaceId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [kilo, setKilo] = useState(true);
  const [light, setLight] = useState(true);
  const [load, setLoad] = useState(0);
  const [value, setValue] = useState(0); // integer state
  const [currentUser, setCurrentUser] = useState(null); // integer state

  const [userMarker, setUserMarker] = useState({
    // latlng: {
    //   latitude: parseFloat(0),
    //   longitude: parseFloat(0),
    //   latitudeDelta: 0.0922,
    //   longitudeDelta: 0.0421,
    // },
  });

  const mapRef = useRef(null);
  const width = useWindowDimensions().width;

  const flatlist = useRef();



  // Geolocation interval
  
function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Se souvenir de la dernière fonction de rappel.
  useEffect(() => {
    savedCallback.current = callback;
  });

  // Configurer l’intervalle.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

  useInterval(() => {
    let location = Geolocation.getCurrentPosition(
      async (position) => {
        var lat = parseFloat(position.coords.latitude);
        var long = parseFloat(position.coords.longitude);

        if(lat && long) {
          
          setUserMarker({
            latlng: {
              latitude: lat,
              longitude: long,
              latitudeDelta: 0,
              longitudeDelta: 0
            }
          })  

          firestore
            .collection("users")
            .doc(currentUser.uid)
            .update({
              latitude: lat,
              longitude: long,
              last_activity: new Date()
            })
            .then(() => {
              //console.log("HOME: Document successfully written !");
            })
            .catch((error) => {
              console.error("Error writing document: ", error);
            });
        }
      },
      (error) => console.log(error),
      { enableHighAccuracy: false, timeout: 5000 }
    );
  }, 10000);
  
  // END Geolocation interval

  useEffect(async () => {
    let isMounted = true;
    var subscribe;

    if (isMounted)
      await auth.onAuthStateChanged(async (user) => {
        if (user) {

          console.log('AUTH STATE CHANGED')

          const latitudeDelta = 0.1522;
          const longitudeDelta = 0.0921;

          setCurrentUser(user)
          var uid = user.uid;
          console.log("USER UID: ", uid)
          subscribe = await firestore
            .collection("users")
            .doc(uid)

          let doc = await subscribe.get()
          console.log('DOC USER: ', doc)
          if (doc.exists) {
            var docs = undefined
              ? {}
              : {
                  key: user.uid,
                  title: doc.data().userName,
                  latlng: undefined
                    ? {}
                    : {
                        longitude: parseFloat(doc.data().longitude),
                        latitude: parseFloat(doc.data().latitude),
                        latitudeDelta: latitudeDelta,
                        longitudeDelta: longitudeDelta,
                      },
                };
          }

          

          let location = Geolocation.getCurrentPosition(
            async (position) => {
              var lat = parseFloat(position.coords.latitude);
              var long = parseFloat(position.coords.longitude);

              var initialRegion = await {
                latlng: {
                  latitude: lat && lat,
                  longitude: long && long,
                  latitudeDelta: latitudeDelta,
                  longitudeDelta: longitudeDelta,
                },
              };
              // console.log("initial region=> ", initialRegion.latlng.latitude)
              // console.log("docs=> ", docs.latlng.latitude)

              if (
                docs.latlng.latitude != initialRegion.latlng.latitude ||
                docs.latlng.longitude != initialRegion.latlng.longitude
              ) {
                if (initialRegion) {
                  setUserMarker(initialRegion);
                }
                firestore
                  .collection("users")
                  .doc(uid)
                  .update({
                    latitude: initialRegion.latlng.latitude,
                    longitude: initialRegion.latlng.longitude,
                    last_activity: new Date()
                  })
                  .then(() => {
                    //console.log("HOME: Document successfully written !");
                  })
                  .catch((error) => {
                    console.error("Error writing document: ", error);
                  });
              } else {
                if (docs) {
                  setUserMarker(docs);
                  firestore
                    .collection("users")
                    .doc(uid)
                    .update({
                      last_activity: new Date()
                    })
                }
              }
            },
            (error) => console.log(error),
            { enableHighAccuracy: false, timeout: 5000 }
          );


            
        } else {
          // User is signed out
          // ...
        }
      });

    if (!selectedPlaceId || !flatlist) {
      return;
    }
    const index = marker.findIndex((marker) => marker.key == selectedPlaceId);
    flatlist.current.scrollToIndex({ index });

    return () => {
      isMounted = false;
      subscribe();
    };
  }, [selectedPlaceId, kilo, light]);

  useEffect(async () => {


    let isMounted = true;

    var subscribeLoc;

    if (isMounted) {
      let distance = 1;
      if (kilo === true) {
        distance = 10;
      }

      const maxLat = distanceGPSReverse(userMarker.latlng.latitude, userMarker.latlng.longitude, 0, distance).lat;
      const minLat = distanceGPSReverse(userMarker.latlng.latitude, userMarker.latlng.longitude, 180, distance).lat;
      const maxLng = distanceGPSReverse(userMarker.latlng.latitude, userMarker.latlng.longitude, 90, distance).lng;
      const minLng = distanceGPSReverse(userMarker.latlng.latitude, userMarker.latlng.longitude, 270, distance).lng;

      // console.log("Minimum latitude: ", minLat)
      // console.log("Maximum latitude: ", maxLat)
      // console.log("Minimum longitude: ", minLng)
      // console.log("Maximum longitude: ", maxLng)

      subscribeLoc = await firestore
        .collection("location")
        .where('latitude', '<=', maxLat)
        .where('latitude', '>=', minLat)
        // .where('longitude', '<=', maxLng)
        // .where('longitude', '>=', minLng)
        .limit(50)
        .onSnapshot(async (querySnapshot) => {
          var docs = await querySnapshot.docs.map((doc) => ({
            key: doc.id,
            title: doc.data().title,
            address: doc.data().address,
            description: doc.data().description,
            schedules: doc.data().schedules,
            img: doc.data().photo,
            open_type: doc.data().open_type,
            link: doc.data().link,
            latlng: {
              longitude: doc.data().longitude,
              latitude: doc.data().latitude,
            },
          }));

          let latitudeDelta;
          let longitudeDelta;
          

          // 24.93986404097375, 67.04325282594995
          if (docs.length > 0) {
            var data = [];

            if (kilo === true) {
              latitudeDelta = 0.1522;
              longitudeDelta = 0.0921;

              for (var i in docs) {
                
                if(light && docs[i].open_type != "night"){
                  break;
                }
                if(!light && docs[i].open_type != "day"){
                  break;
                }

                var dis = getDistance(userMarker.latlng, docs[i].latlng);

                dis = dis / 1000;

                // console.log(dis)
                if (dis < 10) {
                  data.push(docs[i]);
                  // console.log(data)
                }
              }
            } else {
              latitudeDelta = 0.015;
              longitudeDelta = 0.0071;
              
              for (var i = 0; i < docs.length; i++) {

                if(light && docs[i].open_type != "night"){
                  break;
                }

                var dis = getDistance(userMarker.latlng, docs[i].latlng);

                dis = dis / 1000;

                // console.log(dis)
                if (dis < 1) {
                  data.push(docs[i]);
                }
              }
            }

            const region = {
              latitude: userMarker.latlng.latitude,
              longitude: userMarker.latlng.longitude,
              latitudeDelta: latitudeDelta,
              longitudeDelta: longitudeDelta
            };
            mapRef.current.animateToRegion(region);

            if (data) {
              await setMarker(data);
              // console.log(marker)
              setLoading(false);
            }
          }
        });
    }

    return () => {
      subscribeLoc();
      isMounted = false;
    };
  }, [userMarker]);

  function useForceUpdate() {
    return () => setValue((value) => value + 1); // update the state to force render
  }

  return (
    <LinearGradient
      colors={ ["#000", "#DD488C"] }
      style={styles.linearGradient}>
      <SafeAreaView style={styles.main}>
        <View style={{ 
          marginTop: 10
         }}>
          <TopBar>
          </TopBar>
          <TouchableOpacity onPress={() => props.navigation.navigate("Scan")} style={{ 
              position: 'absolute',
              zIndex: 9,
              top: 30,
              right: 30,
            }}>
              <MaterialCommunityIcons name="qrcode-scan" size={35} color={Colors.darkPink} />
            </TouchableOpacity>
        </View>

        <View style={{ marginTop: 30 }}>
          {userMarker != null && userMarker != undefined && userMarker.latlng && (
            <LocationTab
              ChangeKilo={(e) => setKilo(e)}
              ChangeLight={(e) => setLight(e)}
            />
          )}
          
        </View>

        {userMarker != null && userMarker != undefined && userMarker.latlng && (
          <View style={styles.map}>
            <StatusBar barStyle="dark-content" />
            <MapView
            pitchEnabled={false} rotateEnabled={false} zoomEnabled={false} scrollEnabled={false}
              customMapStyle={light ? MapStyleNight : MapStyleDay}
              style={styles.mapContainer}
              provider={PROVIDER_GOOGLE}
              initialRegion={userMarker.latlng}
              showsUserLocation={true}
              ref={mapRef}
              >
              {marker.length > 0 ? (
                marker.map((marker, key) => (
                  <Marker
                    
                    key={key}
                    coordinate={marker.latlng}
                    //title={marker.title}
                    //description={marker.description}
                    onPress={() => setSelectedPlaceId(marker.key)}>
                    <Image source={require('../../assets/images/marker.png')} style={{height: 50, width:35 }} />
                  </Marker>
                ))
              ) : (
                <View />
              )}
              {/* {<Marker
                zIndex={9999}
                coordinate={userMarker.latlng}
                image={require('../../assets/images/marker_user.png')}
              ></Marker>
              } */}
            </MapView>
          </View>
        )}
        {loading ? (
          <ActivityIndicator
            //visibility of Overlay Loading Spinner
            visible={loading}
            //Text with the Spinner
            textContent={"Loading..."}
            //Text style of the Spinner Text
            textStyle={styles.spinnerTextStyle}
          />
        ) : marker.length > 0 ? (
          <View style={styles.Corousel}>
            <FlatList
              ref={flatlist}
              data={marker}
              showsHorizontalScrollIndicator={false}
              snapToInterval={width - 60}
              horizontal
              keyExtractor={(item) => item.key}
              snapToAlignment={"center"}
              decelerationRate={"fast"}
              renderItem={({ item }) => (
                <MapCorousel
                  id={item.key}
                  title={item.title}
                  place={item.description}
                  location={item.address}
                  code={item.code}
                  link={item.link}
                  img={item.img}
                  latlng={item.latlng}
                  schedules={item.schedules}
                />
              )}
            />
          </View>
        ) : (
          <View style={styles.Corousel}>
            <View style={{ justifyContent: "center" }}>
              <Text style={{ alignSelf: "center", fontSize: 20 }}>
                Aucune Bubble à proximité
              </Text>
            </View>
          </View>
        )}
      </SafeAreaView>
    </LinearGradient>
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
  map: {
    flex: 4,
    marginTop: 30,
    marginBottom: 10,
    alignSelf: "center",
    width: "90%",
    height: "100%",
    borderWidth: 0,
    borderRadius: 15,
    overflow: "hidden",
    
  },
  mapContainer: {
    alignSelf: "center",
    flex: 4,
    width: "100%",
    height: "100%",
    // marginHorizontal: 15,
    borderRadius: 40,
    // zIndex: 1,
    // elevation: 1,
    ...Colors.customShadow,
  },
  Corousel: {
    // position: "absolute",
    flex: 2,
    // bottom: 110,
    zIndex: 1,
    elevation: 1,
    marginBottom: 90,
    marginLeft: "10%",
  },
});
