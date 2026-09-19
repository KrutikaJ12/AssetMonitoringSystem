const { sql, getPool } = require("../config/db");


// ======================================================
// SPEED VIOLATION REPORT
// ======================================================

async function getSpeedViolationReports() {
    const pool = await getPool();

    const response = await pool.request().query(`
        SELECT
            Id,
            AssetId,
            [Date],
            [Time],
            Location,
            Speed,
            SpeedLimit,
            [Status],
            DriverName
        FROM dbo.SpeedViolationReport
        ORDER BY Id;
    `);

    return response.recordset;
}


// ======================================================
// START STOP REPORT
// ======================================================

async function getStartStopReports() {
    const pool = await getPool();

    const response = await pool.request().query(`
        SELECT
            Id,
            AssetId,
            StartDate,
            StartTime,
            StartLocation,
            [Event],
            EndDate,
            EndTime,
            EndLocation,
            Duration,
            MaxSpeedLocation,
            DriverName
        FROM dbo.StartStopReport
        ORDER BY Id ;
    `);

    return response.recordset;
}


// ======================================================
// MOVEMENT REPORT
// ======================================================

async function getMovementReports() {
    const pool = await getPool();

    const response = await pool.request().query(`
        SELECT
            Id,
            AssetId,
            StartDate,
            StartTime,
            StartLocation,
            [Event],
            EndDate,
            EndTime,
            EndLocation,
            Duration,
            MaxSpeedLocation,
            DriverName
        FROM dbo.MovementReport
        ORDER BY Id ;
    `);

    return response.recordset;
}


// ======================================================
// STOP REPORT
// ======================================================

async function getStopReports() {
    const pool = await getPool();

    const response = await pool.request().query(`
        SELECT
            Id,
            AssetId,
            StartDate,
            StartTime,
            StartLocation,
            [Event],
            EndDate,
            EndTime,
            EndLocation,
            Duration,
            MaxSpeedLocation,
            DriverName
        FROM dbo.StopReport
        ORDER BY Id;
    `);

    return response.recordset;
}


module.exports = {
    getSpeedViolationReports,
    getStartStopReports,
    getMovementReports,
    getStopReports
};