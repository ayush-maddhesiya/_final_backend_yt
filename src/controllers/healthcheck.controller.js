import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import os from 'os'

const healthcheck = asyncHandler(async (req, res) => {
    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();
    const loadAverage = os.loadavg();
    const platform = os.platform();
    const cpus = os.cpus().length;
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();

    try {
        const healthInfo = {
            uptime: `${Math.floor(uptime / 60)} minutes, ${Math.floor(uptime % 60)} seconds`,
            memoryUsage: {
                rss: `${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB`,
                heapTotal: `${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`,
                heapUsed: `${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`,
                external: `${(memoryUsage.external / 1024 / 1024).toFixed(2)} MB`,
            },
            loadAverage: loadAverage.map(avg => avg.toFixed(2)),
            platform,
            cpus,
            totalMemory: `${(totalMemory / 1024 / 1024).toFixed(2)} MB`,
            freeMemory: `${(freeMemory / 1024 / 1024).toFixed(2)} MB`,
        };
    
        res.status(200).json(
            new ApiResponse(
                200,
                healthInfo,
                "Health check successful"
            )
        );
    } catch (error) {
        throw new ApiError(504,error?.messaage || "some error in health cheak")
    }
});


export {
    healthcheck
    }
    