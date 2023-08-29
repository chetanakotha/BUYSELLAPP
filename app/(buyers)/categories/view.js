import {Pressable, ScrollView, StyleSheet, TouchableOpacity, View} from "react-native";
import {useEffect, useState} from "react";
import { Image } from "expo-image";
import { useRouter, Stack, useSearchParams } from "expo-router";
import Title from "../../components/title";
import { getAuth } from "firebase/auth";
import { getUser, getProductsByCategory, addFavoriteProduct} from "../../controller/dao";
import TopBar from "../../components/topbar";
import Paragraph from "../../components/paragraph";
import {Feather} from "@expo/vector-icons";

const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export default function ViewCategory() {
    const { id, name } = useSearchParams();
    const router = useRouter();
    const auth = getAuth();

    const [user, setUser] = useState(null);
    const [products, setProducts] = useState([]);

    const handleFavorite = (id) => {
        addFavoriteProduct({
            product_id: id,
            user_id: user.id,
        }).then(() => {
            router.push("/favorites");
        });

    }

    useEffect(() => {
        getUser(auth)
            .then(async (user) => {
                setUser(user);

                const categoriesList = await getProductsByCategory(id, user.address);
                console.log(categoriesList)
                setProducts(categoriesList);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [id]);
    return (
        <>
            <Stack.Screen
                options={
                    {
                        title: `${name ? name : "Product Category"}`
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
                            width: "100%",
                            gap: 14,
                            flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginTop: 20
                        }}
                    >
                        {products && products.map((product) => (
                            <Pressable
                                key={product.id}
                                style={{
                                    width: "48%",
                                    borderRadius: 10,
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                                onPress={() => router.push({ pathname: "/categories/product", params: { id: product.id } }) }
                            >
                                    <Image
                                        style={{ width: 155, height: 170, borderRadius: 15 }}
                                        source={{ uri: product.image }}
                                        placeholder={blurhash}
                                        contentFit="cover"
                                        transition={1000}
                                    />
                                    {/*favorite button*/}
                                    <TouchableOpacity
                                        style={{
                                            position: "absolute",
                                            top: 10,
                                            right: 15,
                                            width: 30,
                                            height: 30,
                                            borderRadius: 15,
                                            backgroundColor: "#000",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                        onPress={() => handleFavorite(product.id)}
                                    >
                                        <Feather name="heart" size={20} color="#fff" />
                                    </TouchableOpacity>
                                    <View>
                                        <Title text={product.name} extraStyles={{ fontSize: 14, textAlign: 'center', marginTop: 11 }} />
                                        <Paragraph text={`$${product.price}`} extraStyles={{ fontSize: 14, textAlign: 'center' }} />
                                    </View>
                            </Pressable>
                        ))}
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
