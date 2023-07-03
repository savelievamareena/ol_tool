import {Field, Form} from 'react-final-form';
import './App.css';
import React from "react";

export default function App() {
    const [positionsAll, setPositionsAll] = React.useState([]);
    const [positionsSelected, setPositionsSelected] = React.useState([]);

    const [allGroups, setAllGroups] = React.useState([]);
    const [unassigned, setUnassigned] = React.useState([]);

    const handleChange = (event) => {
        if(event.target.name === "positionsAll") {
            setPositionsAll(typeof event.target.value === 'string' ? event.target.value.trim().split('\n') : []);
        }
        if(event.target.name === "positionsSelected") {
            setPositionsSelected(typeof event.target.value === 'string' ? event.target.value.trim().split('\n') : []);
        }
    };

    function findWordsInArray(positionToSearch, array) {
        let result = [];
        let searchStringAsArray = positionToSearch.split(' ');
        array.forEach(positionAsString => {
            let match = true;
            searchStringAsArray.forEach(searchWord => {
                const regex = new RegExp(`\\b${searchWord}s?\\b`, 'i');
                if(!regex.test(positionAsString)) {
                    match = false;
                }
            })
            if(match) {
                result.push(positionAsString);
            }
        })
        return result;
    }

    React.useEffect(() => {
        let resultArr = [];
        let assigned = [];
        positionsSelected.forEach((positionToSearch) => {
            let resultArray = findWordsInArray(positionToSearch, positionsAll);
            if(resultArray.length > 0) {
                resultArray.forEach(el => assigned.push(el))
                let groupObj = {name: positionToSearch, positions: resultArray}
                resultArr.push(groupObj)
            }
        })
        let unassignedPositions = positionsAll.filter(el => !assigned.includes(el));
        setUnassigned(unassignedPositions);

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
        resultArr = resultArr.filter(resObj => resObj.positions.length > 0);
        setAllGroups(resultArr);

    }, [positionsAll, positionsSelected])

    let resultBlocks = allGroups.map((resultColumn, i) => {
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

    let unassignedBlock = unassigned.map((unassigned, i) => {
        return (
            <div key={i}>
                {unassigned}
            </div>
        )
    })

    const MyForm = () => (
        <Form
            onSubmit={values => {console.log(values)}}
            render={({handleSubmit: ffSubmitHandler}) => {
                return <form onSubmit={ffSubmitHandler} className="contentBlock">
                    <div className="input-block">
                        <Field
                            name="positionsAll"
                            render={(fieldRenderProps) => (
                                <div>
                                    <label>Positions All</label><br/>
                                    <textarea style={{height: '400px', width: '300px'}}
                                              onChange={function (e) {
                                                  handleChange(e);
                                                  fieldRenderProps.input.onChange(e);
                                              }}
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
                                              onChange={function (e) {
                                                  handleChange(e);
                                                  fieldRenderProps.input.onChange(e);
                                              }}
                                              value={fieldRenderProps.input.value}
                                              name={fieldRenderProps.input.name}
                                    />
                                </div>
                            )}
                        />
                    </div>
                </form>
            }}
        />
    )

    return (
        <div>
            <div className="App">
                {MyForm()}
            </div>
            <div className="resultsBlock contentBlock">
                {resultBlocks}
                {unassigned.length >0 &&
                    <div className="resultCol">
                        <h4>unassigned</h4>
                        {unassignedBlock}
                    </div>
                }
            </div>
        </div>
    );
}