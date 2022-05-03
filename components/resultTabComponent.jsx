import { TabContext, TabPanel, TabList } from "@mui/lab";
import { Tab } from "@mui/material";
import { useState } from "react";
import ResultDashboard from "./resultDashboard";
import AllocationList from "./allocationList";
import makeAliceBobUtility from "../src/mainAlgorithm";

export default function ResultTabComponent(props) {
  const [tabNum, setTabNum] = useState("1");
  const handleChangeTab = (_, newValue) => {
    setTabNum(newValue);
  }
  const { currentTaskRepartition, allTasks, setTaskRepartition } = props;
  let [adjustedWinnerTaskRepartition, leastChangeAllocationTaskRepartition] = makeAliceBobUtility(allTasks, currentTaskRepartition);
  let [currentAliceAllocation, currentBobAllocation] = makeBothAllocation(currentTaskRepartition, allTasks);
  let [adjustedWinnerAliceAllocation, adjustedWinnerBobAllocation] = makeBothAllocation(adjustedWinnerTaskRepartition, allTasks);
  let [leastChangeAliceAllocation, leastChangeBobAllocation] = makeBothAllocation(leastChangeAllocationTaskRepartition, allTasks);
  return (
    <TabContext value={tabNum}>
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
      <AllocationList head="私" data={leastChangeAliceAllocation}></AllocationList>
        <AllocationList head="パートナー" data={leastChangeBobAllocation}></AllocationList>
        <ResultDashboard value={ leastChangeAllocationTaskRepartition }></ResultDashboard>
      </TabPanel>
      <TabPanel value="3" sx={{ width: 1}}>
      <AllocationList head="私" data={adjustedWinnerAliceAllocation}></AllocationList>
        <AllocationList head="パートナー" data={adjustedWinnerBobAllocation}></AllocationList>
        <ResultDashboard value={ adjustedWinnerTaskRepartition }></ResultDashboard>
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

