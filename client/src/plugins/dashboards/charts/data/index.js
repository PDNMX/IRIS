import rp from 'request-promise';
import auth from '../../../../auth';
import _ from 'lodash';

const availableAnalytics = ['avg', 'min', 'max'];

const getDateId = axis => {
    const { operator } = axis,
        parts = operator.split('-');

    return (parts.length > 1)?
        _.fromPairs(parts.map(p => [p, { [`$${p}`]: `$${axis.value.name}` }])):
        { [`$${axis.operator}`]: `$${axis.value.name}` };
};

const getStageId = ({axis, color}) => {
    // todo: validate operator
    const axisId = (axis.value.type === 'datetime' && !!axis.operator && !!axis.operator.length > 0)?
        getDateId(axis):
        `$${axis.value.name}`;

    // console.log('#axis:', axis, axisId);

    return !!color && !!color.value && axis.value.name !== color.value.name?
        {
            [axis.value.name]: axisId,
            [color.value.name]: `$${color.value.name}`
        }:
        axisId;
};

const getCountByAxisStage = ({axis, values, color}) => {
    const { name } = values.type === 'array'? values.value[0]: values.value;

    return {
        $group: {
            _id: getStageId({axis, color}),
            [name]: {
                $sum: 1
            }
        }
    };
};

const getSumByAxisStage = ({axis, values, color}, config) => {
    let res = {
        $group: {
            _id: getStageId({axis, color})
        }
    };


    if (values.value instanceof Array) {
        const v = _.find(values.value, v => !!v.operator),
            opt = !!v? `$${v.operator}`: '$sum';

        values.value.map(field =>
            res.$group[field.name] = {
                [opt]: `$${field.name}`
            }
        );
    }
    else {
        const { operator } = values,
            opt = !!operator? `$${operator}`: '$sum';

        res.$group[values.value.name] = {
            [opt]: `$${values.value.name}`
        };
    }

    if (
        !!config &&
        !!config.analytic &&
        !!config.analytic.value &&
        availableAnalytics.includes(config.analytic.value)
    ) {
        let name;

        if (values.value instanceof Array) {
            if (values.value.length === 1) {
                name = values.value[0].name;
            }
        }
        else {
            name = values.value.name;
        }

        if (!!name) {
            const { value } = config.analytic;

            // console.log(`$${value}`, `$${name}`);

            res.$group[`${name}_${value}`] = {
                [`$${value}`]: `$${name}`
            };
        }
    }

    return res;
};

const getCartesianStage = (fields, config) => {
    const { values } = fields,
        { value } = values;

    // console.log(values);

    if (
        (values.type === 'array' && value.length === 1 && value[0].type === 'string') ||
        (values.type !== 'array' && values.value.type === 'string')
    ) {
        // console.log('$count');
        return getCountByAxisStage(fields);
    }
    else {
        // console.log('$sum');
        return getSumByAxisStage(fields, config);
    }
};

const getDoubleAxisStage = (fields) => {
    const { axis, bars, lines } = fields,
        axisId = (axis.value.type === 'datetime' && !!axis.operator && !!axis.operator.length > 0)?
            /*{ [`$${axis.operator}`]: `$${axis.value.name}` }*/ getDateId(axis):
            `$${axis.value.name}`;

    return {
        $group: {
            _id: axisId,
            [bars.value.name]: !!bars.operator?
                { [`$${bars.operator}`]: `$${bars.value.name}` }:
                { $sum: bars.value.type === 'string'? 1: `$${bars.value.name}` },
            [lines.value.name]: !!lines.operator?
                { [`$${lines.operator}`]: `$${lines.value.name}` }:
                { $sum: lines.value.type === 'string'? 1: `$${lines.value.name}` }
        }
    };
};

const getCountVariableStage1 = (v) => {
    return {
        $group: {
            _id: `$${v.value.name}`
        }
    };
};

const getCountVariableStage2 = (v) => {
    return {
        $group: {
            _id: 1,
            [v.value.name]: {
                $sum: 1
            }
        }
    };
};

const getSumVariableStage = (v) => {
    return {
        $group: {
            _id: null,
            [v.value.name]: {
                $sum: `$${v.value.name}`
            }
        }
    }
};

const getVariableStages = (v) => {
    return  v.value.type === 'string'? [getCountVariableStage1(v), getCountVariableStage2(v)]: [getSumVariableStage(v)];
};

export default async (chartType, dataSetId, fields, match, config=undefined) => {
    let documents = [];

    if (chartType === 'cartesian' || chartType === 'radar') {
        try {
            const stages = !!match? [match, getCartesianStage(fields, config)]: [getCartesianStage(fields, config)];

            // console.log(JSON.stringify(stages));

            return await rp({
                method: 'POST',
                uri: `${auth.getHost()}/dataset/${dataSetId}/aggregate`,
                body: stages,
                headers: {
                    'Authorization': `Bearer ${auth.getToken()}`
                },
                json: true
            });
        }
        catch (e) {
            console.log(e);
            return null;
        }
    }
    if (chartType === 'doubleAxis') {
        try {
            const doubleAxisStage = getDoubleAxisStage(fields),
                stages = !!match? [match, doubleAxisStage]: [doubleAxisStage];

            // console.log(stages);

            return await rp({
                method: 'POST',
                uri: `${auth.getHost()}/dataset/${dataSetId}/aggregate`,
                body: stages,
                headers: {
                    'Authorization': `Bearer ${auth.getToken()}`
                },
                json: true
            });
        }
        catch (e) {
            console.log(e);
            return null;
        }
    }
    else if (chartType === 'variable') {
        try {
            let stages = getVariableStages(fields.variable);

            if (!!match) {
                stages.unshift(match);
            }

            // console.log(stages);

            return await rp({
                method: 'POST',
                uri: `${auth.getHost()}/dataset/${dataSetId}/aggregate`,
                body: stages,
                headers: {
                    'Authorization': `Bearer ${auth.getToken()}`
                },
                json: true
            });
        }
        catch (e) {
            console.log(e);
            return null;
        }
    }
    else if (chartType === 'getOne') {
        try {
            let stages = [{ $limit: 1 }];

            if (!!match) {
                stages.unshift(match);
            }

            return await rp({
                method: 'POST',
                uri: `${auth.getHost()}/dataset/${dataSetId}/aggregate`,
                body: stages,
                headers: {
                    'Authorization': `Bearer ${auth.getToken()}`
                },
                json: true
            });
        }
        catch (e) {
            console.log(e);
            return null;
        }
    }

    return documents;
}