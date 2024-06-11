/**
 * 数据管理页面
 */
import React, {
  useState,
  useEffect,
  forwardRef,
  useRef,
  useImperativeHandle,
} from "react";
import {
  Button,
  Form,
  Input,
  Space,
  Select,
  DatePicker,
  Card,
  Table,
  Tooltip,
  Tag,
  Modal,
  message,
  Popconfirm,
} from "antd";
import type { GetProp, TableProps } from "antd";
import { useTranslation } from "react-i18next";
import { SearchOutlined, RedoOutlined, PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import http from "../../utils/http";
import "./datas.css";

const { Option } = Select;
const { RangePicker } = DatePicker;

interface SearchFormProps {
  tagOptions: Array<any>;
  onFinish: (values: any) => void;
}
const SearchForm = (props: SearchFormProps) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const onReset = () => {
    form.resetFields();
    props.onFinish({});
  };

  return (
    <Card>
      <Form
        layout="inline"
        form={form}
        initialValues={{}}
        onFinish={props.onFinish}
        style={{}}
      >
        <Form.Item name="name" label={t("name")}>
          <Input
            count={{
              show: true,
              max: 20,
            }}
            placeholder={t("inputPlaceholder") + t("name")}
            style={{ width: '160px' }}
          />
        </Form.Item>
        <Form.Item name="tags" label={t("tag")}>
          <Select
            mode="multiple"
            placeholder={t("inputPlaceholder") + t("tag")}
            allowClear
            style={{ width: '200px' }}
          >
            {props.tagOptions.map((item) => {
              return (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item name="createTime" label={t("createTime")}>
          <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              <SearchOutlined />
              {t("search")}
            </Button>
            <Button htmlType="button" onClick={onReset}>
              <RedoOutlined />
              {t("reset")}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};
interface DataType {
  id: string;
  seqNo: number;
  name: string;
  description: string;
  tags: [string];
}
type TablePaginationConfig = Exclude<
  GetProp<TableProps, "pagination">,
  boolean
>;
interface TableParams {
  pagination?: TablePaginationConfig;
}

type AntTableProps = React.ComponentProps<typeof Table>;
interface TagTableProps
  extends Omit<
    AntTableProps,
    "dataSource" | "loading" | "pagination" | "onChange"
  > {
  dataSource: any;
  pagination: any;
  loading: boolean;
  onChange: TableProps["onChange"];
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}
const DataTable = (props: TagTableProps) => {
  const { t } = useTranslation();
  type ColumnsType<T> = TableProps<T>["columns"];
  const columns: ColumnsType<DataType> = [
    {
      title: t("seqNo"),
      dataIndex: "seqNo",
      width: "8%",
    },
    {
      title: t("name"),
      dataIndex: "name",
      width: "15%",
    },
    {
      title: t("desc"),
      dataIndex: "description",
      width: "25%",
      render: (desc) => {
        const shortDesc = desc && desc.slice(0, 30);

        return shortDesc === desc ? (
          <span>{desc}</span>
        ) : (
          <Tooltip placement="top" title={desc}>
            <span>{shortDesc}...</span>
          </Tooltip>
        );
      },
    },
    {
      title: t("createTime"),
      dataIndex: "time",
      width: "15%",
      render: (time) => {
        return (
          <span>{dayjs(new Date(time)).format("YYYY-MM-DD HH:mm:ss")}</span>
        );
      },
    },
    {
      title: t("tag"),
      dataIndex: "tags",
      width: "25%",
      render: (tags) => {
        return (
          tags &&
          tags.map((tag: { id: string; name: string }) => (
            <Tag color="blue">{tag.name}</Tag>
          ))
        );
      },
    },
    {
      title: t("operation"),
      dataIndex: "id",
      render: (id) => {
        return (
          <Space>
            <Button type="link" onClick={props.onEdit.bind(null, id)}>
              {t("edit")}
            </Button>
            <Popconfirm
              title={t("deleteTags")}
              description={t("confirmDelete")}
              onConfirm={props.onDelete.bind(null, id)}
            >
              <Button danger type="link">
                {t("delete")}
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <Table
      columns={columns}
      rowKey={(record) => record.id}
      dataSource={props.dataSource}
      pagination={props.pagination}
      loading={props.loading}
      onChange={props.onChange}
      scroll={{ y: "calc(100vh - 450px)" }}
    />
  );
};

type ModalProps = React.ComponentProps<typeof Modal>;
interface DataEditModalProps
  extends Omit<ModalProps, "open" | "onOk" | "onCancel"> {
  open: boolean;
  tagOptions: Array<any>;
  editLoading: boolean;
  onOk: (value?: any) => Promise<void>;
  onCancel: () => Promise<void>;
}
const DataEditModal = forwardRef((props: DataEditModalProps, ref) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  useImperativeHandle(ref, () => ({ form }));

  const handleOk = () => {
    form.validateFields().then((values) => {
      props.onOk({ ...values, id: form.getFieldValue("id") });
    });
  };

  const title = form.getFieldValue("id") ? t("editData") : t("addData");

  return (
    <Modal
      title={title}
      open={props.open}
      onOk={handleOk}
      onCancel={props.onCancel}
      confirmLoading={props.editLoading}
    >
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 16 }}
        form={form}
        style={{ maxWidth: 600 }}
      >
        <Form.Item
          name="name"
          label={t("name")}
          rules={[{ required: true }, { max: 20 }]}
        >
          <Input
            count={{
              show: true,
              max: 20,
            }}
            placeholder={t("inputPlaceholder") + t("name")}
          />
        </Form.Item>
        <Form.Item
          name="description"
          label={t("desc")}
          rules={[{ required: true }]}
        >
          <Input placeholder={t("inputPlaceholder") + t("desc")} />
        </Form.Item>
        <Form.Item name="tags" label={t("tag")}>
          <Select
            mode="multiple"
            allowClear
            placeholder={t("inputPlaceholder") + t("tag")}
          >
            {props.tagOptions.map((item) => {
              return (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
});

const DataView: React.FC = () => {
  const { t } = useTranslation();
  const dataEditModal = useRef(null);
  const [allTags, setAllTags] = useState([]);
  const [searchData, setSearchData] = useState({});

  const getAllTags = () => {
    if (allTags.length > 0) {
      return Promise.resolve(allTags);
    }
    return http("/api/tags").then(({ data }) => {
      setAllTags(data);
      return data;
    });
  };

  const [data, setData] = useState<DataType[]>();
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      total: 0,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total) => `共 ${total} 条数据`,
      current: 1,
      pageSize: 10,
    },
  });

  const fetchData = ({
    pageNo,
    pageSize,
    searchData,
  }: {
    pageNo?: number | undefined;
    pageSize?: number | undefined;
    searchData?: any;
  }) => {
    setLoading(true);
    return getAllTags().then((tagsData) => {
      return http({
        url: "/api/data",
        params: {
          pageNo: pageNo || 1,
          pageSize: pageSize || 10,
          ...searchData,
        },
      }).then(({ data }) => {
        const dataList = data.dataInfo.map((item: any, index: number) => {
          const tags = item.tags.map((id: string) => {
            const match = tagsData.find(
              (tag: { id: string; name: string }) => tag.id === id
            );
            return {
              id,
              // @ts-ignore
              name: match && match.name,
            };
          });
          return {
            seqNo:
              (data.pageInfo.pageNo - 1) * data.pageInfo.pageSize + index + 1,
            ...item,
            tags,
          };
        });
        setData(dataList);
        setLoading(false);
        setTableParams({
          pagination: {
            ...tableParams.pagination,
            current: data.pageInfo.pageNo,
            pageSize: data.pageInfo.pageSize,
            total: data.pageInfo.total,
            // total: 59
          },
        });
      });
    });
  };

  useEffect(() => {
    fetchData({});
  }, []);

  const onAddData = () => {
    // @ts-ignore
    dataEditModal.current?.form.resetFields();
    setOpen(true);
  };
  const [open, setOpen] = useState(false);
  const [editLoaing, setEditLogding] = useState(false);
  const onOk = (values: any): Promise<void> => {
    setEditLogding(true);
    debugger;
    if (values.id) {
      // 修改
      return http({
        url: "/api/data",
        method: "put",
        data: values,
      })
        .then((data) => {
          // @ts-ignore
          message.success(data.msg);
          setOpen(false);
          setTableParams({
            pagination: {
              ...tableParams.pagination,
              current: 1,
            },
          }); // 重置分页，刷新数据
          fetchData({
            pageNo: 1,
            pageSize: tableParams.pagination?.pageSize,
            searchData,
          });
        })
        .finally(() => {
          setEditLogding(false);
        });
    } else {
      // 新增
      return http({
        url: "/api/data",
        method: "post",
        data: values,
      })
        .then((data) => {
          // @ts-ignore
          message.success(data.msg);
          setOpen(false);
          setTableParams({
            pagination: {
              ...tableParams.pagination,
              current: 1,
            },
          });
          fetchData({
            pageNo: 1,
            pageSize: tableParams.pagination?.pageSize,
            searchData,
          });
        })
        .finally(() => {
          setEditLogding(false);
        });
    }
  };
  const onCancel = () => {
    setOpen(false);
    return Promise.resolve();
  };
  const handleTableChange: TableProps["onChange"] = (pagination) => {
    debugger;
    setTableParams({
      pagination: {
        ...pagination,
      },
    });
    fetchData({
      pageNo: pagination.current,
      pageSize: pagination.pageSize,
      searchData,
    });

    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setData([]);
    }
  };
  const onDelete = (id: string) => {
    setLoading(true);
    http({
      url: `/api/data`,
      method: "delete",
      params: {
        id,
      },
    })
      // @ts-ignore
      .then(({ msg }) => {
        message.success(msg || t("deleteSuccess"));
        fetchData({});
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const onEdit = (id: string) => {
    debugger;
    const editData = { ...data?.find((item) => item.id === id) };
    if (editData) {
      // @ts-ignore
      editData.tags = editData.tags?.map((tag) => tag.id);
    }
    // @ts-ignore
    dataEditModal.current?.form.setFieldsValue(editData);
    setOpen(true);
  };
  const onSearch = (values: any) => {
    console.log("onSearch values = ", values);
    const searchValues = { ...values };
    if (Array.isArray(values.createTime) && values.createTime.length === 2) {
      searchValues.startTime = dayjs(values.createTime[0]).valueOf();
      searchValues.endTime = dayjs(values.createTime[1]).valueOf();
    }
    if (Array.isArray(values.tags)) {
      searchValues.tags = values.tags.join(",");
    }
    delete searchValues.createTime;

    console.log("onSearch searchValues = ", searchValues);
    setSearchData(values);
    fetchData({
      pageNo: 1,
      pageSize: tableParams.pagination?.pageSize,
      searchData: searchValues,
    });
  };

  return (
    <>
      <SearchForm tagOptions={allTags} onFinish={onSearch}></SearchForm>
      <Card style={{ marginTop: "15px" }}>
        <Space
          style={{
            textAlign: "right",
            width: "100%",
            justifyContent: "flex-end",
            marginBottom: "15px",
          }}
        >
          <Button type="primary" onClick={onAddData}>
            <PlusOutlined />
            {t("addData")}
          </Button>
        </Space>
        <DataTable
          dataSource={data}
          pagination={tableParams.pagination}
          loading={loading}
          onChange={handleTableChange}
          onDelete={onDelete}
          onEdit={onEdit}
        ></DataTable>
      </Card>
      <DataEditModal
        ref={dataEditModal}
        open={open}
        tagOptions={allTags}
        onOk={onOk}
        onCancel={onCancel}
        editLoading={editLoaing}
      ></DataEditModal>
    </>
  );
};

export default DataView;
