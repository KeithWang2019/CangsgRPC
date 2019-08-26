import React from 'react';

import classNames from 'classnames';

import { pushMousePath, gid } from '../../common.js';
import Input from '../Input/index.jsx';
import Layer from '../Layer/index.jsx';
import DateLayer from './DateLayer.jsx';


class DatePicker extends React.Component {

    constructor(props) {
        super(props);
        this.layer = React.createRef();
        this.ktId = gid(props);
    }

    mouseIn = (el) => {
        this.layer.current.show(el);
    }

    mouseOut = (el) =>{
        this.layer.current.hide();
    }

    render() {
        return (
            <React.Fragment>
                <Input {...this.props} onMouseIn={this.mouseIn} onMouseOut={this.mouseOut} ktId={this.ktId}></Input>
                <Layer ref={this.layer} ktId={this.ktId}>
                    <DateLayer></DateLayer>
                </Layer>
            </React.Fragment>
        );
    }

}

export default DatePicker;