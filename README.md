# React Native Giftr App Project

The React Native Giftr App Project is a mobile application designed to facilitate the collection of gift ideas for individuals. It aims to provide users with a convenient way to organize and manage gift ideas for their friends and family members.

## Summary and Layout

The app stores all data related to people and gift ideas in global state and AsyncStorage. The state and AsyncStorage data are managed through a Context object, which contains functions for reading, updating, inserting, or deleting people data. The project consists of four main screens:

1. **PeopleScreen**: Lists the name and date of birth of each person from the global state. Users can navigate to the IdeaScreen for each person and add new people via the AddPersonScreen.
2. **AddPersonScreen**: Allows users to add a new person with a name, date of birth, and an empty ideas array.

3. **IdeaScreen**: Displays a list of gift ideas for a selected person. Users can add new gift ideas via the AddIdeaScreen and delete existing ideas.

4. **AddIdeaScreen**: Enables users to add a new gift idea for a selected person, including a name for the idea and a picture taken using the device's camera.

## Data Structure

Data for people and ideas is stored as objects in the following format:

```json
[
  {
    "id": "d825796c-4fc1-4879-ad86-048ece61358b",
    "name": "Mr Man",
    "dob": "1983-07-22",
    "ideas": []
  }
]
```

##Features

The app includes the following key features:

- **PeopleScreen** displays a sorted list of people with icons to navigate to IdeaScreen.
- **AddPersonScreen** allows users to add new people with validation for name and date of birth.
- **IdeaScreen** lists gift ideas for selected people with thumbnails and delete buttons.
- **AddIdeaScreen** enables users to add new gift ideas with validation for text and image.
- All functionality is managed through a single Context object, including data validation and storage.
- Error messages, confirmations, and warnings are displayed through a Modal component.
- Unique IDs are generated for every person and gift idea.
