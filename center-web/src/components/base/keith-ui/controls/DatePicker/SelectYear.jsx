import React from 'react';

import classNames from 'classnames';

import Base from '../Base';
import { pushMousePath, gid, parseTime, parseTimeFormat, currentTime, addTime } from '../../common.js';

class SelectYear extends Base {

    constructor(props) {
        super(props, "SelectYear");
        this.state = {
            opacity: 0,
            display: ""
        }
        this.years = [];
        this.centerYear = null;
    }

    init(date, inlineCall) {
        this.years = [];

        let year = 0;
        if (inlineCall) {
            year = date;
        }
        else {
            year = parseInt(parseTimeFormat(date, "yyyy"));
        }
        this.centerYear = year;
        let firstYear = year - 4;
        for (let i = 0; i < 12; i++) {
            this.years.push({ title: firstYear + i, selected: i == 4 ? true : false });
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

    click(yearItem) {
        this.props.onlySelectYear(yearItem.title);
        this.close();
    }

    prevYears = () => {
        this.init(this.centerYear - 12, true);
    }

    nextYears = () => {
        this.init(this.centerYear + 12, true);
    }

    onRender() {
        return (
            <div className="select-year" style={{ display: this.state.display, opacity: this.state.opacity }}>
                <div className="select-header">
                    <svg className={classNames("cac-icon", "prev-button")} onClick={this.prevYears} aria-hidden="true"><use xlinkHref={"#cac-angle-double-left"}></use></svg>
                    <span className="center-text">{this.centerYear - 4}年-{this.centerYear + 7}年</span>
                    <svg className={classNames("cac-icon", "next-button")} onClick={this.nextYears} aria-hidden="true"><use xlinkHref={"#cac-angle-double-right"}></use></svg>
                </div>
                <div className="select-bodyer">
                    {
                        this.years.map(yearItem =>
                            <div className={classNames("year-button", { "selected": yearItem.selected })} key={yearItem.title} onClick={() => this.click(yearItem)}><span>{yearItem.title}年</span></div>
                        )
                    }
                </div>
            </div>
        );
    }

}

export default SelectYear;