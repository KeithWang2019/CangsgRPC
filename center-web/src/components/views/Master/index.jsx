import React, { Suspense, lazy } from 'react';

import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';

import { handleMousePath } from 'keith-ui/common.js';

import { action } from 'store/modules/quickNavigation';

import QuickNavigation from './QuickNavigation';
import UserPanel from './UserPanel';

import Home from 'views/Home';
const FrontDemo = React.lazy(() => import('views/FrontDemo'));
import NoMatch from 'views/NoMatch';
const NodeList = React.lazy(() => import('views/NodeList'));

class Master extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.loadQuickNavigation(document.location.pathname);
    }

    mouseDownDocument = (e) => {
        handleMousePath();
    }

    keyUpDocument = (e) => {
        switch (e.key) {
            case "Tab":
                this.mouseDownDocument(e);
                break;
        }
    }

    render() {
        return (
            <div onMouseDown={this.mouseDownDocument} onKeyUp={this.keyUpDocument}>
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
                                            <Route exact path="/front/demo" component={FrontDemo} />
                                            <Route path="/main/nodes" children={<NodeList key="nodes" />} />
                                            <Route path="/main/e" children={<NodeList key="2" />} />
                                            <Route path="/about/b/c" children={<NodeList key="3" />} />
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
        dispatch(action.loadQuickNavigation(path));
    }
});

export default connect(null, mapDispatchToProps)(Master);