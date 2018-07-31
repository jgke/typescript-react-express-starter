import * as React from 'react';

import './app.css';
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

    private readonly sendMsg = (msg: React.ChangeEvent<HTMLInputElement>) => {
        const str = msg.target.value;
        this.setState({str});
        apiMap.str.POST({message: str})
            .then(this.updateMsg)
            .catch(App.handleError);
    }

    private readonly sendNumber = (msg: React.ChangeEvent<HTMLInputElement>) => {
        const num = msg.target.value.replace('[^0-9]', '');
        this.setState({num});
        if (num.length && num !== this.state.num) {
            apiMap.num.nested.PUT({msg: Number.parseInt(num, 10)})
                .then(this.updateMsg)
                .catch(App.handleError);
        }
    }

    private readonly updateMsg = () => {
        apiMap.str.GET()
            .then(msg =>
                apiMap.num.nested.GET()
                    .then(num => {
                        this.setState({
                            showStr: msg.message,
                            showNum: num.message
                        });
                    })
                    .catch(App.handleError))
            .catch(App.handleError);
    }

    // tslint:disable-next-line:no-unbound-method
    private static readonly handleError = console.warn;
}
