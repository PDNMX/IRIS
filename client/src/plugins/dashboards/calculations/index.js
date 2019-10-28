import _ from "lodash";
import {Guide, Point} from "viser-react";
import React from "react";

const getComparator = c => {
    switch (c) {
        case 'lt':
            return (a, b) => a < b;
        case 'lte':
            return (a, b) => a <= b;
        case 'eq':
            return (a, b) => a === b;
        case 'gt':
            return (a, b) => a > b;
        case 'gte':
            return (a, b) => a >= b;
        default:
            return (a, b) => a >= b;
    }
};

export const renderCalculationsLayer = () => {
    const { secondaryColor } = this.state,
        { calculations } = this.props;
    let calc;

    if (!!calculations) {
        const { chartFields } = this.state,
            { axis, values } = chartFields;

        calc = _.map(calculations, (calculation, calculationId) =>
            <div key={calculationId}>
                <Guide
                    key={calculationId}
                    type={'line'}
                    top={true}
                    start={['min', calculation.threshold]}
                    end={['max', calculation.threshold]}
                    lineStyle={{
                        stroke: secondaryColor
                    }}
                    text={{
                        content: `${calculation.name}: ${calculation.threshold}`,
                        position: 'start',
                        offsetX: 38,
                        offsetY: -4,
                    }}
                />
                <Point
                    position={`_id_${axis.value.name}*${values.value.name}`}
                    size={[
                        values.value.name,
                        (val) => (getComparator(calculation.evaluation)(val, calculation.threshold))? 3: 0
                    ]}
                    style={{
                        lineWidth: 2
                    }}
                    color={secondaryColor}
                />
            </div>
        )
    }

    return calc;
};