import React, { useState, useEffect } from 'react'
import {
    callApi
} from "../utilities/utilities";
import "./cpuInfo.css"
function CpuInfo() {
    const [cpuInfo, setCpuInfo] = useState({
        cpusCount: null,
        cpusList: []
    });
    useEffect(() => {
        callApi("api/cpu/info").then(info => setCpuInfo(info));
    }, [])
    return (
        <div className="pannel-cpu-info">
            <h2>CPUS INFO</h2>
            <ul className="cpu-info">
                <li>CPU Number: {cpuInfo.cpusCount}</li>
                {cpuInfo.cpusList.map((cpu, index) => {
                    return (
                        <li key={index}>
                            <span>cpu n°{index} </span>
                            <span>model:{cpu.model} </span>
                            <span>speed:{cpu.speed}</span>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default CpuInfo
