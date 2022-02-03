import React, {Component} from 'react'
import './App.css'
import Navbar from './Navbar'
import Web3 from 'web3'

class App extends Component{

    async Web3(){
        if(window.ethereum){
            window.web3 = new Web3(window.ethereum)
            await window.ethereum.enable()
        }
    }

    constructor(props){
        super(props)
        this.state = {
            account: '0x0'
        }
    }

    render(){
        return(
            <div>
                <Navbar account={this.state.account}/>
                <div className="text-center">
                    <h1>Hell, World</h1>
                </div>

            </div>
        )
    }
}

export default App