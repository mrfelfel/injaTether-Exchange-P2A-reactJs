import React, {Component} from 'react';

// import header index
import HeaderIndex from './Layouts/HeardeIndex';
//import css

import './Css/index.css';

// import react router
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import {Card, CardDeck, Button, Container, Row, Form} from 'react-bootstrap';


class Index extends Component {


    render() {


        return (

            <div style={{backgroundColor:'#009393'}}>

                <HeaderIndex/>

                <Container style={{backgroundColor:'#009393',border:0}}>


                    <Row className="vertical-center">

                        <div className="col-md-4" style={{marginLeft: 0, marginRight: 'auto'}}>
                            <Card className="text-center mx-auto" style={{
                                textAlign: 'center'
                                , backgroundColor: '#24A2A2'
                                , boxShadow: 'rgb(38, 57, 77) 0px 20px 30px -10px'
                                , color: 'white'
                            }}>

                                <h3 className='p-3'>خرید تتر از ما</h3>
                                <Card.Body>

                                    <Form>
                                        <Form.Group>
                                            <Form.Label style={{float: 'right'}}>میگیرید</Form.Label>
                                            <Form.Control type="number" placeholder="1 USDT"/>
                                        </Form.Group>

                                        <Form.Group>
                                            <Form.Label style={{float: 'right'}}>میدهید</Form.Label>
                                            <Form.Control type="number" placeholder="24500 IRT"/>
                                        </Form.Group>

                                        <Button size="lg" variant="outline-light" type="submit">
                                            خرید
                                        </Button>
                                    </Form>

                                </Card.Body>

                            </Card>
                        </div>

                        <div className="col-md-4" style={{marginRight: 0, marginLeft: 'auto'}}>
                            <Card className="text-center " style={{
                                boxShadow: 'rgb(38, 57, 77) 0px 20px 30px -10px'
                            }}>
                                <h3 className='p-3' style={{color: '#24a2a2'}}>فروش تتر به ما</h3>
                                <Card.Body>

                                    <Form>
                                        <Form.Group>
                                            <Form.Label style={{float: 'right'}}>میگیرید</Form.Label>
                                            <Form.Control style={{border: '2px solid #24a2a2'}} type="number"
                                                          placeholder="1 USDT"/>
                                        </Form.Group>

                                        <Form.Group>
                                            <Form.Label style={{float: 'right'}}>میدهید</Form.Label>
                                            <Form.Control style={{border: '2px solid #24a2a2'}} type="number"
                                                          placeholder="24500 IRT"/>
                                        </Form.Group>

                                        <Button size="lg" variant="secondary" type="submit"
                                                style={{backgroundColor: '#24A2A2', border: 0}}>
                                            فروش
                                        </Button>
                                    </Form>

                                </Card.Body>
                            </Card>
                        </div>

                    </Row>


                </Container>

            </div>

        )
    }
}

export default Index;
