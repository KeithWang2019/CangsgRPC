import React from 'react';

import classNames from 'classnames';

import Base from '../Base';
import { pushMousePath, gid, parseTime, parseTimeFormat, currentTime, addTime } from '../../common.js';

import SelectYear from './SelectYear';
import SelectMonth from './SelectMonth';

class DateLayer extends Base {

    constructor(props) {
        super(props, "DateLayer");
        this.state = {
            year: 0,
            month: 0,
            weeks: [],
            days: []
        };
        this.value = "";
        this.today = "";
        this.ctlSelectYear = React.createRef();
        this.ctlSelectMonth = React.createRef();
    }

    init(val) {
        this.rendering = true;
        let date = null;
        if (typeof (val) == "string") {
            if (val) {
                date = parseTime(val);
            }
            else {
                date = new Date();
            }
        }
        else {
            date = val;
        }

        let weeks = ["一", "二", "三", "四", "五", "六", "日"];

        // let rows = [];
        let days = [];

        let year = parseTimeFormat(date, "yyyy");
        let month = parseTimeFormat(date, "M");
        let day = parseTimeFormat(date, "d");
        this.value = parseTimeFormat(date, "yyyy-MM-dd");

        let now = new Date();
        let nowYear = parseTimeFormat(now, "yyyy");
        let nowMonth = parseTimeFormat(now, "M");
        let nowDay = parseTimeFormat(now, "d");
        this.today = parseTimeFormat(now, "yyyy-MM-dd");

        let thatMonthFirstDay = parseTime(`${year}-${month}-1`);
        let week = parseInt(parseTimeFormat(thatMonthFirstDay, "W"));
        let n = 0;

        //一周以周一开始
        switch (week) {
            case 0:
                n = 6;
                break;
            default:
                n = week - 1;
                break;
        }

        //一周以周日开始
        //n = week;

        let thatDay = addTime(3, thatMonthFirstDay, -n);

        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 7; j++) {
                let jDay = parseTimeFormat(thatDay, "d");
                let jMonth = parseTimeFormat(thatDay, "M");
                let jYear = parseTimeFormat(thatDay, "yyyy");
                let jFullDay = parseTimeFormat(thatDay, "yyyy-MM-dd");

                let objDay = { isCurrent: false, isSelectDay: false, isNowDay: false, isClick: true, day: jDay, fullDay: jFullDay };
                if (month == jMonth) {
                    objDay.isCurrent = true;
                }
                if (day == jDay && month == jMonth && year == jYear) {
                    objDay.isSelectDay = true;
                }
                if (nowDay == jDay && nowMonth == jMonth && nowYear == jYear) {
                    objDay.isNowDay = true;
                }

                days.push(objDay);
                thatDay = addTime(3, thatDay, 1);
            }
        }

        this.setState({
            year,
            month,
            weeks,
            days
        });
        // this.ctlSelectYear.current.close();
        // this.ctlSelectMonth.current.close();
    }

    selectDay = (e) => {
        this.dispatch("value", e.currentTarget.dataset.day);
    }

    prevMonth = () => {
        let date = addTime(2, this.value, -1);
        this.init(date);
    }

    nextMonth = () => {
        let date = addTime(2, this.value, 1);
        this.init(date);
    }

    selectToday = () => {
        this.dispatch("value", this.today);
    }

    initSelectYear = () => {
        this.flowIndex = 1;
        let date = parseTime(this.value);
        this.ctlSelectYear.current.init(date);
    }

    initSelectYearFromSelectMonth = () => {
        this.flowIndex = 2;
        let date = parseTime(this.value);
        this.ctlSelectYear.current.init(date);
    }

    initSelectMonth = () => {
        let date = parseTime(this.value);
        this.ctlSelectMonth.current.init(date);
    }

    onlySelectYear = (year) => {
        let date = parseTimeFormat(this.value, `${year}-MM-dd`);
        this.init(date);
        if (this.flowIndex == 2) {
            this.ctlSelectMonth.current.init(date);
        }
    }

    onlySelectMonth = (month) => {
        let date = parseTimeFormat(this.value, `yyyy-${month}-dd`);
        this.init(date);
    }

    onRender() {
        return (
            <div className="kt-datepicker-layer">
                <div className="header">
                    <div className="left-item" onClick={this.prevMonth}><svg className="cac-icon btn-prev" aria-hidden="true"><use xlinkHref="#cac-angle-left"></use></svg></div>
                    <div className="center-item">
                        <div className="btn-year" onClick={this.initSelectYear}><span>{this.state.year}</span><span>年</span></div>
                        <div className="btn-month" onClick={this.initSelectMonth}><span>{this.state.month}</span><span>月</span></div>
                    </div>
                    <div className="right-item" onClick={this.nextMonth}><svg className="cac-icon btn-next" aria-hidden="true"><use xlinkHref="#cac-angle-right"></use></svg></div>
                </div>
                <div className="bodyer">
                    <div className="week">
                        {
                            this.state.weeks.map((week, index) => (
                                <div className="cell" key={week}>
                                    <div className={"day week" + index}><span>{week}</span></div>
                                </div>
                            ))
                        }
                    </div>
                    <div className="date">
                        {
                            this.state.days.map((cell, index) => (
                                <div className="cell" key={index} onClick={this.selectDay} data-day={cell.fullDay}>
                                    <div className={classNames("day", { "can-choice-day": cell.isClick, "not-choice-day": !cell.isClick, "not-this-month-day": !cell.isCurrent, "current-day": cell.isNowDay, "selected-day": cell.isSelectDay })}><span>{cell.day}</span></div>
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className="footer">
                    <div className="center-item">
                        <div className="btn-today" onClick={this.selectToday}><span>今天</span></div>
                    </div>
                </div>
                <SelectMonth kid={this.kid} ref={this.ctlSelectMonth} onlySelectMonth={this.onlySelectMonth} initSelectYear={this.initSelectYearFromSelectMonth}></SelectMonth>
                <SelectYear kid={this.kid} ref={this.ctlSelectYear} onlySelectYear={this.onlySelectYear}></SelectYear>
            </div>
        );
    }

}

export default DateLayer;