import React           from 'react';
import ReactDOM        from 'react-dom';
import Field           from './Field.jsx';
import Search          from './Search.jsx';
import Task            from './Task.jsx';
import {journal, temp} from '../db/journal.js';

export default class List extends React.Component {
  constructor(props) {
    super(props);

    this.handleClickBack = this.handleClickBack.bind(this);
    this.getDate = this.getDate.bind(this);
    this.getCompTasks = this.getCompTasks.bind(this);
  }

  handleClickBack(e) {
    window.dispatchEvent(new CustomEvent('BACK'));
  }

  render() {
    return (
      <div className='list'>
        <div className='list__container'>
        {this.props.type === 'project' ?
          (<span
            className='list__button-back'
            onClick={this.handleClickBack}>
            {'\u25C0 back'}
          </span>) :
          null
        }
        {this.props.type !== 'archiv' ? <Search /> : null}
        {this.props.type !== 'archiv' ? <Field /> : null}
          <div className='list__container-task-box'>
            <div className='list__container-task'>
            {this.getCompTasks(this.getTasks(this.props.type, this.props.db))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  getTasks(type, db) {

    switch (type) {
    case 'inbox':
        return this.getInboxTasks(db);
    case 'archiv':
        return db.filter(item => {
          if (item.project === 'ARCHIV') return item;
        })[0].tasks;
    case 'project':
        return db.filter(item => {
          if (item.project === this.props.projectName) return item;
        })[0].tasks;
    case 'search':
        const val = this.props.value;
        return this.getInboxTasks(db).filter((item, d, array) => {
          if (~item.description.search(new RegExp(`${val}`, 'i'))) return item;
        });
    }

  }

  getInboxTasks(db) {
    return db.filter(item => {
      if (!(item.project === 'ARCHIV'))  return item;
    }).reduce((sum, item) => sum.concat(item.tasks), []);
  }

  getCompTasks(tasks) {
    const exceptions = ['project', 'archiv', 'search'];

    function compareDateYMD(date1, date2) {
      if (!date1 || !date2) return false;

      // short name string to date, param string, return create date
      const std = s => new Date(s);
      date1 = std(date1);
      date2 = std(date2);

      if (!(date1.getFullYear() === date2.getFullYear()) ||
          !(date1.getMonth()    === date2.getMonth())    ||
          !(date1.getDay()      === date2.getDay())) {
          return false;
      }

      return true;
    }

    return tasks.map((task, i) => {

      if (compareDateYMD(temp.date, task.date) ||
        ~exceptions.indexOf(this.props.type)) {
        return (
          <Task
            journal={this.props.journal}
            info={task}
            key={task.id}
            stopwatch={this.props.stopwatch}
          />
        );
      } else {
        temp.date = task.date;
        return this.getDate(task, task.date);
      }

    });
  }

  getDate(task, date) {
    return (
      <div
        className='list__container-date list__container-date_vertical'
        key={task.id}
      >
        <p className='list__date'>{this.getFormatDate(task.date)}</p>
        <Task
          journal={this.props.journal}
          info={task}
          stopwatch={this.props.stopwatch}
        />
      </div>
    );
  }

  getFormatDate(date) {
    function getNameMonth(month) {
      switch (month) {
      case 0:
          return 'January';
      case 1:
          return 'February';
      case 2:
          return 'March';
      case 3:
          return 'April';
      case 4:
          return 'May';
      case 5:
          return 'June';
      case 6:
          return 'July';
      case 7:
          return 'August';
      case 8:
          return 'September';
      case 9:
          return 'October';
      case 10:
          return 'November';
      case 11:
          return 'December';
      }
    }
    // d - short name date
    const d = new Date(date);
    return `${d.getDate()}, ${getNameMonth(d.getMonth())} ${d.getFullYear()}`;
  }

};