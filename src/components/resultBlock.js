import React from "react"
import PositionRow from "./positionRow";

export default function ResultBlock({name: nameProp, positions: positionsProp}) {
    return (
        <div className="resultCol">
            <h4>{nameProp}</h4>
            {
                positionsProp.map((position, key) => {
                    return (
                        <PositionRow {...{position, key}} />
                    )
                })
            }
        </div>
    )
}
