import React from 'react';
import { connect } from 'react-redux';

import { action } from 'store/modules/nodeList';

import NodeItem from './NodeItem';

class NodeList extends React.Component {
    constructor(props) {
        super(props);
        props.loadData();
    }

    render() {
        return (
            <div className="node-list" onClick={this.props.myClick}>
                {this.props.nodeList.map((node, index) =>
                    <NodeItem key={index} {...node} />
                )}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    nodeList: state.nodeList
});

const mapDispatchToProps = dispatch => ({
    loadData: () => {
        dispatch(action.queryNodes()).then((r) => {
            console.log(r);
        });
    },
    myClick: id => {

    }
});

export default connect(mapStateToProps, mapDispatchToProps)(NodeList);