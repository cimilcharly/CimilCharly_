import { runFullIngestionIndex } from "../lib/api/indexer.server";

console.log("[CLI Indexer] Starting full portfolio ingestion...");
runFullIngestionIndex()
  .then(() => {
    console.log("[CLI Indexer] Ingestion and vector store cache generated successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("[CLI Indexer] Ingestion failed:", error);
    process.exit(1);
  });
