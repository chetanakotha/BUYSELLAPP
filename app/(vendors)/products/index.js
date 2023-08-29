import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { useRouter, Stack} from "expo-router";
import {useEffect, useState} from "react";
import Button from "../../components/button";
import Title from "../../components/title";
import Paragraph from "../../components/paragraph";
import { getAuth } from "firebase/auth";
import { getUser, getProducts, getCategoryName} from "../../controller/dao";

const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export default function Products() {
    const [products, setProducts] = useState([]);
    const [user, setUser] = useState(null);
    const router = useRouter();
    const auth = getAuth();

    const [categoryNames, setCategoryNames] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const vendor = await getUser(auth);
                setUser(vendor);
                const products = await getProducts(vendor);
                setProducts(products);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const promises = products.map((product) => {
            return getCategoryName(product.category_id);
        });

        Promise.all(promises)
            .then((names) => {
                setCategoryNames(names);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [products]);

    return (
        <>
            <Stack.Screen
                options={{
                    title: "Vendor Products",
                }
                }
            />
            <ScrollView
                contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-start", backgroundColor: "#fff" }}
            >
                <View style={styles.container}>
                    <View
                        style={{
                            marginTop: 26,
                            alignItems: "center",
                            justifyContent: "center",
                            width: "100%",
                        }}
                    >
                        <Button
                            onPress={() => {
                                router.push({ pathname: '/products/add' });
                            }}
                            title="Add Product"
                            icon={{ name: "shoppingcart", color: "#fff" }}
                            extraStyle={{
                                btn: {
                                    backgroundColor: "#000",
                                },
                                text: { color: "#fff" },
                            }}
                        />
                    </View>
                    <View
                        style={{
                            marginTop: 37,
                            width: "100%",
                            gap: 29,
                        }}
                    >
                        {
                            products ? products.map((product, index) => {
                                    return (
                                        <View key={product.name} style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                                            <Image
                                                source={{ uri: product.image }}
                                                placeholder={blurhash}
                                                contentFit="cover"
                                                transition={1000}
                                                style={{ width: 80, height: 81, borderRadius: 8 }}
                                            />
                                            <View>
                                                <Title
                                                    text={product.name}
                                                    extraStyles={{
                                                        fontSize: 16,
                                                    }}
                                                />
                                                <Paragraph
                                                    text={categoryNames[index]}
                                                    extraStyles={{
                                                        textTransform: "capitalize",
                                                    }}
                                                />
                                                <Title
                                                    text={`$${product.price}`}
                                                    extraStyles={{
                                                        marginTop: 10,
                                                        fontSize: 14,
                                                    }}
                                                />
                                            </View>
                                            <View style={{ flex: 1, alignItems: "flex-end" }}>
                                                <Button
                                                    onPress={() => {
                                                        router.push({ pathname: '/products/edit', params: { id: product.id } });
                                                    }}
                                                    title="Edit"
                                                    icon={{ name: "edit", color: "#000" }}
                                                    extraStyle={{
                                                        btn: {
                                                            backgroundColor: "#fff",
                                                            width: 80,
                                                            borderRadius: 8,
                                                            borderColor: "#000",
                                                        },
                                                        text: { color: "#000" },
                                                    }}
                                                />
                                            </View>
                                        </View>
                                    );
                            }) : <Paragraph text="No products found" />
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
