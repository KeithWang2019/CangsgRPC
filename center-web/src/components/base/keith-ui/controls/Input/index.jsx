import React from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import Base from '../Base';
import { pushMousePath, gid } from '../../common.js';


class Input extends Base {

    constructor(props) {
        super(props);
        this.state = {
            active: false
        };

        this.elControl = React.createRef();
        this.elInput = React.createRef();
    }

    mouseIn = (e) => {
        this.setState({
            active: true
        });

        pushMousePath(this.ktId, () => {
            this.setState({
                active: false
            })
            if (this.props.onMouseOut) {
                this.props.onMouseOut();
            }
            if (this.updateModel) {
                this.updateModel("value", this.elInput.current.value);
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
        this.updateModel("value", this.elInput.current.value);
        console.log("change");
    }

    render() {
        return (
            <div ref={this.elControl} onMouseDown={this.mouseIn} onKeyUp={this.keyUp} className={classNames("kt-ui", "kt-size-" + this.props.size)} style={{ width: this.props.width }} >
                <div className={classNames("kt-border", { "kt-active": this.state.active })}>
                    <input ref={this.elInput} type="text" className="kt-input" placeholder={this.props.placeholder} value={this.props.val} onChange={this.change} />
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
    updateModel: PropTypes.func
}

Input.defaultProps = {
    size: "default"
}

export default Input;