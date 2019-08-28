import React from 'react';

import classNames from 'classnames';

import Base from '../Base';
import { pushMousePath, gid, parseTime, parseTimeFormat, currentTime, addTime } from '../../common.js';

class DateLayer extends Base {

    constructor(props) {
        super(props);
        this.state = {
            year: 2019,
            month: 8,
            weeks: [],
            rows: []
        }
    }

    init(val) {
        let date = val;
        if (val) {
            date = parseTime(val);
        }
        else {
            date = new Date();
        }

        let weeks = ["一", "二", "三", "四", "五", "六", "日"];

        let rows = [];

        let now = new Date();
        let year = parseTimeFormat(date, "yyyy");
        let month = parseTimeFormat(date, "M");
        let day = parseTimeFormat(date, "d");

        this.setState({
            year,
            month
        });

        let nowYear = parseTimeFormat(now, "yyyy");
        let nowMonth = parseTimeFormat(now, "M");
        let nowDay = parseTimeFormat(now, "d");

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
            rows.push({ row: i, cells: [] });
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

                rows[i].cells.push(objDay);
                thatDay = addTime(3, thatDay, 1);
            }
        }

        this.setState({
            weeks,
            rows
        });
    }

    selectDay(item) {
        this.updateModel("value", item.fullDay);
    }

    render() {
        return (
            <div className="kt-datepicker-layer">
                <div className="header">
                    <div className="left-item"><svg className="cac-icon btn-prev" aria-hidden="true"><use xlinkHref="#cac-angle-left"></use></svg></div>
                    <div className="center-item">
                        <div className="btn-year"><span>{this.state.year}</span><span>年</span></div>
                        <div className="btn-month"><span>{this.state.month}</span><span>月</span></div>
                    </div>
                    <div className="right-item"><svg className="cac-icon btn-next" aria-hidden="true"><use xlinkHref="#cac-angle-right"></use></svg></div>
                </div>
                <div className="bodyer">
                    <div className="week">
                        <div className="row">
                            {
                                this.state.weeks.map((week, index) => (
                                    <div className="cell" key={week}>
                                        <div className={"day week" + index}><span>{week}</span></div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                    <div className="date">
                        {
                            this.state.rows.map((row, index) => (
                                <div className="row" key={index}>
                                    {
                                        row.cells.map((cell, index) => (
                                            <div className="cell" key={cell.fullDay} onClick={this.selectDay.bind(this, cell)}>
                                                <div className={classNames("day", { "can-choice-day": cell.isClick, "not-choice-day": !cell.isClick, "not-this-month-day": !cell.isCurrent, "current-day": cell.isNowDay, "selected-day": cell.isSelectDay })}><span>{cell.day}</span></div>
                                            </div>
                                        ))
                                    }
                                </div>
                            ))
                        }


                    </div>
                </div>
                <div className="footer">
                    <div className="center-item">
                        <div className="btn-today"><span>今天</span></div>
                    </div>
                </div>
            </div>
        );
    }

}

export default DateLayer;