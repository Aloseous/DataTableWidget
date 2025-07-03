import { Tooltip } from 'antd';
import ExpandableCell from './renderers/ExpandableCell';

const formatHeader = key => {
  return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const createSorter = key => {
  return (a, b) => {
    const getSortValue = val => {
      if (val && typeof val === 'object') return JSON.stringify(val);
      return val;
    };

    const sortA = getSortValue(a[key]);
    const sortB = getSortValue(b[key]);

    if (typeof sortA === 'string' && typeof sortB === 'string') {
      return sortA.localeCompare(sortB);
    }

    return (sortA || 0) - (sortB || 0);
  };
};

// Main function that uses JSX
export const generateColumns = data => {
  if (!data?.length) return [];

  const sampleItem = data[0];
  const keys = Object.keys(sampleItem);

  return keys.map(key => ({
    title: (
      <Tooltip title={key}>
        <span>{formatHeader(key)}</span>
      </Tooltip>
    ),
    dataIndex: key,
    key,
    width: 200,
    render: value => <ExpandableCell value={value} />,
    sorter: createSorter(key)
  }));
};
