import React,{useState,useEffect,useContext} from 'react'
import Image from 'next/image';
import Link from 'next/link';

//internal import
import Style from "./NavBar.module.css";
import { ChatAppContect } from '@/Context/ChatAppContext';
import {Model,Error} from '../index';
import images from '../../assets';

function NavBar() {
  const menuItems=[
    {
      menu:"All Users",
      link:"alluser",
    },

    {
      menu:"CHAT",
      link:"/",
    },

    {
      menu:"CONTACT",
      link:"/",
    },

    {
      menu:"SETTING",
      link:"/",
    },
    {
      menu:"FAQS",
      link:"/",
    },
    {
      menu:"TERMS OF USE",
      link:"/",
    }
  ];
  //which menu item is active initially chat
  const [active,setActive]=useState(2);
  const[open,setOpen]=useState(false);
  const[openModel,setOpenModel]=useState(false);

  const {createAccount,error,account,userName,connectWallet}=useContext(ChatAppContect);
  return (
    <div className={Style.NavBar}>
      <div className={Style.NavBar_box}>
        <div className={Style.NavBar_box_left}>
          <Image src={images.logo} alt="log" width={50} height={50}/>
        </div>
        <div className={Style.NavBar_box_right}>
          {/*//desktop*/}
          <div className={Style.NavBar_box_right_menu}>
            {menuItems.map((el,i)=>(
              <div onClick={()=>setActive(i+1)} key={i+1} className={`${Style.NavBar_box_right_menu_items} ${active==i+1?Style.active_btn:""}`}>
                <Link className={Style.NavBar_box_right_menu_items_link} href={el.link}>{el.menu}</Link>
              </div>

            ))}
          </div>

          {/*//mobile*/}
          {open && (
            <div className={Style.mobile_menu}>
            {menuItems.map((el,i)=>(
              <div onClick={()=>setActive(i+1)} key={i+1} className={`${Style.mobile_menu_items} ${active==i+1?Style.active_btn:""}}`}>
                <Link className={Style.mobile_menu_items_link} href={el.link}>{el.menu}</Link>
              </div>

            ))}
            <p className={Style.mobile_menu_btn}>
              <Image src={images.close} alt="close" width={50} height={50} onClick={()=>setOpen(false)}/>
            </p>
          </div>
          )}

          {/* connect wallet button in navigation bar*/}
          
          <div className={Style.NavBar_box_right_connect}>
            {
              account ==""?(
                 <button onClick={()=>connectWallet()}>
                  {""}
                 <span>Connect Wallet</span>
                 </button> 
              ) :(
                <button onClick={()=>setOpenModel(true)}>
                  {""}
                  <Image src={userName?images.accountName:images.create2} alt="Account image" width={20} height={20}/> 
                  {""}
                  <small>{userName||"Create Account"}</small>
                </button>
              )
            }
          </div>
          

          <div className={Style.NavBar_box_right_open} onClick={()=>setOpen(true)}>
            <Image src={images.open} alt='open' width={30} height={30} />

          </div>
        </div>
      </div>
      {/*Model component */}
      {openModel && (
        <div className={Style.modelBox}>
          <Model openBox ={setOpenModel}
            title="WELCOME TO"
            head="CHAT BUDDY"
            info="At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat."
          smallInfo="Kindly select your name..."
          image={images.hero}
          functionName={createAccount}
          address={account}
          />
        </div>
      )}
      {error =="" ? "":<Error error={error}/>}

    </div>
  );
};

export default NavBar
