import React, { useContext } from 'react'
import { ConfigContext } from '../reducers/ConfigContext';
import "./configPannel.css"

function ConfigPannel() {
    let {stateConfig, dispatchConfig} = useContext(ConfigContext);

    return (
        <div className="pannel-config">
            <h2>CONFIG PANNEL</h2>
            {Object.entries(stateConfig)
            .map((conf, index) => <p key={index}><span>{conf[0]}: </span>{conf[1]}</p>)}

            <button 
            
            onClick={() => {
                dispatchConfig({
                    type: 'UPDATE_INTERVAL',
                    payload: 3000
                })
            }}>
                    
                    change interval in ms</button>
        </div>
    )
}


export default ConfigPannel
