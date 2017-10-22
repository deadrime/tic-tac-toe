# Базовая сборка webpack 2: 

- ES6: babel на основе [babel-preset-env](https://github.com/babel/babel-preset-env)

- CSS: [PostCSS](https://github.com/postcss/postcss) на основе [cssNext](https://github.com/MoOx/postcss-cssnext) + [postcss-nested](https://github.com/postcss/postcss-nested)

- Сжатие: [cssnano](https://github.com/ben-eb/cssnano)(входит в [postcss-loader](https://github.com/postcss/postcss-loader)), [UglifyJs](https://github.com/mishoo/UglifyJS)(Входит в сам вебпак)

## Установка

```sh
$ npm i
```

## Запуск
```sh
$ npm run dev
$ npm run build
```

### Примечание
Для линукса, возможно, нужно без set:
```
set NODE_ENV=production
```

### Cтруктура:
- build
- src
    - app.js
    - index.html
    - index.pcss
- .babelrc
- package.json
- webpack.build.config.js
- webpack.dev.config.js