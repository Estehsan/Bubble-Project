import React from "react";
import { Image, SafeAreaView, StyleSheet, Text, View, ScrollView, TouchableOpacity } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Colors from "../../../assets/colors/Colors";
import H1 from "../../../component/basic/H1";
import H2 from "../../../component/basic/H2";
import P from "../../../component/basic/P";
import TopBar from "../../../component/TopBar";
import { webBrowser } from '../../../helpers/webBrowser'

const PlacesDetails = ({ route }) => {


  
  const { id, title, place, location, code, img, link, latlng, qrimage } =
    route.params;
  return (
    <LinearGradient
      colors={ ["#FFC1DD", "#FFE5F1"] }
      style={styles.linearGradient}>
      <SafeAreaView>
        <View style={{ 
          height: "100%",
          paddingBottom: 120
         }}>

          <View style={{ 
            marginTop: 10,
            marginBottom: 30
           }}>
            <TopBar/>
          </View>

          <ScrollView style={styles.Data}>
            
            {img ? (
              <View style={{ 
                display: "flex",
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <Image
                  style={{
                    height: 200,
                    width: "90%",
                    borderWidth: 1,
                    borderColor: "white",  
                    borderRadius: 5
                  }}
                  source={{ uri: img }}
                />
              </View>
            ) : (<View></View>)}
            

            <Text style={styles.Heading}>{title}</Text>
            {/* <H2>{place}</H2> */}

            <View style={{ 
              display: "flex",
              justifyContent: 'flex-start',
              // alignItems: 'center',
              paddingHorizontal: 20,
              marginTop: 15
             }}>
              <P style={{fontSize: 16, color: "black",}}>
                {place}
              </P>
            </View>

            <View style={{ 
              display: "flex",
              justifyContent: 'flex-start',
              // alignItems: 'center',
              paddingHorizontal: 20,
              marginTop: 10
             }}>
              <H2 style={{
                color: "black",
                fontSize: 16,
                textAlign: "left",
                fontFamily: "FredokaOne-Regular",
              }}>{code}</H2>
            </View>

            <TouchableOpacity onPress={() => {
                webBrowser(link)
             }}>
              <View style={{ 
                display: "flex",
                justifyContent: 'flex-start',
                // alignItems: 'center',
                paddingHorizontal: 20,
                marginTop: 20
              }}>
                <Text style={{ 
                  color: Colors.blue,
                  fontFamily: "FredokaOne-Regular",
                  fontSize: 16
                }}>{link}</Text>
              </View>
            </TouchableOpacity>

            <View style={{ 
              display: "flex",
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 20,
              marginTop: 20
             }}>
              <Text style={{ 
                color: "black",
                fontFamily: "FredokaOne-Regular",
                fontSize: 16
              }}>{location}</Text>
            </View>

          </ScrollView>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default PlacesDetails;

const styles = StyleSheet.create({
  linearGradient: { flex: 1 },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  Data: {
    // justifyContent: "center",
    // alignItems: "center",
    //alignContent: "center",
    height: "100%",
    
  },
  Heading: {
    fontFamily: "FredokaOne-Regular",
    fontSize: 35,
    flexWrap: "wrap",
    marginTop: 20,
    color:"black",
    textAlign: "left",
    paddingHorizontal: 20,
  },
});
