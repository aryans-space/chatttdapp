import React,{useState,useContext} from 'react'
import Image from 'next/image'

//internal import
import Style from './Filter.module.css';
import images from '../../assets';
import { ChatAppContect } from '@/Context/ChatAppContext';
import {Model} from '../index';

const Filter = () => {
  const{account,addFriends} =useContext(ChatAppContect);
  const[addFriend,setAddFriend]=useState(false);
 
  return (
    <div className={Style.Filter}>
      <div className={Style.Filter_box}>
        <div className={Style.Filter_box_left}>
          <div className={Style.Filter_box_left_search}>
            <Image src={images.search} alt='image' width={20} height={20}/>
            <input type='text' placeholder='search..'></input>
          </div>
        </div>
        <div className={Style.Filter_box_right}>
          <button>
            <Image src={images.clear} alt='clear' width={20} height={20}/>
            Clear chat
          </button>
          <button onClick={()=>setAddFriend(true)}>
            <Image src={images.user} alt='clear' width={20} height={20}/>
            Add friend
          </button>
        </div>

      </div>

      {/* //model component */}
      {addFriend && (
        <div className={Style.Filter_model}>
          <Model openBox={setAddFriend}
            title="Welcome to"
            head="Chat Buddy"
            info="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
            smallInfo="Kindly select your friend name and address.."
            image={images.hero}
            functionName={addFriends}
          />

          
        </div>
      )

      }

      
    </div>
  )
}

export default Filter
