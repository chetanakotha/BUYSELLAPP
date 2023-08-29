import {StyleSheet, Text, TouchableOpacity} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useFonts, Poppins_600SemiBold } from '@expo-google-fonts/poppins';

export default function Button({ onPress, extraStyle, icon, title }) {
    // Load fonts
    let [fontsLoaded] = useFonts({
        Poppins_600SemiBold,
    });

    if (!fontsLoaded) {
        return null;
    }
  return (
    <TouchableOpacity style={[styles.button, extraStyle?.btn]} onPress={onPress}>
      <AntDesign
        name={icon?.name}
        size={18}
        color={icon?.color}
        style={styles.buttonIcon}
      />
      <Text style={[styles.buttonLabel, extraStyle?.text]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 30,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingVertical: 17,
    display: "flex",
  },
  buttonIcon: {
    paddingRight: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Poppins_600SemiBold",
    textTransform: "capitalize",
  },
});
