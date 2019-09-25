import React from 'react';
import { Menu, Icon, Tooltip, Switch } from 'antd';

export default class extends React.Component {
    state = {
        viewControls: true,
        breakpoint: this.props.breakpoint
    };

    componentDidUpdate() {
        const { breakpoint } = this.props;

        if(this.state.breakpoint !== breakpoint) {
            this.setState({ breakpoint });
        }
    }

    handleSelect = ({ item, key, keyPath, selectedKeys, domEvent }) => {
        console.log(key);
        const { actions } = this.props;

        if (key in actions) {
            actions[key]();
        }
    };

    handleChange = (viewControls) => {
        const { actions } = this.props,
            key = 'controls';

        if (key in actions) {
            actions[key](viewControls);
        }

        this.setState({viewControls});
    };

    render() {
        const { breakpoint } = this.state;

        return (
            <div>
                <Menu
                    onClick={this.handleSelect}
                    selectable={false}
                    mode={'horizontal'}>
                    <Menu.Item key={'goBack'}>
                        <Icon type={'project'} /> Tableros
                    </Menu.Item>
                    <Menu.Item key={'addChart'}>
                        <Tooltip title={'Gráfico'} placement={'bottom'}>
                            <Icon type={'bar-chart'} />
                        </Tooltip>
                    </Menu.Item>
                    <Menu.Item key={'addFilter'}>
                        <Tooltip title={'Filtro'} placement={'bottom'}>
                            <Icon type={'filter'} />
                        </Tooltip>
                    </Menu.Item>
                    <Menu.Item key={'addText'}>
                        <Tooltip title={'Cuadro de texto'} placement={'bottom'}>
                            <Icon type={'form'} />
                        </Tooltip>
                    </Menu.Item>
                    <Menu.Item key={'addImage'}>
                        <Tooltip title={'Imagen'} placement={'bottom'}>
                            <Icon type={'file-image'} />
                        </Tooltip>
                    </Menu.Item>
                    <Menu.Item key={'sync'}>
                        <Tooltip title={'Sincronizar'} placement={'bottom'}>
                            <Icon type={'sync'} />
                        </Tooltip>
                    </Menu.Item>
                    <Menu.Item key={'share'}>
                        <Tooltip title={'Compartir'} placement={'bottom'}>
                            <Icon type={'share-alt'} />
                        </Tooltip>
                    </Menu.Item>
                    <Menu.Item key={'layout'}>
                        <Tooltip title={'Diseño'} placement={'bottom'}>
                            <Icon type={'layout'} /> {breakpoint}
                        </Tooltip>
                    </Menu.Item>
                    <Menu.Item key={'save'}>
                        <Tooltip title={'Guardar'} placement={'bottom'}>
                            <Icon type={'save'} />
                        </Tooltip>
                    </Menu.Item>
                    <Menu.Item key={'controls'}>
                        <Tooltip title={'Controles'} placement={'bottom'}>
                            <Switch
                                onChange={this.handleChange}
                                checked={this.state.viewControls}
                                checkedChildren={<Icon type={'control'} />}
                                unCheckedChildren={<Icon type={'control'} />}/>
                        </Tooltip>
                    </Menu.Item>
                </Menu>
            </div>
        );
    }
}