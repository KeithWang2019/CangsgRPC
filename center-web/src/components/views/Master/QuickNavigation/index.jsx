import React from 'react';
import { BrowserRouter as Router, Route, Link, matchPath } from "react-router-dom";
import classNames from 'classnames';

import { connect } from 'react-redux';

import { action } from 'store/modules/quickNavigation';

class QuickNavigationItem extends React.Component {

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        if (this.props.type == "group") {
            if (this.props.to != nextProps.to || this.props.open != nextProps.open) {
                return true;
            }
        }
        else {
            if (this.props.to != nextProps.to) {
                return true;
            }
        }
        return false;
    }

    openClick = () => {
        this.props.handleClick(this.props.to, !this.props.open);
    }

    render() {
        console.log("render -> QuickNavigationItem" + this.props.to)
        switch (this.props.type) {
            case "group":
                const listItems = this.props.child && this.props.child.map((item, index) => {
                    return (<QuickNavigationItem to={item.to} label={item.label} type={item.type} key={index} child={item.child} level={this.props.level + 1} icon={item.icon} open={item.open} handleClick={this.props.handleClick} />)
                });

                return (
                    <div>
                        <a>
                            <div className={classNames("quick-nav", "quick-nav-group", { "open": this.props.open, "close": !this.props.open })} style={{ paddingLeft: this.props.level * 12 }} onClick={this.openClick}>
                                <svg className="cac-icon" style={{ fontSize: 16 }} aria-hidden="true"><use xlinkHref={classNames({ '#cac-folder': !this.props.open, '#cac-folder-open': this.props.open })}></use></svg>
                                <span>{this.props.label}</span>
                            </div>
                        </a>
                        {
                            listItems &&
                            <div className={classNames("quick-nav-group-list", { "open": this.props.open, "close": !this.props.open })}>
                                {listItems}
                            </div>
                        }
                    </div >
                );
            default:
                return (
                    <Route
                        path={this.props.to}
                        exact={true}
                        children={({ match }) => (
                            <Link to={this.props.to}>
                                <div className={classNames("quick-nav", "quick-nav-item", { "active": match })} style={{ paddingLeft: this.props.level * 12 }}>
                                    <svg className="cac-icon" style={{ fontSize: 14 }} aria-hidden="true"><use xlinkHref={this.props.icon}></use></svg><span>{this.props.label}</span>
                                </div>
                            </Link>
                        )}
                    />
                );
        }
    }
}

function QuickNavigation(props) {
    const quickNavigation = props.quickNavigation;

    return (
        <div className="quick-navigation">
            {
                quickNavigation.map((item, index) => {
                    return (<QuickNavigationItem to={item.to} label={item.label} type={item.type} key={index} child={item.child} level={1} icon={item.icon} handleClick={props.handleGroupClick} open={item.open} />)
                })
            }
        </div>
    );
}

const mapStateToProps = state => ({
    quickNavigation: state.quickNavigation
});

const mapDispatchToProps = dispatch => ({
    handleGroupClick: (path, open) => {
        dispatch(action.openQuickNavigation(path, open)).then(() => {

        });
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(QuickNavigation);