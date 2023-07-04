import React from "react";
import ResultBlock from "./resultBlock";
import findWordsInArray from "../utils/findWordsInArray";
import UnassignedBlock from "./unassignedBlock";

export default function ResultBlocksContainer({positionsAllArr: positionsAllArrProps, positionsSelectedArr: positionsSelectedArrProps}) {
    let unassigned = [];
    let resultArr = [];
    let assigned = [];

    positionsSelectedArrProps.forEach((positionToSearch) => {
        let resultArray = findWordsInArray(positionToSearch, positionsAllArrProps);
        if(resultArray.length > 0) {
            resultArray.forEach(el => assigned.push(el))
            if(positionToSearch !== "") {
                let groupObj = {name: positionToSearch, positions: resultArray}
                resultArr.push(groupObj)
            }
        }
    })
    if(positionsAllArrProps !== "") {
        unassigned = positionsAllArrProps.filter(el => !assigned.includes(el));
    }

    //сортируем группы от самой большой к самой маленькой
    resultArr.sort((a, b) => b.positions.length - a.positions.length);

    //убираем позиции, которые встречаются в более мелких группах
    for(let i = 0; i < resultArr.length; i++) {
        // eslint-disable-next-line no-loop-func
        resultArr[i].positions.forEach(mainPosition => { //один тайтл из приоритетной колонки
            for(let j = i + 1; j < resultArr.length; j++) { //цикл по колонке, следующей за приоритетной
                resultArr[j].positions = resultArr[j].positions.filter(word => word !== mainPosition);
            }
        })
    }

    //убираем группы, оставшиеся пустыми
    const allGroups = resultArr.filter(resObj => resObj.positions.length > 0);

    return (
        <div className="colsWrapper">
            {
                allGroups.map((resultColumn, key) => {
                    return (
                        <ResultBlock name={resultColumn.name} positions={resultColumn.positions} />
                    )
                })
            }
            <UnassignedBlock {...{unassigned}} />
        </div>
    )
}