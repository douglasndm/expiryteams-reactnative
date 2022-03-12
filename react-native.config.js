module.exports = {
    project: {
        ios: {},
        android: {}, // grouped into "project"
    },
    assets: ['./src/Assets/Fonts/'], // stays the same,
    dependencies: {
        'react-native-vector-icons': {
            platforms: {
                ios: null,
            },
        },
    },
};
