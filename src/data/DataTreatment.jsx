import { useState, useEffect, useRef, useContext } from 'react';
import {
  callApi,
  unmergeArraysConsecutivelyJoined,
  calculateTracesArrayAverage,
  isObjectHavingKeys,
} from '../utilities/utilities';
import Trace from '../utilities/classes/Trace';
import { ReportFinished, ReportInProgress } from '../utilities/classes/Report';
import { RequestStatusContext } from './context/RequestStatusContext';
import { DataStateContext, DataDispatchContext } from './reducers/DataContext';
import { ConfigContext } from './reducers/ConfigContext';
import { NotificationContext } from './reducers/NotificationContext';

function DataTreatment() {
  const isInitialMount = useRef(true);

  const { isRequesting, setIsRequesting } = useContext(RequestStatusContext);
  const { stateData } = useContext(DataStateContext);
  const { dispatchData } = useContext(DataDispatchContext);
  const { stateConfig } = useContext(ConfigContext);
  const { dispatchNotification } = useContext(NotificationContext);
  const [cpuData, setCpuData] = useState({});
  const [isCpuData, setIsCpuData] = useState(false);

  // STEPS
  const [currentStep, setCurrentStep] = useState(null);

  //STEP 0 HIGH LOAD AVERAGE - suspected
  const [isHighLoadAverageSuspected, setIsHighLoadAverageSuspected] = useState(
    false,
    'isHighLoadAverageSuspected'
  );
  const [highLoadAverageSuspected, setHighLoadAverageSuspected] = useState(
    [],
    'highLoadAverageSuspected'
  );

  // STEP 1: HIGH LOAD AVERAGE - suspected  / RECOVERY - suspected
  //  high load confirmed
  const [isHighLoadAverageConfirmed, setIsHighLoadAverageConfirmed] = useState(
    false,
    'isHighLoadAverageConfirmed'
  );
  const [highLoadAverageConfirmed, setHighLoadAverageConfirmed] = useState(
    [],
    'highLoadAverageConfirmed'
  );
  // recovery suspected
  const [isRecoveryAverageSuspected, setIsRecoveryAverageSuspected] = useState(
    false,
    'isRecoveryAverageSuspected'
  );
  const [recoveryAverageSuspected, setRecoveryAverageSuspected] = useState(
    [],
    'recoveryAverageSuspected'
  );

  //STEP 2 RECOVERING AVERAGE confirmed
  const [isRecoveryAverageConfirmed, setIsRecoveryAverageConfirmed] = useState(
    false,
    'isRecoveryAverageConfirmed'
  );
  const [recoveryAverageConfirmed, setRecoveryAverageConfirmed] = useState(
    [],
    'recoveryAverageConfirmed'
  );

  //RESET
  const [isResetting, setIsResetting] = useState(false, 'isResetting');

  const [
    isTemporaryHighLoadReportCreated,
    setIsTemporaryHighLoadReportCreated,
  ] = useState(false);

  /********* UTILITIES */
  const manageTracesLRU = (traces, newTrace) => {
    let updatedTraces = [...traces, newTrace];
    let maxLength = stateConfig.getTimeWindowArrayLength();
    if (updatedTraces.length > maxLength) {
      updatedTraces.shift();
    }
    return updatedTraces;
  };

  const getHighLoadCleanConfirmedTraces = (
    highLoadsConfirmedAverages,
    recoveryConfirmedAverages,
    checkProp = 'dateInMs'
  ) => {
    return unmergeArraysConsecutivelyJoined(
      highLoadsConfirmedAverages,
      recoveryConfirmedAverages,
      checkProp
    );
  };
  const createReport = (type, traces) => {
    let report = new ReportFinished(type, traces);
    return report;
  };

  /*** Main state effect */

  // call api
  useEffect(() => {
    if (isRequesting) {
      //console.log("requesting api ...");
      callApi('api/cpu/averages').then((data) => {
        setCpuData(data);
        setIsRequesting(false);
      });
    }
    return () => null;
    // eslint-disable-next-line
  }, [isRequesting]);

  // triggered when cpuData is received
  useEffect(() => {
    if (!isCpuData) {
      let isCpuDataAvailable = isObjectHavingKeys(cpuData);
      setIsCpuData(isCpuDataAvailable);
    }
    if (isCpuData) {
      let newTrace = new Trace(cpuData, stateConfig);
      let updatedTraces = cpuData.loadAverageLast1Min
        ? manageTracesLRU(stateData.traces, newTrace)
        : [];
      dispatchData({
        type: 'UPDATE_TRACES',
        payload: updatedTraces,
      });
      controlTrace(stateData.traces, newTrace);
    }
    return () => null;
    // eslint-disable-next-line
  }, [cpuData, isCpuData]);

  // change the steps
  useEffect(() => {
    //console.log('Change previous step to =>', currentStep);
    if (currentStep === null && isResetting) {
      setIsHighLoadAverageSuspected(false);
      setIsHighLoadAverageConfirmed(false);
      setIsRecoveryAverageSuspected(false);
      setIsTemporaryHighLoadReportCreated(false);
      setIsRecoveryAverageConfirmed(false);
    }
    return () => null;
    // eslint-disable-next-line
  }, [currentStep]);

  /********* ALGO STEPS TODO: remove step logic from this file  */
  // Management of high load average and recovery as steps.
  const steps = [
    {
      state: highLoadAverageSuspected, // Maybe high load average
      update: setHighLoadAverageSuspected,
    },
    {
      state: highLoadAverageConfirmed, // high load average confirmed ....  recovery suspected treated same time as high load average confirmed
      update: setHighLoadAverageConfirmed,
    },
    {
      state: recoveryAverageConfirmed, // alert, finish , create reports
      update: setRecoveryAverageConfirmed,
    },
  ];

  //🔶👀 STEP index 0 _ SUSPECT HIGH LOAD AVERAGE
  //HIGH LOAD AVERAGE suspected
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      if (!isHighLoadAverageSuspected) {
        //RESET High LoadAverage Suspected
        setHighLoadAverageSuspected([]);
        if (currentStep === 0) setCurrentStep(null);
      } else {
        //console.log('🔶👀 START HIGH LOAD SUSPECTED');
        setCurrentStep(0);
      }
    }
    return () => null;
    // eslint-disable-next-line
  }, [isHighLoadAverageSuspected]);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      if (isHighLoadAverageSuspected) {
        //console.log('🔶👀 HIGH LOAD SUSPECTED');
        let currentSuspectedWindowAverage = parseFloat(
          calculateTracesArrayAverage(highLoadAverageSuspected)
        );
        let isWindowMinToConfirmHighAverageReached =
          highLoadAverageSuspected.length >=
          stateConfig.getHighLoadAverageMinArrayLength();
        let isCurrentlyInHighAverage =
          currentSuspectedWindowAverage >
          stateConfig.loadAverageByCpuConsideredAsHigh;

        if (isCurrentlyInHighAverage) {
          if (isWindowMinToConfirmHighAverageReached) {
            setIsHighLoadAverageConfirmed(true);
          }
        } else {
          setIsHighLoadAverageSuspected(false); // meaning that the average decreased
        }
      }
    }
    return () => null;
    // eslint-disable-next-line
  }, [highLoadAverageSuspected]);

  //STEP index 1 _ 🔴 CONFIRMED HIGH LOAD AVERAGE  + 🔷👀SUSPECT RECOVERY
  //🔴 HIGH LOAD AVERAGE confirmed
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      if (!isHighLoadAverageConfirmed) {
        //reset array
        //console.log('RESET HIGH LOAD AVERAGE CONFIRMED');
        setHighLoadAverageConfirmed([]);
      } else {
        //console.log('IS HIGH LOAD CONFIRMED', isHighLoadAverageConfirmed);
        let firstTraceOfPeriod = highLoadAverageSuspected[0]; // last trace created
        //console.log('📢 ALERT START OF HIGH LOAD CONFIRMED');
        dispatchNotification({
          type: 'CREATE_NEW_NOTIFICATION',
          payload: { type: 'highLoadConfirmed', trace: firstTraceOfPeriod },
        });
        // update step
        setCurrentStep(1);
        //copy high load suspected to high load confirmed
        setHighLoadAverageConfirmed([...highLoadAverageSuspected]);
      }
    }
    return () => null;
    // eslint-disable-next-line
  }, [isHighLoadAverageConfirmed]);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      if (isHighLoadAverageConfirmed) {
        //console.log('🔴 HIGH LOAD CONFIRMED');
        let newTrace =
          highLoadAverageConfirmed[highLoadAverageConfirmed.length - 1];
        let isALoadAverageDecrease =
          newTrace.loadAverageLast1Min <
          stateConfig.loadAverageByCpuConsideredAsHigh;
        // create a new temporary report in reducer
        if (!isTemporaryHighLoadReportCreated) {
          let newTemporaryReport = new ReportInProgress(
            'temporary',
            highLoadAverageConfirmed
          );
          dispatchData({
            type: 'CREATE_REPORT_HIGH_LOAD_IN_PROGRESS',
            payload: newTemporaryReport,
          });
          setIsTemporaryHighLoadReportCreated(true);
        } else {
          // simply update with traces
          dispatchData({
            type: 'UPDATE_REPORT_HIGH_LOAD_IN_PROGRESS',
            payload: highLoadAverageConfirmed,
          });
        }

        if (isALoadAverageDecrease && !isRecoveryAverageSuspected) {
          setIsRecoveryAverageSuspected(true);
        }
        // need to maintain the two arrays in case the recovery is not completed
        if (isRecoveryAverageSuspected) {
          setRecoveryAverageSuspected([...recoveryAverageSuspected, newTrace]);
        }
      }
    }
    return () => null;
    // eslint-disable-next-line
  }, [highLoadAverageConfirmed]);

  // 🔷👀 RECOVERY SUSPECTED
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      if (!isRecoveryAverageSuspected) {
        //console.log('👎🏻 RECOVERY SUSPECTED ABORTED');
        setRecoveryAverageSuspected([]);
      } else {
        //console.log('🔷👀 START RECOVERY SUSPECTED');
        let newTrace =
          highLoadAverageConfirmed[highLoadAverageConfirmed.length - 1]; // last trace created
        setRecoveryAverageSuspected([...recoveryAverageSuspected, newTrace]);
      }
    }
    return () => null;
    // eslint-disable-next-line
  }, [isRecoveryAverageSuspected]);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      if (isRecoveryAverageSuspected) {
        //console.log('🔷👀 RECOVERY SUSPECTED');
        let currentSuspectedWindowAverage = parseFloat(
          calculateTracesArrayAverage(recoveryAverageSuspected)
        ); // make an average of current window
        let isRecovering =
          currentSuspectedWindowAverage <
          stateConfig.loadAverageByCpuConsideredAsHigh;
        let isWindowMinToConfirmReached =
          recoveryAverageSuspected.length >=
          stateConfig.getRecoveryArrayMinLength();
        if (isRecovering) {
          if (isWindowMinToConfirmReached) {
            // confirm the recovery if time min is passed
            //console.log('confirm THE END OF INCIDENT');
            setIsRecoveryAverageConfirmed(true);
          }
        } else {
          // meaning the current window average of sum average recovering is higher than expected and breaks the recovery
          setIsRecoveryAverageSuspected(false);
        }
      }
    }
    return () => null;
    // eslint-disable-next-line
  }, [recoveryAverageSuspected]);

  //STEP index 2 _ ✅ RECOVERY CONFIRMED _ REPORT END HIGH LOAD AVERAGE
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      if (!isRecoveryAverageConfirmed) {
        //console.log('END OF EVENT ===> RESET EVERYTHING');
        setRecoveryAverageConfirmed([]);
        if (currentStep === 2) setCurrentStep(null); //TODO: reset all
      } else {
        //console.log('✅ RECOVERING CONFIRMED => END OF EVENT');
        //console.log('📢 ALERT END OF INCIDENT'); // maybe later with more context?
        let newTrace = recoveryAverageSuspected[0]; // last trace created
        dispatchNotification({
          type: 'CREATE_NEW_NOTIFICATION',
          payload: { type: 'recoveryConfirmed', trace: newTrace },
        });
        setCurrentStep(2);
        setRecoveryAverageConfirmed([...recoveryAverageSuspected]);
      }
    }
    return () => null;
    // eslint-disable-next-line
  }, [isRecoveryAverageConfirmed]);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      if (isRecoveryAverageConfirmed) {
        let {
          highLoadAverageNewReport,
          recoveringAverageNewReport,
        } = getFinalReports(highLoadAverageConfirmed, recoveryAverageConfirmed);

        dispatchData({
          type: 'UPDATE_FINAL_REPORTS',
          payload: {
            highLoadReports: highLoadAverageNewReport,
            recoveryReports: recoveringAverageNewReport,
          },
        });
        //RESET ALL
        setIsResetting(true);
        setCurrentStep(null);
      }
    }
    return () => null;
    // eslint-disable-next-line
  }, [recoveryAverageConfirmed]);

  // main function
  const controlTrace = (traces, newTrace) => {
    const isHigherThanAverage =
      newTrace.loadAverageLast1Min >
      stateConfig.loadAverageByCpuConsideredAsHigh;
    const isCurrentlyAProcess = currentStep !== null;
    if (!isCurrentlyAProcess) {
      if (isHigherThanAverage) {
        setCurrentStep(0);
        setIsHighLoadAverageSuspected(true);
        setHighLoadAverageSuspected([...highLoadAverageSuspected, newTrace]);
      } else {
        console.log('🏖 Everything is ok so far');
      }
    } else {
      // A Process is already started => update the current step array
      steps[currentStep].update([...steps[currentStep].state, newTrace]);
    }
  };

  const getFinalReports = (
    highLoadAverageConfirmed,
    recoveryAverageConfirmed
  ) => {
    let highLoadCleanConfirmedTraces = getHighLoadCleanConfirmedTraces(
      highLoadAverageConfirmed,
      recoveryAverageConfirmed
    );
    let highLoadAverageNewReport = createReport(
      'highLoad',
      highLoadCleanConfirmedTraces
    ); // this report is previously created
    let recoveringAverageNewReport = createReport(
      'recovery',
      recoveryAverageConfirmed
    );
    return { highLoadAverageNewReport, recoveringAverageNewReport };
  };

  return null;
}

export default DataTreatment;
