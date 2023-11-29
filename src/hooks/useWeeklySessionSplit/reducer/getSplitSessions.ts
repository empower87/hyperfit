import { getBroSplit } from "~/constants/workoutSplits";
import { MusclePriorityType } from "./weeklySessionSplitReducer";





const lol = (type: string, priority_muscle: string,) => {
  switch(type) {
    case "BRO":
      
    case "PPL":
    case "UL":
    case "PPLUL":
    case "":
    default:
  }
}



const getBroSessions = (total: [number, number], priority: MusclePriorityType[]) => {
  const weeklySessions = total[0]
  const extraDailySessions = total[1]
  const totalSessions = total[0] + total[1]

  let initEvenDistribution = Math.floor(totalSessions / 5) 

  const bro_sessions = {
    legs: initEvenDistribution,
    back: initEvenDistribution,
    chest: initEvenDistribution,
    arms: initEvenDistribution,
    shoulders: initEvenDistribution
  }

  let count = totalSessions % 5
  
  let added: ("legs" | "back" | "chest" | "arms" | "shoulders")[] = []
  for (let i = 0; i < priority.length; i++) {
    if (count < 1) break

    const broKey = getBroSplit(priority[i].muscle)


      bro_sessions[broKey]++
      count--
      added.push(broKey)
    
  }
  
  return bro_sessions
}

const getCount = (total: number) => {
  let findEvenDistribution = total % 5
  let divided = Math.floor(total / 5) 

  if (divided < 1) {
    return [0, total]
  } else {
    return [divided, findEvenDistribution]
  }
}