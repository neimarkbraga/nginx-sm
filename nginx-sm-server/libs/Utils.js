const fs = require('fs');
const executeCommand = require('child_process').execSync;

class Utils {

  static generateNginxConfig({serverName, port}) {
    return [
      `#SITE: ${serverName}`,
      `#PORT: ${port}`,
      `server {`,
      `  listen 80;`,
      `  listen [::]:80;`,
      `  server_name ${serverName};`,
      ``,
      `  location / {`,
      `    # Http Proxy`,
      `    proxy_set_header X-Real-IP $remote_addr;`,
      `    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;`,
      `    proxy_set_header Host $server_name;`,
      `    proxy_set_header X-NginX-Proxy true;`,
      `    proxy_pass http://127.0.0.1:${port};`,
      ``,
      `    # Websocket Support`,
      `    proxy_http_version 1.1;`,
      `    proxy_set_header Upgrade $http_upgrade;`,
      `    proxy_set_header Connection "upgrade";`,
      `  }`,
      `}`
    ].join('\n');
  }

  static async saveNginxConfig({configPath, sites}) {
    const content = sites.map(item => {
      return Utils.generateNginxConfig({
        serverName: item.name,
        port: item.port
      });
    }).join('\n\n\n');
    fs.writeFileSync(configPath, content, {encoding:'utf8',flag:'w'});
    await executeCommand('sudo nginx -t');
    await executeCommand('sudo systemctl restart nginx');
  }
}

module.exports = Utils;