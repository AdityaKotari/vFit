import React, { Component, useState, useEffect, useContext } from "react"
import { useHistory } from "react-router"
import { Button, Grid, GridColumn } from "semantic-ui-react"

import Topnav from "../Topnav.js"

const Home = () => {
    let history = useHistory()
    return (
        <div>
            <Topnav />
            <Grid className="homeB" columns={3} relaxed="very" stackable>
                <Grid.Column verticalAlign="middle">
                    <Button
                        circular
                        size="massive"
                        className="homebuttons"
                        onClick={() => {
                            history.push("/solo")
                        }}
                    >
                        Exercise Solo
                    </Button>
                </Grid.Column>
                <Grid.Column verticalAlign="middle">
                    <Button
                        circular
                        size="massive"
                        className="homebuttons"
                        onClick={() => {
                            history.push("/random")
                        }}
                    >
                        Random Match
                    </Button>
                </Grid.Column>
                <Grid.Column verticalAlign="middle">
                    <Button
                        circular
                        size="massive"
                        className="homebuttons"
                        onClick={() => {
                            history.push("/friendplay")
                        }}
                    >
                        Play with a friend
                    </Button>
                </Grid.Column>
            </Grid>
        </div>
    )
}

export default Home
