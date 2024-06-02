
import React,{useState,useEffect} from 'react'
import { useRouter } from 'next/router'

import { CheckIfWalletConnected,connectWallet,connectingWithContract } from '@/apiFeatures'

export const ChatAppContect=React.createContext();
export const ChatAppProvider=({children})=>{
    //state variables to store information we get from smart contract
    const[account,setAccount] =useState("");
    const[userName,setUserName] =useState("");
    const[friendLists,setFriendLists] =useState([]);
    const[friendMsg,setFriendMsg] =useState([]);
    const[loading,setLoading]=useState(false);
    const[userLists,setUserLists] =useState([]);
    const[error,setError]=useState("");

    //chat user data two states varible to know whom iam chatting with
    const[currentUserName,setCurrentUserName] =useState("");
    const[currentUserAddress,setCurrentUserAddress]=useState("");
    

    const router=useRouter();//when someone create account redirect to home page

    //fetch data at time of page load
    const fetchData=async()=>{
        try{ 
            //get contract
            const contract=await connectingWithContract();
            //get account
           const connectAccount=await connectWallet();
            setAccount(connectAccount);
            //get username
         const userName=await contract.getUsername(connectAccount);
           setUserName(userName);

            //get his friend list
            const friendLists=await contract.getMyFriendList();
            setFriendLists(friendLists);

            //get all app user list
            const userList=await contract.getAllAppUser();
            setUserLists(userList);

        }catch(error){
           // setError("Please install and connect your wallet");

        }
    };
        //whenever someone renders the page call the function
        useEffect(()=>{
            fetchData();
        },[]);
    
        //read message of a friend
        const readMessage=async(friendAddress)=>{
            try{
                const contract=await connectingWithContract();
                const read= await contract.readMessage(friendAddress);
                
                setFriendMsg(read);

            }catch(error){
                console.log("Currently you have no message");
            }
        };

        //create account
        const createAccount=async({name,accountAddress})=>{
            try{
                //CHECK IF NAME OR ADDRESS IS FILL IS EMPTY OR NOT
                //if(name|| accountAddress)
                   // return setError("Name and Account address fields cannot be empty");

                    const contract=await connectingWithContract();
                    const getCreatedUser=await contract.createAccount(name);
                    setLoading(true);
                    await getCreatedUser.wait();
                    setLoading(false);
                    window.location.reload();
            }catch(error){
                setError("Error while creating your account please reload browser");
            }

        };

        //add your friends
        const addFriends=async({name,accountAddress})=>{
            try{
               // if(name|| accountAddress) return setError("Please provide name and address");
                const contract=await connectingWithContract();
                const addMyFriend=await contract.addFriend(accountAddress,name);
                setLoading(true);
                await addMyFriend.wait();
                setLoading(false);
                router.push("/"); //set to home page
                window.location.reload();

            }catch(error){
                setError("Something went wrong while adding friends, try again!!");
            }
        };

        //send message to your friend
        const sendMessage=async({msg,address})=>{
            try{
                //if(msg||address) return setError("Please type your message");
                console.log(msg);
                const contract=await connectingWithContract();
                const addMessage=await contract.sendMessage(address,msg);
                console.log(msg);
                setLoading(true);
                await addMessage.wait();
                setLoading(false);
                window.location.reload();
            }catch(error){
                setError("Please reload and try again");
            }
        };

        //read info of person chatting with name address
        const readUser=async(userAddress)=>{
            const contract=await connectingWithContract();
            const userName=await contract.getUsername(userAddress);
            setCurrentUserName(userName);
            setCurrentUserAddress(userAddress);
        };
    return(
        <ChatAppContect.Provider value={{readMessage,createAccount,addFriends,sendMessage,readUser,connectWallet,CheckIfWalletConnected,account,userName,friendLists,friendMsg,userLists,loading,userLists,error,currentUserName,currentUserAddress}}>
            {children}
        </ChatAppContect.Provider>
    )
};