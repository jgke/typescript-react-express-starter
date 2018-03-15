import * as React from 'react';

import './App.css';
import {apiMap} from './clientApi';

interface State {
    str: string;
    showStr: string;
    num: string;
    showNum: number;
}

export class App extends React.Component<{}, State> {
    public constructor(props: {}) {
        super(props);
        this.state = {str: '', num: '0', showStr: '', showNum: 0};
        this.sendMsg = this.sendMsg.bind(this);
        this.sendNumber = this.sendNumber.bind(this);
        this.updateMsg = this.updateMsg.bind(this);
    }

    public componentDidMount(): void {
        this.updateMsg();
    }

    public render(): JSX.Element {
        return (
            <div className='App'>
                <p className='App-intro'>
                    {this.state.showStr}
                    <br/>
                    {this.state.showNum}
                </p>
                <input value={this.state.str} onChange={this.sendMsg}/>
                <input value={this.state.num} onChange={this.sendNumber}/>
            </div>
        );
    }

    private sendMsg(msg: React.ChangeEvent<HTMLInputElement>): void {
        const str = msg.target.value;
        this.setState({str});
        apiMap.str.POST({message: str})
            .then(this.updateMsg)
            .catch(console.warn);
    }

    private sendNumber(msg: React.ChangeEvent<HTMLInputElement>): void {
        const num = msg.target.value.replace('[^0-9]', '');
        this.setState({num});
        if (num.length && num !== this.state.num) {
            apiMap.num.nested.PUT({msg: Number.parseInt(num)})
                .then(this.updateMsg)
                .catch(console.warn);
        }
    }

    private updateMsg(): void {
        apiMap.str.GET()
            .then(msg =>
                apiMap.num.nested.GET()
                    .then(num => {
                        this.setState({
                            showStr: msg.message,
                            showNum: num.message
                        });
                    })
                    .catch(console.warn))
            .catch(console.warn);
    }
}
