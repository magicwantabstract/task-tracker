import React     from 'react';
import ReactDOM  from 'react-dom';
import Content   from '../component/content.jsx';
import Nav       from '../component/nav.jsx';
import Help      from '../component/help.jsx';
import {db}      from '../db/index.js';
import {journal} from '../db/journal.js';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      db: db,
      journal: journal
    };

    this.handleNavBtn       = this.handleNavBtn.bind(this);
    this.handleAddNewTask   = this.handleAddNewTask.bind(this);
    this.handleSearchReq    = this.handleSearchReq.bind(this);
    this.handleDeleteFolder = this.handleDeleteFolder.bind(this);
    this.handleDeleteTask   = this.handleDeleteTask.bind(this);
    this.handleCompleteTask = this.handleCompleteTask.bind(this);
    this.handleSaveEdit     = this.handleSaveEdit.bind(this);
    this.handleOpenNote     = this.handleOpenNote.bind(this);
    this.handleSaveNote     = this.handleSaveNote.bind(this);
    this.handleBackContent  = this.handleBackContent.bind(this);
    this.handleTick         = this.handleTick.bind(this);
    this.handleCancelTimer  = this.handleCancelTimer.bind(this);
    this.handleSetJournal   = this.handleSetJournal.bind(this);
    this.handleClearJournal = this.handleClearJournal.bind(this);

    this.searchTaskDb  = this.searchTaskDb.bind(this);
    this.setStateDB    = this.setStateDB.bind(this);
    this.getFolderOfDb = this.getFolderOfDb.bind(this);
  }

  handleDeleteFolder(e) {
    e.preventDefault();
    const db = [...this.state.db]
    db.splice(this.getFolderOfDb(e.detail.project), 1);
    this.setStateDB(db);
  }

  handleNavBtn(e) {
    e.preventDefault();
    this.setState({viewContent: e.detail.category});
  }

  handleAddNewTask(e) {
    e.preventDefault();
    const db = this.state.db.slice();

    const folder = this.getFolderOfDb(e.detail.project) || db.length;

    if (folder === db.length) {
      db.unshift({
        project: e.detail.project,
        tasks: [e.detail],
        note: ''
      });
    } else {
      db[folder].tasks.unshift(e.detail);
    }

    this.setState({db: db});
  }

  handleSearchReq(e) {
    e.preventDefault();
    this.setState({
      viewContent: 'search',
      value: e.detail.value
    });
  }

  handleDeleteTask(e) {
    const db   = [...this.state.db],
          task = this.searchTaskDb(e.detail.id, db);

    task.arr.splice(task.i, 1);
    this.setStateDB(db);
  }

  handleCompleteTask(e) {
    const db   = [...this.state.db],
          task = this.searchTaskDb(e.detail.id, db);

    task.arr[task.i].complete = true;
    task.arr[task.i].project  = 'ARCHIV';
    db[this.getFolderOfDb('ARCHIV')].tasks.unshift(task.arr.splice(task.i, 1)[0]);
    this.setStateDB(db);
  }

  handleSaveEdit(e) {
    const db = [...this.state.db];

    if (e.detail.project) {
      const folder = db[this.getFolderOfDb(e.detail.project)];
      folder.project = e.detail.value;

      folder.tasks.forEach(item => item.project = e.detail.value);
    } else if (e.detail.id) {
      const task = this.searchTaskDb(e.detail.id, db);
      task.arr[task.i].description = e.detail.value;
    }

    this.setStateDB(db);
  }

  handleOpenNote(e) {
    this.setState({
      viewContent: 'note',
      value      : e.detail.value,
      edit       : e.detail.project || e.detail.id,
      viewLast   : this.state.viewContent || 'inbox'
    });

  }

  handleSaveNote(e) {
    const db = [...this.state.db];

    if (typeof this.state.edit === 'number') {
      const task = this.searchTaskDb(this.state.edit, db);
      task.arr[task.i].note = e.detail.value;
    } else if (typeof this.state.edit === 'string') {
      this.state.db[this.getFolderOfDb(this.state.edit)].note = e.detail.value;
    }

    this.setState({
      viewContent: this.state.viewLast,
      edit: null,
      db: this.state.db,
      value: null
    });
  }

  handleBackContent(e) {
    if (!this.state.viewLast) return;
    this.setState({
      viewContent: this.state.viewLast,
      viewLast: this.state.viewContent
    });
  }

  handleTick(e) {
    const db = [...this.state.db],
          task = this.searchTaskDb(e.detail.id, db);

    switch (e.detail.type) {
    case 'timer':
        task.arr[task.i].timeDeath = e.detail.time;
        break;
    case 'stopwatch':
        task.arr[task.i].stopwatch = e.detail.time;
        break;
    }

    this.setStateDB(db);
  }

  handleCancelTimer(e) {
    const db = this.state.db.slice();
    db.forEach(item => {
      item.tasks.forEach((item, i, arr) => {
        if (e.detail.id === item.id) {
          item.timeDeath = null;
        }
      });
    });

    this.setState({db: db});
  }

  handleSetJournal(e) { journal.push(e.detail); }

  handleClearJournal(e) {
    journal.splice(e.detail.index, 1);
  }

  componentWillMount() {
    window.removeEventListener('clickNavBtn' , this.handleNavBtn);
    window.removeEventListener('addNewTask'  , this.handleAddNewTask);
    window.removeEventListener('searchValue' , this.handleSearchReq);
    window.removeEventListener('deleteFolder', this.handleDeleteFolder);
    window.removeEventListener('deleteTask'  , this.handleDeleteTask);
    window.removeEventListener('complete'    , this.handleCompleteTask);
    window.removeEventListener('save'        , this.handleSaveEdit);
    window.removeEventListener('openNote'    , this.handleOpenNote);
    window.removeEventListener('saveNote'    , this.handleSaveNote);
    window.removeEventListener('back'        , this.handleBackContent);
    window.removeEventListener('tick'        , this.handleTick);
    window.removeEventListener('deleteTimer' , this.handleCancelTimer);
    window.removeEventListener('clearJournal', this.handleClearJournal);
    window.removeEventListener('setJournal'  , this.handleSetJournal);
  }

  render() {
    return (
      <div className='app'>
        <Nav />
        <Content
          view={this.state.viewContent ? this.state.viewContent : 'inbox'}
          db={this.state.db}
          journal={journal}
          value={this.state.value ? this.state.value : ''}
        />
      </div>
    );
  }

  componentDidMount() {
    window.addEventListener('clickNavBtn' , this.handleNavBtn);
    window.addEventListener('addNewTask'  , this.handleAddNewTask);
    window.addEventListener('searchValue' , this.handleSearchReq);
    window.addEventListener('deleteFolder', this.handleDeleteFolder);
    window.addEventListener('deleteTask'  , this.handleDeleteTask);
    window.addEventListener('complete'    , this.handleCompleteTask);
    window.addEventListener('save'        , this.handleSaveEdit);
    window.addEventListener('openNote'    , this.handleOpenNote);
    window.addEventListener('saveNote'    , this.handleSaveNote)
    window.addEventListener('back'        , this.handleBackContent);
    window.addEventListener('tick'        , this.handleTick);
    window.addEventListener('deleteTimer' , this.handleCancelTimer);
    window.addEventListener('clearJournal', this.handleClearJournal);
    window.addEventListener('setInJournal', this.handleSetJournal);
  }

  searchTaskDb(id, DB) {
    const task = {};
    const db = DB;

    db.forEach(item => {
      item.tasks.forEach((item, i, arr) => {
        if (id === item.id) {
          task.i = i;
          task.arr = arr;
        }
      });
    });

    return task;
  }

  setStateDB(DB) { this.setState({db: DB}); }

  getFolderOfDb(project) {
    let index = null;
    this.state.db.forEach((folder, i) => {
      if (folder.project === project) index = i;
    });

    return index;
  }

};