import { exec, spawn } from 'child_process';

async function runWithSpawn(command: string): Promise<any> {
  const [cmd, ...args] = command.split(/\s/);
  const { stdout } = spawn(cmd, args || []);

  for await (const output of stdout) {
    return output.toString().split('\n');
  }
}

async function runWithExec(command: string): Promise<any> {
  const promise: any = new Promise((resolve, reject) => {
    exec(command, (error, res) => 
      error ? reject(error) : resolve(res)
    );
  });

  const response = (await promise).split('\n').filter(i => !!i);
  
  return response;
}

async function runWithDocker(command: string): Promise<any> {
  const nodeScript = `
    async function runInt() {
        const { spawn } = require('child_process')
        const { stdout, stderr } = spawn('${command}', { cwd: './documents', shell: true })
        for await( const result of stdout) {
            return result.toString()
        }
    }
    runInt().then(console.log).catch(console.error)
  `;
  
  const dockerCommand = `
    docker run --rm \
    -v "$PWD"/documents:/documents \
    node:14-alpine node -e "${nodeScript}"
  `;

  const { stdout } = spawn(dockerCommand);

  for await(const output of stdout) {
    return output.toString().split('\n').filter(i => !!i)
  }
}

export {
  runWithSpawn,
  runWithExec,
  runWithDocker
}
