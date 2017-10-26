import * as React from 'react';

import { apiMap } from './api';
import './App.css';

interface State {
  msg: string;
  num: number;
}

export class App extends React.Component<{}, State> {
  public constructor(props: {}) {
    super(props);
    this.state = { msg: '', num: 0 };
    this.sendMsg = this.sendMsg.bind(this);
    this.sendNumber = this.sendNumber.bind(this);
  }

  public componentDidMount(): void {
    this.updateMsg();
  }

  // tslint:disable:no-unbound-method
  public render(): JSX.Element {
    return (
      <div className='App'>
        <p className='App-intro'>
          {this.state.msg}
          <br />
          {this.state.num}
        </p>
        <input value={this.state.msg} onChange={this.sendMsg} />
        <input value={`${this.state.num}`} onChange={this.sendNumber} />
      </div>
    );
  }

  private sendMsg(msg: React.ChangeEvent<HTMLInputElement>): void {
    apiMap['/api'].POST.fn({ message: msg.target.value })
      .then(() => { this.updateMsg(); })
      .catch(console.warn);
  }

  private sendNumber(msg: React.ChangeEvent<HTMLInputElement>): void {
    const num = msg.target.value.replace('[^0-9]', '');
    if (num.length && Number.parseInt(num) !== this.state.num) {
      apiMap['/other'].POST.fn({ msg: Number.parseInt(num) })
        .then(() => { this.updateMsg(); })
        .catch(console.warn);
    }
  }

  private updateMsg(): void {
    apiMap['/api'].GET.fn()
      .then(msg =>
        apiMap['/other'].GET.fn()
          .then(num => { this.setState(state => ({ msg: msg.message, num: num.message })); })
          .catch(console.warn))
      .catch(console.warn);
  }
}
