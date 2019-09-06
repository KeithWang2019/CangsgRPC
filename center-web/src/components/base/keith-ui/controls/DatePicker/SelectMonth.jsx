import React from 'react';

import classNames from 'classnames';

import Base from '../Base';
import { pushMousePath, gid, parseTime, parseTimeFormat, currentTime, addTime } from '../../common.js';

class SelectMonth extends Base {

    constructor(props) {
        super(props, "SelectMonth");
        this.state = {
            opacity: 0,
            display: ""
        }
        this.months = [];
        this.centerYear = null;
        this.centerMonth = null;
    }

    init(date) {
        this.months = [];

        let year = parseInt(parseTimeFormat(date, "yyyy"));
        let month = parseInt(parseTimeFormat(date, "M"));

        this.centerYear = year;
        this.centerMonth = month;
        for (let i = 1; i <= 12; i++) {
            this.months.push({ title: i, selected: i == month ? true : false });
        }

        this.rendering = true;
        this.setState({
            display: "block"
        }, () => {
            setImmediate(() => {
                this.rendering = true;
                this.setState({
                    opacity: 1
                })
            });
        });
    }

    close() {
        if (this.state.display != "") {
            this.rendering = true;
            this.setState({
                display: "",
                opacity: 0
            });
        }
    }

    click(monthItem) {
        this.props.onlySelectMonth(monthItem.title);
        this.close();
    }

    clickInitSelectYear = () => {
        this.props.initSelectYear();
    }


    onRender() {
        return (
            <div className="select-month" style={{ display: this.state.display, opacity: this.state.opacity }}>
                <div className="select-header">
                    <span className="center-text" onClick={this.clickInitSelectYear}>{this.centerYear}年</span>
                </div>
                <div className="select-bodyer">
                    {
                        this.months.map(monthItem =>
                            <div className={classNames("year-button", { "selected": monthItem.selected })} key={monthItem.title} onClick={() => this.click(monthItem)}><span>{monthItem.title}月</span></div>
                        )
                    }
                </div>
            </div>
        );
    }

}

export default SelectMonth;