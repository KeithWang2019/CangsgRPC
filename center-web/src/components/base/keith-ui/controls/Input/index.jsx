import React from 'react';

import classNames from 'classnames';

import { pushMousePath, gid } from '../../common.js';


class Input extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            size: "default",
            ktActive: false
        };
        this.ktId = gid(props);

        switch (props["kt-size"]) {
            case "small":
                this.state.size = "small";
                break;
            case "default":
                this.state.size = "default";
                break;
            case "large":
                this.state.size = "large";
                break;
        }

        this.el = React.createRef();
    }

    mouseDownBorder = (e) => {
        this.setState({
            ktActive: true
        });

        pushMousePath(this.ktId, () => {
            this.setState({
                ktActive: false
            })
            if (this.props.modal) {
                this.props.modal.current.hide();
            }
        });
        if (this.props.modal) {
            this.props.modal.current.show(this.el.current);
        }
    }

    render() {
        return (
            <div ref={this.el} onMouseDown={this.mouseDownBorder} className={classNames("keith-ui", "kt-input", "kt-size-" + this.state.size, { "kt-active": this.state.ktActive })} style={{ width: this.props["kt-width"] }} >
                <input type="text" placeholder={this.props.placeholder} />
            </div>
        );
    }
}

export default Input;