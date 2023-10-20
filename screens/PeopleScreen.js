import React, { useContext, useState } from "react";
import { FlatList, View, StyleSheet, Pressable } from "react-native";
import { PeopleContext } from "../context/PeopleProvider";
import { FAB, Button, Dialog, Portal, Text } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function PeopleScreen() {
  const { people, deletePerson } = useContext(PeopleContext);
  const navigation = useNavigation();
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);

  const editPerson = (personId) => {
    const person = people.find((p) => p.id === personId);
    navigation.navigate("Add Person", { personToEdit: person });
  };

  const deleteOne = (personId) => {
    setSelectedPerson(personId);
    setDeleteModalVisible(true);
  };
  console.log(people);

  const sortList = people.slice().sort((a, b) => {
    const dateA = a.dob ? new Date(a.dob) : null;
    const dateB = b.dob ? new Date(b.dob) : null;
    if (dateA && dateB) {
      if (dateA.getMonth() === dateB.getMonth()) {
        return dateA.getDate() - dateB.getDate();
      }
      return dateA.getMonth() - dateB.getMonth();
    }
  });

  return (
    <View style={styles.container}>
      {sortList.length === 0 ? (
        <Text style={styles.emptyText}>
          No people available. Please add a person.
        </Text>
      ) : (
        <FlatList
          data={sortList}
          keyExtractor={(item, index) =>
            item.id ? item.id.toString() : index.toString()
          }
          renderItem={({ item }) => (
            <View style={styles.personItem}>
              <View>
                <Text style={styles.personName}>{item.name}</Text>
                {item.dob && (
                  <Text style={styles.personDob}>
                    {new Date(item.dob).toLocaleDateString("en-CA", {
                      timeZone: "America/Toronto",
                      month: "long",
                      day: "numeric",
                    })}
                  </Text>
                )}
              </View>
              <Pressable onPress={() => deleteOne(item.id)}>
                <Ionicons name="ios-trash" size={24} color="red" />
              </Pressable>
              <Pressable onPress={() => editPerson(item.id)}>
                <Ionicons name="create-outline" size={24} color="green" />
              </Pressable>
              <Ionicons
                name="bulb-outline"
                size={24}
                color="blue"
                onPress={() =>
                  navigation.navigate("Ideas", {
                    personId: item.id,
                  })
                }
              />
            </View>
          )}
        />
      )}

      <Portal>
        <Dialog
          visible={isDeleteModalVisible}
          onDismiss={() => setDeleteModalVisible(!isDeleteModalVisible)}
        >
          <Dialog.Title>Delete Person</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">Are you sure?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              textColor="green"
              onPress={() => {
                if (selectedPerson) {
                  deletePerson(selectedPerson);
                  setDeleteModalVisible(false);
                  setSelectedPerson(null);
                }
              }}
            >
              Yes
            </Button>
            <Button
              textColor="red"
              onPress={() => {
                setDeleteModalVisible(false);
                setSelectedPerson(null);
              }}
            >
              Cancel
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <FAB
        icon="account-multiple-plus"
        style={styles.fab}
        title="person-add-outline"
        label="Add Person"
        onPress={() => navigation.navigate("Add Person")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "rgb(240, 219, 255)",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 10,
    bottom: 10,
  },
  emptyText: {
    fontSize: 18,
    textAlign: "center",
  },
  personItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  personName: {
    fontSize: 18,
  },
  personDob: {
    fontSize: 16,
  },
});
