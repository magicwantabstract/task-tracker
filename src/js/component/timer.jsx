import React    from 'react';
import ReactDOM from 'react-dom';

let keyId = 10000;

export default class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      spoiler: true
    };
    this.timer = null;
    this.handleTickTimer = this.handleTickTimer.bind(this);
    this.cancel = this.cancel.bind(this);
    this.spoiler = this.spoiler.bind(this);
    this.compile = this.compile.bind(this);
  }

  componentWillMount() {
    clearInterval(this.timer);
    this.timer = null;
  }

  render() {
    return (<span className='timer' key={++keyId}>{this.compile()}</span>);
  }

  compile() {
    const result = [],
          t = this.props.time;

    if (!this.state.spoiler) {
      result.push(
        <span key={++keyId} className='timer-btn' onClick={this.cancel}></span>,
        <span key={++keyId}>{t[0] < 10 ? `0${t[0]}` : t[0]}:</span>,
        <span key={++keyId}>{t[1] < 10 ? `0${t[1]}` : t[1]}:</span>,
        <span key={++keyId}>{t[2] < 10 ? `0${t[2]}` : t[2]}</span>,
        <span key={++keyId} className='timer-spoiler-off-btn' onClick={this.spoiler} />
      );
    } else {
      result.push(
        <span className='timer-spoiler-btn' key={++keyId} onClick={this.spoiler} />
      );
    }

    return result;
  }

  spoiler() {
    this.setState({spoiler: !this.state.spoiler});
  }

  componentDidMount() {
    const self = this;
    this.timer = setInterval(self.handleTickTimer, 1000);
  }

  componentWillUnmount() {
    this.cancel();
  }

  handleTickTimer() {
    let [h, m, s] = this.props.time;

    if (s > 0) {
      --s;
    } else if (s === 0 && m > 0) {
      s = 59;
      --m;
    } else if (m === 0) {
      s = 59;
      m = 59;
      --h;
    }

    if (!Math.max(h, m, s)) {
      clearInterval(this.timer);
      this.timer = null;
      window.dispatchEvent(new CustomEvent('deleteTask', {
        detail: {id: this.props.id}
      }));
    } else {
      window.dispatchEvent(new CustomEvent('tick', {
        detail: {
          type: 'timer',
          time: [h, m, s],
          id: this.props.id,
          now: new Date().getTime()
        }
      }));
    }

  }

  cancel() {
    clearInterval(this.timer);
    this.timer = null;
    window.dispatchEvent(new CustomEvent('deleteTimer', {
      detail: {id: this.props.id}
    }));
  }
};