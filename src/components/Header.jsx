// import {ConfigContext} from "../archiveContext/context/ConfigContext"
import React, { useContext } from 'react'
import { RequestStatusContext } from '../context/RequestStatusContext';
import { DataContext } from "../reducers/DataContext";
import { ConfigContext } from "../reducers/ConfigContext";

function Header() {
    const {stateConfig, dispatchConfig} = useContext(ConfigContext);
    // console.log("config from header",stateConfig, dispatchConfig)
    const { isRequesting, setIsRequesting } = useContext(RequestStatusContext);
    const { stateData, dispatchData } = useContext(DataContext);

    // console.log(stateData);

    return (
        <div>
            <h2>CPU MONITOR HEADER</h2>
            status request : {isRequesting ? "📫" : "📪"}
            {/* <div onClick={() => {
                dispatch({
                    type: 'ADD_TRACE',
                    payload: {
                        traces: {"test":"test"}
                    }
                })
            }}> */}
                {/* {JSON.stringify(state)} */}
            {/* </div> */}
            {/* <button onClick={() => config.log()}>click to update</button> */}
        </div>
    )
}


export default Header
