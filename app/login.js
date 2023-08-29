import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import { Image } from "expo-image";
import { Link, useRouter } from "expo-router";
import Button from "./components/button";
import Title from "./components/title";
import Paragraph from "./components/paragraph";
import Input from "./components/input";
import { getAuth } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore"
import { login } from "./controller/dao";
import { db } from "../firebaseConfig";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export default function Login() {
  const router = useRouter();
  const auth = getAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    });
    const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
    });
    const [user, setUser] = useState(null);

    const handleChanges = (name, value) => {
      setFormData({ ...formData, [name]: value });
      setErrors({ ...errors, [name]: "", general: "" });
    }

  const handleSubmit = () => {
    let isValid = true;

    if (!formData.email.trim()) {
        errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = "Email is invalid";
      isValid = false;
    }

    if (!formData.password.trim()) {
        errors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
        errors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    if (isValid) {
      // Perform login logic here
        const loginAndGetUser = async () => {
            await login(auth, formData.email, formData.password).then(async (user) => {
                setUser(user);

                // fetch user role
                const userRef = collection(db, "users");
                const userSnapshot = await getDocs(userRef);
                const userItems = userSnapshot.docs.map((doc) => doc.data());
                const userItem = userItems.find((item) => item.id === user.uid);

                // redirect to dashboard
                if (userItem.role === "vendor") {
                    router.push("/products");
                } else {
                    router.push("/categories");
                }
            }).catch((error) => {
        setErrors({ ...errors, general: error.message});
        });
    }

        loginAndGetUser();
    } else {
        setErrors({ ...errors, general: "Please fix the errors below" });
    }};

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-end" }}
    >
      <View style={styles.container}>
        <Image
          source={require(`./assets/small_logo.svg`)}
          placeholder={blurhash}
          contentFit="cover"
          transition={1000}
          style={{ width: 59, height: 60 }}
        />
        <Title
          text="Sign in"
          extraStyles={{
            marginTop: 16,
            fontSize: 20,
            textAlign: "center",
          }}
        />
        <Paragraph
          text="Please provide details below to login to your account"
          extraStyles={{ marginTop: 33, textAlign: "center", maxWidth: 309 }}
        />
        {errors?.general ? (
          <Text style={styles.errorText}>{errors?.general}</Text>
        ) : null}
        <View style={{ marginTop: 69, width: "100%" }}>
          <View style={{ marginBottom: 20 }}>
            <Input
              placeholder="enter your email..."
              label="Email"
              onChangeText={handleChanges}
              name="email"
            />
            {
                errors.email ? (
                    <Text style={styles.errorText}>{errors.email}</Text>
                ) : null
            }
          </View>
          <View style={{ marginBottom: 20 }}>
            <Input
              placeholder="enter your password"
              label="Password"
              onChangeText={handleChanges}
              name="password"
            />
            {errors.password ? (
              <Text style={styles.errorText}>{errors.password}</Text>
            ) : null}
          </View>
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
            onPress={handleSubmit}
            title="Sign in"
            icon={{ name: "login", color: "#fff" }}
            extraStyle={{
              btn: { backgroundColor: "#000" },
              text: { color: "#fff" },
            }}
          />
        </View>
        <Text style={{ marginTop: 20 }}>
          Don't have an account?{" "}
          <Text style={{ color: "#91C63F", fontWeight: "bold" }}>
            <Link href="/register">Sign up</Link>
          </Text>
        </Text>
      </View>
    </ScrollView>
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
