import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';

const features = [
    {
        icon: '🔥',
        title: 'Early Wildfire Detection',
        description: 'BMV080 particulate and BME688 gas sensors detect smoke signatures before fires spread, enabling faster emergency response.',
    },
    {
        icon: '📡',
        title: 'Cellular Connectivity',
        description: 'Blues Notecard provides reliable LTE-M connectivity from remote deployments, no Wi-Fi required.',
    },
    {
        icon: '🧠',
        title: 'Decides on the Node',
        description: 'An on-device anomaly detector learns each spot\'s normal air and sends an alert the moment smoke is confirmed, not at the next upload.',
    },
    {
        icon: '🔧',
        title: 'Off-the-shelf Hardware',
        description: 'A small carrier board for an Arduino Nano ESP32, a Notecard and two Bosch sensors, powered by a 12 V battery and solar.',
    },
    {
        icon: '📊',
        title: 'Live Map & Incidents',
        description: 'Nodes on a live map with wind-driven spread estimates and NASA satellite hotspots. Incidents are emailed to hosts and tracked to an outcome.',
    },
    {
        icon: '🔓',
        title: 'Fully Open Source',
        description: 'Firmware and cloud stack under Apache-2.0, hardware under CERN-OHL-P, data and docs under CC BY 4.0.',
    },
];

const repos = [
    { name: 'biobot-firmware', desc: 'Node firmware with on-device anomaly detection', lang: 'C++', color: '#f34b7d' },
    { name: 'biobot-hardware', desc: 'Carrier PCB: schematics, layout, BOM, gerbers', lang: 'Altium', color: '#2178c4' },
    { name: 'biobot-cloud', desc: 'Node.js API: ingest, incidents, alerts', lang: 'JavaScript', color: '#f1e05a' },
    { name: 'biobot-dashboard', desc: 'React dashboard and live map', lang: 'JavaScript', color: '#f1e05a' },
    { name: 'biobot-infrastructure', desc: 'Docker Compose deployment stack', lang: 'Docker', color: '#384d54' },
    { name: 'biobot-data', desc: 'Open datasets from test burns', lang: 'Data', color: '#e34c26' },
];

export default function Home() {
    const { siteConfig } = useDocusaurusContext();
    return (
        <Layout title="Home" description="Open-source wildfire detection sensor network">
            <main>

                {/* Hero */}
                <section className={styles.hero}>
                    <div className={styles.heroInner}>
                        <div className={styles.heroBadge}>Open Source · Apache-2.0 · CERN-OHL-P</div>
                        <h1 className={styles.heroTitle}>
                            Detect wildfires<br />
                            <span className={styles.heroAccent}>before they spread.</span>
                        </h1>
                        <p className={styles.heroSub}>
                            Wildfire Alarm is an open-source sensor network combining particulate matter detection,
                            gas sensing, and cellular connectivity to provide early wildfire warnings in remote areas.
                        </p>
                        <div className={styles.heroCta}>
                            <Link className={styles.btnPrimary} to="/docs/intro">Get Started</Link>
                            <Link className={styles.btnSecondary} to="https://github.com/biobotproject-org">
                                View on GitHub
                            </Link>
                        </div>
                    </div>
                    <div className={styles.heroVisual}>
                        <div className={styles.sensorCard}>
                            <div className={styles.sensorDot} />
                            <div className={styles.sensorLabel}>Node #A3 · Active</div>
                            <div className={styles.sensorGrid}>
                                <div className={styles.sensorStat}>
                                    <span className={styles.statVal}>12<span className={styles.statUnit}>μg/m³</span></span>
                                    <span className={styles.statKey}>PM2.5</span>
                                </div>
                                <div className={styles.sensorStat}>
                                    <span className={styles.statVal}>23<span className={styles.statUnit}>°C</span></span>
                                    <span className={styles.statKey}>Temp</span>
                                </div>
                                <div className={styles.sensorStat}>
                                    <span className={styles.statVal}>94<span className={styles.statUnit}>%</span></span>
                                    <span className={styles.statKey}>Humidity</span>
                                </div>
                                <div className={styles.sensorStat}>
                                    <span className={styles.statVal}>118<span className={styles.statUnit}>kΩ</span></span>
                                    <span className={styles.statKey}>Gas</span>
                                </div>
                            </div>
                            <div className={styles.sensorFooter}>Last report: 2 min ago · Severity: none</div>
                        </div>
                    </div>
                </section>

                {/* Features */}
                <section className={styles.features}>
                    <div className={styles.sectionInner}>
                        <h2 className={styles.sectionTitle}>Built for the field</h2>
                        <div className={styles.featureGrid}>
                            {features.map((f) => (
                                <div key={f.title} className={styles.featureCard}>
                                    <div className={styles.featureIcon}>{f.icon}</div>
                                    <h3 className={styles.featureTitle}>{f.title}</h3>
                                    <p className={styles.featureDesc}>{f.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Repos */}
                <section className={styles.repos}>
                    <div className={styles.sectionInner}>
                        <h2 className={styles.sectionTitle}>Explore the codebase</h2>
                        <div className={styles.repoGrid}>
                            {repos.map((r) => (
                                <Link
                                    key={r.name}
                                    className={styles.repoCard}
                                    to={`https://github.com/biobotproject-org/${r.name}`}
                                >
                                    <div className={styles.repoName}>{r.name}</div>
                                    <div className={styles.repoDesc}>{r.desc}</div>
                                    <div className={styles.repoLang}>
                                        <span className={styles.langDot} style={{ background: r.color }} />
                                        {r.lang}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className={styles.cta}>
                    <div className={styles.sectionInner}>
                        <h2 className={styles.ctaTitle}>Ready to deploy?</h2>
                        <p className={styles.ctaSub}>Run the stack locally, simulate a node, and see an incident open on the live map in a few minutes.</p>
                        <Link className={styles.btnPrimary} to="/docs/intro">Read the Docs →</Link>
                    </div>
                </section>

            </main>
        </Layout>
    );
}
