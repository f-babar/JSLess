//---------------------------------------------------------
//                    INSERT DATA
//---------------------------------------------------------

exports.create = (model, data, callback) => {
  model.create(data)
    .then(response => {
      callback({ success: true, result: response });
    }).catch(err => {
      callback({ success: false, result: err });
    });
};

//---------------------------------------------------------
//                   FETCH SINGLE RECORD
//---------------------------------------------------------

exports.findOne = (model, filter, callback) => {
  model.findOne(filter)
    .then(response => {
      callback({ success: true, result: response });
    }).catch(err => {
      callback({ success: false, result: err });
    });
};

//---------------------------------------------------------
//                   FETCH ALL RECORDS
//---------------------------------------------------------

exports.find = (model, filter, callback) => {
  model.find(filter)
    .then(response => {
      callback({ success: true, result: response._doc });
    }).catch(err => {
      callback({ success: false, result: err });
    });
};

//---------------------------------------------------------
//                   DELETE RECORDS
//---------------------------------------------------------

exports.delete = (model, filter, callback) => {
  model.remove(filter)
    .then(response => {
      callback({ success: true, result: response });
    }).catch(err => {
      callback({ success: false, result: err });
    });
};

