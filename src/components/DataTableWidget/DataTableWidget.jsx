import { useState, useEffect, useMemo } from 'react';
import { Table, Button, Spin, Alert, Card, Space, Badge, Typography, Select } from 'antd';
import {
  SettingOutlined,
  SyncOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import useApiData from '../../hooks/useApiData';
import ApiConfigModal from './ApiConfigModal';
import { generateColumns } from './tableConfig';

const { Title, Text } = Typography;

const DataTableWidget = () => {
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });
  const [apiConfig, setApiConfig] = useState(() => {
    const savedConfig = localStorage.getItem('apiConfig');
    return savedConfig
      ? JSON.parse(savedConfig)
      : {
          url: 'https://jsonplaceholder.typicode.com/users',
          headers: [{ key: 'Content-Type', value: 'application/json' }],
          params: []
        };
  });
  const [refreshInterval, setRefreshInterval] = useState(() => {
    const savedInterval = localStorage.getItem('refreshInterval');
    return savedInterval ? parseInt(savedInterval, 10) : 0;
  });
  const [isConfigVisible, setIsConfigVisible] = useState(false);

  const { data, loading, error, fetchData, lastFetched } = useApiData();

  // Save configuration to localStorage
  useEffect(() => {
    localStorage.setItem('apiConfig', JSON.stringify(apiConfig));
    localStorage.setItem('refreshInterval', refreshInterval.toString());
  }, [apiConfig, refreshInterval]);

  // Initial data fetch
  useEffect(() => {
    fetchData(apiConfig);
  }, [apiConfig, fetchData]);

  // Auto-refresh effect
  useEffect(() => {
    if (refreshInterval > 0) {
      const interval = setInterval(() => {
        fetchData(apiConfig);
      }, refreshInterval * 1000);

      return () => clearInterval(interval);
    }
  }, [refreshInterval, apiConfig, fetchData]);

  const handleTableChange = pagination => {
    setPagination(pagination);
  };

  const handleRefresh = () => {
    fetchData(apiConfig);
  };

  const handleConfigSubmit = values => {
    setApiConfig({
      ...values,
      headers: values.headers || [{ key: '', value: '' }],
      params: values.params || [{ key: '', value: '' }]
    });
    setIsConfigVisible(false);
  };

  const columns = useMemo(() => generateColumns(data), [data]);

  const paginatedData = useMemo(() => {
    const start = (pagination.current - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    return data.slice(start, end);
  }, [data, pagination]);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
      <Card
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Title level={3} style={{ margin: 0 }}>
                REST API Data Table
              </Title>
              {lastFetched && (
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Last updated: {new Date(lastFetched).toLocaleTimeString()}
                </Text>
              )}
            </div>
            <Space>
              <Badge status={error ? 'error' : 'success'} text={error ? 'Connection Error' : 'Connected'} />
              <Button type="primary" icon={<SettingOutlined />} onClick={() => setIsConfigVisible(true)}>
                Configure API
              </Button>
            </Space>
          </div>
        }
        variant="borderless"
        style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>
        <div style={{ marginBottom: 24 }}>
          <Space>
            <Button type="primary" icon={<SyncOutlined />} onClick={handleRefresh} loading={loading}>
              Refresh Data
            </Button>

            <Select
              value={refreshInterval}
              onChange={setRefreshInterval}
              style={{ width: 200 }}
              suffixIcon={<SyncOutlined />}>
              <Select.Option value={0}>
                <CloseCircleOutlined /> No auto-refresh
              </Select.Option>
              <Select.Option value={5}>
                <CheckCircleOutlined /> Every 5 seconds
              </Select.Option>
              <Select.Option value={15}>
                <CheckCircleOutlined /> Every 15 seconds
              </Select.Option>
              <Select.Option value={30}>
                <CheckCircleOutlined /> Every 30 seconds
              </Select.Option>
              <Select.Option value={60}>
                <CheckCircleOutlined /> Every minute
              </Select.Option>
            </Select>

            <Text strong style={{ marginLeft: 16 }}>
              Records: {data.length} items
            </Text>
          </Space>
        </div>

        {error && (
          <Alert
            message="API Error"
            description={
              <div>
                <Text>{error}</Text>
                <div style={{ marginTop: 8 }}>
                  <Button type="link" onClick={() => setIsConfigVisible(true)} style={{ paddingLeft: 0 }}>
                    Check Configuration
                  </Button>
                  <Button type="link" onClick={handleRefresh}>
                    Try Again
                  </Button>
                </div>
              </div>
            }
            type="error"
            showIcon
            closable
            style={{ marginBottom: 16 }}
          />
        )}

        <Spin spinning={loading} tip="Fetching data...">
          {data.length === 0 && !loading && !error ? (
            <div style={{ textAlign: 'center', padding: '40px 0', border: '1px dashed #d9d9d9', borderRadius: '8px' }}>
              <WarningOutlined style={{ fontSize: 48, color: '#faad14' }} />
              <Title level={4} style={{ marginTop: 16 }}>
                No Data Available
              </Title>
              <Text type="secondary" style={{ maxWidth: '500px', margin: '0 auto' }}>
                The API returned no data. Please check your configuration or try a different endpoint.
              </Text>
              <div style={{ marginTop: 24 }}>
                <Button type="primary" onClick={() => setIsConfigVisible(true)}>
                  Configure API
                </Button>
              </div>
            </div>
          ) : (
            <Table
              columns={columns}
              dataSource={paginatedData.map((item, index) => ({ ...item, key: `row-${index}` }))}
              pagination={{
                ...pagination,
                total: data.length,
                showSizeChanger: true,
                pageSizeOptions: ['5', '10', '20', '50', '100'],
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                position: ['bottomCenter']
              }}
              onChange={handleTableChange}
              scroll={{ x: 'max-content' }}
              bordered
              size="middle"
            />
          )}
        </Spin>
      </Card>

      <ApiConfigModal
        visible={isConfigVisible}
        onCancel={() => setIsConfigVisible(false)}
        onSubmit={handleConfigSubmit}
        initialValues={apiConfig}
      />
    </div>
  );
};

export default DataTableWidget;
