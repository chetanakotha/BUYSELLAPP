import { ScrollView, StyleSheet, Text, View } from "react-native";
import {useEffect, useState} from "react";
import {Stack, useRouter} from "expo-router";
import Button from "../../components/button";
import Input from "../../components/input";
import { getAuth, signOut } from "firebase/auth";
import { getUser, getCityName } from "../../controller/dao";

const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export default function Profile() {
    const router = useRouter();
    const auth = getAuth();
    const [user, setUser] = useState(null);
    const [city, setCity] = useState(null);

    const getInitials = (name) => {
        const nameArr = name?.split(" ");
        if (nameArr?.length === 1) {
            return nameArr[0].charAt(0);
        } else if (nameArr?.length === 2) {
            return nameArr[0].charAt(0) + nameArr[1].charAt(0);
        }
    };

    useEffect(() => {
        getUser(auth)
            .then((user) => {
                setUser(user);

                getCityName(user.address).then((city) => {
                    setCity(city);
                });
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                router.push("/login");
            })
            .catch((error) => {
                console.error(error);
            });
    }

    return (
        <>
            <Stack.Screen
                options={{
                    title: "Profile",
                }
                }
            />
            <ScrollView
                contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-end", backgroundColor: '#fff' }}
            >
                <View style={styles.container}>
                    <View style={{ width: 95, height: 95, alignItems: 'center', justifyContent: 'center', backgroundColor: '#D9D9D9', borderRadius: 50 }}>
                        <Text style={{fontWeight: 'bold', fontSize: 31, color: '#000'}}>
                            {getInitials(user?.name)}
                        </Text>
                    </View>
                    <View style={{ marginTop: 69, width: "100%" }}>
                        <View style={{ marginBottom: 20 }}>
                            <Input
                                placeholder="update your name"
                                label="Name"
                                val={user?.name}
                                disabled
                            />
                        </View>
                        <View style={{ marginBottom: 20 }}>
                            <Input
                                placeholder="update your email"
                                label="Email"
                                val={user?.email}
                                disabled
                            />
                        </View>
                        <View style={{ marginBottom: 20 }}>
                            <Input
                                placeholder="update your address"
                                label="Address"
                                val={city}
                                disabled
                            />
                        </View>
                    </View>
                    <View
                        style={{
                            marginTop: 72,
                            alignItems: "center",
                            justifyContent: "center",
                            width: "100%",
                        }}
                    >
                        <Button
                            onPress={handleLogout}
                            title="Logout"
                            icon={{ name: "logout", color: "#fff" }}
                            extraStyle={{
                                btn: { backgroundColor: "#FF4949" },
                                text: { color: "#fff" },
                            }}
                        />
                    </View>
                </View>
            </ScrollView>
        </>
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
    errorText: {
        color: "red",
        fontSize: 12,
    },
});
