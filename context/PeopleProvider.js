import React, { useState, createContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const PeopleContext = createContext();

export default function PeopleProvider({ children }) {
  const [people, setPeople] = useState([]);

  useEffect(() => {
    AsyncStorage.getItem("@people")
      .then((data) => {
        if (data) {
          setPeople(JSON.parse(data));
        }
      })
      .catch((error) => console.error("Error loading people data:", error));
  }, []);

  // Person
  const addPerson = (person) => {
    const newPerson = {
      id: person.id,
      name: person.name,
      dob: person.dob,
      ideas: [],
    };

    setPeople([...people, newPerson]);
    AsyncStorage.setItem(
      "@people",
      JSON.stringify([...people, newPerson])
    ).catch((error) => console.error("Error saving people data:", error));
  };

  const editPerson = (personId, updatedPersonData) => {
    const updatedPeople = people.map((person) => {
      if (person.id === personId) {
        person = { ...person, ...updatedPersonData };
      }
      return person;
    });

    setPeople(updatedPeople);
    AsyncStorage.setItem("@people", JSON.stringify(updatedPeople)).catch(
      (error) => console.error("Error saving people data:", error)
    );
  };

  const deletePerson = (personId) => {
    const updatedPeople = people.filter((person) => person.id !== personId);
    setPeople(updatedPeople);
    AsyncStorage.setItem("@people", JSON.stringify(updatedPeople)).catch(
      (error) => console.error("Error saving people data:", error)
    );
  };

  // Idea
  const addIdea = (personId, idea) => {
    const newIdea = {
      id: idea.id,
      text: idea.text,
      img: idea.image,
      width: 100,
      height: 100,
    };

    const updatedPeople = people.map((person) => {
      if (person.id === personId) {
        person.ideas.push(newIdea);
      }
      return person;
    });
    setPeople(updatedPeople);
    AsyncStorage.setItem("@people", JSON.stringify(updatedPeople)).catch(
      (error) => console.error("Error saving people data:", error)
    );
  };

  const deleteIdea = (personId, ideaId) => {
    setPeople((prevPeople) => {
      const updatedPeople = prevPeople.map((person) => {
        if (person.id === personId) {
          const updatedIdeas = person.ideas.filter(
            (idea) => idea.id !== ideaId
          );
          return { ...person, ideas: updatedIdeas };
        }
        return person;
      });
      AsyncStorage.setItem("@people", JSON.stringify(updatedPeople));
      return updatedPeople;
    });
  };

  return (
    <PeopleContext.Provider
      value={{
        people,
        addPerson,
        deletePerson,
        editPerson,
        addIdea,
        deleteIdea,
      }}
    >
      {children}
    </PeopleContext.Provider>
  );
}
