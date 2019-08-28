import React from 'react';

import classNames from 'classnames';

import Base from '../Base';
import { pushMousePath, gid, parseTime } from '../../common.js';
import Input from '../Input/index.jsx';
import Layer from '../Layer/index.jsx';
import DateLayer from './DateLayer.jsx';


class DatePicker extends Base {

    constructor(props) {
        super(props);
        this.state = {
            value: ""
        };
        this.ctlLayer = React.createRef();
        this.ctlDateLayer = React.createRef();
    }

    mouseIn = (el) => {
        this.ctlLayer.current.show(el);
        this.ctlDateLayer.current.init(this.state.value);
    }

    mouseOut = (el) => {
        this.ctlLayer.current.hide();
    }

    onUpdateModel = (key, val) => {
        let obj = {};
        switch (key) {
            case "value":
                obj.value = val;
                this.setState(obj, () => {
                    this.ctlDateLayer.current.init(val);
                });
                break;
        }
    }

    render() {
        return (
            <React.Fragment>
                <Input {...this.props} val={this.state.value} onMouseIn={this.mouseIn} onMouseOut={this.mouseOut} ktId={this.ktId}></Input>
                <Layer ref={this.ctlLayer} ktId={this.ktId}>
                    <DateLayer ref={this.ctlDateLayer} ktId={this.ktId}></DateLayer>
                </Layer>
            </React.Fragment>
        );
    }

}

export default DatePicker;