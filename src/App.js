import {Field, Form} from 'react-final-form';
import './App.css';
import React from "react";
import findWordsInArray from "./utils/findWordsInArray";

export default function App() {
    return (
        <Form
            onSubmit={values => {console.log(1)}}
            render={function({handleSubmit, reset, submitting, pristine, values}) {
                let allGroups = [];
                let unassigned = [];

                let resultBlocks;
                let unassignedBlock;

                let positionsAllArr = values.positionsAll ? values.positionsAll.trim().split('\n') : [];
                let positionsSelectedArr = values.positionsSelected ? values.positionsSelected.trim().split('\n') : [];

                let resultArr = [];
                let assigned = [];

                positionsSelectedArr.forEach((positionToSearch) => {
                    let resultArray = findWordsInArray(positionToSearch, positionsAllArr);
                    if(resultArray.length > 0) {
                        resultArray.forEach(el => assigned.push(el))
                        if(positionToSearch !== "") {
                            let groupObj = {name: positionToSearch, positions: resultArray}
                            resultArr.push(groupObj)
                        }
                    }
                })
                if(positionsAllArr !== "") {
                    unassigned = positionsAllArr.filter(el => !assigned.includes(el));
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

                //убираем группы оставшиеся пустыми
                allGroups = resultArr.filter(resObj => resObj.positions.length > 0);

                resultBlocks = allGroups.map((resultColumn, i) => {
                    return (
                        <div className="resultCol" key={i}>
                            <h4>{resultColumn.name}</h4>
                            {
                                resultColumn.positions.map((position, index) => {
                                    return (
                                        <div key={index}>
                                            {position}
                                        </div>
                                    )
                                })
                            }
                        </div>
                    )
                })

                unassignedBlock = unassigned.map((unassigned, i) => {
                    return (
                        <div key={i}>
                            {unassigned}
                        </div>
                    )
                })

                return (
                    <div>
                        <div className="App">
                            <form onSubmit={handleSubmit} className="contentBlock">
                                <div className="input-block">
                                    <Field
                                        name="positionsAll"
                                        render={(fieldRenderProps) => (
                                            <div>
                                                <label>Positions All</label><br/>
                                                <textarea style={{height: '400px', width: '300px'}}
                                                          onChange={fieldRenderProps.input.onChange}
                                                          value={fieldRenderProps.input.value}
                                                          name={fieldRenderProps.input.name}
                                                />
                                            </div>
                                        )}
                                    />
                                    <Field
                                        name="positionsSelected"
                                        render={(fieldRenderProps) => (
                                            <div>
                                                <label>Positions Selected</label><br/>
                                                <textarea style={{height: '400px', width: '300px'}}
                                                          onChange={fieldRenderProps.input.onChange}
                                                          value={fieldRenderProps.input.value}
                                                          name={fieldRenderProps.input.name}
                                                />
                                            </div>
                                        )}
                                    />
                                </div>
                            </form>
                        </div>
                        <div className="resultsBlock contentBlock">
                            {resultBlocks}
                            {unassigned.length > 0 && unassignedBlock &&
                                <div className="resultCol">
                                    <h4>Unassigned</h4>
                                    {unassignedBlock}
                                </div>
                            }
                        </div>
                    </div>
                )
            }}
        />
    );
}