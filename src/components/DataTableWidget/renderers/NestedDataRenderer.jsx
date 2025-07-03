import React from 'react';
import { Typography, Tag } from 'antd';

const { Text } = Typography; // Correct Text import

const NestedDataRenderer = ({ value }) => {
  if (value === null || value === undefined) {
    return <Text type="secondary">-</Text>;
  }

  // Handle arrays
  if (Array.isArray(value)) {
    if (value.length === 0) return <Text type="secondary">[]</Text>;

    return (
      <div>
        {value.map((item, index) => (
          <div key={index} style={{ marginBottom: 4 }}>
            <NestedDataRenderer value={item} />
          </div>
        ))}
      </div>
    );
  }

  // Handle objects
  if (typeof value === 'object') {
    const keys = Object.keys(value);
    if (keys.length === 0) return <Text type="secondary">{'{}'}</Text>;

    return (
      <div>
        {keys.map(key => (
          <div key={key} style={{ marginBottom: 4 }}>
            <Text strong>{key}:</Text> <NestedDataRenderer value={value[key]} />
          </div>
        ))}
      </div>
    );
  }

  // Special types
  if (typeof value === 'string' && value.startsWith('http')) {
    return (
      <a href={value} target="_blank" rel="noopener noreferrer">
        {value}
      </a>
    );
  }

  if (typeof value === 'boolean') {
    return <Tag color={value ? 'green' : 'red'}>{value.toString()}</Tag>;
  }

  return value;
};

export default NestedDataRenderer;
