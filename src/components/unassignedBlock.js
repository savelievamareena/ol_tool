import React from "react"
import UnassignedRow from "./unassignedRow";

export default function UnassignedBlock({unassigned: unassignedProp}) {

    return (unassignedProp.length > 0 && unassignedProp[0] !== "") ?
        <div className="resultCol">
            <h4>Unassigned</h4>
            {
                unassignedProp.map((unassignedEl, key) => {
                    return (
                        <UnassignedRow {...{unassignedEl, key}} />
                    )
                })
            }
        </div> : <React.Fragment />;
}
