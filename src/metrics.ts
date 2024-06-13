import "dotenv/config";
import { StatsD } from "node-statsd";

const environment = process.env.NODE_ENV;
const graphite = process.env.GRAPHITE_HOST;

if (graphite === null) throw new Error("Graphite host is not configured");

const metrics = new StatsD({
    host: graphite,
    port: 8125,
    prefix: `${environment}.arcadious.`,
});

export default metrics;
