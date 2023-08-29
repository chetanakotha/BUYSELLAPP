import {onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword} from "firebase/auth";
import {collection, getDocs, addDoc, deleteDoc, updateDoc} from "firebase/firestore";
import {db} from "../../firebaseConfig";


// login
export const login = (auth, email, password) => {
    return new Promise((resolve, reject) => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                resolve(userCredential.user);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

// register
export const register = (auth, formData) => {
    return new Promise((resolve, reject) => {
        createUserWithEmailAndPassword(auth, formData.email, formData.password)
            .then(async (userCredential) => {
                // Signed in
                const user = userCredential.user;
                // Add user to firestore
                try {
                    const docRef = await addDoc(collection(db, "users"), {
                        role: formData.role,
                        name: formData.name,
                        email: formData.email,
                        phone: formData.phone,
                        address: formData.address,
                        id: user.uid,
                    });
                    resolve(user);
                } catch (error) {
                    reject(error);
                }
            })
            .catch((error) => {
                reject(error);
            });
    });
}

// get currently logged in user
export const getUser = (auth) => {
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const userRef = collection(db, "users");
                getDocs(userRef)
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            if (doc.data().id === user.uid) {
                                resolve(doc.data());
                            }
                        });
                        // If the user is not found, reject the promise
                        reject(new Error("User not found"));
                    })
                    .catch((error) => {
                        reject(error);
                    });
            } else {
                reject(new Error("User not logged in"));
            }
        });
    });
}

// get user by id
export const getUserById = (id) => {
    return new Promise((resolve, reject) => {
        const userRef = collection(db, "users");
        getDocs(userRef)
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if (doc.data().id === id) {
                        resolve(doc.data());
                    }
                });
                // If the user is not found, reject the promise
                reject(new Error("User not found"));
            })
            .catch((error) => {
                reject(error);
            });
    });
}


// get products by vendor id
export const getProducts = (user) => {
    return new Promise((resolve, reject) => {
        const products = [];
        const productsRef = collection(db, "products");
        getDocs(productsRef)
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if (doc.data().user_id === user.id) {
                        products.push({...doc.data(), id: doc.id});
                    }
                });
                resolve(products);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

// get categories
export const getCategories = () => {
    return new Promise((resolve, reject) => {
        const categories = [];
        const categoriesRef = collection(db, "categories");
        getDocs(categoriesRef)
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    categories.push({...doc.data(), id: doc.id});
                });
                resolve(categories);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

// get cities
export const getCities = () => {
    return new Promise((resolve, reject) => {
        const cities = [];
        const citiesRef = collection(db, "cities");
        getDocs(citiesRef)
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    cities.push({...doc.data(), id: doc.id});
                });
                resolve(cities);
            })
            .catch((error) => {
                reject(error);
            });
    })
}

// get city by id
export const getCityName = (id) => {
    return new Promise((resolve, reject) => {
        const citiesRef = collection(db, "cities");
        getDocs(citiesRef)
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if (doc.id === id) {
                        resolve(doc.data().name);
                    }
                });
                // If the city is not found, reject the promise
                reject(new Error("City not found"));
            })
            .catch((error) => {
                reject(error);
            });
    });
}

// get product by id
export const getProduct = (id) => {
    return new Promise((resolve, reject) => {
        const productsRef = collection(db, "products");
        getDocs(productsRef)
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if (id && doc.id === id) {
                        resolve({...doc.data(), id: doc.id});
                    }
                });
                // If the product is not found, reject the promise
                reject(new Error("Product not found"));
            })
            .catch((error) => {
                reject(error);
            });
    });
}

// get category by id
export const getCategoryName = (id) => {
    return new Promise((resolve, reject) => {
        const categoriesRef = collection(db, "categories");
        getDocs(categoriesRef)
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if (doc.id === id) {
                        resolve(doc.data().name);
                    }
                });
                // If the category is not found, reject the promise
                reject(new Error("Category not found"));
            })
            .catch((error) => {
                reject(error);
            });
    });
}

// create a new product
export const createProduct = (product) => {
    return new Promise((resolve, reject) => {
        const productsRef = collection(db, "products");
        addDoc(productsRef, product)
            .then((docRef) => {
                resolve(docRef.id);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

// update a product
export const updateProduct = (product) => {
    return new Promise((resolve, reject) => {
        const productsRef = collection(db, "products");
        getDocs(productsRef)
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if (doc.id === product.id) {
                        updateDoc(doc.ref, product);
                        resolve();
                    }
                });
                // If the product is not found, reject the promise
                reject(new Error("Product not found"));
            })
            .catch((error) => {
                reject(error);
            });
    });
}

// delete a product
export const deleteProduct = (id) => {
    return new Promise((resolve, reject) => {
        const productsRef = collection(db, "products");
        getDocs(productsRef)
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if (doc.id === id) {
                        deleteDoc(doc.ref);
                        resolve();
                    }
                });
                // If the product is not found, reject the promise
                reject(new Error("Product not found"));
            })
            .catch((error) => {
                reject(error);
            });
    });
}

// get product by category id, from specific city
export const getProductsByCategory = (category, city) => {
    return new Promise((resolve, reject) => {
        const products = [];
        const productsRef = collection(db, "products");
        getDocs(productsRef)
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if (doc.data().category_id === category && doc.data().city_id === city) {
                        products.push({...doc.data(), id: doc.id});
                    }
                });
                resolve(products);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

// get all ads
export const getAds = () => {
    return new Promise((resolve, reject) => {
        const ads = [];
        const adsRef = collection(db, "ads");
        getDocs(adsRef)
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    ads.push({...doc.data(), id: doc.id});
                });
                resolve(ads);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

// create purchase request
export const createPurchaseRequest = (purchaseRequest) => {
    return new Promise((resolve, reject) => {
        const purchaseRequestsRef = collection(db, "purchase_requests");
        addDoc(purchaseRequestsRef, purchaseRequest)
            .then((docRef) => {
                resolve(docRef.id);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

// get purchase requests by buyer id
export const getPurchaseRequests = (id) => {
    return new Promise((resolve, reject) => {
        const purchaseRequests = [];
        const purchaseRequestsRef = collection(db, "purchase_requests");
        getDocs(purchaseRequestsRef)
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if (doc.data().buyer_id === id) {
                        purchaseRequests.push({...doc.data(), id: doc.id});
                    }
                });
                resolve(purchaseRequests);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

// delete purchase request
export const deletePurchaseRequest = (id) => {
    return new Promise((resolve, reject) => {
        const purchaseRequestsRef = collection(db, "purchase_requests");
        getDocs(purchaseRequestsRef)
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if (doc.id === id) {
                        deleteDoc(doc.ref);
                        resolve();
                    }
                });
                // If the purchase request is not found, reject the promise
                reject(new Error("Purchase request not found"));
            })
            .catch((error) => {
                reject(error);
            });
    });
}

// get purchase requests by seller id
export const getPurchaseRequestsBySeller = (id) => {
    return new Promise((resolve, reject) => {
        const purchaseRequests = [];
        const purchaseRequestsRef = collection(db, "purchase_requests");
        getDocs(purchaseRequestsRef)
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if (doc.data().vendor_id === id) {
                        purchaseRequests.push({...doc.data(), id: doc.id});
                    }
                });
                resolve(purchaseRequests);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

// accept purchase request
export const acceptPurchaseRequest = (id) => {
    return new Promise((resolve, reject) => {
        const purchaseRequestsRef = collection(db, "purchase_requests");
        getDocs(purchaseRequestsRef)
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if (doc.id === id) {
                        updateDoc(doc.ref, {status: "accepted"});
                        resolve();
                    }
                });
                // If the purchase request is not found, reject the promise
                reject(new Error("Purchase request not found"));
            })
            .catch((error) => {
                reject(error);
            });
    });
}

// reject purchase request
export const rejectPurchaseRequest = (id) => {
    return new Promise((resolve, reject) => {
        const purchaseRequestsRef = collection(db, "purchase_requests");
        getDocs(purchaseRequestsRef)
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if (doc.id === id) {
                        updateDoc(doc.ref, {status: "rejected"});
                        resolve();
                    }
                });
                // If the purchase request is not found, reject the promise
                reject(new Error("Purchase request not found"));
            })
            .catch((error) => {
                reject(error);
            });
    });
}

// get favorite products by user id
export const getFavoriteProducts = (id) => {
    return new Promise((resolve, reject) => {
        const favoriteProducts = [];
        const favoriteProductsRef = collection(db, "favorites");
        getDocs(favoriteProductsRef)
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if (doc.data().user_id === id) {
                        favoriteProducts.push({...doc.data(), id: doc.id});
                    }
                });
                resolve(favoriteProducts);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

// add favorite product
export const addFavoriteProduct = (favoriteProduct) => {
    return new Promise((resolve, reject) => {
        const favoriteProductsRef = collection(db, "favorites");
        // check if the favorite product already exists
        getDocs(favoriteProductsRef)
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if (doc.data().user_id === favoriteProduct.user_id && doc.data().product_id === favoriteProduct.product_id) {
                        reject(new Error("Favorite product already exists"));
                    }
                });
            })
            .catch((error) => {
                reject(error);
            });

        // add favorite product
        addDoc(favoriteProductsRef, favoriteProduct)
            .then((docRef) => {
                resolve(docRef.id);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

// delete favorite product
export const deleteFavoriteProduct = (id) => {
    return new Promise((resolve, reject) => {
        const favoriteProductsRef = collection(db, "favorites");
        getDocs(favoriteProductsRef)
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if (doc.id === id) {
                        deleteDoc(doc.ref);
                        resolve();
                    }
                });
                // If the favorite product is not found, reject the promise
                reject(new Error("Favorite product not found"));
            })
            .catch((error) => {
                reject(error);
            });
    });
}
