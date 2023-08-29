import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function AppLayout() {
    return (
        <Tabs>
            <Tabs.Screen
                name="products"
                options={{
                    title: "Home",
                    tabBarIcon: () => <Ionicons name="ios-home" size={24} />,
                    headerShown: false,
                    tabBarShowLabel: false,
                    tabBarActiveBackgroundColor: "#f2f2f2",
                }}
            />
            <Tabs.Screen
                name="purchases"
                options={{
                    title: "Purchase Requests",
                    tabBarIcon: () => <Ionicons name="ios-cart" size={24} />,
                    headerShown: false,
                    tabBarShowLabel: false,
                    tabBarActiveBackgroundColor: "#f2f2f2",
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: () => <Ionicons name="ios-person" size={24} />,
                    headerShown: false,
                    tabBarShowLabel: false,
                    tabBarActiveBackgroundColor: "#f2f2f2",
                }}
            />
        </Tabs>
    );
}