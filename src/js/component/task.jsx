import React     from 'react';
import ReactDOM  from 'react-dom';
import Stopwatch from './stopwatch.jsx';
import Timer     from './timer.jsx';

export default class Task extends React.Component {
  constructor(props) {
    super(props);

    this.state = {edit: false};

    this.handleDelete   = this.handleDelete.bind(this);
    this.handleNote     = this.handleNote.bind(this);
    this.handleComplete = this.handleComplete.bind(this);
    this.handleEdit     = this.handleEdit.bind(this);
    this.handleSaveEdit = this.handleSaveEdit.bind(this);

    this.setStateToggleEdit = this.setStateToggleEdit.bind(this);
    this.edit               = this.edit.bind(this);
    this.content            = this.content.bind(this);
    this.archiv             = this.archiv.bind(this);
    this.timer              = this.timer.bind(this);
    this.getClearJournal    = this.getClearJournal.bind(this);
    this.diffArrs           = this.diffArrs.bind(this);
    this.diffDate           = this.diffDate.bind(this);
    this.addArrs            = this.addArrs.bind(this);
    this.color              = this.color.bind(this);
  }

  handleDelete() {
    window.dispatchEvent(new CustomEvent('deleteTask', {
      detail: {id: this.props.info.id}
    }));
  }

  handleComplete(e) {
    window.dispatchEvent(new CustomEvent('complete', {
      detail: {id: this.props.info.id}
    }));
    e.target.checked = false;
  }

  handleEdit() {
    this.setStateToggleEdit();
  }

  handleSaveEdit(e) {
    this.setStateToggleEdit();
    window.dispatchEvent(new CustomEvent('save', {
      detail: {
        value: ReactDOM.findDOMNode(this.refs.value).value,
        id: this.props.info.id
      }
    }));
  }

  handleNote(e) {
    if (!e.target.classList.contains('note-btn')) return;
    window.dispatchEvent(new CustomEvent('openNote', {
      detail: {
        id: this.props.info.id,
        value: this.props.info.note
      }
    }));
  }

  render() {
    const time = this.diffDate(this.props.info.project === 'ARCHIV' ?
                               [] :
                               this.getClearJournal(this.props.info.id));

    return (
      <div className='task'>
        {this.edit()}
        {this.content(time.stopwatch, time.timer)}
        {this.archiv()}
      </div>
    );
  }

  componentDidMount() {
    if (this.state.edit) document.querySelector('.edit-field').focus();
  }

  componentWillUnmount() {
    if (!(this.props.info.project === 'ARCHIV')) {
      window.dispatchEvent(new CustomEvent('setInJournal', {
        detail: {
          id: this.props.info.id,
          date: new Date()
        }
      }));
    }
  }

  timer(time) {
    const t = this.props.info.timeDeath;

    if (!t) return;

    return (
      <Timer
        className='wrap'
        delete={this.handleDelete}
        id={this.props.info.id}
        time={time}
      />
    );
  }

  edit() {
    if (!this.state.edit) return;

    return (
      <span className={'wrap ' + this.color()}>
        <input
          className='edit-field'
          type='text'
          ref='value'
          defaultValue={`${this.props.info.description}`}
        />
        <span className='save' onClick={this.handleSaveEdit}></span>
        <span className='exit' onClick={this.handleEdit}></span>
      </span>
    );
  }

  content(stopwatch, timer) {
    if (this.props.info.project === 'ARCHIV' || this.state.edit) return;

    return (
      <span className={'wrap ' + this.color()}>
        <lable
          onClick={this.handleComplete}
          className='complete'>
        <input type='checkbox'/>
        </lable>
        <p className='descript'>{this.props.info.description}</p>
        {this.timer(timer)}
        <Stopwatch
          id={this.props.info.id}
          time={stopwatch}
        />
        <span
          title='edit task'
          className='edit-btn'
          onClick={this.handleEdit}>
        </span>
        <span
          title='open note'
          className='note-btn'
          onClick={this.handleNote}>
        </span>
        <span
          title='delete task'
          className='delete-btn'
          onClick={this.handleDelete}>
        </span>
      </span>
    );
  }

  archiv() {
    if (this.props.info.project !== 'ARCHIV') return;
    return (
      <span className='wrap level-one'>
        <p className='descript archiv'>{this.props.info.description}</p>
        <span className='delete-btn' onClick={this.handleDelete}></span>
      </span>
    );
  }

  setStateToggleEdit() { this.setState({edit: !this.state.edit}); }

  getClearJournal(id) {
    let index;
    const tmp = this.props.journal.filter((item, i)=> {

      if (item.id === id) {
        index = i;
        return true;
      }

      return false;

    });

    window.dispatchEvent(new CustomEvent('clearJournal', {
      detail: {index: index}
    }));

    return tmp; // timer, stopwatch ...
  }

  diffDate(journal) {
    const timer     = this.props.info.timeDeath,
          stopwatch = this.props.info.stopwatch,
          result    = {
            timer: timer,
            stopwatch: stopwatch
          };

    if (!journal.length) return result;

    // j - short name from journal
    const j = (typeof(journal[0].date) === 'string') ? new Date(journal[0].date) :
      journal[0].date;

    const journalToFormat = [j.getHours(), j.getMinutes(), j.getSeconds()];

    const now = new Date();

    const nowDate = [now.getHours(), now.getMinutes(), now.getSeconds()];

    if (timer) {
      result.timer = this.formatTimer(this.diffArrs
                                     (timer, this.formatTimer
                                     (this.diffArrs
                                     (nowDate, journalToFormat))));
    }

    if (!timer || Math.min(...result.timer) < 0) result.timer = timer;

    if (stopwatch.some(item => item > 0)) {
      result.stopwatch = this.formatStopwatch(this.addArrs(stopwatch, this.formatTimer(this.diffArrs(nowDate, journalToFormat))));
    } else {
      result.stopwatch = stopwatch;
    }

    return result;
  }

  diffArrs(arr1, arr2) {
    for (let i = arr1.length; --i >= 0;) arr1[i] -= arr2[i];
    return arr1;
  }

  addArrs(arr1, arr2) {
    for (let i = arr1.length; --i >= 0;) arr1[i] += arr2[i];
    return arr1;
  }

  formatTimer(arr) {

    for (let i = arr.length; --i >= 0;) {

      while (arr[i] < 0) {

        if (arr[i] < 0) {
          arr[i] += 60;

          if (0 <= (i - 1)) {
            arr[i - 1] -= 1;
          } else {
            arr[i] = arr[i + 1] = arr[i + 2] = 0;
          }

        }

      }

    }

    return arr;
  }

  formatStopwatch(arr) {

    for (let i = arr.length; --i >= 0;) {

      while (arr[i] > 59) {

        if (arr[i] > 59) {
          arr[i] -= 60;
          if (0 <= (i - 1)) arr[i - 1] += 1;
        }

      }

    }

    return arr;
  }

  color() {

    switch (this.props.info.priority) {
    case 0:
        return 'level-one';
    case 1:
        return 'level-two';
    case 2:
        return 'level-three';
    case 3:
        return 'level-four';
    case 4:
        return 'level-five';
    }

  }

};
