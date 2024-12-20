module.exports = async () => {
    return {
        testEnvironment: "jest-environment-jsdom",
        setupFilesAfterEnv: ["@testing-library/jest-dom"],
        moduleNameMapper: {
            "\\.(css|scss)$": "identity-obj-proxy"
        },
    };
};
