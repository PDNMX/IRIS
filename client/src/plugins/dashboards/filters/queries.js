export default {
    getDataSet(hubId, dataSetId) {
        return `
{
  hub(id: ${hubId}) {
    dataSet(id: '${dataSetId}') {
      id
      name
      schema
    }
  }
}
`;
    },
}