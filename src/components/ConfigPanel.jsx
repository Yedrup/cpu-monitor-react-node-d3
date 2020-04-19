import React, { useContext } from 'react'
import { ConfigContext } from '../data/reducers/ConfigContext';
import { Button, Card, CardContent, Typography } from '@material-ui/core';

function ConfigPanel() {
    let { stateConfig, dispatchConfig } = useContext(ConfigContext);
    let timeWindowArrayLength = stateConfig.getTimeWindowArrayLength();
    let highLoadAverageMinArrayLength = stateConfig.getHighLoadAverageMinArrayLength();
    let recoveryArrayMinLength = stateConfig.getRecoveryArrayMinLength();

    return (


        <Card>
            <CardContent>
                <Typography variant="h6" color="primary">CONFIG PANNEL</Typography>

                {Object.entries(stateConfig)
                    .map((conf, index) => {
                        let isAFunc = typeof conf[1] === "function";
                        return (isAFunc ? null : <p key={index}> <span>{conf[0]}: </span>{conf[1]}</p>)
                    }
                    )}
                <p>timeWindowArrayLength:{timeWindowArrayLength}</p>
                <p>highLoadAverageMinArrayLength:{highLoadAverageMinArrayLength}</p>
                <p>recoveryArrayMinLength:{recoveryArrayMinLength}</p>
                <Button variant="contained" color="secondary" onClick={() => {
                    dispatchConfig({
                        type: 'UPDATE_INTERVAL',
                        payload: 3000
                    })
                }}>change interval in ms</Button>
            </CardContent>
        </Card>

    )
}


export default ConfigPanel
