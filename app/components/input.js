import { StyleSheet, View, TextInput, Text } from "react-native";
import { useFonts, Poppins_700Bold } from "@expo-google-fonts/poppins";

export default function Input({ placeholder, label, onChangeText, name, val, disabled }) {
  // Load fonts
  let [fontsLoaded] = useFonts({
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }
  return (
    <View style={styles.formGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#aaa"
        onChangeText={(value) => onChangeText(name, value)}
        value={val}
        editable={!disabled}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  formGroup: {
    marginBottom: 10,
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
    fontSize: 16,
    color: "#000",
    width: "100%",
  },
});
