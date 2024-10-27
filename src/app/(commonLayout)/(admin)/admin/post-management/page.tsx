/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React,{ useEffect, useState } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Pagination,
  Selection,
  SortDescriptor
} from "@nextui-org/react";
import { useGetAllPostQuery } from '@/redux/features/post/postApi';
import { categoryOptions } from '@/components/post/constant';
import { SearchIcon } from '@/components/table/SearchIcon';
import { ChevronDownIcon } from '@/components/table/ChevronDownIcon';
import { capitalize } from '@/components/table/utils';
import { PlusIcon } from '@/components/table/PlusIcon';
import { VerticalDotsIcon } from '@/components/table/VerticalDotsIcon';
import Author from '@/components/shared/Author';

export interface IPost {
  _id?: string;
  author: {name:string,email:string,image: string, isVerified: boolean}; 
  title: string;
  category: string;
  isPremium?: boolean; 
  upvoteCount?: number; 
  downvoteCount?: number; 
  commentCount?: number;
}

const columns = [
  {name: "AUTHOR", uid: "name", sortable: true},
  {name: "EMAIL", uid: "email"},
  {name: "TITLE", uid: "title", sortable: true},
  {name: "CATEGORY", uid: "category", sortable: true},
  {name: "RREMIUM", uid: "isPremium"},
  {name: "UPVOTES", uid: "upvoteCount", sortable: true},
  {name: "DOWNVOTES", uid: "downvoteCount"},
  {name: "COMMENTS", uid: "commentCount"},
  {name: "ACTIONS", uid: "actions"},
];

  // const roleOptions = [
  //   {name: "Admin", uid: "admin"},
  //   {name: "User", uid: "user"},
    
  // ]



  const INITIAL_VISIBLE_COLUMNS = ["name", "category", "upvotesCount", "downvoteCount", "isPremium", "role", "actions"];


const PostManagement: React.FC = () => {
  const { data: allPosts, refetch } = useGetAllPostQuery({});
  const [users, setUsers] = useState<IPost[]>(allPosts?.data || []);

  useEffect(() => {
    if (allPosts?.data) {
      setUsers(allPosts.data);
    }
  }, [allPosts?.data, refetch]);

  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
  const [categoryFilter, setCategoryFilter] = React.useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "upvoteCount",
    direction: "ascending",
  });
  const [page, setPage] = React.useState(1);

  const pages = Math.ceil(users.length / rowsPerPage);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...users];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user?.author?.name.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }
    if (categoryFilter !== "all" && Array.from(categoryFilter).length !== categoryOptions.length) {
      filteredUsers = filteredUsers.filter((user) =>
        Array.from(categoryFilter).includes(user?.category),
      );
    }

    return filteredUsers;
  }, [users, filterValue, categoryFilter]);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: IPost, b: IPost) => {
      const first = a[sortDescriptor.column as keyof IPost] as number;
      const second = b[sortDescriptor.column as keyof IPost] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback((user: IPost, columnKey: React.Key) => {
    const cellValue = user[columnKey as keyof IPost];

  
    switch (columnKey) {
      case "name":
        // Render the 'author' object with name and email
        return (
          // <User
          //   avatarProps={{ radius: "full", size: "sm", src: user?.author?.image }}
          //   classNames={{
          //     description: "text-default-500",
          //   }}
          //   description={user?.author?.email}
          //   name={user?.author?.name} 
          //   // name={cellValue as string} 
          // >
          //   {/* {user?.author?.email} */}
          // </User>
          <Author author={user?.author} />
        );
  
      case "email":
        // Safely render the title
        return <p className="text-bold">{user?.author?.email}</p>;
      case "title":
        // Safely render the title
        return <p className="text-bold">{cellValue as string}</p>;
  
      case "category":
        // Safely render the category
        return <p className="text-muted">{cellValue as string}</p>;
  
      case "isPremium":
        // Safely render the premium status as 'Premium' or 'Standard'
        return <p>{(cellValue as boolean) && <span className=' border rounded-md px-2 py-1 text-blue-400'>{'Premium'}</span>}</p>;
  
      case "upvoteCount":
      case "downvoteCount":
      case "commentCount":
        // Render counts, defaulting to 0 if undefined
        return <p>{cellValue !== undefined ? cellValue as number : 0}</p>;
  
      case "actions":
        // Render action buttons (e.g., View, Edit, Delete)
        return (
          <div className="relative flex justify-end items-center gap-2">
            <Dropdown className="bg-background border-1 border-default-200">
              <DropdownTrigger>
                <Button isIconOnly radius="full" size="sm" variant="light">
                  <VerticalDotsIcon className="text-default-400" width={24} height={24} />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem>View</DropdownItem>
                <DropdownItem>Edit</DropdownItem>
                <DropdownItem>Delete</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
  
      default:
        // Handle fallback cases for other fields
        if (typeof cellValue === "object" && cellValue !== null) {
          // If it's an object, render a JSON representation or custom handling
          return <p>{JSON.stringify(cellValue)}</p>;
        } else {
          // Render any other value, or 'N/A' if undefined
          return <p>{cellValue !== undefined ? cellValue : 'N/A'}</p>;
        }
    }
  }, []);
  
  
  

  const onRowsPerPageChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            classNames={{
              base: "w-full sm:max-w-[44%]",
              inputWrapper: "border-1",
            }}
            placeholder="Search by name..."
            size="sm"
            startContent={<SearchIcon className="text-default-300" />}
            value={filterValue}
            variant="bordered"
            onClear={() => setFilterValue("")}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  size="sm"
                  variant="flat"
                >
                  Category
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={categoryFilter}
                selectionMode="multiple"
                onSelectionChange={setCategoryFilter}
              >
                {categoryOptions.map((category) => (
                  <DropdownItem key={category.uid} className="capitalize">
                    {capitalize(category.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  size="sm"
                  variant="flat"
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button
              className="bg-foreground text-background"
              endContent={<PlusIcon width={24} height={24} />}
              size="sm"
            >
              Add New
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Total {users.length} users</span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    categoryFilter,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    users.length,
    hasSearchFilter,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <Pagination
          showControls
          classNames={{
            cursor: "bg-foreground text-background",
          }}
          color="default"
          isDisabled={hasSearchFilter}
          page={page}
          total={pages}
          variant="light"
          onChange={setPage}
        />
        <span className="text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${items.length} selected`}
        </span>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  const classNames = React.useMemo(
    () => ({
      wrapper: ["max-h-[382px]", "max-w-3xl"],
      th: ["bg-transparent", "text-default-500", "border-b", "border-divider"],
      td: [
        // changing the rows border radius
        // first
        "group-data-[first=true]:first:before:rounded-none",
        "group-data-[first=true]:last:before:rounded-none",
        // middle
        "group-data-[middle=true]:before:rounded-none",
        // last
        "group-data-[last=true]:first:before:rounded-none",
        "group-data-[last=true]:last:before:rounded-none",
      ],
    }),
    [],
  );

  return (
    <Table
      isCompact
      removeWrapper
      aria-label="Example table with custom cells, pagination and sorting"
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      checkboxesProps={{
        classNames: {
          wrapper: "after:bg-foreground after:text-background text-background",
        },
      }}
      classNames={classNames}
      selectedKeys={selectedKeys}
      selectionMode="multiple"
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      onSelectionChange={setSelectedKeys}
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={"No data found"} items={sortedItems}>
        {(item) => (
          <TableRow key={item?._id}>
            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export default PostManagement;
