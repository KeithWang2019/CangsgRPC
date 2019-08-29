import React from 'react';

import classNames from 'classnames';

import Base from '../Base';
import { pushMousePath, gid, parseTime, isTime } from '../../common.js';
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
        if (!this.check(this.state.value)) {
            console.log(this.state.value);
            this.setState({
                value: ""
            });
        }
    }

    check(val) {
        if (isTime(val)) {
            return true;
        }
        return false;
    }

    onUpdateModel = (key, val) => {
        let obj = {};
        switch (key) {
            case "value":
                obj.value = val;
                this.setState(obj);
                if (this.check(val)) {
                    this.ctlDateLayer.current.init(val);
                }
                break;
        }
    }

    render() {
        return (
            <React.Fragment>
                <Input {...this.props} value={this.state.value} onMouseIn={this.mouseIn} onMouseOut={this.mouseOut} ktId={this.ktId}></Input>
                <Layer ref={this.ctlLayer} ktId={this.ktId}>
                    <DateLayer ref={this.ctlDateLayer} ktId={this.ktId}></DateLayer>
                </Layer>
            </React.Fragment>
        );
    }

}

export default DatePicker;