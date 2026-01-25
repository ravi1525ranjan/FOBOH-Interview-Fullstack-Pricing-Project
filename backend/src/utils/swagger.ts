export const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "FOBOH Pricing API",
    version: "1.0.0",
    description: "In-memory pricing API for the FOBOH challenge"
  },
  servers: [{ url: "http://localhost:4000" }],
  paths: {
    "/api/products": {
      get: {
        summary: "List products",
        parameters: [
          { name: "q", in: "query", schema: { type: "string" } },
          { name: "category", in: "query", schema: { type: "string" } },
          { name: "subCategory", in: "query", schema: { type: "string" } },
          { name: "segment", in: "query", schema: { type: "string" } },
          { name: "brand", in: "query", schema: { type: "string" } }
        ],
        responses: {
          "200": { description: "OK" }
        }
      }
    },
    "/api/profiles": {
      get: { summary: "List profiles", responses: { "200": { description: "OK" } } },
      post: { summary: "Create profile", responses: { "201": { description: "Created" } } }
    },
    "/api/profiles/{id}": {
      get: { summary: "Get profile", responses: { "200": { description: "OK" } } },
      delete: { summary: "Delete profile", responses: { "204": { description: "Deleted" } } }
    }
  }
};
