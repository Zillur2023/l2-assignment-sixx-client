'use client'
import React, { useEffect, useRef, useState } from 'react';
import { Table, Input, Button, Space, InputRef } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import type { ColumnsType } from 'antd/es/table';
import { IPost } from '@/components/type';
import { useGetAllPostQuery } from '@/redux/features/post/postApi';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import Author from '@/components/shared/Author';

const PostManagement: React.FC = () => {
  const { data: allPosts, refetch } = useGetAllPostQuery({});
  const [posts, setPosts] = useState<IPost[]>(allPosts?.data || []);
  
  // State for handling search per column
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  
  const searchInput = useRef<InputRef>(null);

  useEffect(() => {
    if (allPosts?.data) {
      setPosts(allPosts.data);
    }
  }, [allPosts?.data, refetch]);

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps['confirm'],
    dataIndex: keyof IPost | 'author'
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex: keyof IPost | 'author'): any => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: FilterDropdownProps) => (
      <div style={{ padding: 8 }}>
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
          <Button onClick={() => clearFilters && handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value: string, record: IPost) => {
      if (dataIndex === 'author') {
        // Handle filtering for author by name and email
        return (
          (record.author?.name?.toLowerCase().includes(value.toLowerCase()) || 
          record.author?.email?.toLowerCase().includes(value.toLowerCase())) ?? false
        );
      }
  
      // Check if the dataIndex exists on the record
      const recordValue = record[dataIndex];
      return recordValue ? recordValue.toString().toLowerCase().includes(value.toLowerCase()) : false;
    },
    render: (text: any, record: IPost) => {
      if (dataIndex === 'author') {
        const isSearching = searchedColumn === 'author' && searchText;
    
        // Highlight styles
        const highlightClass = 'font-medium bg-yellow-200'; // Example highlight class
    
        return (
          <Author
            author={{
              ...record.author,
              name: isSearching ? (
                <Highlighter
                  highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                  searchWords={[searchText]}
                  autoEscape
                  textToHighlight={record.author.name || ''}
                />
              ) : (
                record.author.name
              ),
              email: isSearching ? (
                <Highlighter
                  highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                  searchWords={[searchText]}
                  autoEscape
                  textToHighlight={record.author.email || ''}
                />
              ) : (
                record.author.email
              ),
            }}
            nameClass={'font-medium'} // Pass the highlight class if necessary
          />
        );
      }
    
      return searchedColumn === dataIndex && searchText ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text || ''}
        />
      ) : (
        text
      );
    },
    
  });

  // Define columns for the Ant Design Table
  const columns: ColumnsType<IPost> = [
    {
      title: 'Author',
      dataIndex: 'author',
      key: 'author',
      ...getColumnSearchProps('author'), // Search logic for both name and email
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      ...getColumnSearchProps('category'), // Search logic for category
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      ...getColumnSearchProps('title'), // Search logic for title
    },
    {
      title: 'Upvotes',
      dataIndex: 'upvoteCount',
      key: 'upvoteCount',
      sorter: (a, b) => (a.upvoteCount || 0) - (b.upvoteCount || 0),
    },
    {
      title: 'Downvotes',
      dataIndex: 'downvoteCount',
      key: 'downvoteCount',
      sorter: (a, b) => (a.downvoteCount || 0) - (b.downvoteCount || 0),
    },
    {
      title: 'Comments',
      dataIndex: 'commentCount',
      key: 'commentCount',
      sorter: (a, b) => (a.commentCount || 0) - (b.commentCount || 0),
    },
    {
      title: 'Premium',
      dataIndex: 'isPremium',
      key: 'isPremium',
      render: (isPremium: boolean) => (isPremium ? 'Yes' : 'No'),
    },
  ];

  return (
    <div>
      <h1>Post List</h1>
      <Table<IPost>
        columns={columns}
        dataSource={posts}
        rowKey={(record) => record._id!}
        loading={!allPosts}
      />
    </div>
  );
};

export default PostManagement;
