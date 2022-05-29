import React from "react";
import { GiftedChat, Bubble } from "react-native-gifted-chat";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const firebase = require('firebase');
require('firebase/firestore');

import {
  View,
  Text,
  Button,
  Platform,
  KeyboardAvoidingView,
} from "react-native";

export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
    };
  }

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyAy-h3k9l1PCfqnzLe3IluT5F9Lz8qkQGQ",
    authDomain: "chat-app-72494.firebaseapp.com",
    projectId: "chat-app-72494",
    storageBucket: "chat-app-72494.appspot.com",
    messagingSenderId: "1044212206610",
    appId: "1:1044212206610:web:d42b9d42fd2155ebf79ccb",
    measurementId: "G-NL636T5LWK"
  };

  if (!firebase.app.length){
      firebase.initializeApp(firebaseConfig);
  }

  this.referenceChatMessages = firebase.firestore().collection('messages');

  componentDidMount() {
    this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
         firebase.auth().signInAnonymously();
      }
      this.setState({
        uid: user.uid,
        messages: [],
    });
    this.unsubcribe = this.referenceChatMessages
      .orderBy('createdAt', 'desc')
      .onSnapshot(this.onCollectionUpdate);
    });
  }

  componentWillUnmount() {
    // stop listening for changes
    this.unsubcribe();
    // stop listening to authentication
    this.authUnsubscribe();
  }

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createAt.toDate(),
        user: data.user,
      });
    });
    this.setState({
      messages: messages
    });
    this.saveMessages();
  };

  addMessages() {
    //adds new message to the collection
    this.referenceChatMessages.add({
      uid: this.state.uid,
      createAt: message.createAt,
      text: message.createAt,
      user: this.state.user,
    });
  }

  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }), () => {
      this.addMessages();
      this.saveMessages();
    });
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#000",
          },
        }}
      />
    );
  }
  render() {
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });
    return (
      <View style={{ flex: 1 }}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={{
            _id: 1,
          }}
        />
        {Platform.OS === "android" ? (
          <KeyboardAvoidingView behavior="height" />
        ) : null}
      </View>
    );
  }
}
