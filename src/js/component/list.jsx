import React    from 'react';
import ReactDOM from 'react-dom';
import Field    from './field.jsx';
import Search   from './search.jsx';
import Task     from './task.jsx';

export default class List extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='list'>
        {this.props.type !== 'archiv' ? <Search /> : null}
        {this.props.type !== 'archiv' ? <Field />  : null}
        {this.getCompTasks(this.getTasks(this.props.type, this.props.db))}
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
    return tasks.map((task, i) => <Task info={task} key={task.id} />);
  }
};