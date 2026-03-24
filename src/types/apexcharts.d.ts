declare module 'apexcharts' {
    export type ApexOptions = any;
    const content: any;
    export default content;
  }
  
  declare module 'react-apexcharts' {
    import { Component } from 'react';

    export interface Props {
      type?: string;
      series?: any[];
      options?: any;
      [key: string]: any;
    }
    export default class Chart extends Component<Props> {}
  }