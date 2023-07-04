import {Field, Form} from 'react-final-form';
import './App.css';
import React from "react";
import ResultBlocksContainer from "./components/resultBlocksContainer";

export default function App() {
    return (
        <Form
            onSubmit={values => {console.log(1)}}
            render={function({handleSubmit, reset, submitting, pristine, values}) {
                let positionsAllArr = values.positionsAll ? values.positionsAll.trim().split('\n') : [];
                let positionsSelectedArr = values.positionsSelected ? values.positionsSelected.trim().split('\n') : [];

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
                        <div className="contentBlock">
                            <ResultBlocksContainer {...{positionsAllArr, positionsSelectedArr}} />
                        </div>
                    </div>
                )
            }}
        />
    );
}