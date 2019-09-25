import React from 'react';
import { Timeline, Typography } from 'antd/lib/index';


const { Text } = Typography;


export default class extends React.Component {
    state = {
        documents: this.props.documents
    };

    render() {
        const { documents } = this.state,
            { options } = this.props,
            { datetime, title, subTitle } = options.fields;

        return (
            <div>
                <Timeline {...options.props}>
                    {
                        documents.map(doc =>
                            <Timeline.Item key={doc._id}>
                                <div><Text strong>{doc[datetime.value.name]}</Text></div>
                                <div><Text>{doc[title.value.name]}</Text></div>
                                <div><Text type={'secondary'}>{doc[subTitle.value.name]}</Text></div>
                            </Timeline.Item>
                        )
                    }
                </Timeline>
            </div>
        );
    }
}