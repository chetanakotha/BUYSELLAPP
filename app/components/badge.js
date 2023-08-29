import {StyleSheet, Text, TouchableOpacity} from 'react-native';

export default function Badge({title, extraStyles, onPress}) {
  return (
    <TouchableOpacity style={[styles.badge, extraStyles.badge]} onPress={onPress}>
      <Text style={[styles.badgeText, extraStyles.text]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
    badge: {
        borderRadius: 15,
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: "#fff",
        borderStyle: "solid",
        borderWidth: 1,
    },
    badgeText: {
        fontSize: 11,
        fontWeight: "500",
    },
});