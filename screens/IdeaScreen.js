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
  const [selectedIdea, setSelectedIdea] = useState(null);
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
      setSelectedIdea(null);
      setDeleteModalVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      {ideas.length === 0 ? (
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text
            style={{ paddingBottom: 20, fontSize: 20, textAlign: "center" }}
          >
            No ideas for {person.name}, add something
          </Text>
          <Image
            source={require("../assets/3779167.webp")}
            style={{ width: 300, height: 300 }}
          />
        </View>
      ) : (
        <View>
          <Text style={styles.personName}>Gift Ideas for {person.name}</Text>
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
                <Text>{item.text}</Text>
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
        </View>
      )}
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
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
    backgroundColor: "rgb(240, 219, 255)",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 10,
    bottom: 10,
  },
  personName: {
    fontSize: 20,
    marginBottom: 12,
  },
  ideaItem: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 16,
  },
  ideaImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 8,
  },
  deleteButton: {
    marginLeft: "auto",
    backgroundColor: "#FF0000",
  },
  closeButton: {
    position: "absolute",
    right: 10,
    top: 5,
    zIndex: 1,
  },
});
