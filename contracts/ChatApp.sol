

//SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract ChatApp{

    //details of each user
    struct user{
        string name;
        friend[] friendList;
    }
   //for friend
    struct friend{
        address pubkey;
        string name;
    }

    struct message{
        address sender;
        uint256 timestamp;
        string msg;
    }


    struct AllUserStruck{
        string name;
        address accountAddress;
    }

    AllUserStruck[] getAllUsers;

    //storing user registered in this app
    mapping(address=>user) userList;
    //all communication information between user and friend()between two users
    mapping(bytes32=>message[]) allMessages;
    

    //check user exist or not using address
    function checkUserExists(address pubkey) public view returns(bool){
        return bytes(userList[pubkey].name).length>0;
    }

    //create/register user using calldata to remain gasfree external so anybody can call it

    function createAccount(string calldata name) external{
        require(checkUserExists(msg.sender)==false,"User already exists"); //check already exist or not
        require(bytes(name).length>0,"Username cannot be empty"); //name field cannot be empty

        userList[msg.sender].name=name; //creating a name for the user

        getAllUsers.push(AllUserStruck(name,msg.sender));

    }

    //get Username on base of the address...memory because we want name to return
    function getUsername(address pubkey) external view returns(string memory){
        require(checkUserExists(pubkey),"User is not registered"); //check if user exist in smart contract
        return userList[pubkey].name;
    }

    //add friends by taking his address and name
    function addFriend(address friend_key,string calldata name) external{
        require(checkUserExists(msg.sender),"Create an account first"); //first he has to create an account
        require(checkUserExists(friend_key),"User is not registered!"); //the person trying to add friend exist or not
        require(msg.sender!=friend_key,"User cannot add themselves as friends"); //someone cannot add themselves
        require(checkAlreadyFriends(msg.sender,friend_key)==false,"These users are already friends");
        _addFriend(msg.sender,friend_key,name);
        _addFriend(friend_key, msg.sender,userList[msg.sender].name);
    
    }

    //check already friends or not
    function checkAlreadyFriends(address pubkey1,address pubkey2)internal view returns (bool){
        if(userList[pubkey1].friendList.length>userList[pubkey2].friendList.length){
            address tmp=pubkey1;
            pubkey1=pubkey2;
            pubkey2=tmp;
        }

        for(uint256 i=0;i<userList[pubkey1].friendList.length;i++){
            if(userList[pubkey1].friendList[i].pubkey==pubkey2) return true; //checking if friend1 connected to friend 2
        }
        return false;
    }


    function _addFriend(address me,address friend_key,string memory name) internal{
        friend memory newFriend=friend(friend_key,name);
        userList[me].friendList.push(newFriend);
    }

    //user sees all his friends
    function getMyFriendList() external view returns(friend[] memory){
        return userList[msg.sender].friendList;
    }

    //get chat code internal
    function _getChatCode(address pubkey1,address pubkey2) internal pure returns(bytes32){
        if(pubkey1<pubkey2){
            return keccak256(abi.encodePacked(pubkey1,pubkey2));
        }
        else return keccak256(abi.encodePacked(pubkey2,pubkey1));

    }

    //send message
    function sendMessage(address friend_key,string calldata _msg) external{
        require(checkUserExists(msg.sender),"Create an account first");
        require(checkUserExists(friend_key),"User is not registered");
        require(checkAlreadyFriends(msg.sender,friend_key),"You are not friend with the given user");

        bytes32 chatCode=_getChatCode(msg.sender,friend_key);
        message memory newMsg=message(msg.sender,block.timestamp,_msg);
        allMessages[chatCode].push(newMsg);
    }

    //Read message
    function readMessage(address friend_key) external view returns(message[] memory){
        bytes32  chatCode=_getChatCode(msg.sender,friend_key);
        return allMessages[chatCode];
    }

    //get all users who are registered in this app
    function getAllAppUser() public view returns(AllUserStruck[] memory){
        return getAllUsers;
    }
}