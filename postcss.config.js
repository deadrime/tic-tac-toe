const devSettings = {
    plugins: {
        'postcss-import': {},
        'postcss-nested' : {},
        'postcss-cssnext': {}
    },
    options: {
        sourceMap: true
    }
};

const prodSettings = {
    plugins: {
        'postcss-import': {},
        'postcss-nested' : {},
        'postcss-cssnext': {
            browsers: ['last 2 versions', '> 5%'],
        },
        'cssnano': {}
    },
    options: {
        sourceMap: false
    }
};

module.exports = ctx => {
    return ctx.env === 'production' ? prodSettings : devSettings;
};

