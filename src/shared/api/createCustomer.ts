import { apiRoot } from './BuildClient';

const getProject = () => {
  return apiRoot.get().execute();
};

getProject().then(console.log).catch(console.error);
