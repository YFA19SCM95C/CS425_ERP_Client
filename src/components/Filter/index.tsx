import React, {useState} from 'react';
import { Form, Row, Col, Button, message } from 'antd';
import { useObserver } from 'mobx-react-lite';
import { storeContext } from '../context';
import { getUserList } from '../../api/table';
import { longerThanYears } from '../../utils';

export const Filter: React.FC = ({ children }) => {
  const store = React.useContext(storeContext);
  if (!store) throw Error("Store shouldn't be null");

  const { setTableData, setCurrentPage } = store.tableStore;
  const [form] = Form.useForm();
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [resetLoading, setResetLoading] = useState<boolean>(false);
  let requestBtn = '';

  interface GetUsersParams {
    name?: string;
    job?: string;
    startDate?: number;
    endDate?: number;
  }
  const getUsers = async (params: GetUsersParams, btn: string) => {
    return getUserList(params).then((response) => {
      if (requestBtn == btn) {
        setTableData(response.data.tableData);
        setCurrentPage(1);
      }
    });
  };

  const onFinish = (values): void => {
    if (!values.name) {
      message.error('Name is empty!');
      return;
    }
    if (values.job === undefined) {
      message.error('Job Description is empty!');
      return;
    }
    if (!values.date) {
      message.error('Entry Date is empty!');
      return;
    }
    const [startDate, endDate] = values.date;
    if (longerThanYears(startDate, endDate, 2)) {
      message.error(`Entry Date shouldn't longer than 2 years`);
      return;
    }
    requestBtn = 'submit';
    setSubmitLoading(true);
    async function fetchData() {
      try {
        await getUsers({
          name: values.name,
          job: values.job,
          startDate: startDate.unix() * 1000,
          endDate: endDate.unix() * 1000
        }, requestBtn);
      } catch {} finally {
        setSubmitLoading(false);
      }
    }
    fetchData();
  };

  const onResetClick = () => {
    requestBtn = 'reset';
    form.resetFields();
    setResetLoading(true);
    async function fetchData() {
      try {
        await getUsers({}, requestBtn);
      } catch {} finally {
        setResetLoading(false);
      }
    }
    fetchData();
  }

  return useObserver(() => {
    return (
      <Form
        labelCol={{span: 6}}
        wrapperCol={{span: 18}}
        form={form}
        name="advanced_search"
        className="ant-advanced-search-form"
        onFinish={onFinish}
      >
        <Row gutter={24}>
          {children}
          <Col
            span={12}
            style={{
              textAlign: 'right',
            }}
          >
            <Button type="primary" htmlType="submit" loading={submitLoading}>
              Submit
            </Button>
            <Button
              style={{
                margin: '0 8px',
              }}
              onClick={onResetClick}
              loading={resetLoading}
            >
              Reset
            </Button>
          </Col>
        </Row>
      </Form>
    );
  });
}
