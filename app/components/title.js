import { StyleSheet, Text } from "react-native";
import { useFonts, Poppins_700Bold } from '@expo-google-fonts/poppins';

export default function Title({ text, extraStyles }) {
    // Load fonts
    let [fontsLoaded] = useFonts({
        Poppins_700Bold,
    });

    if (!fontsLoaded) {
        return null;
    }

  return <Text style={[styles.title, extraStyles]}>{text}</Text>;
}

const styles = StyleSheet.create({
  title: {
    color: "#000",
    fontFamily: "Poppins_700Bold",
  },
});
