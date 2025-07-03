import { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Card, Space, Alert } from 'antd';
import { SettingOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';

const ApiConfigModal = ({ visible, onCancel, onSubmit, initialValues }) => {
  const [form] = Form.useForm();
  const [testLoading, setTestLoading] = useState(false);
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    if (visible) form.setFieldsValue(initialValues);
  }, [visible, form, initialValues]);

  const testConnection = async () => {
    try {
      setTestLoading(true);
      setTestResult(null);
      const values = await form.validateFields();

      // Build headers
      const headers = new Headers();
      (values.headers || []).forEach(header => {
        if (header.key && header.value) {
          headers.append(header.key, header.value);
        }
      });

      // Build query params
      const params = new URLSearchParams();
      (values.params || []).forEach(param => {
        if (param.key && param.value) {
          params.append(param.key, param.value);
        }
      });

      const url = params.toString() ? `${values.url}?${params.toString()}` : values.url;

      const response = await fetch(url, {
        method: 'GET',
        headers
      });

      if (!response.ok) {
        throw new Error(`Test failed: ${response.status} ${response.statusText}`);
      }

      const jsonData = await response.json();
      setTestResult({
        status: 'success',
        message: `Connection successful! Received ${Array.isArray(jsonData) ? jsonData.length : 1} records`
      });
    } catch (err) {
      setTestResult({
        status: 'error',
        message: err.message || 'Connection test failed'
      });
    } finally {
      setTestLoading(false);
    }
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <SettingOutlined style={{ marginRight: 8 }} />
          API Configuration
        </div>
      }
      open={visible}
      onCancel={onCancel}
      width={800}
      footer={[
        <Button key="test" loading={testLoading} onClick={testConnection}>
          Test Connection
        </Button>,
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={() => form.submit()}>
          Save Configuration
        </Button>
      ]}>
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        {testResult && (
          <Alert message={testResult.message} type={testResult.status} showIcon style={{ marginBottom: 16 }} />
        )}

        <Form.Item
          label="API URL"
          name="url"
          rules={[
            { required: true, message: 'API URL is required' },
            { type: 'url', message: 'Please enter a valid URL' }
          ]}>
          <Input placeholder="https://jsonplaceholder.typicode.com/users" />
        </Form.Item>

        <Card title="Headers" size="small" style={{ marginBottom: 16 }}>
          <Form.List name="headers">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item {...restField} name={[name, 'key']}>
                      <Input placeholder="Key (e.g., Authorization)" />
                    </Form.Item>
                    <Form.Item {...restField} name={[name, 'value']}>
                      <Input placeholder="Value" />
                    </Form.Item>
                    <Button danger icon={<DeleteOutlined />} onClick={() => remove(name)} />
                  </Space>
                ))}
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Add Header
                </Button>
              </>
            )}
          </Form.List>
        </Card>

        <Card title="Query Parameters" size="small">
          <Form.List name="params">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item {...restField} name={[name, 'key']}>
                      <Input placeholder="Key" />
                    </Form.Item>
                    <Form.Item {...restField} name={[name, 'value']}>
                      <Input placeholder="Value" />
                    </Form.Item>
                    <Button danger icon={<DeleteOutlined />} onClick={() => remove(name)} />
                  </Space>
                ))}
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Add Parameter
                </Button>
              </>
            )}
          </Form.List>
        </Card>
      </Form>
    </Modal>
  );
};

export default ApiConfigModal;
