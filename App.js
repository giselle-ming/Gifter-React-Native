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

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <PeopleProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="PeopleScreen">
              <Stack.Screen name="People" component={PeopleScreen} />
              <Stack.Screen name="Add Person" component={AddPersonScreen} />
              <Stack.Screen name="Ideas" component={IdeaScreen} />
              <Stack.Screen name="Add Idea" component={AddIdeaScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </PeopleProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
