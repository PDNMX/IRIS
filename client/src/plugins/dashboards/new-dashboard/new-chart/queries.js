export default {
    getDataSets(hubId, selector) {
        return `
{
  hub(id: ${hubId}) {
    dataSets(selector: "${JSON.stringify(selector).replace(/"/g, '\\"')}") {
      id
      name
      numberOfDocuments
      createdAt
      updatedAt
      schema
      createdBy {
        email
      }
    }
  }
}
`;
    },
    getDataSet(hubId, dataSetId) {
        return `
{
  hub(id: ${hubId}) {
    dataSet(id: "${dataSetId}") {
      id
      name
      schema
    }
  }
}
`;
    },

}