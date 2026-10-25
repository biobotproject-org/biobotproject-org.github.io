---
sidebar_position: 1
---

# Hardware Overview

A Wildfire Alarm node is a carrier PCB that holds off-the-shelf modules and gives them clean power and sensor connectors. The current board is **Fire Detection Device, rev A**. Its design files, gerbers and BOM are in [biobot-hardware](https://github.com/biobotproject-org/biobot-hardware).

## Core components

| Function | Part |
|---|---|
| Microcontroller | Arduino Nano ESP32 (ESP32-S3) on two 15-pin headers |
| Cellular modem | Blues Notecard in an M.2 Key E socket, with an external nano-SIM holder |
| Particulate sensor | Bosch BMV080 breakout (PM1, PM2.5, PM10, obstruction flag) |
| Gas / environment sensor | Bosch BME688 breakout (gas resistance, temperature, humidity, pressure) |
| 5 V regulator | TI TPS563201 buck, 3 A |
| Power input | 12 V screw terminal |

### Bosch BMV080, particulate matter
Measures PM1, PM2.5 and PM10. Smoke from wood combustion raises PM2.5 sharply, which makes it the primary detection input.

### Bosch BME688, gas, humidity, temperature, pressure
Smoke and nearby fire show up as gas resistance falling, humidity dropping and temperature rising relative to the node's own baseline. Combined with PM readings, this helps tell smoke from dust or pollen.

### Blues Notecard, cellular
A low-power LTE-M / NB-IoT modem that sends notes to Blues Notehub, with store-and-forward when coverage drops. Notehub routes the notes to the Wildfire Alarm API.

## Power

The board expects an external 12 V supply, for example a 12 V LiFePO4 battery behind an off-the-shelf solar charge controller with a load output. The buck regulator makes 5 V for the Nano and the Notecard modem; 3.3 V comes from the Nano's own regulator. There is no charger, fuel gauge or solar input on the board itself.

## Known limitations of rev A

- No battery voltage sensing yet.
- Reverse polarity protection is a shunt diode with no fuse.
- Notecard ATTN is not routed, so the node cannot yet deep-sleep and wake on the modem.
- The sensor 3.3 V rail has no load switch, so the particulate sensor cannot be duty-cycled.
- The Notecard's u.FL antenna connectors need a pigtail to a bulkhead LTE antenna on the enclosure.

These are planned for rev B. The full list is in the hardware repository README.
