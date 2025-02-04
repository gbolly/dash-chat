module.exports = {
    presets: [
        [
            "@babel/preset-env",
            {
                modules: "auto"
            }
        ],
        "@babel/preset-react"
    ],
    env: {
        production: {
            plugins: [
                "@babel/plugin-proposal-object-rest-spread",
                "styled-jsx/babel"
            ]
        },
        development: {
            plugins: [
                "@babel/plugin-proposal-object-rest-spread",
                "styled-jsx/babel"
            ]
        },
        test: {
            plugins: [
                "@babel/plugin-proposal-object-rest-spread",
                "styled-jsx/babel-test"
            ]
        }
    }
};
