import client from 'prom-client';

const register = new client.Registry();

client.collectDefaultMetrics({ register });

export const httpRequests = new client.Counter({ name: 'nexdrop_http_requests_total', help: 'Total HTTP requests', labelNames: ['route', 'method'] });
export const uploads = new client.Counter({ name: 'nexdrop_uploads_total', help: 'Total uploaded files' });
export const downloads = new client.Counter({ name: 'nexdrop_downloads_total', help: 'Total downloads' });
export const errors = new client.Counter({ name: 'nexdrop_errors_total', help: 'Total server errors' });

register.registerMetric(httpRequests);
register.registerMetric(uploads);
register.registerMetric(downloads);
register.registerMetric(errors);

export { register };
