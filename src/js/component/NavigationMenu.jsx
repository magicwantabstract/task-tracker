import React, {Component} from 'react';

export default class NavigationMenu extends Component {
  constructor(props) {
    super(props);

    this.handleClickButton = this.handleClickButton.bind(this);
  }

  handleClickButton(e) {
    window.dispatchEvent(new CustomEvent('RELOCATE', {
      detail: {
        category: e.target.getAttribute('name')
      }
    }));
  }

  render() {
    return (
      <div className="navigation-menu">
        <div className="navigation-menu__container">
          <div
            className="navigation-menu__button"
            name="inbox"
            onClick={this.handleClickButton}
          >
            inbox
          </div>
          <div
            className="navigation-menu__button"
            name="project"
            onClick={this.handleClickButton}
          >
            project
          </div>
          <div
            className="navigation-menu__button"
            name="archiv"
            onClick={this.handleClickButton}
          >
            archiv
          </div>
          <div
            className="navigation-menu__button"
            name="account"
            onClick={this.handleClickButton}
          >
            account
          </div>
          <div
            className="navigation-menu__button"
            name="spell"
            onClick={this.handleClickButton}
          >
            spell
          </div>
        </div>
      </div>
    );
  }
}