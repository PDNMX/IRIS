import React from 'react';
import {Button, Dropdown, Menu, message, Modal, Radio, Typography} from 'antd';
import moment from 'moment';
import auth from '../../../auth';
import FileSaver from 'file-saver';
import Papa from 'papaparse';
import _ from 'lodash';
import axios from "axios";

const {Title} = Typography;

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
                item: this.props.item,
                filters: this.props.filters
            });
        }
    }

    download = async () => {
        try {
            await this.setState({downloading: true});

            const {item, ext, downloadType, filters} = this.state,
                {dataSet, options} = item,
                fileName = `${dataSet.id}_${moment().format('YYYY_MM_DD_hh_mm_ss')}.${ext}`;

            let opt = {
                method: 'post',
                url: `${auth.getHost()}/dataset/${dataSet.id}`,
                headers: {
                    'Authorization': `Bearer ${auth.getToken()}`
                }
            };

            let where = {};

            if ('filters' in options && options.filters.length > 0) {
                where = JSON.parse(options.filters);
            }

            if (downloadType === 'filtered-pane' && !!filters && !_.isEmpty(filters) && dataSet.id in filters) {
                _.forEach(
                    filters[dataSet.id],
                    itemFilters => _.forEach(
                        itemFilters,
                        (filter, field) => where = {...where, [field]: filter}
                    )
                );
            }

            if (!_.isEmpty(where)) {
                // console.log(where);
                opt.body = {
                    where
                };
            }

            axios(opt)
                .then(function (response) {
                    FileSaver.saveAs(
                        ext === 'json' ?
                            new Blob(
                                [JSON.stringify(response.data, null, 2)],
                                {type: 'application/json'}
                            ) :
                            new Blob(
                                [Papa.unparse(response.data)],
                                {type: 'text/csv;charset=utf-8;'}
                            ),
                        fileName
                    );
                    this.setState({downloading: false}, this.handleClose);
                }
                .bind(this))
                .catch(function (err) {
                    console.log(err)
                });

        } catch (e) {
            message.error('Error al descargar los datos.');
        }

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
                if (this.props.onClose instanceof Function) {
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
        const {downloading, item, downloadType, ext} = this.state,
            radioStyle = {
                display: 'block',
                height: '30px',
                lineHeight: '30px',
            };

        return (
            <Modal
                centered={true}
                title={!!item && item.dataSet.name}
                closable={!downloading}
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
                        {downloading ? 'Descargando' : 'Descargar'}
                    </Dropdown.Button>
                ]}>
                <Title level={4}>Descargar:</Title>
                <Radio.Group
                    value={downloadType}
                    onChange={e => this.setState({downloadType: e.target.value})}>
                    <Radio style={radioStyle} value={'all'}>Todos los datos.</Radio>
                    <Radio style={radioStyle} value={'filtered-pane'}>Solo los datos seleccionados por los filtros de la
                        página.</Radio>
                    {/*<Radio style={radioStyle} value={'filtered-chart'}>Solo los datos mostrados en el gráfico.</Radio>*/}
                </Radio.Group>
            </Modal>
        );
    }
}