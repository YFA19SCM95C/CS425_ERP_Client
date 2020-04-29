import React, {useState} from 'react';
import { Form, Row, Col, Button, message } from 'antd';
import { useObserver } from 'mobx-react-lite';
import { storeContext } from '../../../../components/context';
import { getProductList } from '../../../../api/table';
import { longerThanYears } from '../../../../utils';

export const Filter: React.FC = ({ children }) => {
  const store = React.useContext(storeContext);
  if (!store) throw Error("Store shouldn't be null");

  const { setProductList, setCurrentPage } = store.tableStore;
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
  const getProducts = async (params, btn) => {
    return getProductList(params).then((response) => {
      if (requestBtn == btn) {
        setProductList(response.data.list);
        setCurrentPage(1);
      }
    });
  };

  const onFinish = (values): void => {
    requestBtn = 'submit';
    setSubmitLoading(true);
    async function fetchData() {
      try {
        await getProducts({
          modelID: values.modelID,
          modelNumber: values.modelNumber,
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
        await getProducts({}, requestBtn);
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
            span={24}
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
