import { ScrollView, StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { useRouter, Stack} from "expo-router";
import { useEffect, useState } from "react";
import Title from "../../components/title";
import Paragraph from "../../components/paragraph";
import Badge from "../../components/badge";
import { getAuth } from "firebase/auth";
import {getUser, getPurchaseRequests, getProduct, deletePurchaseRequest} from "../../controller/dao";

const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export default function Purchases() {
    const router = useRouter();
    const auth = getAuth();

    const [user, setUser] = useState(null);
    const [requests, setRequests] = useState([]);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await getUser(auth).then((user) => {
                    setUser(user);

                    getPurchaseRequests(user.id).then((requests) => {
                        setRequests(requests);

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
        deletePurchaseRequest(id).then(() => {
            router.push("/favorites");
        });
    }

    return (
        <>
            <Stack.Screen
                options={{
                    title: "Purchase Requests",
                }}
            />
            <ScrollView
                contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-start" }}
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
                            requests ? requests.map((request, index) => (
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
                                            {
                                                request.status === "pending" ? (
                                                    <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                                                        <Badge
                                                            title="Cancel"
                                                            extraStyles={{
                                                                badge: {
                                                                    borderColor: "#eee",
                                                                    backgroundColor: "#eee",
                                                                },
                                                                text: {
                                                                    color: "#000",
                                                                }
                                                            }}
                                                            onPress={() => handleCancel(request.id)}
                                                        />
                                                    </View>
                                                ) : (
                                                    <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                                                        <Badge
                                                            title={request.status === "accepted" ? "Accepted" : "Declined"}
                                                            extraStyles={{
                                                                badge: {
                                                                    borderColor: "#000",
                                                                    backgroundColor: "#eee",
                                                                },
                                                                text: {
                                                                    color: "#000",
                                                                }
                                                            }}
                                                        />
                                                    </View>
                                                )
                                            }

                                        </View>
                                    </View>
                                </View>
                            )) : <Paragraph text="No Purchase Requests found" />
                        }
                    </View>
                    <Paragraph
                        text="Only accept when payment has been processed and the buyer has received the product" extraStyles={{
                        marginTop: 37,
                    }}
                    />
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
