import React from 'react';
import {Modal, Button, Radio, Typography, Dropdown, Menu, message} from 'antd';
import moment from 'moment';
import rp from 'request-promise';
import auth from "../../../auth";
import FileSaver from 'file-saver';
import Papa from 'papaparse';

const { Title } = Typography;

export default class extends React.Component {
    state = {
        visible: this.props.visible,
        downloading: false,
        downloadType: 'all',
        ext: 'csv'
    };

    componentDidUpdate(prevProps) {
        if (prevProps.visible !== this.props.visible) {
            this.setState({
                visible: this.props.visible,
                item: this.props.item
            });
        }
    }

    download = async () => {
        await this.setState({ downloading: true });

        try {
            const {ext} = this.state,
                {dataSet} = this.state.item,
                data = await rp({
                    method: 'POST',
                    uri: `${auth.getHost()}/dataset/${dataSet.id}`,
                    headers: {
                        'Authorization': `Bearer ${auth.getToken()}`
                    },
                    json: true
                }),
                fileName = `${dataSet.id}_${moment().format('YYYY_MM_DD_hh_mm_ss')}.${ext}`;


            if (!!data && data.length) {
                FileSaver.saveAs(
                    ext === 'json' ?
                        new Blob(
                            [JSON.stringify(data, null, 2)],
                            {type: 'application/json'}
                        ) :
                        new Blob(
                            [Papa.unparse(data)],
                            {type: 'text/csv;charset=utf-8;'}
                        ),
                    fileName
                );
            } else {
                message.error('No existen datos.');
            }

        }
        catch (e) {
            message.error('Error al descargar los datos.');
        }

        await this.setState({ downloading: false }, this.handleClose);
    };

    handleOk = async () => {
        await this.download();
    };

    handleCancel = () => {
        this.handleClose();
    };

    handleClose = () => {
        this.setState(
            {
                visible: false,
                ext: 'csv',
                downloadType: 'all'
            },
            () => {
                if(this.props.onClose instanceof Function) {
                    this.props.onClose();
                }
            }
        );
    };

    getMenu = () => (
        <Menu onClick={({key}) => this.setState({ext: key})}>
            <Menu.Item key={'csv'}>csv</Menu.Item>
            <Menu.Item key={'json'}>json</Menu.Item>
        </Menu>
    );

    render() {
        const { downloading, item, downloadType, ext } = this.state,
            radioStyle = {
                display: 'block',
                height: '30px',
                lineHeight: '30px',
            };

        return(
            <Modal
                title={!!item && item.dataSet.name}
                closable={!downloading}
                maskClosable={!downloading}
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                footer={[
                    <Button
                        disabled={downloading}
                        key={'back'}
                        type={'danger'}
                        onClick={this.handleCancel}>
                        Cancelar
                    </Button>,
                    <Dropdown.Button
                        style={{paddingLeft: 12}}
                        onClick={this.handleOk}
                        type={'primary'}
                        key={'submit'}
                        overlay={this.getMenu()}
                        icon={`.${ext}`}>
                        {downloading? 'Descargando': 'Descargar'}
                    </Dropdown.Button>
                ]}>
                <Title level={4}>Descargar:</Title>
                <Radio.Group
                    value={downloadType}
                    onChange={e => this.setState({downloadType: e.target.value})}>
                    <Radio style={radioStyle} value={'all'}>Todos los datos.</Radio>
                    <Radio disabled style={radioStyle} value={'filtered-pane'}>Solo los datos seleccionados por los filtros de la página.</Radio>
                    {/*<Radio style={radioStyle} value={'filtered-chart'}>Solo los datos mostrados en el gráfico.</Radio>*/}
                </Radio.Group>
            </Modal>
        );
    }
}