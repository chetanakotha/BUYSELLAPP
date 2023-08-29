import { ScrollView, StyleSheet, View } from "react-native";
import {useEffect, useState} from "react";
import { Image } from "expo-image";
import { useRouter, Stack, useSearchParams } from "expo-router";
import Title from "../../components/title";
import {getProduct, getUserById, createPurchaseRequest, getUser} from "../../controller/dao";
import { getAuth } from "firebase/auth";
import Paragraph from "../../components/paragraph";
import Button from "../../components/button";

const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export default function ProductDetails() {
    const router = useRouter();
    const auth = getAuth();
    const [user, setUser] = useState(null);
    const [product, setProduct] = useState([]);
    const [vendor, setVendor] = useState({});

    const { id } = useSearchParams();

    const handlePurchaseRequest = () => {
        createPurchaseRequest({
                    buyer_id: user.id,
                    vendor_id: product.user_id,
                    product_id: product.id,
                    status: "pending",
                }).then(() => {
                    router.push("/purchases");
                });
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                await getProduct(id).then((productDetails) => {
                    getUserById(productDetails.user_id).then((vendorDetails) => {
                        setProduct(productDetails);
                        setVendor(vendorDetails);
                    });
                });
            } catch (error) {
                console.error(error);
            }
        }

        getUser(auth)
            .then((user) => {
                setUser(user);
            })
            .catch((error) => {
                console.error(error);
            });

        fetchData();
    }, [id]);
    return (
        <>
            <Stack.Screen
                options={
                    {
                        title: `${product.name}`
                    }
                }
            />
            <ScrollView
                contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-start", backgroundColor: '#fff' }}
            >
                <View style={styles.container}>
                    <View
                        style={{
                            marginTop: 21,
                            width: "100%",
                            gap: 17,
                            alignItems: "center",
                        }}
                    >
                        {
                            <View
                                key={product.id}
                                style={{
                                    width: "100%",
                                }}
                            >
                                <Image
                                    style={{ width: '100%', height: 430 }}
                                    source={{ uri: product.image }}
                                    preview={{ uri: product.image }}
                                    blurHash={blurhash}
                                    contentFit="cover"
                                />
                                <View style={{ justifyContent: 'space-between', flexDirection: 'row', width: '100%', alignItems: 'center', marginTop: 20 }}>
                                    <View>
                                        <Title text={product.name} extraStyles={{ fontSize: 18 }} />
                                        <Paragraph text={product.category_id} />
                                    </View>
                                    <View>
                                        <Paragraph text="Total Price" />
                                        <Title text={`$${product.price}`} extraStyles={{ fontSize: 18 }} />
                                    </View>
                                </View>
                                <View style={{ width: '100%', marginTop: 30 }}>
                                    <Title text="Description" extraStyles={{ fontSize: 18 }} />
                                    <Paragraph text={product.description} />
                                </View>
                                <View style={{ width: '100%', marginTop: 30 }}>
                                    <Title text="Vendor Info" extraStyles={{ fontSize: 18 }} />
                                    <Paragraph text={`Name: ${vendor.name}`} />
                                    <Paragraph text={`Location: ${vendor.address}`} />
                                    <Paragraph text={`Phone: ${vendor.phone}`} />
                                    <Paragraph text={`Email: ${vendor.email}`} />
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
                                        onPress={handlePurchaseRequest}
                                        title="Request Purchase"
                                        icon={{ name: "shoppingcart", color: "#fff" }}
                                        extraStyle={{
                                            btn: { backgroundColor: "#000" },
                                            text: { color: "#fff" },
                                        }}
                                    />
                                </View>
                            </View>
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
