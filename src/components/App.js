import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';
import Hash from '../abis/Hash.json';

const ipfsClient = require('ipfs-http-client');
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' });

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      buffer: null,
      contract: null,
      hash: "",
      account: "",
    }
  }

  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadWeb3() {
    if(window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    }  else {
      window.alert("Please use metamask!")
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });
    const networkId = await web3.eth.net.getId();
    const networkData = Hash.networks[networkId];
    if (networkData) {
      const abi = Hash.abi;
      const address = networkData.address;
      const contract = web3.eth.Contract(abi, address);
      this.setState({ contract });
      const hash = await contract.methods.get().call();
      this.setState({ hash })
    } else {
      window.alert("Smart contract not deployed to detected network");
    }
  }

  captureFile = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) });
    }
  }


  onSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting the form");
    for await (const file of ipfs.add(this.state.buffer)) {
      console.log(file);
      const hash = file.path;
      this.state.contract.methods.set(hash).send({ from: this.state.account }, () => {
        this.setState({ hash })
      });
    }
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://www.dappuniversity.com/bootcamp"
            target="_blank"
            rel="noopener noreferrer"
          >
            Meme of the day
          </a>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small className="text-white">{this.state.account}</small>
            </li>
          </ul>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {this.state.hash !== "" && <img src={`https://ipfs.infura.io/ipfs/${this.state.hash}`} className="App-logo" alt="" />}
                </a>
                <h2 style={{ "padding": "25px" }}>Change Meme</h2>
                <form onSubmit={this.onSubmit} >
                  <input type="file" onChange={this.captureFile} />
                  <input type="submit" />
                </form>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
