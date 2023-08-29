import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { useFonts, Poppins_700Bold } from "@expo-google-fonts/poppins";

export default function TopBar({ name, onPress }) {
  // Load fonts
  let [fontsLoaded] = useFonts({
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  // get initials from name, if name is one word, use first letter, if name is two words, use first letter of each word
  const getInitials = (name) => {
    const nameArr = name?.split(" ");
    if (nameArr?.length === 1) {
      return nameArr[0].charAt(0);
    } else if (nameArr?.length === 2) {
      return nameArr[0].charAt(0) + nameArr[1].charAt(0);
    }
  }

  return (
    <TouchableOpacity style={styles.bar} onPress={onPress}>
      <View style={styles.gk}>
        <Text style={styles.gkText}>{getInitials(name)}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  bar: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "#fff",
    width: "100%",
  },
  gk: {
    backgroundColor: "#000",
    width: 50,
    height: 50,
    borderRadius: 50,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  gkText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    textTransform: "uppercase",
    fontFamily: "Poppins_700Bold",
  },
});
