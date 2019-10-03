import React from "react";
import { Divider, Typography } from "antd";
const { Text } = Typography;


export default class extends React.Component {
    render() {
        const { data } = this.props,
            { divider } = data,
            { text, orientation } = divider;

        return (
            <div>
                {
                    !!text?
                        <Divider style={{marginTop: 4, marginBottom: 0}} orientation={orientation}><Text>{text}</Text></Divider>:
                        <Divider/>
                }
            </div>
        );
    }
}