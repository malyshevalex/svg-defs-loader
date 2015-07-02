# svg-defs-loader
Webpack SVG useable loader

In webpack config file:
```js
...
  module: {
      ...
      loaders: [
        ...
            {
              test: /\.svg\.defs$/
              loader: 'svg-defs-loader'
            }
        ...
      ]
      ...
  }
...
```

In React component:

```js
import svgDefs from './MyComponent.svg.defs';

class MyComponent {
    componentWillMount() {
        svgDefs.use();
    }
    compenentWillUnmount() {
        svgDefs.unuse();
    }
}
```
