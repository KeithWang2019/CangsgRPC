import React from 'react';
import ReactDOM from 'react-dom';

import classNames from 'classnames';

import { getClientRect, gid, pushMousePath, getWindowEffectiveRange } from '../../common.js';

let elModelRoot = document.createElement("div");
document.body.appendChild(elModelRoot);

class Model extends React.Component {

    constructor(props) {
        super(props);
        this.el = document.createElement("div");
        this.el.className = "keith-ui kt-layer";
        this.ktId = gid(props);     
    }

    componentDidMount() {
        elModelRoot.appendChild(this.el);
    }

    componentWillUnmount() {
        elModelRoot.removeChild(this.el);
    }

    show(elMain) {                
        this.el.style.display = "block";
        let position = getClientRect(elMain);

        let left = position.left - 5;
        let top = position.top + position.height;

        let range = getWindowEffectiveRange();
        let boxWidth = this.el.offsetWidth;
        if (range.left_02 < left + boxWidth) {
            left = range.left_02 - boxWidth - 10;
        }
        let boxHeight = this.el.offsetHeight;
        if (range.top_02 < top + boxHeight) {
            top = range.top_02 - boxHeight - 10;
        }

        this.el.style.left = left + "px";
        this.el.style.top = top + "px";
    }

    hide() {
        this.el.style.display = "";
    }

    mouseDown = () => {
        pushMousePath(this.ktId);
    }

    render() {
        return ReactDOM.createPortal(
            (
                <div onMouseDown={this.mouseDown}>
                    {this.props.children}
                </div>
            ),
            this.el
        );
    }

}

export default Model;