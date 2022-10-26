import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractAddress } from "./constants.js"

const connectButton = document.getElementById("connectButton")
connectButton.onclick = connect
const fundButton = document.getElementById("fundButton")
fundButton.onclick = fund
const getBalanceButton = document.getElementById("balanceButton")
getBalanceButton.onclick = getBalance
const withrawButton = document.getElementById("withdrawButton")
withrawButton.onclick = withdraw

console.log(ethers)

async function connect() {
    if (typeof window.ethereum !== undefined) {
        //connect to wallet
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" })
        } catch (error) {
            console.log(error)
        }
        connectButton.innerHTML = "Connected"
        const accounts = await ethereum.request({ method: "eth_accounts" })
        console.log(accounts)
    } else {
        console.log("no metamask")
        connectButton.innerHTML = "Please install metamask"
    }
}

//fund function
async function fund() {
    const ethAmount = document.getElementById("ethAmountInputBox").value
    if (typeof window.ethereum !== undefined) {
        //1. provider / connection to the blockchain
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        //2. signer/wallet / someone with gas
        const signer = provider.getSigner()
        console.log(signer)
        //contract that we are interacting with
        //ABI & Address
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            })
            await listenForTransactionMine(transactionResponse, provider)
            console.log(`Funding with ${ethAmount}`)
        } catch (error) {
            console.log(error)
        }
    } else {
        console.log("no metamask")
        fundButton.innerHTML = "Please install metamask and refresh"
    }
}

function listenForTransactionMine(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}...`)
    //listen for transaction to finish
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(
                `Completed with ${transactionReceipt.confirmations} confirmations`
            )
            resolve()
        })
    })
}

async function getBalance() {
    if (typeof window.ethereum !== undefined) {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        console.log(ethers.utils.formatEther(balance))
    }
}

async function withdraw() {
    if (typeof window.ethereum !== undefined) {
        console.log("Withdrawing...")
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.withdraw()
            await listenForTransactionMine(transactionResponse, provider)
            console.log("Withdrawing funds completed!")
        } catch (error) {
            console.log(error)
        }
    }
}
