import React from 'react';
import { Row, Col, Button } from 'antd';
import { Link } from 'react-router-dom';
import './styles.css';

const contentLayout = {
    xs: 24,
    sm: 12,
    md: 10,
    lg: 10,
    xl: 10
};

export default class extends React.Component {
    render() {
        return (
            <div style={{paddingTop: '10%'}}>
                <Row type={'flex'} justify={'center'}>
                    <Col {...contentLayout}>
                        <Row type={'flex'} justify={'center'}>
                            <Col xs={12}>
                                <img width={256} src={'https://gw.alipayobjects.com/zos/rmsportal/KpnpchXsobRgLElEozzI.svg'}/>
                            </Col>
                            <Col xs={12}>
                                <div className={'content___3yHpa'}>
                                    <h1>404</h1>
                                    <div className={'desc___2TGtg'}>
                                        ¡La página que buscas no existe!
                                    </div>
                                    <Button type={'primary'}><Link to={'/'}>Regresar a casa</Link></Button>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
        )
    }
}