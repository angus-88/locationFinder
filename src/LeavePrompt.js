/* eslint-disable class-methods-use-this */
/* eslint-disable react/no-deprecated */
import React from 'react';
import { Prompt } from 'react-router-dom';

class ExitPrompt extends React.Component {
  componentWillMount() {
    onbeforeunload = () => "Don't leave";
  }

  componentWillUnmount() {
    onbeforeunload = null;
  }

  render() {
    return (
      <div>
        <Prompt when={true} message={'Are you sure you want to leave, you have files in progress'}/>
      </div>
    );
  }
}

export default ExitPrompt;
