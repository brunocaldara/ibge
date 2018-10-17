import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

class SelectCustomizado extends Component {
    render() {
        let items = this.props.items;

        if (this.props.ordenar === 'true')  {
            items = this.props.items.sort((a, b) => {
                if (a.nome > b.nome) {
                    return 1;
                }

                if (a.nome < b.nome) {
                    return -1;
                }

                return 0;
            });
        }

        return (
            <FormGroup controlId={this.props.id} >
                <ControlLabel>{this.props.label}</ControlLabel>
                <FormControl componentClass="select"
                    value={this.props.value}
                    placeholder={this.props.placeholder}
                    disabled={this.props.disabled}
                    onChange={this.props.onChange}>
                    <option key={0} value={0}>Selecione um valor...</option>
                    {
                        items.map((item) => {
                            return <option key={item.id} value={item.id}>{item.nome}</option>
                        })
                    }
                </FormControl>
            </FormGroup>
        );
    }
}

export default SelectCustomizado;