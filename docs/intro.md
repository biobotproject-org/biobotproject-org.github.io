---
sidebar_position: 1
---

# Introduction

Wildfire Alarm is an open-source sensor network for early wildfire detection. Low-cost nodes placed at the forest edge sample the air every 30 seconds, decide on the node itself whether something looks like smoke or fire, and report over cellular to a cloud service that opens an incident and emails the people responsible for that area.

Project website: [wildfirealarm.org](https://wildfirealarm.org/).

## Why Wildfire Alarm?

Wildfires are hardest to stop once they grow past their ignition point, so the first minutes matter. Remote terrain makes cameras and staffed lookouts expensive. A Wildfire Alarm node needs no local infrastructure: a 12 V battery with a solar charge controller, and cellular coverage.

## How it works

1. **Sense.** Each node reads a Bosch BMV080 (PM1, PM2.5, PM10) and a Bosch BME688 (gas resistance, temperature, humidity, pressure) every 30 seconds.
2. **Decide on the node.** An on-device anomaly detector compares each sample with absolute limits (for example PM2.5 above 55 µg/m³) and with a baseline the node learns for its own spot. Signals must persist for several samples, so a single gust does not trip an alarm. The result is a severity: `none`, `watch`, `alert`, `critical` or `fault`.
3. **Report.** A Blues Notecard sends a batch of readings every 10 minutes (`data.qo`) and an alert immediately when the severity reaches `alert` or above (`alert.qo`). Notehub forwards both to the Wildfire Alarm API.
4. **Act.** The API opens an incident, emails the hosts with the readings and a map link, and shows it on the dashboard. A host drives out, checks, and records what they found: fire, false alarm, or sensor fault.

The dashboard also shows a live map with the current wind at each node, a rough "where could a fire be in 30, 60 and 120 minutes" envelope, and NASA FIRMS satellite hotspots nearby.

## Project structure

| Repo | Description |
|---|---|
| [biobot-firmware](https://github.com/biobotproject-org/biobot-firmware) | Arduino firmware for the Nano ESP32 node: sensors, on-device anomaly detection, Notecard uplink |
| [biobot-hardware](https://github.com/biobotproject-org/biobot-hardware) | Carrier PCB (Altium), gerbers, BOM, assembly photos |
| [biobot-cloud](https://github.com/biobotproject-org/biobot-cloud) | Node.js API: Notehub ingest, incidents, email alerts, live map data |
| [biobot-dashboard](https://github.com/biobotproject-org/biobot-dashboard) | React web dashboard |
| [biobot-infrastructure](https://github.com/biobotproject-org/biobot-infrastructure) | Docker Compose stack that runs the database, API and dashboard |
| [biobot-data](https://github.com/biobotproject-org/biobot-data) | Open datasets from test burns and field recordings |

The repository names keep the project's earlier name, BioBot.

## License

Wildfire Alarm is fully open source. Each kind of work uses the license that fits it:

| What | License |
|---|---|
| Firmware, cloud API, dashboard, website code | [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0) |
| Hardware designs (schematics, layout, BOM) | [CERN-OHL-P-2.0](https://ohwr.org/cern_ohl_p_v2.txt) |
| Sensor data and documentation text | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |
