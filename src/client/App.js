import React, { Component } from 'react';
import './app.css';
import { makeStyles, ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import {Mealtheme} from "./Mealtheme"
import MealHeader from './Components/MealHeader'

export default class App extends Component {
  state = { 

  };

  componentDidMount() {

  }

  render() {
    return (
      <MuiThemeProvider  theme={Mealtheme}>
        <MealHeader />
      </MuiThemeProvider >
    );
  }
}
