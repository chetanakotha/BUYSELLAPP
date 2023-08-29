import { StyleSheet, Text } from "react-native";
import { useFonts, Poppins_400Regular } from '@expo-google-fonts/poppins';

export default function Paragraph({ text, extraStyles }) {
    // Load fonts
    let [fontsLoaded] = useFonts({
        Poppins_400Regular,
    });

    if (!fontsLoaded) {
        return null;
    }

  return <Text style={[styles.paragraph, extraStyles]}>{text ? text : ''}</Text>;
}

const styles = StyleSheet.create({
  paragraph: {
    fontSize: 15,
    color: "#666",
    fontFamily: "Poppins_400Regular",
  },
});
