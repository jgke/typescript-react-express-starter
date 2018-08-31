import * as React from 'react';

import './app.css';
import {Customer} from './base';
import {apiMap} from './clientApi';

interface State {
    name: string;
    filter: string;
    customers: Customer[];
}

function renderCustomer(customer: Customer): JSX.Element {
    return <p key={customer.id}>{`${customer.id}: ${customer.name}`}</p>;
}

export class App extends React.Component<{}, State> {
    public constructor(props: {}) {
        super(props);
        this.state = {name: '', filter: '', customers: []};
    }

    public componentDidMount(): void {
        this.update();
    }

    public render(): JSX.Element {
        // tslint:disable
        console.log(this.state.customers);
        return (
            <div className='App'>
                <p className='App-intro'>
                    {this.state.customers ? this.state.customers.map(renderCustomer) : 'No customers'}
                </p>
                <input value={this.state.name} onChange={this.changeAddField}/>
                <button onClick={this.addCustomer}>Add customer</button>
                <input value={this.state.filter} onChange={this.changeSearchField}/>
            </div>
        );
    }

    private readonly changeAddField = (msg: React.ChangeEvent<HTMLInputElement>) => {
        const name = msg.target.value;
        this.setState({name});
    }

    private readonly changeSearchField = (msg: React.ChangeEvent<HTMLInputElement>) => {
        const filter: string = msg.target.value;
        this.setState({filter}, this.update);
    }

    private readonly addCustomer = () => {
        apiMap.customers.POST(this.state.name)
            .then(this.update)
            .catch(App.handleError);
    }

    private readonly update = () => {
        const num = this.state.filter.replace(/[^0-9]/gi, '');
        if (!this.state.filter) {
            apiMap.customers.GET()
                .then(customers => this.setState({customers}))
                .catch(App.handleError);
        } else if (num === this.state.filter) {
            console.log(num, this.state.filter)
            apiMap.search.GET({id: Number.parseInt(num, 10)})
                .then(customers => this.setState({customers}))
                .catch(App.handleError);
        } else {
            apiMap.search.GET({name: this.state.filter})
                .then(customers => this.setState({customers}))
                .catch(App.handleError);
        }
    }

    // tslint:disable-next-line:no-unbound-method
    private static readonly handleError = console.warn;
}
