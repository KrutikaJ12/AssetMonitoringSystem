const { sql, getPool } = require("../config/db");

// ASSET SUMMARY REPORT

async function getAssetSummaryReports({
  assetId,
  fromDate,
  toDate,
  reportType,
}) {
  console.log({
    assetId,
    fromDate,
    toDate,
    reportType,
  });
  const pool = await getPool();

  if (reportType === "day") {
    const response = await pool
      .request()
      .input("assetId", sql.Int, assetId)
      .input("fromDate", sql.Date, fromDate)
      .input("toDate", sql.Date, toDate).query(`
            SELECT
                sm.SiteName,
                adu.AssetID,

                adu.FirstEventDateTimeUtc AS StartDate,
                adu.LastEventDateTimeUtc AS EndDate,

                CONCAT(
                    DATEDIFF(
                        MINUTE,
                        adu.FirstEventDateTimeUtc,
                        adu.LastEventDateTimeUtc
                    ) / 60,
                    'h ',
                    DATEDIFF(
                        MINUTE,
                        adu.FirstEventDateTimeUtc,
                        adu.LastEventDateTimeUtc
                    ) % 60,
                    'm'
                ) AS Duration,
                 CONCAT( adu.WorkingMinutes / 60,'h ',
                       adu.WorkingMinutes % 60,'m') AS WorkingHours,
                adu.FuelConsumedLitres AS FuelConsumedLitres,
                adu.UsageDate,
                adu.EngineOnMinutes,
                adu.IdleMinutes,
                adu.StoppedMinutes,
                adu.OfflineMinutes

            FROM dbo.AssetDailyUsage adu

            LEFT JOIN dbo.AssetInSite ais
                ON ais.AssetID = adu.AssetID

            LEFT JOIN dbo.SiteMaster sm
                ON sm.SiteID = ais.SiteID

            WHERE adu.AssetID = @assetId
              AND adu.UsageDate >= @fromDate
              AND adu.UsageDate <= @toDate

            ORDER BY adu.UsageDate;
        `);

    return response.recordset;
  }
  //this is for weekely
  // WITH WeeklyData AS (
  //                 SELECT
  //                     DATEADD(
  //                         DAY,
  //                         (DATEDIFF(DAY, @fromDate, UsageDate) / 7) * 7,
  //                         @fromDate
  //                     ) AS PeriodStart,

  //                     UsageDate,
  //                     AssetID,
  //                     FirstEventDateTimeUtc,
  //                     LastEventDateTimeUtc,
  //                     EngineOnMinutes,
  //                     WorkingMinutes,
  //                     IdleMinutes,
  //                     StoppedMinutes,
  //                     OfflineMinutes

  //                 FROM dbo.AssetDailyUsage

  //                 WHERE AssetID = @assetId
  //                   AND UsageDate >= @fromDate
  //                   AND UsageDate <= @toDate
  //             )

  //             SELECT
  //                 sm.SiteName,
  //                 WeeklyData.AssetID AS AssetID,

  //                 MIN(FirstEventDateTimeUtc) AS StartDate,
  //                 MAX(LastEventDateTimeUtc) AS EndDate,

  //                 CONCAT(
  //                     DATEDIFF(
  //                         MINUTE,
  //                         MIN(FirstEventDateTimeUtc),
  //                         MAX(LastEventDateTimeUtc)
  //                     ) / 60,
  //                     'h ',
  //                     DATEDIFF(
  //                         MINUTE,
  //                         MIN(FirstEventDateTimeUtc),
  //                         MAX(LastEventDateTimeUtc)
  //                     ) % 60,
  //                     'm'
  //                 ) AS Duration,

  //                 WeeklyData.PeriodStart,

  //                 CASE
  //                     WHEN DATEADD(DAY, 6, WeeklyData.PeriodStart) > @toDate
  //                         THEN @toDate
  //                     ELSE DATEADD(DAY, 6, WeeklyData.PeriodStart)
  //                 END AS PeriodEnd,

  //                 SUM(EngineOnMinutes) AS EngineOnMinutes,
  //                 SUM(WorkingMinutes) AS WorkingMinutes,
  //                 SUM(IdleMinutes) AS IdleMinutes,
  //                 SUM(StoppedMinutes) AS StoppedMinutes,
  //                 SUM(OfflineMinutes) AS OfflineMinutes

  //             FROM WeeklyData

  //             LEFT JOIN dbo.AssetInSite ais
  //                 ON ais.AssetID = WeeklyData.AssetID

  //             LEFT JOIN dbo.SiteMaster sm
  //                 ON sm.SiteID = ais.SiteID

  //             GROUP BY
  //                 sm.SiteName,
  //                 WeeklyData.AssetID,
  //                 WeeklyData.PeriodStart

  //             ORDER BY WeeklyData.PeriodStart;

  if (reportType === "week") {
    const response = await pool
      .request()
      .input("assetId", sql.Int, assetId)
      .input("fromDate", sql.Date, fromDate)
      .input("toDate", sql.Date, toDate).query(`
            WITH WeeklyData AS (
                SELECT
                    DATEADD(
                        DAY,
                        (DATEDIFF(DAY, @fromDate, UsageDate) / 7) * 7,
                        @fromDate
                    ) AS PeriodStart,

                    UsageDate,
                    AssetID,
                    FirstEventDateTimeUtc,
                    LastEventDateTimeUtc,
                    EngineOnMinutes,
                    WorkingMinutes,
                    IdleMinutes,
                    StoppedMinutes,
                    OfflineMinutes,
                    FuelConsumedLitres

                FROM dbo.AssetDailyUsage

                WHERE AssetID = @assetId
                  AND UsageDate >= @fromDate
                  AND UsageDate <= @toDate
            )

            SELECT
                sm.SiteName,

                WeeklyData.AssetID AS AssetID,

                -- Reporting period start
                WeeklyData.PeriodStart AS StartDate,

                -- Reporting period end
                CASE
                    WHEN DATEADD(DAY, 6, WeeklyData.PeriodStart) > @toDate
                        THEN @toDate
                    ELSE DATEADD(DAY, 6, WeeklyData.PeriodStart)
                END AS EndDate,

                -- Duration of the reporting period
                CONCAT(
                    DATEDIFF(
                        DAY,
                        WeeklyData.PeriodStart,
                        CASE
                            WHEN DATEADD(DAY, 6, WeeklyData.PeriodStart) > @toDate
                                THEN @toDate
                            ELSE DATEADD(DAY, 6, WeeklyData.PeriodStart)
                        END
                    ) + 1,
                    ' days'
                ) AS Duration,

                -- Keep period fields available for future use
                WeeklyData.PeriodStart AS PeriodStart,

                CASE
                    WHEN DATEADD(DAY, 6, WeeklyData.PeriodStart) > @toDate
                        THEN @toDate
                    ELSE DATEADD(DAY, 6, WeeklyData.PeriodStart)
                END AS PeriodEnd,

                -- Aggregated usage data
                SUM(FuelConsumedLitres) AS FuelConsumedLitres,
                SUM(EngineOnMinutes) AS EngineOnMinutes,
                CONCAT(SUM(WorkingMinutes) / 60,'h ',
                       SUM(WorkingMinutes) % 60,'m') AS WorkingHours,
                 SUM(WorkingMinutes) AS WorkingMinutes,
                SUM(IdleMinutes) AS IdleMinutes,
                SUM(StoppedMinutes) AS StoppedMinutes,
                SUM(OfflineMinutes) AS OfflineMinutes

            FROM WeeklyData

            LEFT JOIN dbo.AssetInSite ais
                ON ais.AssetID = WeeklyData.AssetID

            LEFT JOIN dbo.SiteMaster sm
                ON sm.SiteID = ais.SiteID

            GROUP BY
                sm.SiteName,
                WeeklyData.AssetID,
                WeeklyData.PeriodStart

            ORDER BY WeeklyData.PeriodStart;
        `);

    return response.recordset;
  }
  if (reportType === "month") {
    const response = await pool
      .request()
      .input("assetId", sql.Int, assetId)
      .input("fromDate", sql.Date, fromDate)
      .input("toDate", sql.Date, toDate).query(`
            WITH MonthlyData AS (
                SELECT
                    CASE
                        WHEN DATEFROMPARTS(
                            YEAR(UsageDate),
                            MONTH(UsageDate),
                            1
                        ) < @fromDate
                        THEN @fromDate
                        ELSE DATEFROMPARTS(
                            YEAR(UsageDate),
                            MONTH(UsageDate),
                            1
                        )
                    END AS PeriodStart,

                    UsageDate,
                    AssetID,
                    EngineOnMinutes,
                    WorkingMinutes,
                    IdleMinutes,
                    StoppedMinutes,
                    OfflineMinutes,
                    FuelConsumedLitres

                FROM dbo.AssetDailyUsage

                WHERE AssetID = @assetId
                  AND UsageDate >= @fromDate
                  AND UsageDate <= @toDate
            )

            SELECT
                sm.SiteName,

                MonthlyData.AssetID AS AssetID,

                -- Reporting period start
                MonthlyData.PeriodStart AS StartDate,

                -- Reporting period end
                CASE
                    WHEN EOMONTH(MonthlyData.UsageDate) > @toDate
                        THEN @toDate
                    ELSE EOMONTH(MonthlyData.UsageDate)
                END AS EndDate,

                -- Duration of the reporting period
                CONCAT(
                    DATEDIFF(
                        DAY,
                        MonthlyData.PeriodStart,
                        CASE
                            WHEN EOMONTH(MonthlyData.UsageDate) > @toDate
                                THEN @toDate
                            ELSE EOMONTH(MonthlyData.UsageDate)
                        END
                    ) + 1,
                    ' days'
                ) AS Duration,

                -- Keep period fields available
                MonthlyData.PeriodStart AS PeriodStart,

                CASE
                    WHEN EOMONTH(MonthlyData.UsageDate) > @toDate
                        THEN @toDate
                    ELSE EOMONTH(MonthlyData.UsageDate)
                END AS PeriodEnd,

                -- Aggregated usage data
                SUM(FuelConsumedLitres) AS FuelConsumedLitres,
                SUM(EngineOnMinutes) AS EngineOnMinutes,
                CONCAT(SUM(WorkingMinutes) / 60,'h ',
                       SUM(WorkingMinutes) % 60,'m') AS WorkingHours,
                SUM(WorkingMinutes) AS WorkingMinutes,
                SUM(IdleMinutes) AS IdleMinutes,
                SUM(StoppedMinutes) AS StoppedMinutes,
                SUM(OfflineMinutes) AS OfflineMinutes

            FROM MonthlyData

            LEFT JOIN dbo.AssetInSite ais
                ON ais.AssetID = MonthlyData.AssetID

            LEFT JOIN dbo.SiteMaster sm
                ON sm.SiteID = ais.SiteID

            GROUP BY
                sm.SiteName,
                MonthlyData.AssetID,
                MonthlyData.PeriodStart,
                CASE
                    WHEN EOMONTH(MonthlyData.UsageDate) > @toDate
                        THEN @toDate
                    ELSE EOMONTH(MonthlyData.UsageDate)
                END

            ORDER BY MonthlyData.PeriodStart;
        `);

    return response.recordset;
  }
}

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
// ASSET DETAIL REPORT
// ======================================================

async function getAssetReportDetails(assetId) {
    const pool = await getPool();

    const response = await pool
        .request()
        .input("assetId", sql.Int, Number(assetId))
        .query(`
            SELECT
                sm.SiteName,
                adu.AssetID,

                MIN(adu.FirstEventDateTimeUtc) AS StartDate,

                MAX(adu.LastEventDateTimeUtc) AS EndDate,

                CONCAT(
                    DATEDIFF(
                        MINUTE,
                        MIN(adu.FirstEventDateTimeUtc),
                        MAX(adu.LastEventDateTimeUtc)
                    ) / 60,
                    'h ',
                    DATEDIFF(
                        MINUTE,
                        MIN(adu.FirstEventDateTimeUtc),
                        MAX(adu.LastEventDateTimeUtc)
                    ) % 60,
                    'm'
                ) AS Duration

            FROM dbo.AssetDailyUsage adu

            LEFT JOIN dbo.AssetInSite ais
                ON ais.AssetID = adu.AssetID

            LEFT JOIN dbo.SiteMaster sm
                ON sm.SiteID = ais.SiteID

            WHERE adu.AssetID = @assetId

            GROUP BY
                sm.SiteName,
                adu.AssetID;
        `);

    const summary = response.recordset?.[0];

    if (!summary) {
        return null;
    }

    return {
        SiteName: summary.SiteName,
        AssetID: summary.AssetID,
        StartDate: summary.StartDate,
        EndDate: summary.EndDate,
        Duration: summary.Duration,
        Movements: []
    };
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
  getAssetSummaryReports,
  getSpeedViolationReports,
  getStartStopReports,
  getMovementReports,
  getStopReports,
  getAssetReportDetails,
};
