import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import {
  Checkbox,
  Radio,
  FormGroup,
  ControlLabel,
  FormControl,
  HelpBlock,
  Button
} from "react-bootstrap";
import firebase from "./Firebase.js";
import { logout } from "./Auth.js";

export default class EnterTasks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
      tasks: [],
      enter: [],
      isClicked: false,
      redirect: false
    };
  }

  componentDidMount() {}

  handleChange = e => {
    this.setState({ value: e.target.value });
  };

  handleClick = e => {
    if (this.state.value !== null) {
      let newTaskList = this.state.tasks;
      let newStr = this.state.value;
      let newObj = { type: newStr, time: Date.now() };
      newTaskList.push(newObj);
      this.setState({ tasks: newTaskList });
    }
    this.setState({ isClicked: true });
  };

  setisClickedFalse = () => {
    this.setState({ isClicked: false });
  };

  handleSubmit = () => {
    if (this.state.tasks === null) {
      console.log("Please input some tasks!");
    } else {
      this.handleClick();
      this.setisClickedFalse();
      this.setState({ tasks: [] });
      this.state.tasks.map(obj => {
        console.log(obj);
        let newPostKey = firebase
          .database()
          .ref(firebase.auth().currentUser.uid)
          .child("tasks")
          .child(obj.type)
          .set(obj.time);
      });
    }
  };

  addEnterLine = () => {
    let newEnter = this.state.enter;
    newEnter.push(
      <form>
        <FormGroup controlId="formBasicText">
          <FormControl
            type="text"
            placeholder="Enter text"
            onChange={this.handleChange}
          />
          <FormControl.Feedback />
          <Button bsStyle="primary" bsSize="xsmall" onClick={this.handleClick}>
            Add another task
          </Button>
        </FormGroup>
      </form>
    );
    this.setState({ enter: newEnter });
  };

  logout = () => {
    firebase
      .auth()
      .signOut()
      .then(function() {
        // Sign-out successful.
        return <Redirect to="/iEat" />;
      })
      .catch(function(error) {
        // An error happened.
      });
    this.setState({
      redirect: true
    });
  };
  render() {
    if (this.state.isClicked) {
      this.addEnterLine();
      this.setisClickedFalse();
    }
    if (this.state.redirect) {
      return <Redirect to="/login" />;
    }
    return (
      <div>
        <ControlLabel>Enter completed tasks below:</ControlLabel>
        <Button bsStyle="primary" bsSize="xsmall" onClick={this.handleClick}>
          Add task
        </Button>
        {this.state.enter.map(comp => comp)}
        <Button bsStyle="primary" bsSize="xsmall" onClick={this.handleSubmit}>
          Submit tasks
        </Button>
        <button onClick={this.logout}> Log out </button>
      </div>
    );
  }
}
