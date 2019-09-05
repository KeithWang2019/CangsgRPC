import React from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import Base from '../Base';
import { pushMousePath, gid } from '../../common.js';


class Input extends Base {

    constructor(props) {
        super(props, "Input");
        this.state = {
            active: false
        };

        this.elControl = React.createRef();
        this.elBorder = React.createRef();
        this.elInput = React.createRef();
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.value != nextProps.value || this.props.disabled != nextProps.disabled) {
            return true;
        }
        else if (this.state.active != nextState.active) {
            return true;
        }
        return false;
    }

    mouseIn = (e) => {
        if (this.props.disabled) {
            return;
        }

        this.setState({
            active: true
        });

        pushMousePath(this.kid, () => {
            this.setState({
                active: false
            })
            if (this.dispatch) {
                this.dispatch("out", this.elInput.current.value);
            }
            if (this.props.onMouseOut) {
                this.props.onMouseOut();
            }
        });
        if (this.props.onMouseIn) {
            this.props.onMouseIn(this.elControl.current);
        }
    }

    keyUp = (e) => {
        switch (e.key) {
            case "Tab":
                this.mouseIn();
                break;
        }
    }

    change = (e) => {
        this.dispatch("value", this.elInput.current.value);
    }

    onDispatch = (key, val) => {
        switch (key) {
            case "value":
                this.updateModel(val);
                break;
            case "out":
                if (this.props.value != val) {
                    this.updateModel(val);
                }
                break;
            case "goto":
                return this.elBorder.current;
        }
    }

    onRender() {
        return (
            <div ref={this.elControl} onMouseDown={this.mouseIn} onKeyUp={this.keyUp} className={classNames("kt-ui", "kt-size-" + this.props.size)} style={{ width: this.props.width }} >
                <div ref={this.elBorder} className={classNames("kt-border", { "kt-active": this.state.active })}>
                    <div className="kt-input-front">
                        {
                            this.props.children &&
                            (
                                this.props.children("front")
                            )
                        }
                    </div>
                    <input disabled={this.props.disabled} ref={this.elInput} type="text" className="kt-input" placeholder={this.props.placeholder} value={this.props.value} onChange=
                        {this.change} />
                    <div className="kt-input-end">
                        {
                            this.props.children &&
                            this.props.children("end")
                        }
                        {
                            this.props.disabled &&
                            <svg className={classNames("cac-icon", "kt-icon-datepicker")} aria-hidden="true"><use xlinkHref={"#cac-lock"}></use></svg>
                        }

                    </div>
                </div>
            </div>
        );
    }
}

Input.propTypes = {
    size: PropTypes.oneOf(['small', 'default', 'large']).isRequired,
    width: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    onMouseIn: PropTypes.func,
    onMouseOut: PropTypes.func,
    disabled: PropTypes.bool
}

Input.defaultProps = {
    size: "default",
    disabled: false
}

export default Input;