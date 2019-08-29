import React from 'react';
import PropTypes from 'prop-types';
import { gid } from '../../common';

// let _controls = {};
// window._kt_controls = _controls;
let _kt_root_controls = {};
window._kt_root_controls = _kt_root_controls;

class Base extends React.Component {

    constructor(props) {
        super(props);
        this.ktId = 0;

        if (props.ktId) {
            this.ktId = props.ktId;
        }
        else {
            this.ktId = gid();
            _kt_root_controls[this.ktId] = this;
        }
    }

    dispatch(key, val) {
        if (_kt_root_controls[this.ktId] && _kt_root_controls[this.ktId].onDispatch) {
            _kt_root_controls[this.ktId].onDispatch(key, val);
        }
    }

    updateModel(val) {
        if (this.props.model && this.props.model.length >= 2) {
            let key = this.props.model[1];
            let refObj = this.props.model[0][key];
            for (let i = 2; i < this.props.model.length - 1; i++) {
                key = this.props.model[i];
                refObj = refObj[key];
            }
            key = this.props.model[this.props.model.length - 1];
            refObj[key] = val;
        }
    }

    componentWillUnmount() {
        _kt_root_controls[this.ktId] = null;
        delete _kt_root_controls[this.ktId];
    }

}

Base.propTypes = {
    ktId: PropTypes.number,
    model: PropTypes.array
}

Base.defaultProps = {
    ktId: 0
}

export default Base;