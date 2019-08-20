import React from 'react';
import { connect } from 'react-redux';

import { test, toggleTodo } from 'store/actions/index2';

const TodoList = ({ xxx, myClick }) => (
    <ul onClick={myClick} className="my">
        {xxx.map(todo => (
            <div key={todo}>{todo}</div>
        ))}
    </ul>
)

const mapStateToProps = state => ({
    xxx: state.xxx
});

const mapDispatchToProps = dispatch => ({
    myClick: id => {
        dispatch(test()).then(() => {
            alert("ok");
        });
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(TodoList);