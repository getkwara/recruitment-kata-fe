import axios from 'axios';

const service = axios.create({
  baseURL: 'api',
});

const errHandler = err => {
  if (err.response && err.response.data) {
    throw err.response.data.message;
  }
  throw err;
};

export default {
  service: service,

  fetchInboxMessages() {
    let inboxs = [];
    return service
      .get('/inbox/loans')
      .then((res) => {
        inboxs = inboxs.concat(res.data.data);
        return service.get('/inbox/till');
      })
      .then(res => inboxs.concat(res.data.data).sort(function(a, b) {
        return a.info.dates.timestamp < b.info.dates.timestamp;
      }))
      .catch(errHandler);
  },
};
