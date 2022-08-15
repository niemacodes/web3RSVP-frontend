import abiJSON from "./Web3RSVP.json"
import { ethers } from "ethers";

function connectContract(){

    // Get contract address + abi: 
    const contractAddress = "0x6c0ccF7D59c60af648c388aA6ebf2D43e991eEB5";
    const contractABI = abiJSON.abi; 

    // Get contract:
    let rsvpContract; 
    try{    
        const { ethereum } = window; 

        if(ethereum){
            // Checking for ETH object in the window: 
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            rsvpContract = new ethers.Contract(contractAddress, contractABI, signer);
        } else {
            throw new Error('Please connect to the Polygon Mumbai network.')
        }

    } catch (error){
        console.log("ERROR: ", error);
    }
    return rsvpContract;
}

export default connectContract;