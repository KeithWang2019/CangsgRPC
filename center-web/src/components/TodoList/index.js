import React from 'react';
import { connect } from 'react-redux';

import { test } from 'store/actions/index';


class TodoList extends React.Component {
    constructor(props) {
        super(props);
        this.state = { date: new Date() };
    }

    componentDidMount() {
        console.log("mount");
    }

    componentWillUnmount() {
        console.log("unmount");
    }

    render() {
        return (
            <ul onClick={this.props.myClick} className="my">
                <h1>{this.state.date.toLocaleTimeString()}</h1>
                {this.props.todos.map((todo, index) => (
                    <div key={index}>{todo}==11</div>
                ))}
            </ul>
        );
    }
}

const mapStateToProps = state => ({
    todos: state.todos
});

const mapDispatchToProps = dispatch => ({
    myClick: id => {
        dispatch(test()).then((r) => {
            console.log(r);
        });
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(TodoList);