import React, { useState, useContext, useEffect } from "react";
import { View, StyleSheet, KeyboardAvoidingView } from "react-native";
import { TextInput, Button, Dialog, Portal, Text } from "react-native-paper";
import { DatePickerInput } from "react-native-paper-dates";
import { PeopleContext } from "../context/PeopleProvider";
import uuid from "react-native-uuid";

export default function AddPersonScreen({ navigation, route }) {
  const { addPerson, editPerson } = useContext(PeopleContext);
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
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
          mode="outlined"
          value={inputDate || (personToEdit && new Date(personToEdit.dob))}
          onChange={(date) => {
            setInputDate(date);
            setDob(date);
          }}
          inputMode="start"
          animationType="slide"
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
        >
          Cancel
        </Button>
      </View>
      <Portal>
        <Dialog visible={modalVisible} onDismiss={() => {}}>
          <Dialog.Content>
            <Text>Name and date of birth are required.</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button title="OK" onPress={() => setModalVisible(false)}>
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
    padding: 16,
    backgroundColor: "rgb(240, 219, 255)",
  },
  inputContainer: {
    flex: 1,
    justifyContent: "flex-start",
    marginTop: 20,
  },
  input: {
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
});
