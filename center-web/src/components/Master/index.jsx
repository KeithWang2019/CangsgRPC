import React, { Suspense, lazy } from 'react';

import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';

import { loadQuickNavigation } from 'store/actions/master';
import QuickNavigation from './QuickNavigation';
import UserPanel from './UserPanel';

import Home from 'components/Home';
import NoMatch from 'components/NoMatch';
const TodoList = React.lazy(() => import('components/TodoList'));
const XxxList = React.lazy(() => import('components/XxxList'));

class Master extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.loadQuickNavigation(document.location.pathname);
    }

    render() {
        return (
            <div>
                <div className="wrapper top">
                    <div className="head-container">
                        <div className="logo"></div>
                    </div>
                </div>
                <div>
                    <div className="wrapper middle">
                        <Router>
                            <UserPanel></UserPanel>
                            <div className="left">
                                <QuickNavigation></QuickNavigation>
                            </div>
                            <div className="top-panel"></div>
                            <div className="right">
                                <div className="container">
                                    <Suspense fallback={<div>Loading...</div>}>
                                        <Switch>
                                            <Route exact path="/" component={Home} />
                                            <Route path="/hello/d" component={TodoList} />
                                            <Route path="/hello/e" component={TodoList} />
                                            <Route path="/about/b/c" component={XxxList} />
                                            <Route component={NoMatch} />
                                        </Switch>
                                    </Suspense>
                                </div>
                            </div>
                        </Router>
                    </div>
                </div>
                <div className="wrapper bottom"></div>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    loadQuickNavigation: path => {
        dispatch(loadQuickNavigation(path)).then(() => {
            console.log("导航加载完成");
        });
    }
});

export default connect(null, mapDispatchToProps)(Master);