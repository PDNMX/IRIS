import React from 'react';
import { Button } from 'antd';

export default class extends React.Component {
    state = {
        loading: false
    };

    handleClick = async () => {
        if (this.props.makeFormatter instanceof Function) {
            const { button } = this.props.data,
                f = this.props.makeFormatter({...button, name: 'button'});
            try{
                await this.setState({loading: true});
            }catch (e) {
                console.log(e)
            }

            if (!!f) {
                f(undefined);
            }
            try{
                await this.setState({loading: false});
            }catch (e) {
                console.log(e)
            }
        }
    };

    render() {
        const { loading } = this.state,
            { button } = this.props.data,
            props = {
                type: button.type,
                icon: button.icon,
                onClick: this.handleClick,
                loading
            };

        // console.log(props);

        return(
            <Button {...props} block>{button.title}</Button>
        );
    }
}