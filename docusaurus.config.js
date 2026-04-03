// @ts-check
import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
    title: 'BioBot Project',
    tagline: 'Open-source wildfire detection sensor network',
    favicon: 'img/favicon.ico',

    future: {
        v4: true,
    },

    url: 'https://biobotproject-org.github.io',
    baseUrl: '/',

    organizationName: 'biobotproject-org',
    projectName: 'biobotproject-org.github.io',
    trailingSlash: false,

    onBrokenLinks: 'throw',

    i18n: {
        defaultLocale: 'en',
        locales: ['en'],
    },

    presets: [
        [
            'classic',
            /** @type {import('@docusaurus/preset-classic').Options} */
            ({
                docs: {
                    sidebarPath: './sidebars.js',
                    editUrl:
                        'https://github.com/biobotproject-org/biobotproject-org.github.io/tree/main/',
                },
                blog: {
                    showReadingTime: true,
                    feedOptions: {
                        type: ['rss', 'atom'],
                        xslt: true,
                    },
                    editUrl:
                        'https://github.com/biobotproject-org/biobotproject-org.github.io/tree/main/',
                    onInlineTags: 'warn',
                    onInlineAuthors: 'warn',
                    onUntruncatedBlogPosts: 'warn',
                },
                theme: {
                    customCss: './src/css/custom.css',
                },
            }),
        ],
    ],

    themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
        ({
            image: 'img/docusaurus-social-card.jpg',
            colorMode: {
                respectPrefersColorScheme: true,
            },
            navbar: {
                title: 'BioBot Project',
                logo: {
                    alt: 'BioBot Logo',
                    src: 'img/logo.svg',
                },
                items: [
                    {
                        type: 'docSidebar',
                        sidebarId: 'tutorialSidebar',
                        position: 'left',
                        label: 'Docs',
                    },
                    {to: '/blog', label: 'Blog', position: 'left'},
                    {
                        href: 'https://github.com/biobotproject-org',
                        label: 'GitHub',
                        position: 'right',
                    },
                ],
            },
            footer: {
                style: 'dark',
                links: [
                    {
                        title: 'Docs',
                        items: [
                            {
                                label: 'Getting Started',
                                to: '/docs/intro',
                            },
                        ],
                    },
                    {
                        title: 'Repositories',
                        items: [
                            {
                                label: 'Firmware',
                                href: 'https://github.com/biobotproject-org/biobot-firmware',
                            },
                            {
                                label: 'Hardware',
                                href: 'https://github.com/biobotproject-org/biobot-hardware',
                            },
                            {
                                label: 'Dashboard',
                                href: 'https://github.com/biobotproject-org/biobot-dashboard',
                            },
                        ],
                    },
                    {
                        title: 'More',
                        items: [
                            {
                                label: 'Blog',
                                to: '/blog',
                            },
                            {
                                label: 'GitHub Org',
                                href: 'https://github.com/biobotproject-org',
                            },
                        ],
                    },
                ],
                copyright: `Copyright © ${new Date().getFullYear()} BioBot Project. Licensed under GPLv3.`,
            },
            prism: {
                theme: prismThemes.github,
                darkTheme: prismThemes.dracula,
            },
        }),
};

export default config;