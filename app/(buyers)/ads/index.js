import {ScrollView, StyleSheet, View} from "react-native";
import {useEffect, useState} from "react";
import {Link, Stack, useRouter} from "expo-router";
import { getAuth } from "firebase/auth";
import {getUser, getAds} from "../../controller/dao";
import TopBar from "../../components/topbar";
import {Image} from "expo-image";

const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export default function Profile() {
    const router = useRouter();
    const auth = getAuth();
    const [user, setUser] = useState(null);
    const [ads, setAds] = useState([]);

    useEffect(() => {
        getUser(auth)
            .then((user) => {
                setUser(user);
            })
            .catch((error) => {
                console.error(error);
            });

        const fetchData = async () => {
            try {
                const adsList = await getAds();
                setAds(adsList);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    return (
        <>
            <Stack.Screen
                options={{
                    title: "Ads",
                }
                }
            />
            <ScrollView
                contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-start", backgroundColor: '#fff' }}
            >
                <View style={styles.container}>
                    <TopBar name={user?.name} onPress={() => router.push("/profile")} />

                    <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginTop: 20 }}>
                        {
                            ads.map((ad, index) => {
                                return (
                                    <Link key={index} href={ad.href} style={{ width: '45%', marginBottom: 20 }}>
                                        <Image
                                            source={{ uri: ad.image }}
                                            placeholder={blurhash}
                                            contentFit="cover"
                                            transition={1000}
                                            style={{ width: 155, height: 170, borderRadius: 15 }}
                                        />
                                    </Link>
                                )
                            })
                        }
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
