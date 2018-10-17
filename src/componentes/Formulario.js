import React, { Component } from 'react';
import { Form, Grid, Row, Col, Button, Glyphicon, FormGroup } from 'react-bootstrap';
import PubSub from 'pubsub-js';
import SelectCustomizado from './SelectCustomizado';

class Formulario extends Component {
    constructor() {
        super();

        this.urlEstados = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados';

        this.state = {
            estado: '0',
            municipio: '0',
            numero: '0',

            estados: [],
            municipios: []
        }

        this.numeros = [
            { id: '1', nome: 'Um' },
            { id: '2', nome: 'Dois' },
            { id: '3', nome: 'Três' },
            { id: '4', nome: 'Quatro' },
            { id: '5', nome: 'Cinco' }
        ];

        this.handleChange = this.handleChange.bind(this);
        this.handleDisabled = this.handleDisabled.bind(this);
        this.getEstados = this.getEstados.bind(this);
        this.getMunicipios = this.getMunicipios.bind(this);
    }

    getEstados() {
        fetch(this.urlEstados)
            .then(resposta => resposta.json())
            .then(resposta => this.setState({ estados: resposta }))
            .catch(erro => console.log(erro));
    }

    getMunicipios(estado) {
        const urlMunicipios = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estado}/municipios`;

        fetch(urlMunicipios)
            .then(resposta => resposta.json())
            .then(resposta => this.setState({ municipios: resposta }))
            .catch(erro => console.log(erro));
    }

    handleChange(e) {
        this.setState({ [e.target.id]: e.target.value }, () => {
            /*ES - Cachoeiro de Itapemirim*/
            if (this.state.estado === '32' && this.state.municipio === '3201209') {
                this.setState({ numero: '3' });
            }
        });

        if (e.target.id === 'estado') {
            PubSub.publish('estado-change', e.target.value);
        }

        // if (this.state.estado === '32' && e.target.value === '3201209') {
        //     this.setState({ numero: '3' });
        // }
    }

    handleDisabled() {
        return this.state.estado === '32' && this.state.municipio === '3201209';
    }

    componentDidMount() {
        this.getEstados();

        PubSub.subscribe('estado-change', (topico, estado) => {
            this.getMunicipios(estado);
        });
    }

    render() {
        return (
            <Grid >
                <h1>IBGE</h1>
                <Form>
                    <Row className="show-grid">
                        <Col xs={12} sm={12} md={3} lg={3}>
                            <SelectCustomizado
                                id="estado"
                                label="Estado"
                                placeholder="Estado..."
                                ordenar="true"
                                value={this.state.estado}
                                items={this.state.estados}
                                disabled={false}
                                onChange={this.handleChange} />
                        </Col>
                        <Col xs={12} sm={12} md={3} lg={3}>
                            <SelectCustomizado
                                id="municipio"
                                label="Município"
                                placeholder="Município..."
                                ordenar="true"
                                value={this.state.municipio}
                                items={this.state.municipios}
                                disabled={this.state.estado === '0'}
                                onChange={this.handleChange} />
                        </Col>
                        <Col xs={12} sm={12} md={3} lg={3}>
                            <SelectCustomizado
                                id="numero"
                                label="Números"
                                placeholder="Números..."
                                ordenar="false"
                                value={this.state.numero}
                                items={this.numeros}
                                disabled={this.handleDisabled()}
                                onChange={this.handleChange} />
                        </Col>
                        <Col xs={12} sm={12} md={3} lg={3}>
                            <FormGroup controlId={this.props.id} >
                                <Button bsStyle="primary"
                                    onClick={(e) => { alert(this.state.numero); }}>
                                    <Glyphicon glyph="ok" /> Exibir Número
                                </Button>   
                            </FormGroup>
                        </Col>
                    </Row>
                </Form>
            </Grid >
        );
    }
}

export default Formulario;