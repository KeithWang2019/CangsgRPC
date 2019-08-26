import React from 'react';

import classNames from 'classnames';

import { pushMousePath, gid } from '../../common.js';
import Input from '../Input/index.jsx';
import Modal from '../Modal/index.jsx';
import DatePanel from './DatePanel.jsx';


class DatePicker extends React.Component {

    constructor(props) {
        super(props);
        this.modal = React.createRef();

        this.ktId = gid(props);
    }

    render() {
        return (
            <React.Fragment>
                <Input {...this.props} modal={this.modal} ktId={this.ktId}></Input>
                <Modal ref={this.modal} ktId={this.ktId}>
                    <DatePanel></DatePanel>
                </Modal>
            </React.Fragment>
        );
    }

}

export default DatePicker;