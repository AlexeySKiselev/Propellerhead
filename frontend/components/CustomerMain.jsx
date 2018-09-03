/**
 * Customers React Component
 * Created by Alexey S. Kiselev.
 */

import React, { Component } from 'react';
import ReactDom from 'react-dom';
import axios from 'axios';

class CustomerMain extends Component {
    constructor(props) {
        super(props);
        this.state = {
            customer_data: {},
            customer_name: '',
            edit_name_class: 'hidden',
            customer_status: '',
            edit_status_class: 'hidden',
            notes: [],
            add_note: ''
        };
        this._cid = parseInt(document.getElementById('customer_id').value);
    }

    _parseContacts(contacts) {
        if(!contacts) {
            return '';
        }
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

    handleInput(e){
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    _editName(e) {
        e.preventDefault();
        this.setState({
            edit_name_class: 'visible'
        });
    }

    _editStatus(e) {
        e.preventDefault();
        this.setState({
            edit_status_class: 'visible'
        })
    }

    _saveName(e) {
        e.preventDefault();
        if(this.state.customer_name !== '') {
            axios.post('/api/savecustomername', {
                name: this.state.customer_name,
                cid: this._cid
            }, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Content-Type': 'application/json'
                }
            })
                .then((response) => {
                    if(response.data) {
                        this.setState(
                            {
                                customer_data: Object.assign(this.state.customer_data, {
                                    name: this.state.customer_name
                                }),
                                edit_name_class: 'hidden'
                            }
                        );
                    }
                });

        }
    }

    _saveStatus(e) {
        e.preventDefault();
        if(this.state.customer_status !== '') {
            axios.post('/api/savecustomerstatus', {
                status: this.state.customer_status,
                cid: this._cid
            }, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Content-Type': 'application/json'
                }
            })
                .then((response) => {
                    if(response.data) {
                        this.setState(
                            {
                                customer_data: Object.assign(this.state.customer_data, {
                                    status: this.state.customer_status
                                }),
                                edit_status_class: 'hidden'
                            }
                        );
                    }
                });

        }
    }

    _saveNote(e) {
        e.preventDefault();
        if(this.state.add_note !== '') {
            axios.post('/api/savecustomernote', {
                note: this.state.add_note,
                cid: this._cid
            }, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Content-Type': 'application/json'
                }
            })
                .then((response) => {
                    this.setState(
                        {
                            notes: (response.data) ? response.data : []
                        }
                    );
                });

        }
    }

    componentWillMount() {
        axios.get(`/api/customer/${this._cid}`)
            .then((response) => {
                this.setState({
                    customer_data: response.data[0]
                });
            });
        axios.get(`/api/notes/${this._cid}`)
            .then((response) => {
                if(response.data.length) {
                    this.setState({
                        notes: response.data
                    });
                }
            });
    }

    render() {
        return (
            <div className="customer_page">
                <h1>{this.state.customer_data.name}</h1>
                <div className={`edit_name ${this.state.edit_name_class}`}>
                    <input type="text" name="customer_name" value={this.state.customer_name} placeholder="Enter name" onChange={this.handleInput.bind(this)} />
                    <a href="#" onClick={this._saveName.bind(this)}>Save</a>
                </div>
                <div className="edit_name_button" onClick={this._editName.bind(this)}>
                    <a href="#">Edit name</a>
                </div>
                <div className="customer_data">
                    <div className="status clearfix">
                        <h3>Status</h3>
                        <div>{this.state.customer_data.status}</div>
                        <div className={`edit_status ${this.state.edit_status_class}`}>
                            <input type="text" name="customer_status" value={this.state.customer_status} placeholder="Enter status" onChange={this.handleInput.bind(this)} />
                            <a href="#" onClick={this._saveStatus.bind(this)}>Save</a>
                        </div>
                        <a href="#" onClick={this._editStatus.bind(this)}>Edit status</a>
                    </div>
                    <div className="createdat clearfix">
                        <h3>Created at</h3>
                        <div>{this.state.customer_data.createdAt}</div>
                    </div>
                    <div className="contacts clearfix">
                        <h3>Contacts</h3>
                        <div>{this._parseContacts(this.state.customer_data.contacts)}</div>
                    </div>
                </div>
                <h2>Customer's Notes:</h2>
                <div>
                    <textarea name="add_note" onChange={this.handleInput.bind(this)} value={this.state.add_note} />
                    <a href="#" onClick={this._saveNote.bind(this)}>Save</a>
                </div>
                <div className="divider"/>
                <div className="customers_notes">
                    {this.state.notes.map((note, index) => {
                        return (
                            <div key={index} className="note">
                                {note.createdAt}: {note.note}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}

ReactDom.render(<CustomerMain/>, document.getElementById('app'));
