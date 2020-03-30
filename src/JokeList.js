import React, { Component } from 'react';
import Joke from './Joke';
import uuid from 'uuid/v4';
import './JokeList.css';
import axios from 'axios';

export default class JokeList extends Component {
  static defaultProps = {
    numJokesToGet: 10
  };

  constructor(props) {
    super(props);
    this.state = {
      jokes: JSON.parse(window.localStorage.getItem('jokes') || '[]')
    };
    this.handleClick = this.handleClick.bind(this);
  }
  componentDidMount() {
    if (this.state.jokes.length === 0) this.getJokes();
  }

  async getJokes() {
    let jokes = [];
    while (jokes.length < this.props.numJokesToGet) {
      const res = await axios.get('https://icanhazdadjoke.com/', {
        headers: { Accept: 'application/json' }
      });
      jokes.push({ joke: res.data.joke, votes: 0, id: uuid() });
    }
    this.setState(
      st => ({
        jokes: [...st.jokes, ...jokes]
      }),
      () =>
        window.localStorage.setItem('jokes', JSON.stringify(this.state.jokes))
    );
    window.localStorage.setItem('jokes', JSON.stringify(jokes));
  }

  handleVotes(id, delta) {
    this.setState(
      st => ({
        jokes: st.jokes.map(j =>
          j.id === id ? { ...j, votes: j.votes + delta } : j
        )
      }),
      () =>
        window.localStorage.setItem('jokes', JSON.stringify(this.state.jokes))
    );
  }

  handleClick() {
    this.getJokes();
  }
  render() {
    return (
      <div className='JokeList'>
        <div className='JokeList-sidebar'>
          <h1 className='JokeList-title'>
            <span>Dad</span> Jokes
          </h1>
          <img src='https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg' />
          <button className='JokeList-getmore' onClick={this.handleClick}>
            New Jokes
          </button>
        </div>
        <div className='JokeList-jokes'>
          {this.state.jokes.map(j => (
            <Joke
              key={j.id}
              text={j.joke}
              votes={j.votes}
              upvotes={() => this.handleVotes(j.id, 1)}
              downvotes={() => this.handleVotes(j.id, -1)}
            />
          ))}
        </div>
      </div>
    );
  }
}
