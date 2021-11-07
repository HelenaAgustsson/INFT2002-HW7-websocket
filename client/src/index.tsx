import ReactDOM from 'react-dom';
import * as React from 'react';
import { Chat } from './chat-component';
import { Alert } from './widgets';

const root = document.getElementById('root');
if (root)
  ReactDOM.render(
    <>
      <Alert />
      <Chat />
    </>,
    root
  );
