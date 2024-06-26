import React, { useState, useContext, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Image,
  useWindowDimensions,
  Modal,
} from "react-native";
import { TextInput, Button, Dialog, Portal, Text } from "react-native-paper";
import { PeopleContext } from "../context/PeopleProvider";
import { Camera } from "expo-camera";
import uuid from "react-native-uuid";

export default function AddIdeaScreen({ route, navigation }) {
  const { personId } = route.params;
  const { addIdea } = useContext(PeopleContext);
  const [ideaText, setIdeaText] = useState("");
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const cameraRef = useRef();
  const [hasPermit, setHasPermit] = useState(false);
  const [imageData, setImageData] = useState(null);
  const [showCamera] = useState(true);
  const [cameraModalVisible, setCameraModalVisible] = useState(false);
  const [retake, setRetake] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status === "granted") {
        setHasPermit(true);
      } else {
        setHasPermit(false);
      }
    })();
  }, []);

  function takePhoto() {
    if (!hasPermit) {
      console.log("No camera permission.");
      return;
    }

    cameraRef.current
      .takePictureAsync({ quality: 0.8, exif: true })
      .then((photo) => {
        if (photo) {
          console.log(photo.uri);

          const rotatedImage = [{ rotate: "270deg" }];
          setImageData({ uri: photo.uri, transform: rotatedImage });
          setCameraModalVisible(false);
        }
      });
  }

  function retakePhoto() {
    setImageData("");
    setRetake(true);
    setCameraModalVisible(true);
  }

  const handleSaveIdea = () => {
    if (ideaText && imageData) {
      const ideaData = {
        id: uuid.v4(),
        text: ideaText,
        image: imageData.uri,
      };
      addIdea(personId, ideaData);
      navigation.navigate("Ideas", { personId });
    } else {
      setShowValidationModal(true);
    }
  };

  const handleCancel = () => {
    navigation.navigate("Ideas", { personId });
  };

  return (
    <View style={styles.container}>
      <TextInput
        mode="outlined"
        onChangeText={(text) => setIdeaText(text)}
        label="Gift Idea"
        multiline={true}
      />

      <View style={styles.inputImageContainer}>
        <View style={styles.inputContainer}>
          {imageData && (
            <Image
              source={{ uri: imageData.uri }}
              style={{ ...styles.image, transform: [{ rotate: "270deg" }] }}
            />
          )}
        </View>
        {imageData && (
          <View style={{ right: 50 }}>
            <Button icon="camera" mode="contained" onPress={retakePhoto}>
              Retake
            </Button>
          </View>
        )}
      </View>

      <View style={styles.centeredContainer}>
        {showCamera ? (
          <View style={styles.cameraContainer}>
            {hasPermit && !imageData && (
              <Button
                icon="camera"
                mode="contained"
                onPress={() => setCameraModalVisible(true)}
              >
                Take Photo
              </Button>
            )}
            {!hasPermit && <Text style={styles.txt}>No camera permission</Text>}
          </View>
        ) : null}
      </View>

      <View style={styles.buttonContainer}>
        {imageData && (
          <Button icon="content-save" mode="contained" onPress={handleSaveIdea}>
            Save
          </Button>
        )}
        <Button icon="cancel" mode="contained" onPress={handleCancel}>
          Cancel
        </Button>
      </View>

      <Modal
        visible={cameraModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setCameraModalVisible(false)}
      >
        <View style={styles.cameraModalContainer}>
          <Camera style={{ flex: 1 }} type={type} ref={cameraRef} />
          <View style={{ ...styles.buttonContainer, paddingVertical: 5 }}>
            <Button icon="content-save" mode="contained" onPress={takePhoto}>
              Take Photo
            </Button>
            <Button
              icon="cancel"
              mode="contained"
              onPress={() => setCameraModalVisible(false)}
            >
              Cancel
            </Button>
          </View>
        </View>
      </Modal>

      <Portal>
        <Dialog
          visible={showValidationModal}
          onDismiss={() => setShowValidationModal(false)}
        >
          <Dialog.Content>
            <Text>Gift idea required</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button title="OK" onPress={() => setShowValidationModal(false)}>
              Ok
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "rgb(240, 219, 255)",
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraContainer: {
    alignItems: "center",
  },
  cameraModalContainer: {
    padding: 10,
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  txt: {
    fontSize: 20,
  },
  inputImageContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  inputContainer: {
    flex: 1,
    paddingRight: 10,
  },
  image: {
    borderRadius: 10,
    width: 100,
    height: 100,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
