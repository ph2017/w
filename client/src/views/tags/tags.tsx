/**
 * 标签管理页面
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
  Popconfirm,
  Card,
  Table,
  Tag,
  Modal,
  message,
} from "antd";
import type { TableProps } from "antd";
import { useTranslation } from "react-i18next";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import http from "../../utils/http";
import "./tags.css";

interface DataType {
  id: string;
  name: string;
}

type AntTableProps = React.ComponentProps<typeof Table>;
interface TagTableProps extends Omit<AntTableProps, "dataSource" | "loading"> {
  dataSource: any;
  loading: boolean;
  onDelete: (id: string) => void;
  onSelectedRowChange: (ids: React.Key[]) => void;
  onEdit: (id: string) => void;
}
const TagTable = forwardRef((props: TagTableProps, ref) => {
  const { t } = useTranslation();
  type ColumnsType<T> = TableProps<T>["columns"];

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
    props.onSelectedRowChange(newSelectedRowKeys);
  };

  useImperativeHandle(ref, () => ({
    setSelectedRowKeys,
  }));

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const onDelete = (id: string) => {
    props.onDelete(id);
  };
  const columns: ColumnsType<DataType> = [
    {
      title: t("name"),
      dataIndex: "name",
      width: "50%",
      render: (name) => {
        return <Tag color="blue">{name}</Tag>;
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
              onConfirm={onDelete.bind(null, id)}
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
      style={{ height: "95%" }}
      rowSelection={rowSelection}
      // @ts-ignore
      columns={columns}
      dataSource={props.dataSource}
      loading={props.loading}
      rowKey="id"
      pagination={false}
      scroll={{ y: "calc(100vh - 250px)" }}
    />
  );
});

type ModalProps = React.ComponentProps<typeof Modal>;
interface TagEditModalProps
  extends Omit<ModalProps, "open" | "onOk" | "onCancel"> {
  open: boolean;
  onOk?: (value?: any) => Promise<void>;
  onCancel?: () => Promise<void>;
  loading: boolean;
}
const TagEditModal = forwardRef((props: TagEditModalProps, ref) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  useImperativeHandle(ref, () => ({
    form,
  }));

  const handleOk = () => {
    form.validateFields().then((values) => {
      props.onOk?.({
        ...values,
        id: form.getFieldValue("id"),
      });
    });
  };

  const handleCancel = () => {
    props.onCancel?.();
  };
  const title = form.getFieldValue("id") ? t("editData") : t("addData");

  return (
    <Modal
      title={title}
      open={props.open}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={props.loading}
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
          rules={[{ required: true }, { max: 10 }]}
        >
          <Input
            count={{
              show: true,
              max: 10,
            }}
            placeholder={t("inputPlaceholder") + t("name")}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
});

const TagsView: React.FC = () => {
  const { t } = useTranslation();
  const [tagEditLoading, setTagEditLoading] = useState(false);

  const [data, setData] = useState<DataType[]>();
  const [loading, setLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState<React.Key[]>([]);
  const tagTable = useRef(null);

  const fetchTagsData = () => {
    setLoading(true);
    http("/api/tags")
      .then(({ data }) => {
        // @ts-ignore
        tagTable?.current?.setSelectedRowKeys([]); // 清空选中项
        setSelectedRows([]);
        setData(data);
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTagsData();
  }, []);

  const [delLoaing, setDelLoading] = useState(false);
  const onDeleteBatch = () => {
    setDelLoading(true);
    http({
      url: "/api/delTagsBatch",
      method: "put",
      data: {
        ids: selectedRows,
      },
    })
      // @ts-ignore
      .then(({ msg }) => {
        message.success(msg || t("deleteSuccess"));
        fetchTagsData();
      })
      .finally(() => {
        setDelLoading(false);
      });
  };
  const [open, setOpen] = useState(false);
  const onOk = (values: any): Promise<void> => {
    setTagEditLoading(true);
    if (values.id) {
      // 修改
      return http({
        url: "/api/tags",
        method: "put",
        data: values,
      })
        .then((data) => {
          // @ts-ignore
          message.success(data.msg);
          setOpen(false);
          fetchTagsData();
        })
        .finally(() => {
          setTagEditLoading(false);
        });
    } else {
      // 新增
      return http({
        url: "/api/tags",
        method: "post",
        data: values,
      })
        .then((data) => {
          // @ts-ignore
          message.success(data.msg);
          setOpen(false);
          fetchTagsData();
        })
        .finally(() => {
          setTagEditLoading(false);
        });
    }
  };
  const onCancel = () => {
    setOpen(false);
    return Promise.resolve();
  };
  const onDeleteById = (id: string) => {
    setLoading(true);
    http({
      url: `/api/tags`,
      method: "delete",
      params: {
        id,
      },
    })
      // @ts-ignore
      .then(({ msg }) => {
        message.success(msg || t("deleteSuccess"));
        fetchTagsData();
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const tagEditModal = useRef(null);

  const onEdit = (id: string) => {
    const editData = { ...data?.find((item) => item.id === id) };
    // @ts-ignore
    tagEditModal.current?.form.setFieldsValue(editData);
    setOpen(true);
  };
  const onAddData = () => {
    // @ts-ignore
    tagEditModal.current?.form.resetFields();
    setOpen(true);
  };

  const onSelectedRowChange = (selectedRowKeys: React.Key[]) => {
    setSelectedRows(selectedRowKeys);
  };

  return (
    <>
      <Card className="tags-view">
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
            {t("addTag")}
          </Button>
          <Popconfirm
            title={t("deleteTags")}
            description={t("confirmDelete")}
            onConfirm={onDeleteBatch}
          >
            <Button
              type="primary"
              danger
              disabled={selectedRows.length === 0}
              loading={delLoaing}
            >
              <MinusOutlined />
              {t("confirmToDelete")}
            </Button>
          </Popconfirm>
        </Space>
        <TagTable
          ref={tagTable}
          dataSource={data}
          loading={loading}
          onDelete={onDeleteById}
          onSelectedRowChange={onSelectedRowChange}
          onEdit={onEdit}
        ></TagTable>
      </Card>
      <TagEditModal
        ref={tagEditModal}
        open={open}
        onOk={onOk}
        onCancel={onCancel}
        loading={tagEditLoading}
      ></TagEditModal>
    </>
  );
};

export default TagsView;
