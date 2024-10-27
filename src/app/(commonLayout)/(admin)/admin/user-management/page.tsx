/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useEffect, useRef, useState } from 'react';
import { Table, Tag, Input, Button, Space, InputRef } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import { IUser } from '@/components/type';
import { useGetAllUserQuery } from '@/redux/features/user/userApi';
import Author from '@/components/shared/Author';

const UserManagement: React.FC = () => {
  const { data: allUser, refetch } = useGetAllUserQuery('');
  const [users, setUsers] = useState<IUser[]>(allUser?.data || []);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);

  // Update users state when allUser data changes
  useEffect(() => {
    if (allUser?.data) {
      setUsers(allUser.data);
    }
  }, [allUser?.data, refetch]);

  // Handle the search functionality
  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps['confirm'],
    dataIndex: 'name' | 'email',
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  // Search properties for "User" column (both name and email)
  const getColumnSearchProps = (): any => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: FilterDropdownProps) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder="Search user (name or email)"
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, 'name')}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, 'name')}
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
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value: string, record: IUser) => {
      const fullNameEmail = `${record.name} ${record.email}`.toLowerCase();
      return fullNameEmail.includes(value.toLowerCase());
    },
    onFilterDropdownOpenChange: (visible: boolean) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text: string | undefined, record: IUser) => {
      const isSearching = searchedColumn === 'name' || searchedColumn === 'email';

      return (
        <Author
          author={{
            ...record,
            name: isSearching ? (
              <Highlighter
                highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                searchWords={[searchText]}
                autoEscape
                textToHighlight={record.name || ''}
              />
            ) : (
              record.name
            ),
            email: isSearching ? (
              <Highlighter
                highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                searchWords={[searchText]}
                autoEscape
                textToHighlight={record.email || ''}
              />
            ) : (
              record.email
            ),
          }}
          nameClass={'font-medium'} // Pass the highlight class if necessary
        />
      );
    },
  });

  // Define columns for the table
  const columns: ColumnsType<IUser> = [
    {
      title: 'User',
      key: 'user',
      ...getColumnSearchProps(), // Apply search for both name and email
    },
    {
      title: 'Followers',
      dataIndex: 'followers',
      key: 'followers',
      sorter: (a, b) => a.followers - b.followers,
    },
    {
      title: 'Following',
      dataIndex: 'following',
      key: 'following',
      sorter: (a, b) => a.following - b.following,
    },
    {
      title: 'Verified',
      dataIndex: 'isVerified',
      key: 'isVerified',
      render: (isVerified: boolean) => (
        isVerified ? <Tag color="green">Verified</Tag> : <Tag color="red">Not Verified</Tag>
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
      render: (role: 'admin' | 'user') => (
        role === 'admin' ? <Tag color="blue">Admin</Tag> : <Tag color="gold">User</Tag>
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
      render: (paymentStatus: 'Pending' | 'Paid' | 'Failed') => (
        <Tag color={paymentStatus === 'Paid' ? 'green' : paymentStatus === 'Pending' ? 'orange' : 'red'}>
          {paymentStatus}
        </Tag>
      ),
      filters: [
        { text: 'Pending', value: 'Pending' },
        { text: 'Paid', value: 'Paid' },
        { text: 'Failed', value: 'Failed' },
      ],
      onFilter: (value, record) => record.paymentStatus === value,
    },
    {
      title: 'Transaction ID',
      dataIndex: 'transactionId',
      key: 'transactionId',
      render: (transactionId: string) => (
        <span style={{ color: transactionId ? 'blue' : 'grey' }}>
          {transactionId || 'N/A'}
        </span>
      ),
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
