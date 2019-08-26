import React from 'react';

function NodeItem(props) {
    return (
        <div className="node-item">
            <div className="node-item-header">
                <div className="header-left"><svg className="cac-icon computer-active" style={{ fontSize: 20 }} aria-hidden="true"><use xlinkHref="#cac-laptop"></use></svg></div>
                <div className="header-center">{props.nodeType}</div>
                <div className="header-right"></div>
            </div>
            <div className="node-item-bodyer">
                <div className="panel-pair"><span className="panel-key">IP</span><span className="panel-value">{props.address.host}</span></div>
                <div className="panel-pair"><span className="panel-key">Port</span><span className="panel-value">{props.address.port}</span></div>
            </div>
        </div>
    );
}

export default NodeItem;