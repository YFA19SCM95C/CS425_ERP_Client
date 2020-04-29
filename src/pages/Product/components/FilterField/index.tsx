import * as React from 'react';
import { Col, Form, Select, Input, DatePicker } from "antd";
import * as style from './index.scss';
import { jobs } from '../../../../constants';

const { Option } = Select;
const { RangePicker } = DatePicker;
const options = jobs.map((job) => <Option key={job} value={job}>{job}</Option>);

export const getFields = () => {
    const modelID = (
      <Col span={12} key="modelID" className={style.field_col}>
        <Form.Item
          name='modelID'
          label='ModelID'
          rules={[
            {
              type: 'string',
            },
          ]}
        >
          <Input placeholder="ModelID" />
        </Form.Item>
      </Col>);

    const modelNumber = (
      <Col span={12} key="modelNumber" className={style.field_col}>
        <Form.Item
          name='modelNumber'
          label='Model Number'
          rules={[
            {
              type: 'string',
            },
          ]}
        >
          <Input placeholder="Model Number" />
        </Form.Item>
      </Col>);
    return [modelID, modelNumber];
};
