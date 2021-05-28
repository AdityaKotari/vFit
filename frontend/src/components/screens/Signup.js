import React, { useState, useEffect } from "react"
import { Link, NavLink, useHistory } from "react-router-dom"
import { Button, Divider, Form, Grid, Segment, Header } from 'semantic-ui-react'

import Topnav from '../Topnav.js'; 

const Signup = () => {
    const history = useHistory()
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")

    const uploadSignupFields = () => {
        fetch("/api/user/signup", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                password,
                email,
                phone,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data)
                if (data.error) {
                    console.log(data.error)
                } else {
                    history.push("/")
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }
    const test = () => {
        console.log(JSON.stringify({
            email,
            password,
        }))
    }

    const uploadLoginFields = () => {
        fetch("/api/user/login", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data)
                if (data.error) {
                    console.log(data.error)
                } else {
                    history.push("/")
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }

    return (
        <div className="signup">
            <Topnav/>
            <Header className="headers" size='huge' >vFit: (image logo here instead maybe)</Header>
            
            <Header className="headers" size='large' >A pogject that aims to eradicate fat people</Header>
            <Segment basic className="segments">
                <Grid columns={2} relaxed="very" stackable>
                    <Grid.Column>
                        <Header className="headers" size='huge'>Log in</Header>
                        <Form>
                            <Form.Input
                                icon="user"
                                iconPosition="left"
                                label="Email"
                                placeholder="Email"
                                onChange={(e)=>setEmail(e.target.value)}
                            />
                            <Form.Input
                                icon="lock"
                                iconPosition="left"
                                label="Password"
                                type="password"
                                onChange={(e)=>setPassword(e.target.value)}
                            />

                            <Button content="Login" primary onClick={uploadLoginFields}/>
                        </Form>
                    </Grid.Column>

                    <Grid.Column>
                    <Header className="headers" size='huge'>Sign up</Header>
                        <Form>
                        <Form.Input
                                icon="user"
                                iconPosition="left"
                                label="Username"
                                placeholder="Username"
                                onChange={(e)=>setName(e.target.value)}
                            />
                            <Form.Input
                                icon="phone"
                                iconPosition="left"
                                label="Phone"
                                placeholder="Phone"
                                onChange={(e)=>setPhone(e.target.value)}
                            />
                            
                            <Form.Input
                                icon="user"
                                iconPosition="left"
                                label="Email"
                                placeholder="Email"
                                onChange={(e)=>setEmail(e.target.value)}
                            />
                            
                            <Form.Input
                                icon="lock"
                                iconPosition="left"
                                label="Password"
                                type="password"
                                onChange={(e)=>setPassword(e.target.value)}
                            />
                            <Button content="Sign up" primary onClick={uploadSignupFields}/>
                        </Form>
                    </Grid.Column>
                </Grid>

                <Divider vertical>Or</Divider>
            </Segment>
        </div>
    )
}

export default Signup
