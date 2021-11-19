import React, { useEffect, useState } from "react";
import fetch from "node-fetch";

import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      curUrl: "",
      loaded: false,
      rememberedSchemes: [],
    };
    this.schemeUrls = [];
    this.curSchema = 0;
  }

  shuffleDeck() {
    console.log("shuffling...");
    this.schemeUrls = this.schemeUrls.sort((a, b) => 0.5 - Math.random());
    this.curSchema = 0;
    this.setState({ curUrl: this.schemeUrls[0] });
  }

  nextCard() {
    this.curSchema++;
    if (this.curSchema === this.schemeUrls.length) this.curSchema = 0;
    this.setState({ curUrl: this.schemeUrls[this.curSchema] });
  }

  componentDidMount() {
    fetch("https://api.magicthegathering.io/v1/cards?type=scheme").then(
      (response) => {
        response.json().then((info) => {
          info.cards.forEach((card) => {
            if (card.imageUrl) this.schemeUrls.push(card.imageUrl);
          });
          console.log("fetched");
          this.shuffleDeck();
          this.setState({ loaded: true });
        });
      }
    );
  }

  rememberCurrentScheme() {
    if (!this.state.rememberedSchemes.includes(this.state.curUrl))
      this.setState({
        rememberedSchemes: [this.state.curUrl, ...this.state.rememberedSchemes],
      });
  }

  removeOngoingScheme(index) {
    this.setState({
      rememberedSchemes: this.state.rememberedSchemes.filter(
        (url, i) => index !== i
      ),
    });
  }

  render() {
    return (
      <>
        {this.state.loaded ? (
          <div>
            <div>
              <button
                onClick={this.shuffleDeck.bind(this)}
                className="deck-button"
              >
                Shuffle
              </button>
              <button
                onClick={this.nextCard.bind(this)}
                className="deck-button"
              >
                Next
              </button>
            </div>
            <img src={this.state.curUrl} alt="" className="schema-image" />
            <br />
            <button onClick={this.rememberCurrentScheme.bind(this)}>
              Remember
            </button>
            <br />
            {this.state.rememberedSchemes.map((url, i) => {
              return (
                <img
                  src={url}
                  alt=""
                  key={url}
                  onClick={() => this.removeOngoingScheme(i)}
                  className="schema-image"
                ></img>
              );
            })}
          </div>
        ) : (
          <div>
            <h2>Loading schemes...</h2>
          </div>
        )}
      </>
    );
  }
}

export default App;
