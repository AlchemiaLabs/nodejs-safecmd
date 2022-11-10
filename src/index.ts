import { createServer } from 'http';

import { runWithSpawn } from './functions';

createServer(async (request, response) => {
  const path = request.url!.replace(/\W/, '');

  const routes = {
    exec: runWithSpawn
  };

  for await (const data of request) {
    const { command } = JSON.parse(data);

    const res = await routes[path](command);
    const responseString = JSON.stringify(res || 'Empty');

    response.write(responseString);
    response.end();
  }
}).listen(3333, () => console.log('Server is running on port 3333'));