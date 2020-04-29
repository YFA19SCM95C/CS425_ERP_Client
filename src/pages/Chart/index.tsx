import React, {useEffect} from "react";
import ReactEcharts from 'echarts-for-react';
import { useObserver } from 'mobx-react-lite';
import { storeContext } from '../../components/context';

interface TableItem {
  date: number;
  name: string;
  id: string;
  job: string;
}

export const Chart: React.FC = () => {
  const store = React.useContext(storeContext);
  if (!store) throw Error("Store shouldn't be null");
  const { tableData, refreshUserList } = store.tableStore;

  useEffect(() => {
    if (!tableData.get().length) {
      refreshUserList();
    }
  }, []);

  return useObserver(() => {
    const getOption = () => {
      const table: TableItem[] = [...tableData.get()];
      const map: Map<string, number> = new Map();
      for (const item of table) {
        const { date } = item;
        const dateObject: Date = new Date(date);
        const yearMonth = `${dateObject.getFullYear()}/${dateObject.getMonth()+1}`;
        map.set(yearMonth, (map.get(yearMonth) || 0) + 1);
      }
      const xAxisData: string[] = [];
      const yAxisData: number[] = [];
      map.forEach((value: number, key: string) => {
        xAxisData.push(key);
        yAxisData.push(value);
      });

      return {
        legend: {
          data: ['Hire Number'],
          left: 0,
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        xAxis: {
          type: 'category',
          data: xAxisData
        },
        yAxis: {
          type: 'value',
        },
        series: [{
          data: yAxisData,
          name: 'Hire Number',
          type: 'bar',
          barWidth: 16,
          itemStyle:{
            normal:{
              color:'#47A2FD'
            }
          },
        }]
      };
    };
    return (
      <div style={{paddingLeft: 24}}>
        <div style={{fontSize: 18, color: 'rgba(0, 0, 0, 0.87)'}}>Chart Page</div>
        <ReactEcharts
          option={getOption()}
          notMerge={true}
          lazyUpdate={true}
          style={{width: '100%'}}
        />
      </div>
    );
  });
};
