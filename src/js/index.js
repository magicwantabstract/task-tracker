const emitter = new EventEmitter();
const COUNT_TASK_MAIN_APP = 3;
// save value timer in daring
const taskDB = [{
  description: 'Купить молока.',
  id: 1,
  complited: false,
  tags: ["#horses", "#horse", "#horsesofinstagram", "#TagsForLikes", "#TagsForLikesApp", "#horseshow", "#horseshoe", "#horses_of_instagram", "#horsestagram", "#instahorses", "#wild", "#mane", "#instagood", "#grass", "#field", "#farm", "#nature", "#pony", "#ponies", "#ilovemyhorse", "#babyhorse", "#beautiful", "#pretty", "#photooftheday", "#gallop", "#jockey", "#rider", "#riders", "#riding"],
  project: 'LoveYouLoveShe',
  priority: 0,
  timeDeath: 0,
  notes: [],
  //timer: ['00', '00', '10'],
  stopwatch: ['01', '04', '44']
}, {
  description: 'Выпить колы.',
  id: 2,
  complited: false,
  tags: ["#insects", "#insect", "#bug", "#bugs", "#TagsForLikes", "#TagsForLikesApp", "#bugslife", "#macro", "#closeup", "#nature", "#animals", "#animals", "#instanature", "#instagood", "#macrogardener", "#macrophotography", "#creature", "#creatures", "#macro_creature_feature", "#photooftheday", "#wildlife", "#nature_shooters", "#earth", "#naturelover", "#lovenature"],
  project: 'strong',
  priority: 0,
  timeDeath: 0,
  notes: [],
  //timer: null,
  stopwatch: null
}, {
  description: 'Познакомиться с девочкой.',
  id: 3,
  complited: false,
  tags: ["#onedirection", "#TagsForLikesApp", "#harrystyles", "#niallhoran", "#zaynmalik", "#louistomlinson", "#liampayne", "#TagsForLikes", "#1d", "#directioner", "#1direction", "#niall", "#harry", "#zayn", "#liam", "#louis", "#leeyum", "#zjmalik", "#iphonesia", "#hot", "#love", "#cute", "#happy", "#beautiful", "#boys", "#guys", "#instagood", "#photooftheday"],
  project: 'loveAllWorld',
  priority: 0,
  timeDeath: 0,
  notes: [],
  //timer: ['00', '00', '14'],
  stopwatch: null
}, ];

const getTask = function(list, id) {

  function searchTask(list, id) {
    let result;

    list.forEach(function(item, index) {
      if (item.id == id) result = index;
    });

    return result;
  }

  const task = {};

  task.list = list;
  task.index = searchTask(task.list, id);

  return task;
};

const getPropTask = function(list, field) {
  return list.map(function(item, index) {
    if (field in item) return item[field];
  });
};

let nextPath = 'main';

const App = React.createClass({
  getInitialState: function() {
    return {
      location: 'project',
      listTask: false,
      tasks: taskDB
    };
  },

  componentDidMount: function() {
    const self = this;

    emitter.addListener('Transfer', function(view) {
      self.setState({location: view});
    });
  },

  // refactoring on getter/setter in es6 style
  setLocation: function(newLocation) {
    this.setState(newLocation);
  },

  getLocation: function() {
    return this.state.location;
  },

  takeView: function(path) {
    switch (path) {
    case 'main':
        return ( 
          <TaskList
            nowThat={this.getLocation} 
            newThat={this.setLocation} 
            quantity={COUNT_TASK_MAIN_APP} />
        );
        break;
    case 'project':
        return (
          <FolderList 
            tasks={this.state.tasks}
          />
        );
        break;
    case 'tag':
        return (
          <TagsCloud />
        );
        break;
    case 'setting':
        return (
          <Setting />
        );
        break;
    case 'help':
        return (
          <Help />
        );
        break;
    case 'stats':
        return (
          <Stats />
        );
        break;
    case 'archiv':
        return (
          <Archiv />
        );
        break;
    default:
        break;
    }
  },

  render: function() {
    const result = this.takeView(this.state.location);
    console.log(this.state.location);
    return (
      <div className="app">
        <Bar />
        <NavigationMenu />
        <PlaceAddTask />
        {result}
      </div>
    );
  }
});

const FolderList = React.createClass({

  getTaskInFolder: function(project) {
    return this.props.tasks.filter(function(item) {
      if (item.project == project) return item; 
    });
  },

  showFolder: function(project) {
    const folders = [];
    const self = this;
    return this.props.tasks.map(function(item, index) {
      if (!(~folders.indexOf(item.project))) {
        folders.push(item.project);
        return <Folder tasks={self.getTaskInFolder} name={`@${item.project}`} />;
      }
    });
  },

  render: function() {
    const folders = this.showFolder();
    return <div className="folder-view-mode">{folders}</div>;
  }
});

const Bar = React.createClass({
  render: function() {
    return (
      <div className="bar"></div>
    )
  }
});


const NavigationMenu = React.createClass({
  onClickBtn: function(loc) {
    emitter.emit('Transfer', loc);
  },
  render: function() {
    return (
      <div className="navigation-menu">
        <div 
          className='navigation-menu-btn main'    
          onClick={this.onClickBtn.bind(this, 'main')}>
          main
        </div>
        <div 
          className='navigation-menu-btn project' 
          onClick={this.onClickBtn.bind(this, 'project')}>
          project
        </div>
        <div 
          className='navigation-menu-btn tag'     
          onClick={this.onClickBtn.bind(this, 'tag')}>
          tag
        </div>
        <div 
          className='navigation-menu-btn stats'   
          onClick={this.onClickBtn.bind(this, 'stats')}>
          stats
        </div>
        <div 
          className='navigation-menu-btn archiv'  
          onClick={this.onClickBtn.bind(this, 'archiv')}>
          archiv
        </div>
        <div 
          className='navigation-menu-btn setting' 
          onClick={this.onClickBtn.bind(this, 'setting')}>
          setting
        </div>
      </div>
    )
  }
});

const Folder = React.createClass({
  onClickFolder: function(name) {
    const tasks = this.props.tasks(name);
  },

  render: function() {
    return (
      <div 
        className="folder" 
        onClick={this.onClickFolder(this.props.name)}
        >
        {this.props.name}
      </div>
    )
  }
});

const TaskList = React.createClass({
  getInitialState: function() { return {tasks: taskDB}; },

  componentDidMount: function() {
    const self = this;
    emitter.addListener('Add', function(item) {
      const newTask = item.concat(self.state.tasks);
      self.setState({tasks: newTask});
    });

    emitter.addListener('Del', function(id) {
      const task = getTask(self.state.tasks, id);
      task.list.splice(task.index, 1);
      task.list.timer = null;
      self.setState({tasks: task.list});
    });

    emitter.addListener('Done', function(id) {
      const task = getTask(self.state.tasks, id);
      task.list[task.index].complited = true;
      self.setState({tasks: task.list});
    });

  },

  componentWillUnmount: function() {
    emitter.removeListener('Add');
    emitter.removeListener('Del');
    emitter.removeListener('Done');
  },

  getTask: function(list, id) {

    function searchTask(list, id) {
      let result;
      list.forEach(function(item, index) {
        if (item.id == id) result = index;
      });
      return result;
    }

    const task = {};

    task.list = list;
    task.id = searchTask(task.list, id);

    return task;
  },

  propTypes: {
    data: React.PropTypes.shape({
      description: React.PropTypes.string.isRequired
    })
  },

  render: function() {
    let quantity = this.props.quantity;
    const tasks = this.state.tasks.map(function(item, index) {

      if (quantity && !item.complited) {
        quantity = quantity - 1;
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

    return (
      <div className="view list">{tasks}</div>
    );
  }
});


const PlaceAddTask = React.createClass({
  onBtnClickHandler: function(e) {
    if (!this.refs.textTask.value.length) return;
    const item = this.createTask();
    emitter.emit('Add', item);
    this.refs.textTask.value = "";
  },

  parser: function(str) {
    const result    = {};
    result.str      = str;
    result.tags     = result.str.match(/#\w*/g);
    result.str      = result.str.replace(/#\w*/g, '');
    result.priority = result.str.match(/\*{2,}/g);
    result.str      = result.str.replace(/\*{2,}/g, '');
    result.project  = result.str.match(/@\w*/g);
    result.str      = result.str.replace(/@\w*/g, '');
    result.str      = result.str.trim();

    return result;
  },

  createTask: function() {
    const newText = this.parser(this.refs.textTask.value);

    const task = [{
      description: newText.str,
      id: Math.floor(Math.random() * Math.pow(10, 6)),
      complited: false,
      tags: newText.tags,
      project: newText.project,
      priority: newText.priority,
      timeDeath: 0,
      notes: [],
      date: new Date(),
      //timer: [0, 0, 0],
      stopwatch: [0, 0, 0]
    }];

    return task;
  },

  render: function() {
    return (
      <div className="add-task">
        <textarea 
          placeholder="#tags @project *priority %time death $time start" 
          className="add-task-area" 
          defaultValue="" 
          ref="textTask">
        </textarea>
        <div className="add-task-btn" onClick={this.onBtnClickHandler}>
        </div>
      </div>
    );
  }
});


const Task = React.createClass({
  getInitialState: function() {
    return {
      complited: false
    }
  },

  deleteTask: function() {
    emitter.emit('Del', this.props.id);
  },

  onCheckedComplited: function() {
    this.setState({complited: !this.state.complited});
    emitter.emit('Done', this.props.id);
  },

  edit: function() {
    this.props.data
  },

  render: function() {
    return (
      <div className="task" onDblclick={this.edit}>
        <p className="task-data">{this.props.data}</p>
        <span onClick={this.deleteTask} className="task-delete"></span>
        <label
          className="task-label-checkbox"
          for="checkboxFourInput">
            <input
              type="checkbox"
              className="task-input-checkbox"
              id="checkboxFourInput"
              onChange={this.onCheckedComplited}
            />
        </label>
        {this.props.stopwatch ? (<Stopwatch stopwatch={this.props.stopwatch}/>) : null}
        {this.props.timer     ? 
          (<Timer 
            index={this.props.index} 
            timer={this.props.timer} 
            id={this.props.id} />) : null}
      </div>
    );
  }
});


const Stopwatch = React.createClass({
  getInitialState: function() {
    return {
      stopwatch: this.props.stopwatch,
      stop: true,
    };
  },

  componentDidUpdate: function() {
    const self = this;

    if (!this.stopwatch && !this.state.stop && this.state.stopwatch) {
      this.stopwatch = setInterval(function() {
        self.setState({stopwatch: self.tick(false, self.state.stopwatch)});
      }, 1000);
    } else if (this.stopwatch && this.state.stop) {
      clearInterval(this.stopwatch);
      this.stopwatch = null;
    }
  },

  clickBtn: function(e) {
    e.preventDefault();
    this.setState({stop: !this.state.stop});
  },

  render: function() {
    return (
      <p className="stopwatch">
        [<span>{this.state.stopwatch[0]}</span>:
         <span>{this.state.stopwatch[1]}</span>:
         <span>{this.state.stopwatch[2]}</span>]
      <input 
        type="button" 
        className="stopwatch-toggle" 
        onClick={this.clickBtn}/>
      </p>
    );
  },

  tick: function(timer, state) {
    let hh = Number(state[0]), 
        mm = Number(state[1]), 
        ss = Number(state[2]);

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
});


const Timer = React.createClass({
  getInitialState: function() {
    return {
      timer: taskDB[getTask(taskDB, this.props.id).index].timer
    }
  },

  componentDidMount: function() {
    const self = this;

    if (this.timer && !this.state.timer && self.maxValArr(self.state.timer)) return;
    console.log('CREATE TIMER');
    this.timer = setInterval(function() {
      self.setState({timer: self.tick(self.state.timer)});

      if (self.maxValArr(self.state.timer)) return;
      clearInterval(self.timer);
      self.timer = null;
      emitter.emit('Del', self.props.id);  
    }, 1000);
  },

  componentWillMount: function() {
    clearInterval(self.timer);
  },

  render: function() {
    return (
      <p className='timer'>[
        <span>{this.state.timer[0]}</span>:
        <span>{this.state.timer[1]}</span>:
        <span>{this.state.timer[2]}</span>
      ]</p>
    ); 
  },

  maxValArr: function(arr) {
    return Math.max.apply(null, arr);
  },

  tick: function(state) {
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
});

const TagsCloud = React.createClass({
  render: function() {
    return (<div 
        className="view cloud-tags">
        {getPropTask(taskDB, 'tags').join('').split(',').join(' ')}
    </div>);
  }
});

const Setting = React.createClass({
  render: function() {
    return <div class="view"> </div>
  }
});

const Help = React.createClass({
  render: function() {
    return <div class="view"> </div>
  }
});

const Stats = React.createClass({
  render: function() {
    return <div class="view"> </div>
  }
});

const Archiv = React.createClass({
  render: function() {
    return <div class="view"> </div>
  }
});

ReactDOM.render(
  <App />,
  document.getElementById('root')
);