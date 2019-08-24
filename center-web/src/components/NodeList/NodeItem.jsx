import React from 'react';

function NodeItem(props) {
    return <div className="node-item">{`${props.address.host}:${props.address.port}`}</div>
}

export default NodeItem;