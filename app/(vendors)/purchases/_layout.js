import { Stack } from "expo-router";

const Layout = () => {
    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: "white",
                },
                headerTintColor: "#000",
                headerTitleStyle: {
                    fontWeight: "bold",
                    textAlign: "center",
                    fontsize: 20,
                },
            }}
        >
        </Stack>
    )
};
export default Layout;