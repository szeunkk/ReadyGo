import 'chart.js';

declare module 'chart.js' {
  interface GridLineOptions {
    borderDash?: number[];
  }

  interface ScriptableAndScriptableOptions<TType, TContext> {
    borderDash?: number[];
  }
}

