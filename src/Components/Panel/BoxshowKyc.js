import React, {Component} from 'react';
import {Card, Row} from 'react-bootstrap';

import PlaylistAddCheckRoundedIcon from '@material-ui/icons/PlaylistAddCheckRounded';
import {Button} from "@material-ui/core";

class BoxshowKyc extends Component {


    constructor(props) {
        super(props);
        this.state = {};

    }

    componentWillUnmount() {
        // stop sending ajax when client in other page
        this.mounted = false;

    }

    componentDidMount(props) {
        this.mounted = true;

    }


    render() {

        const {error, isLoaded, data} = this.state;


        return (
            <div>

                <Card style={{
                    background: 'linear-gradient(0deg, rgba(0,147,147,1) 0%, rgba(3,189,189,1) 100%)'
                    , border: '0px solid rgba(0,0,0,.125)'
                    , boxShadow: 'rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px'
               ,textAlign:'Right',
                }}>
                    <Card.Body>
                        <Row className='mx-auto'>
                            <PlaylistAddCheckRoundedIcon
                                style={{fontSize: 50, color: 'white'}}></PlaylistAddCheckRoundedIcon>
                        <p className='center' style={{color: 'white'}}>برای خرید و فروش در سایت نیاز به احراز هویت دارید </p>
                            <Button className="mx-auto" variant="contained">
                                ارسال مدارک
                            </Button>
                        </Row>


                    </Card.Body>
                </Card>

            </div>
        );

    }

}


export default BoxshowKyc;
