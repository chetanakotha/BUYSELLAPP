import {ScrollView, StyleSheet, View} from "react-native";
import {useState} from "react";
import {Image} from "expo-image";
import {useRouter} from "expo-router";
import Button from "./components/button";
import Title from "./components/title";
import Paragraph from "./components/paragraph";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import {db} from "../firebaseConfig";

const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export default function Success() {
    const [user, setUser] = useState(null);
    const router = useRouter();
    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {
        if (user) {
            // get user data from firestore
            db.collection("users")
                .doc(user.uid)
                .get()
                .then((doc) => {
                    if (doc.exists) {
                        setUser(doc.data());
                    } else {
                        // doc.data() will be undefined in this case
                        console.log("No such document!");
                    }
                });
        } else {
            setUser(null);
        }
    });

    const handlePush = () => {

        if (user?.role === "vendor") {
            router.push({pathname: 'purchases'});
        } else {
            router.push({pathname: 'products'});
        }
    }

    return (
        <ScrollView
            contentContainerStyle={{flexGrow: 1, justifyContent: "flex-end"}}
        >
            <View style={styles.container}>
                <Image
                    source={require(`./assets/success.svg`)}
                    placeholder={blurhash}
                    contentFit="cover"
                    transition={1000}
                    style={{width: 151, height: 113}}
                />
                <Title
                    text="Successful!"
                    extraStyles={{
                        marginTop: 9,
                        fontSize: 20,
                        textAlign: "center",
                    }}
                />
                <Paragraph
                    text="You have successfully registered in out app happy shopping!"
                    extraStyles={{marginTop: 9, textAlign: "center", maxWidth: 290}}
                />
                <View
                    style={{
                        marginTop: 140,
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                    }}
                >
                    <Button
                        onPress={handlePush}
                        title="Start shopping"
                        icon={{name: "shoppingcart", color: "#000"}}
                        extraStyle={{
                            btn: {
                                backgroundColor: "#fff",
                                borderColor: "#000",
                                borderWidth: 1,
                                borderStyle: "solid",
                            },
                            text: {color: "#000"},
                        }}
                    />
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        padding: 25,
        backgroundColor: "#fff",
        marginBottom: 57,
    },
});
