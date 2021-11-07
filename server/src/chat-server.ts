import type http from 'http';
import type https from 'https';
import WebSocket from 'ws';

export type ClientMessage = { text: string } | { addUser: string } | { removeUser: string };

export type ServerMessage = { text: string } | { users: string[] };

export default class ChatServer {
  users: string[] = [];

  /**
   * Constructs a WebSocket server that will respond to the given path on webServer.
   */
  constructor(webServer: http.Server | https.Server, path: string) {
    const server = new WebSocket.Server({ server: webServer, path: path + '/chat' });

    server.on('connection', (connection, _request) => {
      connection.on('message', (message) => {
        const data: ClientMessage = JSON.parse(message.toString());
        if ('addUser' in data) {
          this.users.push(data.addUser);
          const message = JSON.stringify({ users: this.users } as ServerMessage);
          server.clients.forEach((connection) => connection.send(message));
        }
        if ('removeUser' in data) {
          this.users = this.users.filter((e) => e != data.removeUser);
          const message = JSON.stringify({ users: this.users } as ServerMessage);
          server.clients.forEach((connection) => connection.send(message));
        }
        if ('text' in data) {
          // Send the message to all current client connections
          server.clients.forEach((connection) =>
            connection.send(JSON.stringify({ text: data.text } as ServerMessage))
          );
        }
      });
    });
  }
}
