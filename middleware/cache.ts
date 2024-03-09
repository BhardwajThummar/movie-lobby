import NodeCache from "node-cache";
import { Request, Response, NextFunction } from 'express';
import * as dotenv from 'dotenv';
dotenv.config();

const myCache = new NodeCache({ stdTTL: parseInt(process.env.CACHE_EXPIRY_TIME ?? '100'), checkperiod: 120 });

export default function cacheMiddleware(req: Request, res: Response, next: NextFunction) {
    if (req.method === "POST" || req.method === "PUT" || req.method === "DELETE") {
        // Skip caching for non-GET requests
        console.log("Skipping cache for", req.method, "request");
        return next();
    }

    const key = "__express__" + (req.originalUrl || req.url);
    const cachedBody = myCache.get(key);

    if (cachedBody) {
        console.log("Cache hit");
        return res.json(JSON.parse(cachedBody as string));
    } else {
        console.log("Cache miss");
        const originalSend = res.send;
        res.send = function (body) {

            if (res.statusCode !== 200) {
                // Skip caching for non-200 responses
                console.log("Skipping cache for non-200 response");
                return originalSend.call(this, body);
            }

            // Intercept the response and cache it
            try {
                // Convert the response body to JSON if it's not already a string
                const responseBody = typeof body === 'string' ? body : JSON.stringify(body);
                myCache.set(key, responseBody);
            } catch (error) {
                console.log("Error parsing response body, not caching");
            }
            // Call the original send method to send the response
            return originalSend.call(this, body);
        };
        next();
    }
}
