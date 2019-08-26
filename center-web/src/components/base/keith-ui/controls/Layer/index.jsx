import React from 'react';
import ReactDOM from 'react-dom';

import classNames from 'classnames';

import { getClientRect, gid, pushMousePath, getWindowEffectiveRange } from '../../common.js';

let elLayerRoot = document.createElement("div");
document.body.appendChild(elLayerRoot);

class Layer extends React.Component {

    constructor(props) {
        super(props);
        this.ktId = gid(props);
        this.state = {
            top: 0,
            left: 0,
            display: ""
        };
        this.elControl = React.createRef();
    }

    show(elPosition) {
        this.elControl.current.style.display = "block";
        let position = getClientRect(elPosition);

        let left = position.left - 3;
        let top = position.top + position.height - 3;

        let range = getWindowEffectiveRange();
        let boxWidth = this.elControl.current.offsetWidth;
        if (range.left_02 < left + boxWidth) {
            left = range.left_02 - boxWidth - 10;
        }
        let boxHeight = this.elControl.current.offsetHeight;
        if (range.top_02 < top + boxHeight) {
            top = range.top_02 - boxHeight - 10;
        }

        this.setState({
            left,
            top,
            display: "block"
        })
    }

    hide() {
        this.elControl.current.style.display = "";
    }

    mouseDown = () => {
        pushMousePath(this.ktId);
    }

    render() {
        return ReactDOM.createPortal(
            (
                <div ref={this.elControl} className="kt-ui kt-layer" onMouseDown={this.mouseDown} style={{ top: this.state.top, left: this.state.left }}>
                    {this.props.children}
                </div>
            ),
            elLayerRoot
        );
    }

}

export default Layer;