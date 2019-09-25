import React from 'react';
import {Button, Icon, Modal, Steps} from 'antd/lib/index';
import SelectData from './data';
import WorkingVariables from './variables';
import ConfigureChart from './chart';
import './style.css';

const Step = Steps.Step;

export default class extends React.Component {
    state = {
        current: 0,
        numSteps: 3,
        variables: [],
        chartType: 'sheet',
        visible: this.props.visible
    };

    componentDidUpdate(prevProps) {
        if(!prevProps.visible && this.props.visible) {
            console.log('open dialog');
            this.setState({ visible: true });
        }
    }

    next() {
        const current = this.state.current + 1;
        this.setState({ current });
    }

    prev() {
        const current = this.state.current - 1;
        this.setState({ current });
    }

    handleChangeIndicator = (dataSet) => {
        console.log(dataSet);
        this.setState({ dataSet });
    };

    handleChangeVariables = (variables) => {
        console.log(variables);
        this.setState({ variables });
    };

    handleChangeChartOptions = (chartType, options) => {
        this.setState({ chartType, options });
    };

    getStepContent = (current) => {
        const { dataSet, variables, chartType } = this.state;

        switch (current) {
            case 0:
                return (
                    <SelectData
                        dataSet={dataSet}
                        onChange={this.handleChangeIndicator}/>
                );
            case 1:
                return (
                    <WorkingVariables
                        dataSet={dataSet}
                        variables={variables}
                        onChange={this.handleChangeVariables}/>
                );
            case 2:
                return (
                    <ConfigureChart
                        chartType={chartType}
                        dataSet={dataSet}
                        variables={variables}
                        onChange={this.handleChangeChartOptions}/>
                );
            default:
                return 'not defined';
        }
    };

    handleOk = e => {

        this.setState({
            visible: false,
        });
    };

    handleCancel = async () => {
        await this.handleClose();
    };

    handleClose= async () => {
        await this.setState({
            visible: false,
            current: 0,
            dataSet: undefined,
            variables: [],
            options: undefined,
            chartType: 'sheet'
        });

        if (this.props.onClose instanceof Function) {
            this.props.onClose();
        }
    };

    handleFinish = async () => {
        if (this.props.onFinish instanceof Function) {
            const { dataSet, variables, chartType, options } = this.state;
            this.props.onFinish({dataSet, chartType, variables, options});
        }

        await this.handleClose();
    };

    render() {
        const { current, numSteps, visible } = this.state;

        return(
            <Modal
                title={'Crear gráfico'}
                visible={visible}
                width={'90%'}
                style={{ top: 16 }}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                footer={[
                    <Button key={'back'} type={'danger'} onClick={this.handleCancel}>
                        Cancelar
                    </Button>,
                    (current > 0) &&
                    (
                        <Button key={'prev'} onClick={() => this.prev()}>
                            Anterior
                        </Button>
                    ),
                    (current < numSteps - 1) &&
                    (
                        <Button key={'next'} type="primary" onClick={() => this.next()}>Siguiente</Button>
                    ),
                    (current === numSteps - 1) &&
                    (
                        <Button key={'finish'} type="primary" onClick={this.handleFinish}>Finalizar</Button>
                    )
                ]}>
                <Steps current={current}>
                    <Step title={'Datos'} description={'Fuente de datos'} icon={<Icon type="database" />} />
                    <Step title={'Variables'} description={'Variables de trabajo'} icon={<Icon type="table" />} />
                    <Step title={'Gráfico'} description={'Configurar gráfico'} icon={<Icon type="line-chart" />} />
                </Steps>

                <div className="steps-content">{this.getStepContent(current)}</div>
            </Modal>
        )
    }
}