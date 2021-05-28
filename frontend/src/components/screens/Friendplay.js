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
    Item,
} from "semantic-ui-react"
import Peer from "peerjs"
import ScriptTag from 'react-script-tag';

import Topnav from "../Topnav.js"

const Friendplay = () => {
    const [currentPose, setCurrentPose] = useState(0)
    const [poses, setPoses] = useState([
        { name: "pose1" },
        { name: "pose2" },
        { name: "pose3" },
        { name: "pose4" },
        { name: "pose5" },
    ])
    const [inProgress, setInProgress] = useState(false)
    
    

    return (
        <div>
            <Topnav />
            <Grid columns={3} relaxed>
                <Grid.Column>
                    <Segment className="solovideo">
                        insert webcam vid here
                        <p id="uservid"></p>
                    </Segment>
                </Grid.Column>
                <Grid.Column>
                    <Segment className="solovideo">
                        insert webcam vid here
                        <p id="enemyvid"></p>
                    </Segment>
                </Grid.Column>
                <Grid.Column className="poseorder">
                    <h1>Pose order</h1>
                    <Item.Group divided>
                        {poses.map((pose) => {
                            return (
                                <div>
                                    <Item.Image size="tiny" src="" />
                                    <Item.Content verticalAlign="middle">
                                        {pose.name === poses[currentPose].name
                                            ? "current pose: " + pose.name
                                            : pose.name}
                                    </Item.Content>
                                </div>
                            )
                        })}
                    </Item.Group>
                </Grid.Column>
            </Grid>
            <Segment basic>
                Progress:
                <Progress percent={11} />
            </Segment>
            
            <Form>
                <textarea id="id-supply"></textarea>
                <Button onClick={do_call()}>
                    submit
                </Button>
            </Form>

            <p>Generated Peer ID is: </p>
            <p id="demo"></p>
            <video id="sendvidshere"></video>
            <ScriptTag isHydrating={true} type="text/javascript" src="https://unpkg.com/peerjs@1.3.1/dist/peerjs.min.js" /> 
            <ScriptTag isHydrating={true} type="text/javascript" src={process.env.PUBLIC_URL + '/vidcall.js'} />
        </div>
    )
}

export default Friendplay
