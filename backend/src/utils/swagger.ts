export const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "FOBOH Pricing API",
    version: "1.0.0",
    description: "In-memory pricing API for the FOBOH challenge",
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
          { name: "brand", in: "query", schema: { type: "string" } },
        ],
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Product" },
                },
              },
            },
          },
        },
      },
    },
    
    "/api/pricing/preview": {
      post: {
        summary: "Preview bespoke pricing for selected products",
        description:
          "Calculates the final price based on the wholesale price and applied adjustments.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  productIds: { type: "array", items: { type: "string" } },
                  adjustmentType: {
                    type: "string",
                    enum: ["percentage", "fixed"],
                  },
                  adjustmentValue: { type: "number" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Calculation successful",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    allOf: [
                      { $ref: "#/components/schemas/Product" },
                      {
                        type: "object",
                        properties: {
                          calculatedBespokePrice: { type: "number" },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
    },

    "/api/profiles": {
      get: {
        summary: "List profiles",
        responses: { "200": { description: "OK" } },
      },
      post: {
        summary: "Create profile",
        responses: { "201": { description: "Created" } },
      },
    },
    "/api/profiles/{id}": {
      get: {
        summary: "Get profile",
        responses: { "200": { description: "OK" } },
      },
      delete: {
        summary: "Delete profile",
        responses: { "204": { description: "Deleted" } },
      },
    },
  },
  // Added Components for better organization
  components: {
    schemas: {
      Product: {
        type: "object",
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          skuCode: { type: "string" },
          imageUrl: { type: "string" },
          wholesalePrice: { type: "number" },
          brand: { type: "string" },
          categoryId:{ type: "string" },
          subCategoryId: { type: "string" },
          segmentId: { type: "string" },
        },
      },
    },
  },
};
