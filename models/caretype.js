const caretypes = [
  {
    id: 1,
    label: '自理'
  }, {
    id: 2,
    label: '半自理'
  },
  {
    id: 3,
    label: '非自理'
  },
  {
    id: 4,
    label: '日托'
  },
  {
    id: 5,
    label: '居家'
  }, 
  {
    id: 6,
    label: '失智'
  }
];

function idsGetCareLabels(ids) {
  let labels = [];
  // console.log("idsGetCareLabels:ids",ids);
  if (ids) {
    ids.forEach((id, index) => {
      let matType = caretypes.filter((item, tIndex) => {
        return item.id == id;
      });
      if (matType && matType[0]) {
        let label = matType[0].label;
        if (label) {
          labels = labels.concat(label.split(','));
        }
      }
    });
  }
  // console.log("idsGetCareLabels:labels", labels);
  return labels.slice(0, 3);
}

module.exports = {
  idsGetCareLabels
}