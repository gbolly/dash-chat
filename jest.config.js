module.exports = async () => {
    return {
        testEnvironment: "jest-environment-jsdom",
        setupFilesAfterEnv: ["@testing-library/jest-dom"],
        moduleNameMapper: {
            "\\.(css|scss)$": "identity-obj-proxy",
            'react-markdown': '<rootDir>/src/__mocks__/react-markdown.js',
            'remark-*': '<rootDir>/src/__mocks__/remark-gfm.js'
        },
    };
};
