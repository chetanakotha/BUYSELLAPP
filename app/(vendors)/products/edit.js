import { ScrollView, StyleSheet, Text, View } from "react-native";
import {Picker} from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import { useRouter, Stack, useSearchParams} from "expo-router";
import Button from "../../components/button";
import Input from "../../components/input";
import {getCategories, getProduct, updateProduct, deleteProduct} from "../../controller/dao";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";

const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export default function EditProduct() {
    const router = useRouter();
    const { id } = useSearchParams();
    const storage = getStorage();
    const storageRef = ref(storage, 'products');

    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        description: "",
        category_id: null,
        image: "",
        quantity: "",
        user_id: "",
        id: "",
    });

    const [errors, setErrors] = useState({
        name: "",
        price: "",
        description: "",
        image: "",
        category: "",
        quantity: "",
        general: "",
    });

    const handleChanges = (name, value) => {

        if(name === "image") {
            handleImageChange();
            return;
        }
        setFormData({
            ...formData,
            [name]: value,
        });
        setErrors({
            ...errors,
            [name]: "",
            general: "",
        });
    }

    const handleImageChange = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setFormData({
                ...formData,
                image: result.assets[0].uri,
            });
            setErrors({
                ...errors,
                image: "",
                general: "",
            });
        }
    };

    const uploadImage = (storageRef, uri) => {
        return new Promise((resolve, reject) => {
            fetch(uri)
                .then((response) => response.blob())
                .then((blob) => {
                    // upload and then get download url
                    uploadBytes(storageRef, blob)
                        .then((snapshot) => {
                            getDownloadURL(snapshot.ref)
                                .then((downloadURL) => {
                                    resolve(downloadURL);
                                })
                                .catch((error) => reject(error));
                        })
                        .catch((error) => reject(error));
                })
                .catch((error) => reject(error));
        });
    };


    const handleSubmit = () => {
        let isValid = true;

        if (!formData.name.trim()) {
            errors.name = "Name is required";
            isValid = false;
        }

        if (!formData.price.trim()) {
            errors.price = "Price is required";
            isValid = false;
        }

        if (!formData.description.trim()) {
            errors.description = "Description is required";
            isValid = false;
        }

        if (!formData.image.trim()) {
            errors.image = "Image is required";
            isValid = false;
        }

        if (!formData.category_id) {
            errors.category = "Category is required";
            isValid = false;
        }

        if (!formData.quantity.trim()) {
            errors.quantity = "Quantity is required";
            isValid = false;
        }

        if (isValid) {
            try {
                // create image and then create product
                uploadImage(storageRef, formData.image).then((downloadURL) => {
                    updateProduct({
                        ...formData,
                        image: downloadURL,
                        id
                    }).then(() => {
                        router.push("/products");
                    }).catch((error) => {
                        setErrors({
                            ...errors,
                            general: error.message,
                        });
                    });
                }).catch((error) => {
                    setErrors({
                        ...errors,
                        general: error.message,
                    });
                });
            } catch (error) {
                setErrors({
                    ...errors,
                    general: error.message,
                });
            }

        } else {
            setErrors({
                ...errors,
                general: "Please fill all fields",
            });
        }
    };

    useEffect(() => {
        const fetchCategories = async () => {
            const categories = await getCategories();
            setCategories(categories);
        }
        fetchCategories();
    }, []);

    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('Sorry, we need camera roll permissions to make this work!');
                }
            }
        })();
    }, []);

    // get product
    useEffect(() => {
        const fetchProduct = async () => {
            const product = await getProduct(id);
            setFormData({
                ...formData,
                ...product,
            });
        }
        fetchProduct();

    }, [id]);

    return (
        <>
            <Stack.Screen
                options={{
                    title: "Add Product",
                }
                }
            />
            <ScrollView
                contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-start", backgroundColor: "#fff" }}
            >
                <View style={styles.container}>
                    {errors.general ? (
                        <Text style={styles.errorText}>{errors.general}</Text>
                    ) : null}
                    <View style={{ marginTop: 20, width: "100%" }}>
                        <View style={{ marginBottom: 20 }}>
                            <Input
                                placeholder="enter product name..."
                                label="Name"
                                onChangeText={handleChanges}
                                name="name"
                                val={formData.name}
                            />
                            {errors.name ? (
                                <Text style={styles.errorText}>{errors.name}</Text>
                            ) : null}
                        </View>
                        <View style={{ marginBottom: 20 }}>
                            <Input
                                placeholder="enter product price"
                                label="Price"
                                onChangeText={handleChanges}
                                name="price"
                                val={formData.price}
                            />
                            {errors.price ? (
                                <Text style={styles.errorText}>{errors.price}</Text>
                            ) : null}
                        </View>
                        <View style={{ marginBottom: 20 }}>
                            <Input
                                placeholder="enter description..."
                                label="Description"
                                onChangeText={handleChanges}
                                name="description"
                                val={formData.description}
                            />
                            {errors.description ? (
                                <Text style={styles.errorText}>{errors.description}</Text>
                            ) : null}
                        </View>
                        <View style={{ marginBottom: 20 }}>
                            <Text style={styles.label}>Image</Text>
                            <Button
                                onPress={(value) => handleChanges("image", value)}
                                title="Pick an image"
                                icon={{ name: "picture", color: "#000" }}
                                extraStyle={{
                                    btn: { backgroundColor: "#f2f2f2", borderRadius: 10 },
                                    text: { color: "#000" },
                                }}
                            />
                            {/*{formData.image && (*/}
                            {/*    <Image*/}
                            {/*        source={{ uri: formData.image }}*/}
                            {/*        style={{ width: '100%', height: 80 }}*/}
                            {/*    />*/}
                            {/*)}*/}
                            {errors.image ? (
                                <Text style={styles.errorText}>{errors.image}</Text>
                            ) : null}
                        </View>
                        <View style={{ marginBottom: 20 }}>
                            <Text style={styles.label}>Category</Text>
                            <Picker
                                selectedValue={formData.category_id}
                                style={styles.input}
                                onValueChange={(itemValue, itemIndex) =>
                                    handleChanges("category_id", itemValue)
                                }
                            >
                                <Picker.Item label="Select Category" value="" />
                                {categories.map((category) => (
                                    <Picker.Item
                                        key={category.id}
                                        label={category.name}
                                        value={category.id}
                                    />
                                ))}
                            </Picker>
                            {errors.category ? (
                                <Text style={styles.errorText}>{errors.category}</Text>
                            ) : null}
                        </View>
                        <View style={{ marginBottom: 20 }}>
                            <Input
                                placeholder="enter quantity..."
                                label="Quantity"
                                onChangeText={handleChanges}
                                name="quantity"
                                val={formData.quantity}
                            />
                            {errors.quantity ? (
                                <Text style={styles.errorText}>{errors.quantity}</Text>
                            ) : null}
                        </View>
                    </View>
                    <View
                        style={{
                            marginTop: 31,
                            alignItems: "center",
                            justifyContent: "center",
                            width: "100%",
                        }}
                    >
                        <Button
                            onPress={handleSubmit}
                            title="Save"
                            icon={{ name: "shoppingcart", color: "#fff" }}
                            extraStyle={{
                                btn: { backgroundColor: "#000" },
                                text: { color: "#fff" },
                            }}
                        />
                    </View>
                    <View>
                        <Text style={{color: 'red', marginTop: 20, fontWeight: "700"}} onPress={() => {
                            deleteProduct(id).then(() => {
                                router.push("/products");

                            })
                        }}>
                            Delete this product
                        </Text>
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
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: "#000",
        marginBottom: 10,
        textTransform: "capitalize",
        fontFamily: "Poppins_700Bold",
    },
    input: {
        paddingVertical: 15,
        backgroundColor: "#f2f2f2",
        borderRadius: 10,
        paddingHorizontal: 19,
        color: "#000",
        width: "100%",
    },
});
