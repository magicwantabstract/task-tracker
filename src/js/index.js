const emitter = new EventEmitter();
const PAGE_TASK = 3;

const taskDB = [
  {
    description: 'Купить молока.',
    id: 1,
    completed: false,
    tags: ["#horses", "#horse", "#horsesofinstagram", "#TagsForLikes", "#TagsForLikesApp", "#horseshow", "#horseshoe", "#horses_of_instagram", "#horsestagram", "#instahorses", "#wild", "#mane", "#instagood", "#grass", "#field", "#farm", "#nature", "#pony", "#ponies", "#ilovemyhorse", "#babyhorse", "#beautiful", "#pretty", "#photooftheday", "#gallop", "#jockey", "#rider", "#riders", "#riding"],
    project: 'LoveYouLoveShe',
    priority: 0,
    timeDeath: 0,
    notes: [],
    //timer: ['00', '00', '10'],
    stopwatch: ['01', '04', '44']
  },
  {
    description: 'Выпить колы.',
    id: 2,
    completed: false,
    tags: ["#insects", "#insect", "#bug", "#bugs", "#TagsForLikes", "#TagsForLikesApp", "#bugslife", "#macro", "#closeup", "#nature", "#animals", "#animals", "#instanature", "#instagood", "#macrogardener", "#macrophotography", "#creature", "#creatures", "#macro_creature_feature", "#photooftheday", "#wildlife", "#nature_shooters", "#earth", "#naturelover", "#lovenature"],
    project: 'strong',
    priority: 0,
    timeDeath: 0,
    notes: [],
    //timer: null,
    stopwatch: null
  },
  {
    description: 'Познакомиться с девочкой.',
    id: 3,
    completed: false,
    tags: ["#onedirection", "#TagsForLikesApp", "#harrystyles", "#niallhoran", "#zaynmalik", "#louistomlinson", "#liampayne", "#TagsForLikes", "#1d", "#directioner", "#1direction", "#niall", "#harry", "#zayn", "#liam", "#louis", "#leeyum", "#zjmalik", "#iphonesia", "#hot", "#love", "#cute", "#happy", "#beautiful", "#boys", "#guys", "#instagood", "#photooftheday"],
    project: 'loveAllWorld',
    priority: 0,
    timeDeath: 0,
    notes: [],
    //timer: ['00', '00', '14'],
    stopwatch: null
  }
];

const archiv = [{
  description: 'Выйти на улицу разок.',
  id: 1322131231231232,
  completed: true,
  tags: ["#onedirection", "#TagsForLikesApp", "#harrystyles", "#niallhoran", "#zaynmalik", "#louistomlinson", "#liampayne", "#TagsForLikes", "#1d", "#directioner", "#1direction", "#niall", "#harry", "#zayn", "#liam", "#louis", "#leeyum", "#zjmalik", "#iphonesia", "#hot", "#love", "#cute", "#happy", "#beautiful", "#boys", "#guys", "#instagood", "#photooftheday"],
  project: 'loveasdasdsadrld',
  priority: 0,
  timeDeath: 0,
  notes: [],
  //timer: ['00', '00', '14'],
  stopwatch: null
}];

const getTask = (list, id) => {
  let needIndex;

  list.forEach(function(item, index) {
      if (item.id == id) needIndex = index;
  });

  return {
    list: list,
    index: needIndex
  };
};

const getPropTask = (list, field, type, task, value) => {
  let f;

  switch (type) {
  case 'field':
      f = (task ?  function(item, index) {
        if (field in item)  return item;
      } : function(item, index) {
        if (field in item)  return item[field];
      });
      break;
  case 'value':
      f = (task ? function(item, index) {
        if (item[field].indexOf(value))  return item;
      } : function(item, index) {
        if (item[field].indexOf(value))  return item[field];
      });
      break;
  default:
      break;
  }

  return list.map(f);
};


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: 'project',
      tasks: taskDB
    };

  }

  componentWillMount() {
    emitter.removeListener('Transfer');
  }

  render() {
    return (
      <div className="app">
        <Bar />
        <NavigationMenu />
        <PlaceAddTask />
        {this.takeView(this.state.location)}
      </div>
    );
  }

  componentDidMount() {
    emitter.addListener('Transfer', (view) => {
      this.setState({location: view});
    });
  }

  takeView(path) {
    switch (path) {
    case 'main':
        return <Main />;
    case 'project':
        return <FolderList tasks={this.state.tasks} />;
    case 'tag':
        return <TagsCloud tasks={this.state.tasks} />;
    case 'setting':
        return <Setting />;
    case 'help':
        return <Help />;
    case 'stats':
        return <Stats />;
    case 'archiv':
        return <Archiv />;
    default:
        break;
    }
  }
};


class FolderList extends React.Component {
  constructor(props) {
    super(props);
    this.getTaskInFolder = this.getTaskInFolder.bind(this);
  }

  render() {
    const folders = this.showFolder();
    return <div className="folder-view-mode">{folders}</div>;
  }

  getTaskInFolder(project) {
    return this.props.tasks.filter(function(item) {
      if (item.project == project) return item;
    });
  }

  showFolder(project) {
    const folders = [];

    return this.props.tasks.map((item, index) => {
      if (!(~folders.indexOf(item.project))) {
        folders.push(item.project);
        return <Folder tasks={this.getTaskInFolder} name={`@${item.project}`} />;
      }
    });
  }
};


class Bar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div className="bar"></div>;
  }
};


class NavigationMenu extends React.Component {
  constructor(props) {
    super(props);
    this.handlerClickBtn = this.handlerClickBtn.bind(this);
  }

  handlerClickBtn(loc) {
    emitter.emit('Transfer', loc);
  }

  render() {
    return (
      <div className="navigation-menu">
        <div
          className='navigation-menu-btn main'
          onClick={this.handlerClickBtn.bind(this, 'main')}>
          main
        </div>
        <div
          className='navigation-menu-btn project'
          onClick={this.handlerClickBtn.bind(this, 'project')}>
          project
        </div>
        <div
          className='navigation-menu-btn tag'
          onClick={this.handlerClickBtn.bind(this, 'tag')}>
          tag
        </div>
        <div
          className='navigation-menu-btn stats'
          onClick={this.handlerClickBtn.bind(this, 'stats')}>
          stats
        </div>
        <div
          className='navigation-menu-btn archiv'
          onClick={this.handlerClickBtn.bind(this, 'archiv')}>
          archiv
        </div>
        <div
          className='navigation-menu-btn setting'
          onClick={this.handlerClickBtn.bind(this, 'setting')}>
          setting
        </div>
      </div>
    )
  }
};

class Folder extends React.Component {
  constructor(props) {
    super(props);
    this.handlerClickFolder = this.handlerClickFolder.bind(this);
  }

  handlerClickFolder(name) {
    const tasks = this.props.tasks(name);
  }

  render() {
    return (
      <div
        className="folder"
        onClick={this.handlerClickFolder(this.props.name)}>
        {this.props.name}
      </div>
    )
  }
};

class TaskList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: taskDB
    };
  }

  componentWillUnmount() {
    emitter.removeListener('Add');
    emitter.removeListener('Del');
    emitter.removeListener('Done');
  }

  render() {
    const tasks = this.getListTask(getPropTask(
        this.props.list,
        this.props.field,
        this.props.type,
        this.props.task,
        this.props.value),
      this.props.quantity);

    return (
      <div className="view list">{tasks}</div>
    );
  }

  componentDidMount() {
    emitter.addListener('Add', (item) => {
      const newTask = item.concat(this.state.tasks);
      this.setState({tasks: newTask});
    });

    emitter.addListener('Del', (id) => {
      const list = this.state.tasks;
      const task = getTask(list, id);
      list.splice(task.index, 1);
      list.timer = null;
      this.setState({tasks: list});
    });

    emitter.addListener('Done', (id) => {
      const list = this.state.tasks;
      const task = getTask(list, id);
      list[task.index].completed = true;
      this.setState({tasks: list});
    });

  }

  getListTask(list, quantity) {
    return list.map((item, index) => {

      if (quantity && !item.completed) {
        quantity--;
        return (
          <Task
            key={index}
            data={item.description}
            timer={item.timer}
            stopwatch={item.stopwatch}
            id={item.id}
          />
        );
      }

    });
  }
};


class PlaceAddTask extends React.Component {
  constructor(props) {
    super(props);
    this.handlerClickBtn = this.handlerClickBtn.bind(this);
  }

  handlerClickBtn(e) {
    if (!this.refs.textTask.value.length) return;
    const item = this.createTask();

    emitter.emit('Add', item);
    this.refs.textTask.value = "";
  }

  render() {
    return (
      <div className="add-task">
        <textarea
          className="add-task-area"
          placeholder="#tags @project *priority %time death $time start"
          defaultValue=""
          ref="textTask">
        </textarea>
        <div
          className="add-task-btn"
          onClick={this.handlerClickBtn}>
        </div>
      </div>
    );
  }

  parser(str) {
    const result    = {};
    result.str      = str;
    result.tags     = result.str.match(/#\w*/g);
    result.str      = result.str.replace(/#\w*/g, '');
    result.priority = result.str.match(/\*{2,}/g);
    result.str      = result.str.replace(/\*{2,}/g, '');
    result.project  = result.str.match(/@\w*/g);
    result.str      = result.str.replace(/@\w*/g, '');
    result.str      = result.str.trim();
    result.time     = null;
    return result;
  }

  createTask() {
    const newTask = this.parser(this.refs.textTask.value);

    const task = [{
      description: newTask.str,
      id: Math.floor(Math.random() * Math.pow(10, 6)),
      completed: false,
      tags: newTask.tags,
      project: newTask.project,
      priority: newTask.priority,
      timeDeath: 0,
      notes: [],
      date: new Date(),
      timer: newTask.timer,
      stopwatch: [0, 0, 0]
    }];

    return task;
  }
};


class Task extends React.Component {
  constructor(props) {
    super(props);
    this.stats = {completed: false};
    this.handlerDelBtn = this.handlerDelBtn.bind(this);
    this.handlerCheckComplete = this.handlerCheckComplete.bind(this);
  }

  handlerDelBtn() { emitter.emit('Del', this.props.id); }

  handlerCheckComplete() {
    this.setState({completed: !this.state.completed});
    emitter.emit('Done', this.props.id);
  }

  render() {
    return (
      <div
        className="task">
        <p className="task-data">{this.props.data}</p>
        <span
          className="task-delete"
          onClick={this.handlerDelBtn}>
        </span>
        <label
          className="task-label-checkbox"
          for="checkboxFourInput">
            <input
              type="checkbox"
              className="task-input-checkbox"
              id="checkboxFourInput"
              onChange={this.handlerCheckComplete}
            />
        </label>
        {this.props.stopwatch ?
          (<Stopwatch stopwatch={this.props.stopwatch} />) :
          null
        }
        {this.props.timer ?
          (<Timer
            index={this.props.index}
            timer={this.props.timer}
            id={this.props.id} />) :
            null
        }
      </div>
    );
  }
};


class Stopwatch extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      watch: this.props.stopwatch,
      stop: true
    };

    this.handlerClickBtn = this.handlerClickBtn.bind(this);
    this.handlerInterval = this.handlerInterval.bind(this);
  }

  handlerClickBtn(e) {
    e.preventDefault();
    this.setState({stop: !this.state.stop});
  }

  handlerInterval() {
    this.setState({watch: this.tick(this.state.watch)});
  }

  render() {
    return (
      <p className="stopwatch">
        [<span>{this.state.watch[0]}</span>:
         <span>{this.state.watch[1]}</span>:
         <span>{this.state.watch[2]}</span>]
      <input
        type="button"
        className="stopwatch-toggle"
        onClick={this.handlerClickBtn}/>
      </p>
    );
  }

  componentDidUpdate() {
    if (this.state.stop) {
      clearInterval(this.plank);
      this.plank = null;
    } else if (!this.plank) {
      this.plank = setInterval(this.handlerInterval, 1000);
    }
  }

  tick(state) {
    let [hh, mm, ss] = state;

    if (ss != 59) {
      ss += 1;
    } else if (ss == 59) {
      mm += 1;
      ss = 0;
    } else if (mm == 59) {
      hh += 1;
      mm = 0;
    }

    return [
      hh < 10 ? `0${hh}` : `${hh}`,
      mm < 10 ? `0${mm}` : `${mm}`,
      ss < 10 ? `0${ss}` : `${ss}`
    ];
  }
};


class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.stats = {
      timer: taskDB[getTask(taskDB, this.props.id).index].timer
    }
  }

  componentWillMount() {
    clearInterval(this.timer);
  }

  render() {
    return (
      <p className='timer'>[
        <span>{this.state.timer[0]}</span>:
        <span>{this.state.timer[1]}</span>:
        <span>{this.state.timer[2]}</span>
      ]</p>
    );
  }

  componentDidMount() {
    const self = this;

    if (this.timer && !this.state.timer && self.maxValArr(self.state.timer)) return;

    this.timer = setInterval(function() {
      self.setState({timer: self.tick(self.state.timer)});

      if (self.maxValArr(self.state.timer)) return;
      clearInterval(self.timer);
      self.timer = null;
      emitter.emit('Del', self.props.id);
    }, 1000);
  }

  tick(state) {
    let hh = Number(state[0]),
        mm = Number(state[1]),
        ss = Number(state[2]);

    if (this.maxValArr(state)) {
      if (ss > 0) {
        ss -= 1;
      } else if (ss == 0) {
        mm -= 1;
        ss = 59;
      } else if (mm == 0) {
        hh -= 1;
        mm = 59;
      }
    }

    return [
      hh < 10 ? `0${hh}` : `${hh}`,
      mm < 10 ? `0${mm}` : `${mm}`,
      ss < 10 ? `0${ss}` : `${ss}`
    ];
  }

  maxValArr(arr) {
    return Math.max.apply(null, arr);
  }
};

class TagsCloud extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
    <div className="view cloud-tags">
        {getPropTask(this.props.tasks, 'tags', 'field', false, null)
          .join('')
          .split(',')
          .join(' ')}
    </div>);
  }
};

class Setting extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div className="view">
      <p>music</p>
      <p>save</p>
      <p>save</p>
      <p>save</p>
      <p>save</p>
      <p>save</p>
      <p>save</p>
      <p>save</p>
      <p>save</p>
      <p>save</p>
    </div>
  }
};

class Help extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="view">
        <h2>DOCS</h2>
        <h2>Motivation</h2>
      </div>
    );
  }
};

class Stats extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="view">
        <p>привет</p>
        <p>привет</p>
        <p>привет</p>
      </div>
    );
  }
};

class Archiv extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <TaskList
        list    ={archiv}
        field   ={'description'}
        type    ={'field'}
        task    ={true}
        value   ={null}
        quantity={PAGE_TASK}
      />
    );
  }
};

class Main extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <TaskList
        list    ={taskDB}
        field   ={'description'}
        type    ={'field'}
        task    ={true}
        value   ={null}
        quantity={PAGE_TASK}
      />
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);