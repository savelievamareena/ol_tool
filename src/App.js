import {Field, Form} from 'react-final-form'
import './App.css';
import React from "react"

export default function App() {
    const [positionsAll, setPositionsAll] = React.useState([]);
    const [positionsSelected, setPositionsSelected] = React.useState([]);
    // const [form, setForm] = React.useState({
    //     positionsAll: '',
    //     positionsSelected: '',
    // });

    const [allGroups, setAllGroups] = React.useState([]);
    const [unassigned, setUnassigned] = React.useState([]);

    const handleSubmit = values => {
        const arrayAll = values.positionsAll.split('\n');
        const arraySelected = values.positionsSelected.split('\n');
        const all = arrayAll.map(el => el.trim());
        const selected = arraySelected.map(el => el.trim());
        // setForm({
        //     ...form,
        //     positionsAll: all,
        //     positionsSelected: selected
        // });
        setPositionsAll(all);
        setPositionsSelected(selected)
    }

    // const handleChange = (event) => {
    //     console.log("changed")
    //
    //     setForm({
    //         ...form,
    //         [event.target.name]: event.target.value.split('\n'),
    //     });
    // };

    function findWordsInArray(positionToSearch, array) {
        let result = [];
        let searchStringAsArray = positionToSearch.split(' ');
        array.forEach(positionAsString => {
            let match = true;
            searchStringAsArray.forEach(searchWord => {
                const regex = new RegExp(`\\b${searchWord}\\b`, 'i');
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
            onSubmit={handleSubmit}
            render={({handleSubmit}) => {
                return <form onSubmit={handleSubmit} className="contentBlock">
                    <div className="input-block">
                        <Field
                            name="positionsAll"
                            render={({ input}) => (
                                <div>
                                    <label>Positions All</label><br/>
                                    <textarea {...input} style={{ height: '400px', width: '300px' }} />
                                </div>
                            )}
                        />
                        <Field
                            name="positionsSelected"
                            render={({ input, value}) => (
                                <div>
                                    <label>Positions Selected</label><br/>
                                    <textarea {...input} {...value} style={{ height: '400px', width: '300px' }} />
                                </div>
                            )}
                        />
                    </div>

                    <button type="submit" className="submit-button">Submit</button>
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
