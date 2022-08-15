import { Web3Storage, File, getFilesFromPath } from "web3.storage";
const { resolve } = require("path");

/**
 * Exporting a default handler functino to handle incoming requests by checking 
 * if the request is a `POST` request, & returning an error if it isn't. 
 */
export default async function handler(req, res){
    if(req.method === "POST"){
        return await storeEventData(req, res);
    } else {
        return res
            .status(405)
            .json({message: "Method not allowed", success: false});
    }
}

/**
 * Trys to get the event data from the request body & store the data, & returns an 
 * error if unsuccessful. Upon successful storage, a cid that points to an IPFS 
 * directory of the file stored. 
 */
async function storeEventData(req, res){
    const body = req.body; 

    try{    
        // Creating a JSON file that includes metadata from body above:
        const files = await makeFileObjects(body);
        const cid = await storeFiles(files);
        return res.status(200).json({success:true, cid:cid});
    } catch (error){
        return res
            .status(500)
            .json({error:"Error creating event", sucess:false});
    }
}

/**
 * Creates a `Buffer` from the stringified body returned on POST request.
 */
async function makeFileObjects(body){
    
    // Create buffer of body data:
    const buffer = Buffer.from(JSON.stringify(body));

    // Looking up images from the body request:
    const imageDirectory = resolve(process.cwd(), `public/images/${body.image}`);
    
    // Getting image from folder:
    const files = await getFilesFromPath(imageDirectory);

    // Pusing data file to this array to upload image & event data at the same time:
    files.push(new File([buffer], "data.json"));
    return files;
}

/**
 * Creates a Web3Storage client object to interact with.
 */
function makeStorageClient(){
    return new Web3Storage({token: process.env.WEB3STORAGE_TOKEN});
}

/**
 * Calls `put` method on the Web3Storage client to upload an array of files:
 */
async function storeFiles(files){
    const client = makeStorageClient();
    const cid = await client.put(files);
    return cid; 
}