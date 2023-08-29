import { ScrollView, StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { useRouter, Stack} from "expo-router";
import { useEffect, useState } from "react";
import Title from "../../components/title";
import Paragraph from "../../components/paragraph";
import Badge from "../../components/badge";
import { getAuth } from "firebase/auth";
import {getUser, getFavoriteProducts, getProduct, deleteFavoriteProduct} from "../../controller/dao";

const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export default function Favorites() {
    const router = useRouter();
    const auth = getAuth();

    const [user, setUser] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await getUser(auth).then((user) => {
                    setUser(user);

                    getFavoriteProducts(user.id).then((requests) => {
                        setFavorites(requests);

                        requests.forEach((request) => {
                            getProduct(request.product_id).then((product) => {
                                setProducts((products) => [...products, product]);
                            });
                        });
                    });
                })
            } catch (error) {
                console.error(error);
            }
        }

        fetchData();
    }, [user]);

    const handleCancel = (id) => {
        deleteFavoriteProduct(id).then(() => {
            router.push("/favorites");
        });
    }

    return (
        <>
            <Stack.Screen
                options={{
                    title: "Favorite Products",
                }}
            />
            <ScrollView
                contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-start", backgroundColor: "#fff" }}
            >
                <View style={styles.container}>
                    <View
                        style={{
                            marginTop: 37,
                            width: "100%",
                            gap: 29,
                        }}
                    >
                        {
                            favorites ? favorites.map((favorite, index) => (
                                <View key={index} style={{ flexDirection: "row", alignItems: "center", gap: 10, borderBottomColor: '#eee', borderStyle: 'solid', borderBottomWidth: 1, paddingBottom: 13 }}>
                                    <Image
                                        source={{ uri: products[index]?.image }}
                                        placeholder={blurhash}
                                        contentFit="cover"
                                        transition={1000}
                                        style={{ width: 80, height: 81 }}
                                    />
                                    <View>
                                        <Title
                                            text={products[index]?.name}
                                            extraStyles={{
                                                fontSize: 16,
                                            }}
                                        />
                                        <Paragraph
                                            text={products[index]?.category_id}
                                        />
                                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: 'space-between' }}>
                                            <Title
                                                text={`$${products[index]?.price}`}
                                                extraStyles={{
                                                    marginTop: 10,
                                                    fontSize: 14,
                                                }}
                                            />
                                            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                                                <Badge
                                                    title="Remove"
                                                    extraStyles={{
                                                        badge: {
                                                            borderColor: "#ff0000",
                                                            backgroundColor: "#ff0000",
                                                        },
                                                        text: {
                                                            color: "#fff",
                                                        }
                                                    }}
                                                    onPress={() => handleCancel(favorite.id)}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            )) : <Paragraph text="No Favorites found" />
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
});
