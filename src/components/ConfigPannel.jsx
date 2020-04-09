import React, { useContext } from 'react'
import { ConfigContext } from '../data/reducers/ConfigContext';
import "./configPannel.css"

function ConfigPannel() {
    let {stateConfig, dispatchConfig} = useContext(ConfigContext);
    let timeWindowArrayLength = stateConfig.getTimeWindowArrayLength();
    let highLoadAverageMinArrayLength = stateConfig.getHighLoadAverageMinArrayLength();
    let recoveryArrayMinLength = stateConfig.getRecoveryArrayMinLength();

    return (
        <div className="pannel-config">
            <h2>CONFIG PANNEL</h2>
            {Object.entries(stateConfig)
            .map((conf, index) => {
                let isAFunc =  typeof conf[1] === "function";
                return (isAFunc? null :<p key={index}> <span>{conf[0]}: </span>{conf[1]}</p>)
            }
            )}
            <p>timeWindowArrayLength:{timeWindowArrayLength}</p>
            <p>highLoadAverageMinArrayLength:{highLoadAverageMinArrayLength}</p>
            <p>recoveryArrayMinLength:{recoveryArrayMinLength}</p>
            <button 
            
            onClick={() => {
                dispatchConfig({
                    type: 'UPDATE_INTERVAL',
                    payload: 3000
                })
            }}>change interval in ms</button>
        </div>
    )
}


export default ConfigPannel
