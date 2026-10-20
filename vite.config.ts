import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import path from 'path';
import fs from 'fs';

function tgcloudEndpointsPlugin(): Plugin {
  const virtualModuleId = 'virtual:tgcloud-endpoints';
  const resolvedVirtualModuleId = '\0' + virtualModuleId;

  const getEndpoints = () => {
    const endpointsDir = path.resolve(__dirname, 'tgcloud/endpoints');
    if (!fs.existsSync(endpointsDir)) {
      return [];
    }
    return fs
      .readdirSync(endpointsDir)
      .filter((file) => file.endsWith('.js'))
      .map((file) => path.basename(file, '.js'))
      .sort();
  };

  return {
    name: 'tgcloud-endpoints-plugin',
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        const endpoints = getEndpoints();
        return `export const discoveredEndpoints = ${JSON.stringify(endpoints)};`;
      }
    },
    configureServer(server) {
      const endpointsDir = path.resolve(__dirname, 'tgcloud/endpoints');
      if (fs.existsSync(endpointsDir)) {
        server.watcher.add(endpointsDir);
      }
      server.watcher.on('all', (event, filePath) => {
        if (filePath.includes(path.join('tgcloud', 'endpoints'))) {
          const mod = server.moduleGraph.getModuleById(resolvedVirtualModuleId);
          if (mod) {
            server.moduleGraph.invalidateModule(mod);
            server.ws.send({
              type: 'custom',
              event: 'tgcloud-endpoints-changed',
              data: { endpoints: getEndpoints() },
            });
          }
        }
      });

      // Local Dev Serverless Endpoint Runner
      // Intercepts /api/:endpoint so local testing runs the endpoint in Node instead of returning Vite's SPA index.html!
      server.middlewares.use(async (req, res, next) => {
        if (req.url && req.url.startsWith('/api/')) {
          const urlObj = new URL(req.url, 'http://localhost');
          const endpointName = urlObj.pathname.replace(/^\/api\//, '').replace(/\/$/, '');
          const endpointFile = path.join(endpointsDir, `${endpointName}.js`);

          if (fs.existsSync(endpointFile)) {
            if (req.method !== 'POST') {
              res.statusCode = 405;
              res.setHeader('Content-Type', 'application/json');
              res.end(
                JSON.stringify({
                  ok: false,
                  error: `Method ${req.method} not allowed. Telegram serverless endpoints must be called with POST /api/${endpointName}`,
                })
              );
              return;
            }

            let bodyData = '';
            req.on('data', (chunk) => {
              bodyData += chunk;
            });

            req.on('end', async () => {
              let input: Record<string, unknown> = {};
              try {
                if (bodyData.trim()) {
                  input = JSON.parse(bodyData);
                }
              } catch {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ ok: false, error: 'Malformed JSON payload' }));
                return;
              }

              const rawInitData = (req.headers['x-telegram-init-data'] as string) || '';
              const ctx = {
                initData: {
                  user: {
                    id: 12345678,
                    first_name: 'Local Dev User',
                    username: 'dev_user',
                    language_code: 'en',
                  },
                  raw: rawInitData,
                },
              };

              try {
                const mod = await server.ssrLoadModule(endpointFile);
                const fn = mod.default;
                if (typeof fn !== 'function') {
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(
                    JSON.stringify({
                      ok: false,
                      error: 'Endpoint file does not export a default function',
                    })
                  );
                  return;
                }

                const result = await fn(input, ctx);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ ok: true, result }));
              } catch (err: unknown) {
                const error = err as { name?: string; message?: string; parameters?: Record<string, unknown> };
                const isEndpointError =
                  error?.name === 'EndpointError' || error?.parameters !== undefined;
                res.statusCode = isEndpointError ? 400 : 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(
                  JSON.stringify({
                    ok: false,
                    error_type: isEndpointError ? 'ENDPOINT_ERROR' : 'INTERNAL',
                    description: error?.message || 'Serverless execution error',
                    parameters: error?.parameters,
                  })
                );
              }
            });
            return;
          } else {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                ok: false,
                error: `Endpoint '${endpointName}' not found in tgcloud/endpoints/${endpointName}.js`,
              })
            );
            return;
          }
        }
        next();
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tgcloudEndpointsPlugin(),
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
      routesDirectory: './src/app',
      routeFileIgnorePattern: '.*_comp.*',
    }),
    react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    },
  },
  server: {
    allowedHosts: ['app.local', '.local'],
  },
});
