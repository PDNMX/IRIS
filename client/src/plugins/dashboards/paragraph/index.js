import React from 'react';

import { Typography } from 'antd/lib/index';

const { Paragraph } = Typography;

export default class extends React.Component {
    state = {
        str: 'This is an editable text.',
    };

    onChange = (str) => {
        console.log('Content change:', str);
        this.setState({ str });
    };

    render() {
        return (
            <Paragraph editable={{ onChange: this.onChange }}>{this.state.str}</Paragraph>
        )
    }
}