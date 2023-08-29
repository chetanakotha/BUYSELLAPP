import { ScrollView, StyleSheet, Text, View } from "react-native";
import { RadioButton } from "react-native-paper";
import {useEffect, useState} from "react";
import { Image } from "expo-image";
import { Link, useRouter } from "expo-router";
import Button from "./components/button";
import Title from "./components/title";
import Paragraph from "./components/paragraph";
import Input from "./components/input";
import { getAuth } from "firebase/auth";
import {getCategories, getCities, register} from "./controller/dao";
import {Picker} from "@react-native-picker/picker";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export default function Register() {
  const router = useRouter();
  const auth = getAuth();

  const [formData, setFormData] = useState({
    role: "buyer",
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
    address: null,
    });
  const [errors, setErrors] = useState({
    role: "",
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
    address: "",
    general: "",
    });
  const [user, setUser] = useState(null);
  const [cities, setCities] = useState([]);

  const handleChanges = (name, value) => {
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "", general: "" });
  }

  const handleSubmit = () => {
    let isValid = true;

    if (!formData.role.trim()) {
      errors.role = "Role is required";
      isValid = false;
    }

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
        errors.password = "Password must be at least 6 characters long";
      isValid = false;
    }

    if (!formData.confirmPassword.trim()) {
        errors.confirmPassword = "Confirm password is required";
      isValid = false;
    } else if (formData.confirmPassword !== formData.password) {
        errors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    if (!formData.name.trim()) {
        errors.name = "Name is required";
      isValid = false;
    } else if (formData.name.length < 3) {
        errors.name = "Name must be at least 3 characters long";
      isValid = false;
    }

    if (!formData.phone.trim()) {
        errors.phone = "Phone number is required";
      isValid = false;
    } else if (formData.phone.length < 10 || isNaN(parseInt(formData.phone))) {
        errors.phone = "Phone number is invalid";
      isValid = false;
    }

    if (!formData.address.trim()) {
        errors.address = "Address is required";
      isValid = false;
    }

    if (isValid) {
      // Perform registration
        const registerUser = async () => {
            try {
                await register(auth, formData).then((user) => {
                    setUser(user);
                    router.push("login")
                })
            } catch (error) {
                setErrors({ ...errors, general: error.message });
            }
        }

        registerUser();
    } else {
        setErrors({ ...errors, general: "Please fix the errors below" });
    }
    }

  useEffect(() => {
    const fetchCities = async () => {
      const cities = await getCities();
      setCities(cities);
    }

    fetchCities();
  }, []);

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
          style={{ width: 59, height: 60, marginTop: 64 }}
        />
        <Title
          text="Sign up"
          extraStyles={{
            marginTop: 16,
            fontSize: 20,
            textAlign: "center",
          }}
        />
        <Paragraph
          text="Please provide details below to create an account with us"
          extraStyles={{ marginTop: 19, textAlign: "center", maxWidth: 309 }}
        />
        {errors.general ? (
          <Text style={styles.errorText}>{errors.general}</Text>
        ) : null}
        <View style={{ marginTop: 20, width: "100%" }}>
          <View style={{marginBottom: 10}}>
            <Text style={styles.label}>Role</Text>
            <RadioButton.Group
              onValueChange={(value) => handleChanges("role", value)}
              value={formData.role}
            >
              <View style={styles.radioGroup}>
                <View style={styles.radioButtonContainer}>
                  <RadioButton.Android value="buyer" color="#007AFF" />
                  <Text style={styles.radioButtonLabel}>Buyer</Text>
                </View>
                <View style={styles.radioButtonContainer}>
                  <RadioButton.Android value="vendor" color="#007AFF" />
                  <Text style={styles.radioButtonLabel}>Vendor</Text>
                </View>
              </View>
            </RadioButton.Group>
            {errors.role ? (
              <Text style={styles.errorText}>{errors.role}</Text>
            ) : null}
          </View>
          <View style={{ marginBottom: 20 }}>
            <Input
              placeholder="enter your email..."
              label="Email"
              onChangeText={handleChanges}
                name="email"
            />
            {errors.email ? (
              <Text style={styles.errorText}>{errors.email}</Text>
            ) : null}
          </View>
          <View style={{ marginBottom: 20 }}>
            <Input
              placeholder="enter your name..."
              label="Name"
              onChangeText={handleChanges}
                name="name"
            />
            {errors.name ? (
              <Text style={styles.errorText}>{errors.name}</Text>
            ) : null}
          </View>
          <View style={{ marginBottom: 20 }}>
            <Input
              placeholder="enter your phone..."
              label="Phone"
              onChangeText={handleChanges}
                name="phone"
            />
            {errors.phone ? (
              <Text style={styles.errorText}>{errors.phone}</Text>
            ) : null}
          </View>
          <View style={{ marginBottom: 20 }}>
            <Text style={styles.label}>City</Text>
            <Picker
                selectedValue={formData.address}
                style={styles.input}
                onValueChange={(itemValue, itemIndex) =>
                    handleChanges("address", itemValue)
                }
            >
              <Picker.Item label="Select your city" value="" />
              {cities.map((city) => (
                  <Picker.Item
                      key={city.id}
                      label={city.name}
                      value={city.id}
                  />
              ))}
            </Picker>
            {errors.address ? (
              <Text style={styles.errorText}>{errors.address}</Text>
            ) : null}
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
          <View style={{ marginBottom: 20 }}>
            <Input
              placeholder="confirm your password"
              label="Confirm Password"
              onChangeText={handleChanges}
              name="confirmPassword"
            />
            {errors.confirmPassword ? (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
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
            title="Sign up"
            icon={{ name: "adduser", color: "#fff" }}
            extraStyle={{
              btn: { backgroundColor: "#000" },
              text: { color: "#fff" },
            }}
          />
        </View>
        <Text style={{ marginTop: 20 }}>
          Already have an account?{" "}
          <Text style={{ color: "#91C63F", fontWeight: "bold" }}>
            <Link href="/login">Sign in</Link>
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
  radioGroup: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  radioButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
    backgroundColor: "#f2f2f2",
    padding: 15,
    borderRadius: 10,
    minWidth: "45%",
  },
  radioButtonLabel: {
    fontSize: 16,
    marginLeft: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
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
