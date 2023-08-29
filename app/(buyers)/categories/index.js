import {ScrollView, StyleSheet, TouchableOpacity, View} from "react-native";
import {useEffect, useState} from "react";
import { Image } from "expo-image";
import { useRouter, Stack } from "expo-router";
import Title from "../../components/title";
import { getAuth } from "firebase/auth";
import { getUser, getCategories, getCityName } from "../../controller/dao";
import TopBar from "../../components/topbar";

const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export default function Categories() {
    const router = useRouter();

    const auth = getAuth();
    const [user, setUser] = useState(null);
    const [categories, setCategories] = useState([]);
    const [city, setCity] = useState(null);

    useEffect(() => {
        getUser(auth)
            .then(async (user) => {
                setUser(user);

                await getCategories().then((categoriesList) => {
                    setCategories(categoriesList);
                });

                await getCityName(user?.address).then((cityName) => {
                    setCity(cityName);
                });
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);
    return (
        <>
            <Stack.Screen
                options={
                    {
                        title: `${city} city`,
                    }
                }
            />
            <ScrollView
                contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-start", backgroundColor: '#fff' }}
            >
                <View style={styles.container}>
                    <TopBar name={user?.name} />
                    <View
                        style={{
                            marginTop: 21,
                            width: "100%",
                            gap: 17,
                            alignItems: "center",
                        }}
                    >
                        {categories && categories.map((category, index) => {
                            if(index % 2 === 0) {
                                return (
                                    <TouchableOpacity
                                        key={category?.id}
                                        style={{
                                            width: "100%",
                                            paddingVertical: 10,
                                            paddingHorizontal: 30,
                                            backgroundColor: `${category?.color}`,
                                            borderRadius: 10,
                                            flexDirection: "row",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            borderColor: '#f2f2f2',
                                            borderStyle: 'solid',
                                            borderWidth: 1,
                                        }}
                                        onPress={() => router.push({ pathname: "/categories/view", params: { id: category?.id,  name: category?.name } })}
                                    >
                                        <View>
                                            <Title text={category?.name} extraStyles={{ fontSize: 18, textTransform: 'capitalize' }} />
                                        </View>
                                        <Image
                                            source={{ uri: category?.image }}
                                            placeholder={blurhash}
                                            contentFit="cover"
                                            transition={1000}
                                            style={{ width: 81, height: 81 }}
                                        />
                                    </TouchableOpacity>
                                );
                            }else{
                                return (
                                    <TouchableOpacity
                                        key={category?.id}
                                        style={{
                                            width: "100%",
                                            paddingVertical: 10,
                                            paddingHorizontal: 30,
                                            backgroundColor: `${category?.color}`,
                                            borderRadius: 10,
                                            flexDirection: "row",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                        }}
                                        onPress={() => router.push({ pathname: "/categories/view", params: { id: category?.id, name: category?.name } })}
                                    >
                                        <Image
                                            source={{ uri: category?.image }}
                                            placeholder={blurhash}
                                            contentFit="cover"
                                            transition={1000}
                                            style={{ width: 81, height: 81 }}
                                        />
                                        <View>
                                            <Title text={category?.name} extraStyles={{ fontSize: 18, textTransform: 'capitalize' }} />
                                        </View>
                                    </TouchableOpacity>
                                )
                            }
                        })}
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
});
