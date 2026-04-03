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
        icon: '⚡',
        title: 'Ultra-Low Power',
        description: 'Engineered for multi-week battery life in the field. Deploy anywhere, forget about charging.',
    },
    {
        icon: '🗺️',
        title: 'Mesh Network',
        description: 'LoRa-based mesh relay nodes extend coverage deep into remote wilderness areas.',
    },
    {
        icon: '📊',
        title: 'Live Dashboard',
        description: 'Real-time sensor data, deployment maps, and alert management from any browser.',
    },
    {
        icon: '🔓',
        title: 'Fully Open Source',
        description: 'Hardware schematics, firmware, and cloud stack are all open source under Apache 2.0.',
    },
];

const repos = [
    { name: 'biobot-firmware', desc: 'Arduino/PlatformIO sensor firmware', lang: 'C++', color: '#f34b7d' },
    { name: 'biobot-hardware', desc: 'KiCad schematics & PCB files', lang: 'KiCad', color: '#2178c4' },
    { name: 'biobot-cloud', desc: 'Node.js API & alert engine', lang: 'JavaScript', color: '#f1e05a' },
    { name: 'biobot-dashboard', desc: 'React sensor dashboard', lang: 'JavaScript', color: '#f1e05a' },
    { name: 'biobot-gateway', desc: 'LoRa mesh gateway firmware', lang: 'C++', color: '#f34b7d' },
    { name: 'biobot-docs', desc: 'Build guides & deployment handbook', lang: 'Docs', color: '#e34c26' },
];

export default function Home() {
    const { siteConfig } = useDocusaurusContext();
    return (
        <Layout title="Home" description="Open-source wildfire detection sensor network">
            <main>

                {/* Hero */}
                <section className={styles.hero}>
                    <div className={styles.heroInner}>
                        <div className={styles.heroBadge}>Open Source · Apache 2.0</div>
                        <h1 className={styles.heroTitle}>
                            Detect wildfires<br />
                            <span className={styles.heroAccent}>before they spread.</span>
                        </h1>
                        <p className={styles.heroSub}>
                            BioBot is an open-source IoT sensor network combining particulate matter detection,
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
                                    <span className={styles.statVal}>0.4<span className={styles.statUnit}>ppm</span></span>
                                    <span className={styles.statKey}>VOC</span>
                                </div>
                            </div>
                            <div className={styles.sensorFooter}>Last ping: 2 min ago · Battery 87%</div>
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
                        <p className={styles.ctaSub}>Read the build guide, flash the firmware, and have your first node online in an afternoon.</p>
                        <Link className={styles.btnPrimary} to="/docs/intro">Read the Docs →</Link>
                    </div>
                </section>

            </main>
        </Layout>
    );
}