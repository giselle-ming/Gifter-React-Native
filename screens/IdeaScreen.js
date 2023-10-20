import React, { useContext, useState } from "react";
import {
  View,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { PeopleContext } from "../context/PeopleProvider";
import { FAB, Modal, Portal, Text, Button, Dialog } from "react-native-paper";
import { AntDesign } from "@expo/vector-icons";

export default function IdeaScreen({ route, navigation }) {
  const { personId } = route.params;
  const [selectedIdea, setSelectedIdea] = useState(null); // Store the selected idea
  const { people, deleteIdea } = useContext(PeopleContext);
  const [visible, setVisible] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState(null);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const person = people.find((p) => p.id === personId);
  const ideas = person ? person.ideas : [];

  const showModal = (imageUrl) => {
    setModalImageUrl(imageUrl);
    setVisible(true);
  };

  const hideModal = () => {
    setModalImageUrl(null);
    setVisible(false);
  };

  const handleDeleteIdea = () => {
    if (selectedIdea !== null) {
      deleteIdea(personId, selectedIdea);
      setSelectedIdea(null); // Reset the selectedIdea state
      setDeleteModalVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.personName}>Gift Ideas for {person?.name}</Text>
      <FlatList
        data={ideas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View key={item.id} style={styles.ideaItem}>
            {item.img && (
              <TouchableOpacity onPress={() => showModal(item.img)}>
                <Image
                  source={{ uri: item.img }}
                  style={{
                    ...styles.ideaImage,
                    transform: [{ rotate: "270deg" }],
                  }}
                />
              </TouchableOpacity>
            )}
            <Text style={styles.ideaText}>{item.text}</Text>
            <Button
              icon="trash-can"
              mode="contained"
              style={styles.deleteButton}
              onPress={() => {
                setSelectedIdea(item.id);
                setDeleteModalVisible(true);
              }}
            >
              Delete
            </Button>
          </View>
        )}
      />
      <Portal>
        <Dialog
          visible={isDeleteModalVisible}
          onDismiss={() => setDeleteModalVisible(!isDeleteModalVisible)}
        >
          <Dialog.Title>Delete Gift</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button labelStyle={{ color: "green" }} onPress={handleDeleteIdea}>
              Yes
            </Button>
            <Button
              labelStyle={{ color: "red" }}
              onPress={() => {
                setSelectedIdea(null);
                setDeleteModalVisible(false);
              }}
            >
              Cancel
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <Portal>
        <Modal
          style={{ margin: 25 }}
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={{ height: 400 }}
        >
          <View style={{ alignItems: "center" }}>
            <TouchableOpacity onPress={hideModal} style={styles.closeButton}>
              <AntDesign name="closecircle" size={24} color="orange" />
            </TouchableOpacity>
            <Image
              source={{ uri: modalImageUrl }}
              style={{
                width: 300,
                height: 300,
                transform: [{ rotate: "270deg" }],
              }}
            />
          </View>
        </Modal>
      </Portal>
      <FAB
        icon="gift"
        style={styles.fab}
        label="Add Idea"
        onPress={() => navigation.navigate("Add Idea", { personId })}
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
  personName: {
    fontSize: 18,
    marginBottom: 12,
  },
  ideaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  ideaImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 8,
  },
  ideaText: {
    fontSize: 16,
  },
  deleteButton: {
    marginLeft: "auto",
    backgroundColor: "#FF0000",
  },
  deleteButtonText: {
    color: "#FFFFFF",
  },
  addButton: {
    backgroundColor: "#0000FF",
    padding: 16,
    alignItems: "center",
    borderRadius: 4,
  },
  closeButton: {
    position: "absolute",
    right: 10,
    top: 5,
    zIndex: 1,
  },
});
