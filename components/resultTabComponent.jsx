import { TabContext, TabPanel, TabList } from "@mui/lab";
import { Tab, Button } from "@mui/material";
import { useState, useEffect } from "react";
import ResultDashboard from "./resultDashboard";
import AllocationList from "./allocationList";
import makeAliceBobUtility from "../src/mainAlgorithm";

export default function ResultTabComponent(props) {
  const [tabNum, setTabNum] = useState("1");
  const handleChangeTab = (_, newValue) => {
    setTabNum(newValue);
  }
  const { currentTaskRepartition, allTasks, setTaskRepartition } = props;
  const [currentAliceAllocation, currentBobAllocation] = makeBothAllocation(currentTaskRepartition, allTasks);
  // calculate initial state
  const [adjustedWinnerTaskRepartition, leastChangeAllocationTaskRepartition] = makeAliceBobUtility(allTasks, currentTaskRepartition);
  const [adjustedWinnerAliceAllocation, adjustedWinnerBobAllocation] = makeBothAllocation(adjustedWinnerTaskRepartition, allTasks);
  const [leastChangeAliceAllocation, leastChangeBobAllocation] = makeBothAllocation(leastChangeAllocationTaskRepartition, allTasks);

  const [adjustedRepartition, setAdjustedRepartition] = useState(adjustedWinnerTaskRepartition);
  const [leastRepartition, setLeastRepartition] = useState(leastChangeAllocationTaskRepartition);
  const [adjustedAliceAllocation, setAdjustedAliceAllocation] = useState(adjustedWinnerAliceAllocation);
  const [adjustedBobAllocation, setAdjustedBobAllocation] = useState(adjustedWinnerBobAllocation);
  const [leastAliceAllocation, setLeastAliceAllocation] = useState(leastChangeAliceAllocation);
  const [leastBobAllocation, setLeastBobAllocation] = useState(leastChangeBobAllocation);

  useEffect(() => {
    const [adjustedWinnerAliceAllocation, adjustedWinnerBobAllocation] = makeBothAllocation(adjustedRepartition, allTasks);
    const [leastChangeAliceAllocation, leastChangeBobAllocation] = makeBothAllocation(leastRepartition, allTasks);
    setAdjustedAliceAllocation(adjustedWinnerAliceAllocation);
    setAdjustedBobAllocation(adjustedWinnerBobAllocation);
    setLeastAliceAllocation(leastChangeAliceAllocation);
    setLeastBobAllocation(leastChangeBobAllocation);
  }, [adjustedRepartition, currentTaskRepartition]);

  const changeRepartition = (person, taskName, tabNumber) => {
    let TaskRepartition = {}
    let setRepartition = null
    if (tabNumber == 2) {
      TaskRepartition = { ...leastRepartition }
      setRepartition = setLeastRepartition
    } else if (tabNumber == 3) {
      TaskRepartition = { ...adjustedRepartition }
      setRepartition = setAdjustedRepartition
    } else {
      return
    }
    const selectedPerson = (person == 'me' ? 'myTasks' : 'partnerTasks');
    const anotherPerson = (person != 'me' ? 'myTasks' : 'partnerTasks');
    // add a task to the other person
    TaskRepartition[anotherPerson][taskName] = TaskRepartition[selectedPerson][taskName]
    // delete a task from selected person
    delete TaskRepartition[selectedPerson][taskName]
    setRepartition(TaskRepartition)
  }

  const test = () => {
    changeRepartition('me', 'ゴミ出し', 2);
  }

  return (
    <TabContext value={tabNum}>
      <Button onClick={test}>
        hoge
      </Button>
      <TabList onChange={handleChangeTab}>
        <Tab label="今の家事分担" value="1" />
        <Tab label="少しだけ変更" value="2" />
        <Tab label="全家事で理想的な分担" value="3" />
      </TabList>
      <TabPanel value="1" sx={{ width: 1}}>
        <AllocationList head="私" data={currentAliceAllocation}></AllocationList>
        <AllocationList head="パートナー" data={currentBobAllocation}></AllocationList>
        <ResultDashboard value={ currentTaskRepartition }></ResultDashboard>
      </TabPanel>
      <TabPanel value="2" sx={{ width: 1}}>
      <AllocationList head="私" data={leastAliceAllocation}></AllocationList>
        <AllocationList head="パートナー" data={leastBobAllocation}></AllocationList>
        <ResultDashboard value={ leastRepartition }></ResultDashboard>
      </TabPanel>
      <TabPanel value="3" sx={{ width: 1}}>
      <AllocationList head="私" data={adjustedAliceAllocation}></AllocationList>
        <AllocationList head="パートナー" data={adjustedBobAllocation}></AllocationList>
        <ResultDashboard value={ adjustedRepartition }></ResultDashboard>
      </TabPanel>
    </TabContext>
  )
}

function makeBothAllocation(TaskRepartition, allTasks){
  let aliceAllocation = [];
  let bobAllocation = [];
  for (let category of allTasks){
      for (let task of category.children){
          if (task.checked){
              const myTask1 = TaskRepartition['myTasks'][task.name];
              const partnerTask1 = TaskRepartition['partnerTasks'][task.name];
              if (myTask1 && myTask1.participates){
                  aliceAllocation.push(task.name+" ");
              }else if (partnerTask1 && partnerTask1.participates){
                  bobAllocation.push(task.name+" ");
              }
          }
      }
  }
  return [aliceAllocation,bobAllocation];
}

