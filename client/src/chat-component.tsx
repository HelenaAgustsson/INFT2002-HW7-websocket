import * as React from 'react';
import { KeyboardEvent } from 'react';
import { Component } from 'react-simplified';
import chatService, { Subscription } from './chat-service';
import { Alert, Card, Form, Row, Column } from './widgets';

export class Chat extends Component {
  subscription: Subscription | null = null;
  connected = false;
  messages: string[] = [];
  users: string[] = [];
  user = '';
  message = '';
  connection: WebSocket | null = null;

  render() {
    return (
      <Card title={'Chat (' + (this.connected ? 'Connected' : 'Not connected') + ')'}>
        <Card title="Connected users">
          {this.users.map((user, i) => (
            <div key={i}>{user}</div>
          ))}
        </Card>
        <Card title="Messages">
          {this.messages.map((message, i) => (
            <div key={i}>{message}</div>
          ))}
        </Card>
        <Card title="New message">
          <Row>
            <Column width={2}>
              <Form.Input
                type="text"
                placeholder="User"
                value={this.user}
                onChange={(e) => (this.user = e.currentTarget.value)}
                onKeyUp={(e: KeyboardEvent<HTMLInputElement>) => {
                  if (e.key == 'Enter') {
                    /**if (!this.subscription) {
                      // Subscribe to chatService to receive events from Chat server in this component
                      this.subscription = chatService.subscribe();

                      // Called when connection is ready
                      this.subscription.onopen = () => {
                        this.connected = true;
                        chatService.send({ addUser: this.user });

                        // Remove user when web page is closed
                        window.addEventListener('beforeunload', () =>
                          chatService.send({ removeUser: this.user })
                        );
                      };

                      // Called on incoming message
                      this.subscription.onmessage = (message) => {
                        if ('text' in message) {
                          this.messages.push(message.text);
                          console.log(message.text);
                        }
                        if ('users' in message) {
                          this.users = message.users;
                          console.log(message.users);
                        }
                      };

                      // Called if connection is closed
                      this.subscription.onclose = (code, reason) => {
                        this.connected = false;
                        Alert.danger(
                          'Connection closed with code ' + code + ' and reason: ' + reason
                        );
                      };

                      // Called on connection error
                      this.subscription.onerror = (error) => {
                        this.connected = false;
                        Alert.danger('Connection error: ' + error.message);
                      };
                    } */
                  }
                }}
              />
            </Column>
            <Column>
              <Form.Input
                type="text"
                placeholder="Message"
                value={this.message}
                onChange={(e) => (this.message = e.currentTarget.value)}
                onKeyUp={(e: KeyboardEvent<HTMLInputElement>) => {
                  if (e.key == 'Enter') {
                    if (this.connected) {
                      chatService.send({ text: this.user + ': ' + this.message });
                      this.message = '';
                    } else Alert.danger('Not connected to server');
                  }
                }}
              />
            </Column>
          </Row>
        </Card>
      </Card>
    );
  }

  mounted() {
    // Subscribe to chatService to receive events from Chat server in this component
    this.subscription = chatService.subscribe();

    // Called when connection is ready
    this.subscription.onopen = () => {
      this.connected = true;
      chatService.send({ addUser: this.user });

      // Remove user when web page is closed
      window.addEventListener('beforeunload', () => chatService.send({ removeUser: this.user }));
    };

    // Called on incoming message
    this.subscription.onmessage = (message) => {
      if ('text' in message) {
        this.messages.push(message.text);
        console.log(message.text);
      }

      if ('users' in message) {
        this.users = message.users;
        this.users.push(this.user);
        console.log('USERS' + message.users);
      }
    };

    // Called if connection is closed
    this.subscription.onclose = (code, reason) => {
      this.connected = false;
      Alert.danger('Connection closed with code ' + code + ' and reason: ' + reason);
    };

    // Called on connection error
    this.subscription.onerror = (error) => {
      this.connected = false;
      Alert.danger('Connection error: ' + error.message);
    };
    /**
     * this.subscription = chatService.subscribe();
    this.subscription.onopen = () => {
      this.connected = true;
    };
    this.subscription.onmessage = (message) => {
      console.log(message);
    };
     * 
     * 
     * 
     * this.connection = new WebSocket('ws://localhost:3000/api/v1/chat');
    this.connection.onopen = () => {
      this.connected = true;
    };
    chatService.subscribe();
     */
    //Called on incoming message
    //this.connection.onmessage = (message) => {};
  }

  // Unsubscribe from chatService when component is no longer in use
  beforeUnmount() {
    if (this.subscription) chatService.unsubscribe(this.subscription);
  }
}
