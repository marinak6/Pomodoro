import React, { Component } from "react";
import {Link, Redirect} from 'react-router-dom';
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
import { logout } from './Auth.js';
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
      let newTask = this.state.tasks;
      newTask.push(this.state.value);
      this.setState({ tasks: newTask });
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
      let taskRef = firebase.database().ref("tasks");
      taskRef.child("firstset").set({
        tasks: this.state.tasks
      });
      // const thesetasks = {
      //   tasks: this.state.tasks
      // };
      // taskRef.push(thesetasks);
    }
    // console.log(firebase.auth().currentUser.uid);
    // firebase.auth().currentUser.uid.set(this.state.tasks);
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
    console.log("what")
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
      return <Redirect to = '/iEat'/>
    }).catch(function(error) {
      // An error happened.
    });
    this.setState({
        redirect: true
    })
  }
  render() {
    console.log(this.state.tasks);
    if (this.state.isClicked) {
      this.addEnterLine();
      this.setisClickedFalse();
    }
    if(this.state.redirect){
      return <Redirect to = '/login'/>
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
        <button onClick = {this.logout}>
          {" "}
          Log out {" "}
        </button>
      </div>
    );
  }
}