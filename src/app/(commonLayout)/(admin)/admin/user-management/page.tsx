'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Table, Image, Tag, Input, Button, Space, InputRef } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import { IUser } from '@/components/type';
import { useGetAllUserQuery } from '@/redux/features/user/userApi';

const UserManagement: React.FC = () => {
  const { data: allUser, refetch } = useGetAllUserQuery('');
  const [users, setUsers] = useState<IUser[]>(allUser?.data || []);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);

  useEffect(() => {
    if (allUser?.data) {
      setUsers(allUser?.data);
    }
  }, [allUser?.data, refetch]);

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps['confirm'],
    dataIndex: keyof IUser,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex: keyof IUser): any => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }: FilterDropdownProps) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value: string | boolean, record: IUser) => {
      // Safely access record[dataIndex]
      const recordValue = record[dataIndex];
      return recordValue
        ? recordValue.toString().toLowerCase().includes((value as string).toLowerCase())
        : false; // Return false if recordValue is undefined
    },
    onFilterDropdownOpenChange: (visible: boolean) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text: string | boolean | undefined) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  // Define columns for the Ant Design Table
  const columns: ColumnsType<IUser> = [
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (image: string | undefined) => (
        <Image
          width={50}
          src={image || 'https://via.placeholder.com/50'} // Fallback if no image
          alt="User Profile"
          className="rounded-md" 
        />
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      ...getColumnSearchProps('name'),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      ...getColumnSearchProps('email'),
    },
    {
      title: 'Followers',
      dataIndex: 'followers',
      key: 'followers',
      sorter: (a, b) => a.followers - b.followers, // Add sorting
    },
    {
      title: 'Following',
      dataIndex: 'following',
      key: 'following',
      sorter: (a, b) => a.following - b.following, // Add sorting
    },
    {
      title: 'Verified',
      dataIndex: 'isVerified',
      key: 'isVerified',
      render: (isVerified: boolean) =>
        isVerified ? (
          <Tag color="green">Verified</Tag>
        ) : (
          <Tag color="red">Not Verified</Tag>
        ),
      filters: [
        { text: 'Verified', value: true },
        { text: 'Not Verified', value: false },
      ],
      onFilter: (value, record) => record.isVerified === value,
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: 'admin' | 'user') =>
        role === 'admin' ? (
          <Tag color="blue">Admin</Tag>
        ) : (
          <Tag color="gold">User</Tag>
        ),
      filters: [
        { text: 'Admin', value: 'admin' },
        { text: 'User', value: 'user' },
      ],
      onFilter: (value, record) => record.role === value,
    },
    {
      title: 'Payment Status',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: (status: string | undefined) => {
        switch (status) {
          case 'Paid':
            return <Tag color="green">Paid</Tag>;
          case 'Pending':
            return <Tag color="orange">Pending</Tag>;
          case 'Failed':
            return <Tag color="red">Failed</Tag>;
          default:
            return <Tag color="default">N/A</Tag>;
        }
      },
      filters: [
        { text: 'Paid', value: 'Paid' },
        { text: 'Pending', value: 'Pending' },
        { text: 'Failed', value: 'Failed' },
      ],
      onFilter: (value, record) => record.paymentStatus === value,
    },
  ];

  return (
    <div>
      <h1>User List</h1>
      <Table<IUser>
        columns={columns}
        dataSource={users}
        rowKey={(record) => record._id!}
        loading={!allUser} // Show loading if data is not yet loaded
      />
    </div>
  );
};

export default UserManagement;
