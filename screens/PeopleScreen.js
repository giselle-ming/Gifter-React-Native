import React, { useContext, useState } from "react";
import { FlatList, View, StyleSheet, Pressable, Image } from "react-native";
import { PeopleContext } from "../context/PeopleProvider";
import { FAB, Button, Dialog, Portal, Text, Card } from "react-native-paper";
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
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text
            style={{ paddingBottom: 20, fontSize: 20, textAlign: "center" }}
          >
            No people in your list, add someone.
          </Text>
          <Image
            source={require("../assets/3779154.webp")}
            style={{ width: 300, height: 300 }}
          />
        </View>
      ) : (
        <FlatList
          data={sortList}
          keyExtractor={(item, index) =>
            item.id ? item.id.toString() : index.toString()
          }
          renderItem={({ item }) => (
            <Card style={styles.personCard}>
              <View style={styles.cardContent}>
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
                <View style={styles.bulbContainer}>
                  <Pressable
                    onPress={() =>
                      navigation.navigate("Ideas", {
                        personId: item.id,
                      })
                    }
                  >
                    <Ionicons name="bulb-outline" size={30} color="blue" />
                  </Pressable>
                </View>
              </View>
              <Card.Actions style={styles.cardContent}>
                <Button
                  icon="trash-can"
                  mode="contained"
                  style={styles.deleteButton}
                  onPress={() => deleteOne(item.id)}
                >
                  Delete
                </Button>
                <Button
                  icon="file-edit-outline"
                  mode="contained"
                  onPress={() => editPerson(item.id)}
                >
                  Edit
                </Button>
              </Card.Actions>
            </Card>
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
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
    backgroundColor: "rgb(240, 219, 255)",
  },
  deleteButton: {
    marginLeft: "auto",
    backgroundColor: "#FF0000",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 10,
    bottom: 10,
  },
  personCard: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    width: "100%",
  },
  cardContent: {
    minWidth: 320,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  personName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  personDob: {
    fontSize: 16,
  },
  bulbContainer: {
    position: "absolute",
    top: 1,
    right: 1,
  },
});
