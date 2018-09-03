/**
 * Customers React Component
 * Created by Alexey S. Kiselev.
 */

import React, { Component } from 'react';
import ReactDom from 'react-dom';
import axios from 'axios';
import Reactable from 'reactable';

const Table = Reactable.Table;
const Thead = Reactable.Thead;
const Th = Reactable.Th;
const unsafe = Reactable.unsafe;

class CustomersMain extends Component {
    constructor(props) {
        super(props);
        this.state = {
            customers: [],
            sort: '',
            sort_class: 'unsorted'
        };
    }

    componentWillMount() {
        axios.get('/api/customers')
            .then((response) => {
                this.setState({
                    customers: response.data
                });
            });
    }

    _parseContacts(contacts) {
        if(typeof contacts === 'string') {
            return contacts;
        }
        let fields = Object.keys(contacts),
            result = [];
        for(let key of fields) {
            result.push(`${key}: ${contacts[key]}`);
        }
        return result.join(', ');
    }

    _handleTableHeaderClick(column) {
        this.setState({
            sort: column
        });
        if(this.state.sort_class === 'unsorted') {
            this.setState({
                sort_class: 'sorted_asc'
            });
        } else if(this.state.sort_class === 'sorted_asc') {
            this.setState({
                sort_class: 'sorted_desc'
            });
        } else if(this.state.sort_class === 'sorted_desc') {
            this.setState({
                sort_class: 'unsorted'
            });
        } else {
            this.setState({
                sort: '',
                sort_class: 'unsorted'
            });
        }
    }

    render() {
        let columns = {'cid': 'ID', 'name': 'Name', 'createdAt': 'Created at', 'status': 'Status', 'contacts': 'Contacts', 'goto': 'Go to'},
            rows = this.state.customers.map((customer) => {
                return {
                    cid: customer.cid,
                    name: customer.name,
                    createdAt: customer.createdAt,
                    status: customer.status,
                    contacts: this._parseContacts(customer.contacts),
                    goto: unsafe(`<a href="/customer/${customer.cid}">Open</a>`)
                };
            }),
            sortable = [
                'cid',
                'name',
                'status',
                'createdAt'
            ];
        return (
            <div className="customers_wrapper">
                <div className="content_wrapper">
                    <h2>Propellerhead customers</h2>
                    <Table className="customers_table" data={rows}
                        itemsPerPage={10}
                        pageButtonLimit={10}
                        sortable={sortable}
                        filterable={['name', 'status', 'contacts']}
                    >
                        <Thead>
                            {
                                Object.keys(columns).map((column, index) =>  {
                                    let sort_class = (column === this.state.sort) ? this.state.sort_class : 'unsorted';
                                    sort_class = (sortable.indexOf(column) !== -1) ? sort_class : '';
                                    return (
                                        <Th key={index} column={column}>
                                            <strong className={`${column}_header ${sort_class}`} onClick={this._handleTableHeaderClick.bind(this, column)}>{columns[column]}</strong>
                                        </Th>
                                    );
                                })
                            }
                        </Thead>
                    </Table>
                </div>
            </div>
        );
    }
}

ReactDom.render(<CustomersMain/>, document.getElementById('app'));
