import React, { memo } from 'react'
import { Button, Card, CardContent, Typography } from '@material-ui/core';

function WrappedConfigPanel(props) {
    let { stateConfig, dispatchConfig } = props;
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


function compareState(prevProps, nextProps) {
    return prevProps.stateConfig === nextProps.stateConfig
}
export const ConfigPanel = memo(WrappedConfigPanel, compareState);
export default ConfigPanel;
