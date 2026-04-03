---
sidebar_position: 1
---

# Hardware Overview

Each BioBot sensor node is a compact, weatherproof unit designed for unattended outdoor deployment. The hardware is intentionally modular sensors, radios, and power sources can be swapped without redesigning the board.

## Core components

### Bosch BMV080 - Particulate Matter Sensor
The BMV080 measures airborne particle concentration across multiple size fractions including PM1.0, PM2.5, and PM10. Smoke from wood combustion produces a highly characteristic PM2.5 signature that the firmware uses as a primary detection input.

### Bosch BME688 - Gas, Humidity, Temperature & Pressure Sensor
The BME688 provides VOC (volatile organic compound) detection alongside temperature, humidity, and barometric pressure. When combined with PM readings, VOC spikes help distinguish smoke from dust or pollen, reducing false positives.

### Blues Notecard - Cellular Connectivity
The Blues Notecard is a low-power LTE-M/NB-IoT module with a built-in SIM that provides global cellular coverage. It handles all communication with the cloud backend over HTTPS and MQTT, with automatic store-and-forward when connectivity is intermittent.

### Microcontroller
The firmware targets the ESP32-S3, which provides sufficient processing power for sensor fusion and BSEC library integration while maintaining a low sleep current for battery-operated deployments.

## Power budget

The node is designed to run for multiple weeks on a single charge under typical polling intervals. Key power states:

| State | Current draw |
|---|---|
| Deep sleep | ~20 μA |
| Sensor sampling | ~45 mA |
| Cellular transmit | ~220 mA peak |
| Average (5 min interval) | ~2.1 mA |

At 2.1 mA average draw, a 10,000 mAh battery provides approximately 200 days of operation. Adding a small solar panel can extend this indefinitely in sunny deployments.

## Enclosure

The node enclosure is 3D-printable and designed for continuous outdoor use. STL files are available in the [biobot-hardware](https://github.com/biobotproject-org/biobot-hardware) repository.