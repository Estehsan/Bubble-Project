import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    Image,
    TextInput,
    TouchableOpacity,
    Button,
    ActivityIndicator,
} from "react-native";
import { auth } from '../../db/firebase';
import LinearGradient from "react-native-linear-gradient";
import TopBar from "./../../component/TopBar";
import InputF from './../../component/InputF'
import { emailValidator } from './../../helpers/emailValidator'
import { passwordValidator } from './../../helpers/passwordValidator'
import CustomModal from "../../component/basic/CustomModal";
import WP from './../../component/basic/WP'
import Modal from 'react-native-modal';


const Reset = ({ ...props }) => {
    const [email, setEmail] = useState({ value: '', error: '' });
    const [loading, setLoading] = useState(false);

    const [error, setError] = useState()
    const [isModalVisible, setModalVisible] = useState(false);




    const OnReset = () => {
        const emailError = emailValidator(email.value)

        if (emailError) {
            setEmail({ ...email, error: emailError })
        }

        if (email != "") {

            try {
                auth.sendPasswordResetEmail(email.value)
                    .then(() => {
                        setLoading(true)
                        props.navigation.replace("FlowB")
                        setLoading(false)
                        console.log(user)
                        // ...
                    })
                    .catch((error) => {
                        setLoading(true)

                        var errorCode = error.code;
                        var errorMessage = error.message;
                        setError(errorMessage)
                        setModalVisible(true)
                        setLoading(false)
                        console.log(error)
                        // ..
                    });
            }
            catch (error) {

                console.log(error)
            }

        }


    }

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };
    return (
        <LinearGradient colors={["#000", "#DD488C"]} style={styles.linearGradient}>
            <SafeAreaView style={styles.main}>

                <TopBar />
                <View style={styles.Profile}>
                    <Text style={styles.h1}>Mot de passe oublié </Text>
                </View>
                <View style={styles.Form}>


                    <InputF onChangeText={(e) => setEmail({ value: e, error: '' })}
                        value={email.value}
                        error={email.error}
                        errorText={email.error}
                        placeholder="pseudo"
                        keyboardType="default" />



                    <TouchableOpacity onPress={OnReset}>
                        < View style={styles.btnopacity}>


                            <Text style={styles.f}>Valider</Text>
                        </View>

                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => props.navigation.push('FlowB')}>
                        < View style={styles.btnopacity}>


                            <Text style={styles.f}>Retour</Text>
                        </View>

                    </TouchableOpacity>
                </View>
                {/* {error === null ?
          <Modal onBackdropPress={toggleModal} isVisible={isModalVisible}>
            <CustomModal title="Error" content={error} />
          </Modal> : <Text>hailo</Text>} */}

                <Modal onBackdropPress={toggleModal} isVisible={isModalVisible}>
                    <CustomModal title="Error" content={error} />
                </Modal>

            </SafeAreaView>
        </LinearGradient>
    )
}
export default Reset;

const styles = StyleSheet.create({
    main: {
        flex: 1,
        display: "flex",
    },
    h1: {
        fontFamily: "FredokaOne-Regular",

        color: "#fff",
        marginBottom: 15,
        fontSize: 30,
    },
    h2: {
        fontFamily: "FredokaOne-Regular",
        color: "#fff",
        fontSize: 50,
        opacity: 0.5,
    },
    Profile: { alignItems: "center", marginVertical: 30 },

    linearGradient: { flex: 1 },
    Form: {
        alignItems: "center",
    },
    input: {
        width: "70%",
        borderRadius: 20,
        marginBottom: 19,
        height: 40,
        justifyContent: "space-between",
        paddingHorizontal: 60,
        backgroundColor: "#fff",
        color: "black",
    },
    btn: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: "#fff",
        borderRadius: 10,
        marginVertical: 12,
    },
    btnopacity: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: "#fff",
        borderRadius: 10,
        marginVertical: 12,
        opacity: 0.5,
    },
    f: {
        fontFamily: "FredokaOne-Regular",
    },
})
