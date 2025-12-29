import config from "./env.js";
import swaggerJSDoc from "swagger-jsdoc";
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "E-Commerce API E-Commerce",
            version: "1.0.0",
            description: "Dokumentasi lengkap API E-Commerce",
            contact: {
                name: "Backend Developer",
            }
        },
        servers: [
            {
                url: `http://${config.HOST}:${config.PORT}/api`,
                description: "Development server"
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                }
            }
        },
        security: [
            {
                bearerAuth: [],
            }
        ]
    },
    apis: ["src/routes/*.ts"],
};
const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;
//# sourceMappingURL=swagger.js.map
