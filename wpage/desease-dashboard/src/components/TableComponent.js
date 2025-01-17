import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import 'antd/dist/reset.css'; // Correct path for Ant Design styles
import { fetchTableData } from '../services/api';

function TableComponent() {
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        fetchTableData().then((data) => {
            if (data) {
                setTableData(data);
            }
        });
    }, []);

    const columns = [
        {
            title: 'Region',
            dataIndex: 'region',
            key: 'region',
        },
        {
            title: 'Cases',
            dataIndex: 'cases',
            key: 'cases',
        },
    ];

    return (
        <div>
            <h2>Data Table</h2>
            <Table dataSource={tableData} columns={columns} pagination={{ pageSize: 5 }} />
        </div>
    );
}

export default TableComponent;
