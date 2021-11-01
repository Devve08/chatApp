import React, { Component } from "react";
import io from "socket.io-client";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: null,
      isConnected: false,
      messages: [],
      contacts: [],
      userInfo: {
        name: "Mhamad Safa",
        id: null,
        text: "",
      },
    };
  }

  componentWillMount() {
    this.state.socket = io("https://codi-server2.herokuapp.com");

    this.state.socket.on("connect", () => {
      this.setState({ isConnected: true });
    });

    this.state.socket.on("disconnect", () => {
      this.setState({ isConnected: false });
    });

    this.state.socket.on("pong!", (additionalStuff) => {
      console.log("server answered!", additionalStuff);
    });

    this.state.socket.on("peeps", (users) =>
      this.setState({
        contacts: users,
      })
    );

    this.state.socket.on("youare", (answer) => {
      this.setState((prevState) => ({
        userInfo: {
          ...prevState.userInfo,
          id: answer.id,
        },
      }));
    });

    const getID = () => this.state.socket.emit("whoami");

    getID();

    // this.state.socket.on("next", (message_from_server) =>
    //   console.log(message_from_server)
    // );

    // this.state.socket.on("addition", (add) => console.log(add));
    /** this will be useful way, way later **/
    this.state.socket.on("room", (old_messages) => {
      this.setState({
        messages: old_messages,
      });
    });
  }

  componentWillUnmount() {
    this.state.socket.close();
    this.state.socket = null;
  }

  render() {
    return (
      <div className="App">
        {/* <div>
          status: {this.state.isConnected ? "connected" : "disconnected"}
        </div>
        <div>id: {this.state.userInfo.id}</div>
        <div>contacts: {this.state.contacts.length}</div>
        <div>Name: {this.state.userInfo.name}</div> */}
        {/* 
        <input
          type="text"
          onChange={(e) =>
            this.setState((prevState) => ({
              userInfo: {
                ...prevState.userInfo,
                name: e.target.value,
              },
            }))
          }
          placeholder="name"
        /> */}

        {/* <button onClick={() => this.state.socket.emit("ping!")}>ping</button> */}
        {/* <button onClick={() => this.state.socket.emit("whoami")}>Who am I?</button> */}
        {/* <button onClick={() => this.state.socket.emit("addition")}>add</button> */}

        <div className="chat_box">
          <div className="title_chat">
            <h1>
              {" "}
              <span className={this.state.isConnected ? "circle green" : "circle red"}
              ><i class="fas fa-circle"></i></span>
              Chat Shit Get Banned App!!
            </h1>
          </div>
          {this.state.messages.map((item) => {
            return (
              <div
                className={
                  item.name == this.state.userInfo.name
                    ? "message you"
                    : "message"
                }
              >
                <div>
                  <span
                    className={
                      item.name == this.state.userInfo.name
                        ? "sender sender_you"
                        : "sender"
                    }
                  >
                    {item.name == this.state.userInfo.name ? "You" : item.name}{" "}
                  </span>
                </div>
                <div className="chat_text_box">
                  <span className="chat_text">{item.text}</span>
                  <div className="chat_date">
                    <span>{item.date.substring(10, 15)} </span>
                    <span>{item.date.substring(18, 21)} </span>
                  </div>
                </div>
              </div>
            );
          })}
          <div className="send_box">
            <input
              type="text"
              id="Msg"
              className="Msg"
              name="msg_input"
              onChange={(e) =>
                this.setState((prevState) => ({
                  userInfo: {
                    ...prevState.userInfo,
                    text: e.target.value,
                  },
                }))
              }
              placeholder="Message"
            />

            <div
              onClick={() => {
                this.state.socket.emit("message", this.state.userInfo);
                let CurMsg = {
                  date: "",
                  id: this.state.userInfo.id,
                  name: this.state.userInfo.name,
                  text: this.state.userInfo.text,
                };
                let oldmsg = this.state.messages;
                oldmsg.push(CurMsg);
                this.setState({
                  messages: oldmsg,
                });
                document.getElementById("Msg").value = "";
              }}
            >
              <i class="far fa-paper-plane"></i>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
