---
sidebar_position: 1
---

# Introduction

BioBot is an open-source IoT sensor network designed for early wildfire detection in remote environments. Each node combines precision air quality sensing with cellular connectivity to report smoke and gas anomalies in real time — before a fire has a chance to spread.

## Why BioBot?

Wildfires are increasingly difficult to contain once they grow past their ignition point. Early detection in the first minutes is critical, but remote terrain makes traditional monitoring infrastructure impractical. BioBot solves this by deploying low-power, self-contained sensor nodes that require no local infrastructure — just a solar panel, a battery, and cellular coverage.

## How it works

Each BioBot node continuously samples air quality using a Bosch BMV080 particulate matter sensor and a Bosch BME688 gas sensor. When readings exceed configurable thresholds — elevated PM2.5, abnormal VOC signatures, rising temperature — the node transmits an alert over LTE-M via a Blues Notecard to the cloud backend, which triggers notifications and logs the event to the dashboard.

## Project structure

The BioBot project is split across several repositories:

| Repo | Description |
|---|---|
| [biobot-firmware](https://github.com/biobotproject-org/biobot-firmware) | Arduino/PlatformIO firmware for the sensor node |
| [biobot-hardware](https://github.com/biobotproject-org/biobot-hardware) | KiCad schematics, PCB layout, BOM |
| [biobot-cloud](https://github.com/biobotproject-org/biobot-cloud) | Node.js API, database schema, alert engine |
| [biobot-dashboard](https://github.com/biobotproject-org/biobot-dashboard) | React web dashboard |
| [biobot-gateway](https://github.com/biobotproject-org/biobot-gateway) | Gateway firmware for border nodes |
| [biobot-data](https://github.com/biobotproject-org/biobot-data) | Open datasets and ML training data |

## License

BioBot is fully open source under the [GNU General Public License v3.0](https://www.gnu.org/licenses/gpl-3.0.html).