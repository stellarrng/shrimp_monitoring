const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  ScanCommand,
} = require("@aws-sdk/lib-dynamodb");

const app = express();

app.use(cors());
app.use(express.json());

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const docClient = DynamoDBDocumentClient.from(client);

app.get("/", (req, res) => {
  res.json({
    message: "Shrimp monitoring backend is running",
  });
});

app.get("/api/sensor-data", async (req, res) => {
  try {
    const command = new ScanCommand({
      TableName: process.env.DYNAMODB_TABLE,
    });

    const result = await docClient.send(command);

    const data = (result.Items || [])
      .sort((a, b) => String(a.date_time).localeCompare(String(b.date_time)))
      .map((item) => ({
        station: item.station,
        date_time: item.date_time,

        temperature: item["Temperature(oC)"],
        humidity: item["Humidity(%)"],
        windSpeed: item["Windspeed_(km/h)"],
        windDirection: item["Wind_direction(0/360)"],
        windGust: item["Wind_Gust(km/h)"],
        rainfall: item["Rain_fall(mm)"],
        solar: item["Solar_(Lux)"],
        pressure: item["Pressure_(hpa)"],

        recordId: item.recordId,
      }));

    res.json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    console.error("DynamoDB error:", error);

    res.status(500).json({
      success: false,
      message: "Cannot fetch DynamoDB data",
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
