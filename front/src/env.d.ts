/// <reference types="@rsbuild/core/types" />

/**
 * Imports the SVG file as a React component.
 * @requires [@rsbuild/plugin-svgr](https://npmjs.com/package/@rsbuild/plugin-svgr)
 */
declare module '*.svg?react' {
  import type React from 'react';

  const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}

declare module '*.css' {
  const classes: CSSModuleClasses;
  export default classes;
}

declare module '*.sass' {
  const classes: CSSModuleClasses;
  export default classes;
}

declare module '*.scss' {
  const classes: CSSModuleClasses;
  export default classes;
}
