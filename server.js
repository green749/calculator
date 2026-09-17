const http = require("http");
const fs = require("fs");
const path = require("path");

const port = 5000;

const server = http.createServer((req, res) => {

    // Enable CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // Handle preflight request
    if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
    }

    // Serve index.html
    if (req.url === "/" && req.method === "GET") {

        const filePath = path.join(__dirname, "index.html");

        fs.readFile(filePath, (error, data) => {

            if (error) {
                res.writeHead(500, {
                    "Content-Type": "text/plain"
                });

                res.end("Error loading index.html");
                return;
            }

            res.writeHead(200, {
                "Content-Type": "text/html"
            });

            res.end(data);
        });

    }

    // Calculator API
    else if (req.url === "/calculate" && req.method === "POST") {

        let body = "";

        req.on("data", (chunk) => {
            body += chunk;
        });

        req.on("end", () => {

            const { num1, num2, operator } = JSON.parse(body);

            let result;

            switch (operator) {
                case "+":
                    result = num1 + num2;
                    break;

                case "-":
                    result = num1 - num2;
                    break;

                case "*":
                    result = num1 * num2;
                    break;

                case "/":
                    if (num2 === 0) {
                        result = "Cannot divide by zero";
                    } else {
                        result = num1 / num2;
                    }
                    break;

                default:
                    result = "Invalid operator";
            }

            res.writeHead(200, {
                "Content-Type": "application/json"
            });

            res.end(JSON.stringify({
                result: result
            }));
        });

    }

    // Route not found
    else {

        res.writeHead(404, {
            "Content-Type": "application/json"
        });

        res.end(JSON.stringify({
            message: "Route not found"
        }));
    }
});

server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});