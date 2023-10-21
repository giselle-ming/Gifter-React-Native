import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { PaperProvider } from "react-native-paper";
import PeopleScreen from "./screens/PeopleScreen";
import AddPersonScreen from "./screens/AddPersonScreen";
import IdeaScreen from "./screens/IdeaScreen";
import AddIdeaScreen from "./screens/AddIdeaScreen";
import PeopleProvider from "./context/PeopleProvider";
import { theme } from "./theme/Theme";
import { en, registerTranslation } from "react-native-paper-dates";

const Stack = createNativeStackNavigator();
registerTranslation("en", en);

const screenOptions = {
  headerStyle: {
    backgroundColor: "#FB6F22",
  },
  headerTintColor: "#fff",
  headerTitleStyle: {
    fontWeight: "bold",
  },
};

const screens = [
  { name: "People", component: PeopleScreen },
  { name: "Add Person", component: AddPersonScreen },
  { name: "Ideas", component: IdeaScreen },
  { name: "Add Idea", component: AddIdeaScreen },
];

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <PeopleProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="PeopleScreen">
              {screens.map((screen, index) => (
                <Stack.Screen
                  key={index}
                  name={screen.name}
                  component={screen.component}
                  options={screenOptions}
                />
              ))}
            </Stack.Navigator>
          </NavigationContainer>
        </PeopleProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
