import React, { useState, useEffect, useRef } from "react"
import { Link, NavLink, useHistory } from "react-router-dom"
import {
    Button,
    Divider,
    Form,
    Grid,
    Segment,
    Header,
    GridRow,
    Progress,
    Item
} from "semantic-ui-react"

import Topnav from "../Topnav.js"
import ScriptTag from 'react-script-tag';
const Solo = () => {
    const [currentPose, setCurrentPose] = useState(0)
    const [poses, setPoses] = useState([{}])
    const [inProgress, setInProgress] = useState(false)

    useEffect(() => {
        setPoses([
            { name: "pose1" },
            { name: "pose2" },
            { name: "pose3" },
            { name: "pose4" },
            { name: "pose5" },
        ])
    })

    return (
        <div>
            <Topnav />
            <Grid columns={2} relaxed>
                <Grid.Column>
                    {/* <Segment className="solovideo">
                       
                        
                    </Segment> */}
                </Grid.Column>
                <Grid.Column className="poseorder">
                    <h1 id="time"></h1>
                    <p id="poseName"></p>
                    {/* <Item.Group divided>
                        {poses.map((pose) => {
                            return (
                                <div>
                                    <Item.Image
                                        size="tiny"
                                        src=""
                                    />
                                    <Item.Content verticalAlign="middle">
                                        {(pose.name===poses[currentPose].name)? "current pose: "+pose.name:pose.name}
                                    </Item.Content>
                                </div>
                            )
                        })}
                    </Item.Group> */}
                </Grid.Column>
            </Grid>
            <Segment basic>
            <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br /> 
                        <br />
                        <br />
                        <h1 id="asana"></h1>
                Progress:
                <Progress percent={11} />
            </Segment>
            <Button>start</Button>
           
             <ScriptTag isHydrating={true} type="text/javascript" src="/posenet_files/sketch.js" />

        </div>

    )
}

export default Solo
