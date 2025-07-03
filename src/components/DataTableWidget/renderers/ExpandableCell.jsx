import React, { useState } from 'react';
import { DownOutlined, RightOutlined } from '@ant-design/icons';
import NestedDataRenderer from './NestedDataRenderer';

const ExpandableCell = ({ value }) => {
  const [expanded, setExpanded] = useState(false);
  const isExpandable = value && typeof value === 'object';

  if (!isExpandable) {
    return <NestedDataRenderer value={value} />;
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          width: 'fit-content'
        }}
        onClick={() => setExpanded(!expanded)}>
        {expanded ? <DownOutlined /> : <RightOutlined />}
      </div>

      {expanded && (
        <div
          style={{
            marginTop: 8,
            paddingLeft: 8,
            borderLeft: '1px dashed #d9d9d9'
          }}>
          <NestedDataRenderer value={value} />
        </div>
      )}
    </div>
  );
};

export default ExpandableCell;
