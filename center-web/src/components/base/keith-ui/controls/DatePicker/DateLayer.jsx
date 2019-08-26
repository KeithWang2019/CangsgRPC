import React from 'react';

import classNames from 'classnames';

import { pushMousePath, gid } from '../../common.js';

class DateLayer extends React.Component {

    constructor(props) {
        super(props);          
    }
    
    render() {
        return (
            <div className="kt-datepicker-layer">
                <div className="header"></div>
                <div className="bodyer"></div>
                <div className="footer"></div>
            </div>
        );
    }

}

export default DateLayer;