import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import Colors from "./../assets/colors/Colors";
import Entypo from "react-native-vector-icons/Entypo";
import Ionicons from "react-native-vector-icons/Ionicons";

const ChatList = ({ id, name, userImg }) => {
    return (
        <View style={styles.Container}>
            <View style={styles.main}>
                <View style={styles.lContainer}>
                    <View>
                        {userImg ? (
                            <Image
                                style={{ height: 50, width: 50, borderRadius: 50 }}
                                source={{ uri: userImg }}
                            />
                        ) : (
                            <Image
                                style={{ height: 50, width: 50, borderRadius: 50 }}
                                source={{
                                    uri: "https://www.w3schools.com/howto/img_avatar.png",
                                }}
                            />
                        )}
                    </View>
                    <View style={styles.HeadingView}>
                        <Text style={styles.heading}>{name}</Text>
                    </View>
                </View>

                <View style={styles.rContainer}>
                    <View style={styles.btn}>
                        <Text>Content</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default ChatList;

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
        height: 70,
        borderRadius: 100,
        justifyContent: "space-between",
        display: "flex",
        alignContent: "center",
        alignItems: "center",
        flexDirection: "row",
    },
    btn: {
        paddingHorizontal: 19,
        paddingVertical: 8,
        backgroundColor: Colors.background,
        justifyContent: "center",
        borderRadius: 60,
        alignItems: "center",
    },
    headng: {
        fontFamily: "FredokaOne-Bold",
        fontSize: 40,
        fontWeight: "bold",
    },
    lContainer: { display: "flex", flexDirection: "row" },
    HeadingView: {
        justifyContent: "center",
        paddingHorizontal: 30,
    },
});