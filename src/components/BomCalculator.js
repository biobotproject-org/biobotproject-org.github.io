import React, { useState } from 'react';
import styles from './BomCalculator.module.css';

const parts = [
    {
        name: 'ESP32-S3',
        role: 'Microcontroller',
        qty: 1,
        options: [
            { vendor: 'Adafruit', label: 'Adafruit ESP32-S3 Feather', price: 17.95, url: 'https://www.adafruit.com/product/5477' },
            { vendor: 'SparkFun', label: 'SparkFun Thing Plus ESP32-S3', price: 24.95, url: 'https://www.sparkfun.com/products/20168' },
            { vendor: 'Arduino', label: 'Arduino Nano ESP32', price: 18.00, url: 'https://store.arduino.cc/products/nano-esp32' },
            { vendor: 'AliExpress', label: 'Generic ESP32-S3 DevKit', price: 4.50, url: 'https://www.aliexpress.com' },
        ],
    },
    {
        name: 'Bosch BME688',
        role: 'Gas / temp / humidity sensor',
        qty: 1,
        options: [
            { vendor: 'Adafruit', label: 'Adafruit BME688 Breakout', price: 19.95, url: 'https://www.adafruit.com/product/5046' },
            { vendor: 'SparkFun', label: 'SparkFun BME688 Breakout', price: 21.50, url: 'https://www.sparkfun.com/products/19096' },
            { vendor: 'Pimoroni', label: 'Pimoroni BME688 Breakout', price: 15.90, url: 'https://shop.pimoroni.com/products/bme688-breakout' },
            { vendor: 'AliExpress', label: 'Generic BME688 Module', price: 6.20, url: 'https://www.aliexpress.com' },
        ],
    },
    {
        name: 'Bosch BMV080',
        role: 'Particulate matter sensor',
        qty: 1,
        options: [
            { vendor: 'SparkFun', label: 'SparkFun BMV080 Breakout', price: 34.95, url: 'https://www.sparkfun.com/products/26271' },
            { vendor: 'Bosch', label: 'BMV080 Eval Kit (official)', price: 49.00, url: 'https://www.bosch-sensortec.com' },
            { vendor: 'Mouser', label: 'BMV080 bare module', price: 32.50, url: 'https://www.mouser.com' },
        ],
    },
    {
        name: 'Blues Notecard',
        role: 'LTE-M cellular module',
        qty: 1,
        options: [
            { vendor: 'Blues', label: 'Notecard Cell (global)', price: 49.00, url: 'https://shop.blues.com/products/notecard' },
            { vendor: 'Blues', label: 'Notecard Cell+WiFi', price: 59.00, url: 'https://shop.blues.com/products/notecard' },
            { vendor: 'DigiKey', label: 'Notecard via DigiKey', price: 52.00, url: 'https://www.digikey.com' },
        ],
    },
    {
        name: 'Notecarrier',
        role: 'Notecard breakout board',
        qty: 1,
        options: [
            { vendor: 'Blues', label: 'Notecarrier-B', price: 19.00, url: 'https://shop.blues.com/products/carr-b' },
            { vendor: 'Blues', label: 'Notecarrier-A', price: 19.00, url: 'https://shop.blues.com/products/carr-a' },
        ],
    },
    {
        name: 'PCB / Prototyping',
        role: 'Circuit board',
        qty: 1,
        options: [
            { vendor: 'Breadboard', label: 'Breadboard (prototyping only)', price: 3.95, url: 'https://www.adafruit.com/product/64' },
            { vendor: 'Adafruit', label: 'Perma-Proto half-size protoboard', price: 4.50, url: 'https://www.adafruit.com/product/1609' },
            { vendor: 'SparkFun', label: 'SparkFun ProtoBoard', price: 3.95, url: 'https://www.sparkfun.com/products/12070' },
            { vendor: 'JLCPCB', label: 'BioBot custom PCB (JLCPCB, 5-pack)', price: 8.00, url: 'https://jlcpcb.com' },
            { vendor: 'PCBWay', label: 'BioBot custom PCB (PCBWay, 5-pack)', price: 12.00, url: 'https://www.pcbway.com' },
        ],
    },
    {
        name: 'Battery',
        role: 'Power supply',
        qty: 1,
        options: [
            { vendor: 'Adafruit', label: 'LiPo 10,000 mAh', price: 29.95, url: 'https://www.adafruit.com' },
            { vendor: 'Amazon', label: '18650 pack 10,000 mAh', price: 18.99, url: 'https://www.amazon.com' },
            { vendor: 'AliExpress', label: '18650 pack 10,000 mAh', price: 9.50, url: 'https://www.aliexpress.com' },
        ],
    },
    {
        name: 'Solar panel',
        role: 'Optional — 6V 2W',
        qty: 1,
        options: [
            { vendor: 'None', label: 'Skip (battery only)', price: 0.00, url: null },
            { vendor: 'Adafruit', label: '6V 2W Solar Panel', price: 14.95, url: 'https://www.adafruit.com/product/5366' },
            { vendor: 'AliExpress', label: '6V 2W Solar Panel', price: 4.20, url: 'https://www.aliexpress.com' },
        ],
    },
    {
        name: 'Charge controller',
        role: 'TP4056 with protection',
        qty: 1,
        options: [
            { vendor: 'Adafruit', label: 'Adafruit LiPo Charger (USB-C)', price: 6.95, url: 'https://www.adafruit.com/product/4410' },
            { vendor: 'AliExpress', label: 'TP4056 module (5-pack)', price: 1.80, url: 'https://www.aliexpress.com' },
        ],
    },
    {
        name: 'Enclosure',
        role: '3D printed (PLA/PETG)',
        qty: 1,
        options: [
            { vendor: 'Self-print', label: 'Print yourself (~100g filament)', price: 2.50, url: null },
            { vendor: 'JLCPCB', label: 'Order from JLCPCB 3D print', price: 12.00, url: 'https://3d.jlcpcb.com' },
            { vendor: 'Craftcloud', label: 'Order via Craftcloud', price: 18.00, url: 'https://craftcloud3d.com' },
        ],
    },
];

export default function BomCalculator() {
    const [selections, setSelections] = useState(parts.map(() => 0));

    const subtotals = parts.map((part, i) => part.options[selections[i]].price * part.qty);
    const total = subtotals.reduce((a, b) => a + b, 0);
    const cheapest = parts.reduce((a, part) => a + Math.min(...part.options.map(o => o.price)) * part.qty, 0);
    const overage = total - cheapest;

    const handleChange = (i, val) => {
        const next = [...selections];
        next[i] = parseInt(val);
        setSelections(next);
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <span>Component</span>
                <span>Vendor / Part</span>
                <span className={styles.center}>Qty</span>
                <span className={styles.right}>Subtotal</span>
            </div>

            {parts.map((part, i) => (
                <div key={part.name} className={styles.row}>
                    <div>
                        <div className={styles.partName}>{part.name}</div>
                        <div className={styles.partRole}>{part.role}</div>
                    </div>
                    <select value={selections[i]} onChange={(e) => handleChange(i, e.target.value)}>
                        {part.options.map((opt, j) => (
                            <option key={j} value={j}>
                                {opt.label} — {opt.vendor}
                            </option>
                        ))}
                    </select>
                    <div className={styles.center}>×{part.qty}</div>
                    <div className={styles.right}>${subtotals[i].toFixed(2)}</div>
                </div>
            ))}

            <div className={styles.totalBar}>
                <div>
                    <div className={styles.totalLabel}>Estimated total (1 node)</div>
                    <div className={styles.savings}>
                        {overage > 0.5
                            ? `$${overage.toFixed(2)} above minimum possible cost`
                            : 'Minimum cost configuration'}
                    </div>
                </div>
                <div className={styles.totalVal}>${total.toFixed(2)}</div>
            </div>
        </div>
    );
}