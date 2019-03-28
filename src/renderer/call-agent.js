import { ipcRenderer } from 'electron';

export default function callAgent(type, args) {
  return new Promise((resolve) => {
    ipcRenderer.send(`${type}-message`, args);

    const asyncHandle = (event, result) => {
      resolve(result);
      ipcRenderer.removeListener(`${type}-reply`, asyncHandle);
    };

    ipcRenderer.on(`${type}-reply`, asyncHandle);
  });
}
