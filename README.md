This application implements a basic two player lobby system.  



### Current functionality:

- Users can set a username.
- One user can create a lobby and recieve a four letter code.
- A second user can then use that code to join the first users lobby.
- Once connected, both users can see the username of both users in the lobby.
- If a third user attempts to join the lobby, they will be redirected to the start page.

### Known limitations:

- The code entered currently is not validated to see if the lobby exists



### Prerequisites

- Docker and Node.js installed



### Startup:
```
> git clone https://github.com/Ashaka110/Connect-Four-Web-App
> cd Connect-Four-Web-App
> docker-compopse up
```
- In another terminal:
```
> cd Server
> npm install
> npm run dev
```
- In another terminal:
```
> cd Client
> npm install
> npm run dev
```
Open in browser: http://localhost:5173/


