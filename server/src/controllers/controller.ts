import {Customer} from '../api/base';

const customers: Customer[] = [];
let id = 0;

export function getCustomers(): Promise<Customer[]> {
    return new Promise(resolve => resolve(customers));
}

export function addCustomer(customerName: string): Promise<Customer> {
    const newCustomer = {name: customerName, id: id++};
    customers.push(newCustomer);

    return new Promise(resolve => resolve(newCustomer));
}

export function searchCustomers(params: {id?: string; name?: string}): Promise<Customer[]> {
    const filteredCustomers = customers
        .filter(customer => !params.id || `${customer.id}` === params.id)
        .filter(customer => !params.name || customer.name.includes(params.name));

    return new Promise(resolve => resolve(filteredCustomers));
}
