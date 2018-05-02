import React, { Component } from 'react';
import './App.css';
import web3 from './web3'
import lottery from './lottery'
import { transactionWaiting, lotteryEntered, winnerFound, ether } from './constants'

class App extends Component {
  state = {
    balance: '',
    manager: '',
    players: [],
    value: '',
    message: '',
  }
  updateCall = async (message = "") => {
    const manager = await lottery.methods.manager().call()
    const players = await lottery.methods.getPlayers().call()
    const balance = await web3.eth.getBalance(lottery.options.address)

    this.setState({ manager, players, balance, message })
  }
  async componentDidMount() {
    await this.updateCall()
  }
  onSubmit = async (event) => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts()
    this.setState({ message: transactionWaiting })
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, ether)
    })
    await this.updateCall(lotteryEntered)
  }
  onClick = async () => {
    const accounts = await web3.eth.getAccounts()
    this.setState({ message: transactionWaiting })
    await lottery.methods.pickWinner().send({
      from: accounts[0]
    })
    this.setState({ message: winnerFound })
  }

  render() {
    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>
          This contract is managed by {this.state.manager}.
          There are currently {this.state.players.length} people entered,
          competing to win {web3.utils.fromWei(this.state.balance, ether)} ether!
        </p>
        <hr />
        <form onSubmit={this.onSubmit}>
          <h4>Want to try your luck</h4>
          <div>
            <label htmlFor="enterEther">
              Amount of ether to enter
            </label>
            <input type="text" name="enterEther" value={this.state.value} onChange={e => this.setState({ value: e.target.value })} />
          </div>
          <button type="submit">Enter</button>
        </form>
        <hr />

        <h1>{this.state.message}</h1>

        <hr />
        <h4>Ready to pick a winner</h4>
        <button onClick={this.onClick} >Pick a winner!</button>
        <hr />
      </div>
    );
  }
}

export default App;
