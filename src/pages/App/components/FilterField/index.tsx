import * as React from 'react';
import { Col, Form, Select, Input, DatePicker } from "antd";
import * as style from './index.scss';
import { jobs } from '../../../../constants';

const { Option } = Select;
const { RangePicker } = DatePicker;
const options = jobs.map((job) => <Option key={job} value={job}>{job}</Option>);

export const getFields = () => {
    const name = (
      <Col span={12} key="name" className={style.field_col}>
        <Form.Item
          name='name'
          label='Name'
          rules={[
            {
              type: 'string',
            },
          ]}
        >
          <Input placeholder="String Only" />
        </Form.Item>
      </Col>);
    const job = (
      <Col span={12} key="job" className={style.field_col}>
        <Form.Item
          name='job'
          label='Job Description'
        >
          <Select
            placeholder="Select"
            allowClear
          >
            {options}
          </Select>
        </Form.Item>
      </Col>);
      const date = (
        <Col span={12} key="date" className={style.field_col}>
          <Form.Item
            name="date"
            label="Entry Date"
            rules={[
              {
                type: 'array',
              },
            ]}
          >
              <RangePicker className={style.range_picker}/>
            </Form.Item>
          </Col>
        );

    
    return [name, job, date];
};
