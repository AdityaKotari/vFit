import React, { useContext, useRef, useEffect, useState } from "react"
import { NavLink, useHistory } from "react-router-dom"
import { Menu, Divider, Icon } from "semantic-ui-react"

const Topnav = () => {
    let history = useHistory();
    const user = JSON.parse(localStorage.getItem("user"));

    const Profile = () => {
        if(user&&user!==""){
            //do something
        }
        else{
            return (
                <Menu.Item
                    name="user"
                    position="right"
                    onClick={()=>{history.push("/signup")}}
                >
                    <Icon name="user" circular />
                    Sign-in
                </Menu.Item>
            )
        }
    }

    return (
        <div>
            <Menu stackable >
                <Menu.Item onClick={()=>{history.push("/")}}>
                    <h1>vFit</h1>
                </Menu.Item>
                <Menu.Item name="features">Something else</Menu.Item>
                <Profile/>
                
            </Menu>
        </div>
    )
}

export default Topnav
