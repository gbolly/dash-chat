module.exports = async () => {
    return {
        testEnvironment: "jest-environment-jsdom",
        setupFilesAfterEnv: ["@testing-library/jest-dom", "<rootDir>/jest.setup.js"],
        moduleNameMapper: {
            "\\.(css|scss)$": "identity-obj-proxy",
            "react-markdown": "<rootDir>/src/__mocks__/react-markdown.js",
            "react-plotly.js": "<rootDir>/__mocks__/react-plotly.js.js",
            "remark-*": "<rootDir>/src/__mocks__/remark-gfm.js"
        },
    };
};
