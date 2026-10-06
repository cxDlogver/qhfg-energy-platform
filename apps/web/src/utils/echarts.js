import { init } from "echarts/core";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart, LineChart } from "echarts/charts";
import {
  GridComponent,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
} from "echarts/components";
use([
  CanvasRenderer,
  BarChart,
  LineChart,
  GridComponent,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
]);
export { init };
