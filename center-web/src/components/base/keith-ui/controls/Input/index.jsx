import React from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import { pushMousePath, gid } from '../../common.js';


class Input extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            active: false
        };
        this.ktId = gid(props); //复合id传递        
        this.elControl = React.createRef();
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

    render() {
        return (
            <div ref={this.elControl} onMouseDown={this.mouseIn} onKeyUp={this.keyUp} className={classNames("kt-ui", "kt-size-" + this.props.size)} style={{ width: this.props.width }} >
                <div className={classNames("kt-border", { "kt-active": this.state.active })}>
                    <input type="text" className="kt-input" placeholder={this.props.placeholder} />
                </div>
            </div>
        );
    }
}

Input.propTypes = {
    ktId: PropTypes.number,
    size: PropTypes.oneOf(['small', 'default', 'large']).isRequired,
    width: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    onMouseIn: PropTypes.func,
    onMouseOut: PropTypes.func
}

Input.defaultProps = {
    size: "default"
}

export default Input;