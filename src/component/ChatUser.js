import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    TextInput,
    FlatList,
    Image,
    Alert,
    TouchableOpacity,
    Button,
    ScrollView,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import LocationTab from "./LocationTab";
import TopBar from "./TopBar";
import ListContainer from "./ListContainer";
import SearchBar from "./SearchBar";
import { auth, firestore } from "../db/firebase"
import firebase from "firebase/app"
import { set } from "react-native-reanimated";

// linear-gradient(0deg, #FFFFFF 0%, #FFC1DD 78.9%)
const ChatUser = ({ route, ...props }) => {


    const { currentUserId, messageId, name, gender, messageImg } = route.params
    // let [chatUser, setChatUser] = useState({})
    let [chats, setChats] = useState([])
    let [message, setMessage] = useState("")

    let [currentName, setcurrentName] = useState("")
    let [currentGender, setcurrentGender] = useState("")
    let [currentImage, setcurrentImage] = useState("")


    let [request, setRequest] = useState("")
    let [getRequest, setGetRequest] = useState("")
    let [checker, setChecker] = useState(false)


    useEffect(async () => {
        let merge = uid_merge(currentUserId, messageId)
        get_messages(merge)

        console.log(messageImg)
        let datum = await firestore.collection("users").doc(currentUserId).get().then((doc) => {
            setcurrentName(doc.data().userName)
            setcurrentGender(doc.data().userGender)
            setcurrentImage(doc.data().userProfileImageUrl)
            console.log(doc.data().userProfileImageUrl)
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });

        let dataMessenger = await firestore.collection("users").doc(messageId).collection("friends").doc(currentUserId).get()
            .then((doc) => {
                setGetRequest(doc.data().status)
                // console.log(doc.data())
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });

        let dataUser = await firestore.collection("users").doc(currentUserId).collection("friends").doc(messageId).get()
            .then(async (doc) => {
                await setRequest(doc.data().status)
                await setChecker(doc.data().requestGetter)
                console.log(doc.data())

            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });
        console.log(checker)

    }, [])


    let uid_merge = (uid1, uid2) => {
        if (uid1 < uid2) {
            // console.log(uid1 + uid2)
            return uid1 + uid2
        }
        else {
            // console.log(uid2 + uid1)
            return uid2 + uid1
        }
    }

    let get_messages = (uid) => {
        firestore.collection("message").doc(uid).collection(`chat`).orderBy("createdAt").onSnapshot((querySnapshot) => {

            let docs = querySnapshot.docs.map((doc) => (
                {
                    id: doc.id,
                    userid: doc.data().id,
                    message: doc.data().message

                }));
            {
                docs &&
                    setChats(docs)
                // console.log(docs)
            }
            // console.log(docs)
        });
    }

    let send_message = () => {

        if (message.length > 0) {
            let merge = uid_merge(currentUserId, messageId)

            firestore.collection(`message`).doc(merge).collection(`chat`).add({
                message: message,
                id: currentUserId,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            })
            setMessage("")
        }
    }
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
            </SafeAreaView>

            {route.params ?
                <ScrollView style={{ marginTop: 15 }}>

                    {chats &&

                        // console.log(chats)
                        <FlatList
                            data={chats}
                            keyExtractor={(item) => { item.id }}
                            renderItem={({ item }) => (
                                // console.log(item)
                                <View style={{ flex: 1, padding: 10, backgroundColor: "white", margin: 10 }}>
                                    {item.userid == currentUserId ? <Text style={{ color: "red", alignSelf: "flex-end", direction: "rtl" }}>{item.message}</Text>
                                        :
                                        <>
                                            <Image style={{ height: 20, width: 20, borderRadius: 20, marginRight: 5 }} source={{ uri: messageImg }} />
                                            <Text style={{ color: "blue", backgroundColor: "white" }}>{item.message}</Text>
                                        </>
                                    }
                                </View>

                            )}
                        />
                    }

                    {
                        (request == "") &&
                        <View>
                            <Button title="Send Friend Request"
                                onPress={() => {
                                    firestore.collection("users").doc(messageId).collection("friends").doc(currentUserId).set({
                                        friendId: currentUserId,
                                        status: "pending",
                                        requestGetter: true,
                                        name : currentName,
                                        gender : currentGender,
                                        image : currentImage

                                    })

                                    firestore.collection("users").doc(currentUserId).collection("friends").doc(messageId).set({
                                        friendId: messageId,
                                        status: "accept",
                                        requestGetter: false,
                                        name : name,
                                        gender : gender,
                                        image : messageImg

                                    })
                                    setGetRequest("pending")
                                    setRequest("accept")
                                    Alert.alert("Request has been send")
                                }}
                            >
                            </Button>
                        </View>
                    }

                    {/* {
                        (request == "pending") &&
                        <View>
                            <Text>Request has been send</Text>
                        </View>
                    } */}


                    {
                        checker &&
                        <View>
                            <Button title="accept"
                                onPress={async () => {
                                    await firestore.collection("users").doc(currentUserId).collection("friends").doc(messageId).update({
                                        friendId: messageId,
                                        status: "accept",
                                        requestGetter: false,

                                    })
                                        .then(() => {
                                            setGetRequest("accept")
                                            setChecker(false)
                                        })

                                }}
                            >
                            </Button>

                            <Button title="decline"
                                onPress={() => {
                                    firestore.collection("users").doc(currentUserId).collection("friends").doc(messageId).update({
                                        friendId: messageId,
                                        status: "decline",
                                    })
                                    Alert.alert("user declined")
                                    setGetRequest("decline")

                                }}
                            >
                            </Button>
                        </View>
                    }

                    {
                        (getRequest != "decline" || request != "decline") ?
                            <View>
                                <TextInput
                                    style={{
                                        position: "fixed",
                                        bottom: 0
                                    }}
                                    style={styles.input}
                                    onChangeText={setMessage}
                                    value={message}
                                    placeholder="date de naissance"
                                    keyboardType="default"
                                />
                                <Button
                                    title="send"
                                    onPress={() => {
                                        send_message()
                                    }}
                                ></Button>
                            </View>

                            :

                            <Text>Request declined</Text>
                    }
                </ScrollView>
                : <View />}
        </LinearGradient>
    );
};

export default ChatUser;

const styles = StyleSheet.create({
    linearGradient: { flex: 1 },
    input: {
        width: "70%",
        borderRadius: 20,
        marginBottom: 19,
        height: 40,
        justifyContent: "space-between",
        paddingHorizontal: 60,
        backgroundColor: "#fff",
    },
});
