export const getScale = (field) => {
    switch (field.value.type) {
        case 'numeric':
            return 'linear';
        case 'int':
            return 'linear';
        case 'datetime':
            return 'timeCat';
        case 'string':
            return 'timeCat';
        default:
            return 'linear'
    }
};

export const mapStateToProps = (filters, ownProps) => {
    const {paneId, dataSetId} = ownProps;

    // console.log(paneId, dataSetId, chartType);

    return {
        filters: paneId in filters ?
            (
                dataSetId in filters[paneId] ?
                    filters[paneId][dataSetId] :
                    undefined
            ) :
            undefined
    };
};

export const VERSION = '2019-08-28';