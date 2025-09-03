import { Client } from "ssh2";
import fs from "fs";

/**
 * Run a remote SSH command with sudo
 */
export const runSSHCommand = ({ command, timeout = 30000 }) => {
  return new Promise((resolve, reject) => {
    const conn = new Client();
    let timer;

    // Ensure command runs as root
    const wrappedCommand = `sudo bash -c "${command.replace(/"/g, '\\"')}"`;

    conn
      .on("ready", () => {
        conn.exec(wrappedCommand, (err, stream) => {
          if (err) {
            clearTimeout(timer);
            conn.end();
            return reject(err);
          }

          let output = "";
          let errorOutput = "";

          stream
            .on("close", (code) => {
              clearTimeout(timer);
              conn.end();
              if (code === 0) resolve(output.trim());
              else reject(new Error(errorOutput || `Command failed with code ${code}`));
            })
            .on("data", (data) => (output += data.toString()))
            .stderr.on("data", (data) => (errorOutput += data.toString()));
        });
      })
      .on("error", (err) => {
        clearTimeout(timer);
        conn.end();
        reject(err);
      })
      .connect({
        host: process.env.VPN_HOST,
        port: 22,
        username: process.env.VPN_USER,
        password: process.env.VPN_PASS,
      });

    // Timeout safeguard
    timer = setTimeout(() => {
      conn.end();
      reject(new Error(`SSH command timed out after ${timeout / 1000}s`));
    }, timeout);
  });
};

/**
 * Download a file from remote via SFTP
 */
export const downloadFile = ({ remotePath, localPath, timeout = 30000 }) => {
  return new Promise((resolve, reject) => {
    const conn = new Client();
    let timer;

    conn
      .on("ready", () => {
        conn.sftp((err, sftp) => {
          if (err) {
            clearTimeout(timer);
            conn.end();
            return reject(err);
          }

          const stream = sftp.createReadStream(remotePath);
          const writeStream = fs.createWriteStream(localPath);

          stream.pipe(writeStream);

          writeStream.on("close", () => {
            clearTimeout(timer);
            conn.end();
            resolve(localPath);
          });

          const handleError = (e) => {
            clearTimeout(timer);
            conn.end();
            reject(e);
          };

          stream.on("error", handleError);
          writeStream.on("error", handleError);
        });
      })
      .on("error", (err) => {
        clearTimeout(timer);
        conn.end();
        reject(err);
      })
      .connect({
        host: process.env.VPN_HOST,
        port: 22,
        username: process.env.VPN_USER,
        password: process.env.VPN_PASS,
      });

    // Timeout safeguard
    timer = setTimeout(() => {
      conn.end();
      reject(new Error(`SFTP download timed out after ${timeout / 1000}s`));
    }, timeout);
  });
};
