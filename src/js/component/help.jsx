import React    from 'react';
import ReactDOM from 'react-dom';

export default class Help extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <table className='spells'>
        <caption className='spells spells-title'>spells</caption>
        <tbody>
          <tr><td className='props'>timer death</td><td className='value'>hh/mm/ss</td></tr>
          <tr><td className='props'>priority</td><td className='value'>*</td></tr>
          <tr><td className='props'>project</td><td className='value'>@name-project</td></tr>
          <tr><td className='props'>tags</td><td className='value'>#nameTag</td></tr>
          <tr><td className='props'>price</td><td className='value'>$money</td></tr>
          <tr><td className='props'>time price</td><td className='value'>hh:mm:ss</td></tr>
        </tbody>
      </table>
    );
  }
}
