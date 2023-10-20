import React, { useState, useContext, useEffect } from "react";
import { View, StyleSheet, KeyboardAvoidingView } from "react-native";
import { DatePickerInput } from "react-native-paper-dates";
import { PeopleContext } from "../context/PeopleProvider";
import { Dialog, Portal, Text, Button, TextInput } from "react-native-paper";
import uuid from "react-native-uuid";

export default function AddPersonScreen({ navigation, route }) {
  const { addPerson, editPerson } = useContext(PeopleContext);
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { personToEdit } = route.params || {};
  const [inputDate, setInputDate] = useState(undefined);

  useEffect(() => {
    if (personToEdit) {
      setName(personToEdit.name);
      setDob(personToEdit.dob);
    }
  }, [personToEdit]);

  const savePerson = () => {
    if (!name || !dob) {
      setError("Name and date of birth are required.");
      setModalVisible(true);
    } else {
      if (personToEdit) {
        editPerson(personToEdit.id, {
          id: personToEdit.id,
          name: name,
          dob: dob,
          ideas: personToEdit.ideas,
        });
      } else {
        const newPerson = {
          id: uuid.v4(),
          name: name,
          dob: dob,
        };
        addPerson(newPerson);
      }
      navigation.navigate("People");
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
      <View style={styles.inputContainer}>
        <TextInput
          mode="outlined"
          onChangeText={setName}
          value={name}
          label="Name"
          style={styles.input}
        />
        <DatePickerInput
          locale="en"
          label="Birthdate"
          value={inputDate || (personToEdit && new Date(personToEdit.dob))}
          onChange={(date) => {
            setInputDate(date);
            setDob(date);
          }}
          inputMode="start"
          animationType="slide"
          style={{ width: "100%" }}
          mode="outlined"
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button icon="content-save" mode="contained" onPress={savePerson}>
          Save
        </Button>
        <Button
          icon="cancel"
          mode="contained"
          onPress={() => {
            navigation.navigate("People");
          }}
          style={styles.cancelButton}
        >
          Cancel
        </Button>
      </View>

      <Portal>
        <Dialog visible={modalVisible} onDismiss={() => setModalVisible(true)}>
          <Dialog.Content>
            <Text>{error}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button title="OK" onPress={() => setModalVisible(!modalVisible)}>
              Ok
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "rgb(240, 219, 255)",
  },
  inputContainer: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  input: {
    width: "100%",
    marginBottom: 20,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cancelButton: {
    marginLeft: 10,
  },
});
