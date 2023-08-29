import { ScrollView, StyleSheet, View } from "react-native";
import { useEffect } from "react";
import { Image } from "expo-image";
import { Stack, useRouter } from "expo-router";
import { initDatabase } from "./model/db";
import Button from "./components/button";
import Title from "./components/title";

const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export default function Welcome() {
    const router = useRouter();

    useEffect(() => {
        initDatabase();
    }, []);

    const handleLogin = () => {
        router.push("/login");
    };

    const handleSignUp = () => {
        router.push("/register");
    };

    return (
        <>
            <Stack.Screen
                options={{
                    title: "Welcome",
                }}
            />
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
            >
                <View style={styles.container}>
                    <Image
                        source={require(`./assets/welcome.svg`)}
                        placeholder={blurhash}
                        contentFit="cover"
                        transition={1000}
                        style={styles.image}
                    />
                    <Title
                        text="Welcome To The USA’s Most Imaginative Online Marketplace"
                        extraStyles={styles.title}
                    />
                    <View
                        style={styles.buttonsContainer}
                    >
                        <Button
                            onPress={handleLogin}
                            title="Sign in"
                            icon={{ name: "login", color: "#fff" }}
                            extraStyle={styles.loginButton}
                        />
                        <Button
                            onPress={handleSignUp}
                            title="Sign up"
                            icon={{ name: "adduser", color: "#000" }}
                            extraStyle={styles.signupButton}
                        />
                    </View>
                </View>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: "flex-end"
    },
    container: {
        alignItems: "center",
        justifyContent: "center",
        padding: 25,
        backgroundColor: "#fff",
        marginBottom: 57,
    },
    image: {
        width: 234,
        height: 162,
    },
    title: {
        marginTop: 41,
        fontSize: 16,
        textAlign: "center",
        maxWidth: 230,
    },
    buttonsContainer: {
        marginTop: 140,
        flex: 1,
        gap: 15,
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
    },
    loginButton: {
        btn: { backgroundColor: "#000" },
        text: { color: "#fff" },
    },
    signupButton: {
        btn: {
            backgroundColor: "#fff",
            borderColor: "#000",
            borderWidth: 1,
            borderStyle: "solid",
        },
        text: { color: "#000" },
    },
});
