import React from 'react';

import classNames from 'classnames';

import Base from '../Base';
import { pushMousePath, gid, parseTime, isTime, parseTimeFormat } from '../../common.js';
import Input from '../Input/index.jsx';
import Layer from '../Layer/index.jsx';
import DateLayer from './DateLayer.jsx';


class DatePicker extends Base {

    constructor(props) {
        super(props, "DatePicker");
        this.ctlLayer = React.createRef();
        this.ctlDateLayer = React.createRef();
        this.ctlInput = React.createRef();
    }

    shouldComponentUpdate(nextProps) {
        if (this.props.value != nextProps.value || this.props.disabled != nextProps.disabled) {
            return true;
        }
        return false;
    }

    mouseIn = (el) => {
        this.ctlLayer.current.show(el);
        this.ctlDateLayer.current.init(this.props.value);
        this.ctlDateLayer.current.ctlSelectYear.current.close();
        this.ctlDateLayer.current.ctlSelectMonth.current.close();
    }

    mouseOut = (el) => {
        this.ctlLayer.current.hide();
        if (!this.dispatch("check", this.props.value)) {
            this.dispatch("out", "");
        }
        else {
            this.dispatch("out", parseTimeFormat(this.props.value, "yyyy-MM-dd"));
        }
    }

    onDispatch = (key, val) => {
        switch (key) {
            case "value":
                if (this.dispatch("check", val)) {
                    this.ctlDateLayer.current.init(val);
                }
                this.updateModel(val);
                break;
            case "out":
                if (this.props.value != val) {
                    this.updateModel(val);
                }
                break;
            case "goto":
                return this.ctlInput.current.elBorder.current;
            case "check":
                if (val == "" || isTime(val)) {
                    return true;
                }
                return false;
        }
    }

    onRender() {
        return (
            <React.Fragment>
                <Input {...this.props} kid={this.kid} ref={this.ctlInput} value={this.props.value} onMouseIn={this.mouseIn} onMouseOut={this.mouseOut}>
                    {
                        (part) => {
                            switch (part) {
                                case "front":
                                    return (<span className="kt-front-text">去：</span>)
                                case "end":
                                    return (
                                        <React.Fragment>
                                            <span className="kt-icon-text">{parseTimeFormat(this.props.value, "周w")}</span>
                                            <svg className={classNames("cac-icon", "kt-icon-datepicker")} aria-hidden="true"><use xlinkHref={"#cac-calendar-alt"}></use></svg>
                                        </React.Fragment>
                                    )
                            }
                        }
                    }
                </Input>
                <Layer kid={this.kid} ref={this.ctlLayer}>
                    <DateLayer kid={this.kid} ref={this.ctlDateLayer}></DateLayer>
                </Layer>
            </React.Fragment>
        );
    }

}

export default DatePicker;