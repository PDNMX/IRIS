import React from 'react';
import factoryChart from '../charts';


export default class extends React.Component {

    state = {
        loadingDocuments: false,
        element: this.props.element,
        data: this.props.data
    };

    render() {
        const { data, element } = this.state,
            {size, dashboardId} = this.props;

        return (
            <div>
                {
                    factoryChart(
                        element.i,
                        data,
                        size,
                        this.props.changeStatic,
                        this.props.onChange,
                        this.props.makeFormatter,
                        dashboardId
                    )
                }
            </div>
        );
    }
}
