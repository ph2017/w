/**
 * 数据管理页面
 */
import React, { useState, useEffect } from 'react';
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
} from 'antd';
import type { GetProp, TableProps } from 'antd';
import { useTranslation } from 'react-i18next';
import { SearchOutlined, RedoOutlined, PlusOutlined } from '@ant-design/icons';
// import qs from 'qs';

const { Option } = Select;
const { RangePicker } = DatePicker;

const SearchForm: React.FC = () => {
    const { t } = useTranslation();
    const [form] = Form.useForm();

    const onReset = () => {
        form.resetFields();
    };

    const onFinish = (values: any) => {
        console.log(values);
    };

    return (
        <Card>
            <Form layout='inline' form={form} initialValues={{}} onFinish={onFinish} style={{}}>
                <Form.Item name='name' label={t('name')}>
                    <Input
                        count={{
                            show: true,
                            max: 20,
                        }}
                        placeholder={t('inputPlaceholder') + t('name')}
                    />
                </Form.Item>
                <Form.Item name='tag' label={t('tag')}>
                    <Select placeholder={t('inputPlaceholder') + t('tag')} allowClear>
                        <Option value='1'>Option 1</Option>
                        <Option value='2'>Option 2</Option>
                        <Option value='3'>Option 3</Option>
                    </Select>
                </Form.Item>
                <Form.Item name='createTime' label={t('createTime')}>
                    <RangePicker showTime />
                </Form.Item>
                <Form.Item>
                    <Space>
                        <Button type='primary' htmlType='submit'>
                            <SearchOutlined />
                            {t('search')}
                        </Button>
                        <Button htmlType='button' onClick={onReset}>
                            <RedoOutlined />
                            {t('reset')}
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Card>
    );
};

const DataTable: React.FC = () => {
    const { t } = useTranslation();
    type ColumnsType<T> = TableProps<T>['columns'];
    type TablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>;

    interface DataType {
        uuid: string;
        seqNo: number;
        name: string;
        description: string;
        tags: [string];
    }
    interface TableParams {
        pagination?: TablePaginationConfig;
    }
    const onDelete = (id: string) => {
        console.log('id = ', id);
    };
    const columns: ColumnsType<DataType> = [
        {
            title: t('seqNo'),
            dataIndex: 'seqNo',
            width: '5%',
        },
        {
            title: t('name'),
            dataIndex: 'name',
            width: '20%',
        },
        {
            title: t('desc'),
            dataIndex: 'description',
            width: '30%',
            render: desc => {
                const shortDesc = desc && desc.slice(0, 30);

                return shortDesc === desc ? (
                    <span>{desc}</span>
                ) : (
                    <Tooltip placement='top' title={desc}>
                        <span>{shortDesc}...</span>
                    </Tooltip>
                );
            },
        },
        {
            title: t('tag'),
            dataIndex: 'tags',
            width: '30%',
            render: tags => {
                return tags && tags.map((tag: string) => <Tag color='blue'>{tag}</Tag>);
            },
        },
        {
            title: t('operation'),
            dataIndex: 'id',
            render: id => {
                return (
                    <Space>
                        <Button type='link'>{t('edit')}</Button>
                        <Button danger type='link' onClick={onDelete.bind(null, id)}>
                            {t('delete')}
                        </Button>
                    </Space>
                );
            },
        },
    ];

    const [data, setData] = useState<DataType[]>();
    const [loading, setLoading] = useState(false);
    const [tableParams, setTableParams] = useState<TableParams>({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    });

    const fetchData = () => {
        setLoading(true);
        // fetch(`https://randomuser.me/api?${qs.stringify(getRandomuserParams(tableParams))}`)
        fetch(`https://randomuser.me/api`)
            .then(res => res.json())
            .then(({ results }) => {
                setData(results);
                setLoading(false);
                setTableParams({
                    ...tableParams,
                    pagination: {
                        ...tableParams.pagination,
                        total: 200,
                        // 200 is mock data, you should read it from server
                        // total: data.totalCount,
                    },
                });
            });
    };

    useEffect(() => {
        fetchData();
    }, [tableParams.pagination?.current, tableParams.pagination?.pageSize]);

    const handleTableChange: TableProps['onChange'] = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
        });

        // `dataSource` is useless since `pageSize` changed
        if (pagination.pageSize !== tableParams.pagination?.pageSize) {
            setData([]);
        }
    };

    return (
        <Table
            columns={columns}
            rowKey={record => record.uuid}
            dataSource={data}
            pagination={tableParams.pagination}
            loading={loading}
            onChange={handleTableChange}
        />
    );
};

type ModalProps = React.ComponentProps<typeof Modal>;
interface DataEditModalProps extends Omit<ModalProps, 'open' | 'onOk' | 'onCancel'> {
    open: boolean;
    onOk?: (value?: any) => Promise<void>;
    onCancel?: () => Promise<void>;
    isNew?: boolean;
}
const DataEditModal = (props: DataEditModalProps) => {
    const { t } = useTranslation();
    const handleOk = (e: React.MouseEvent<HTMLElement>) => {
        console.log(e);
        props.onOk?.();
    };

    const handleCancel = (e: React.MouseEvent<HTMLElement>) => {
        console.log(e);
        props.onCancel?.();
    };
    const title = props.isNew ? t('addData') : t('editData');
    const [form] = Form.useForm();

    return (
        <Modal title={title} open={props.open} onOk={handleOk} onCancel={handleCancel}>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 16 }}
                form={form}
                style={{ maxWidth: 600 }}
            >
                <Form.Item name='name' label={t('name')} rules={[{ required: true }, { max: 20 }]}>
                    <Input
                        count={{
                            show: true,
                            max: 20,
                        }}
                        placeholder={t('inputPlaceholder') + t('name')}
                    />
                </Form.Item>
                <Form.Item name='description' label={t('desc')} rules={[{ required: true }]}>
                    <Input placeholder={t('inputPlaceholder') + t('desc')} />
                </Form.Item>
                <Form.Item name='tag' label={t('tag')}>
                    <Select placeholder={t('inputPlaceholder') + t('tag')} allowClear>
                        <Option value='1'>Option 1</Option>
                        <Option value='2'>Option 2</Option>
                        <Option value='3'>Option 3</Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

const App: React.FC = () => {
    const { t } = useTranslation();
    const onAddData = () => {
        console.log('add data');
        setOpen(true);
        setIsNew(true);
    };
    const [open, setOpen] = useState(false);
    const [isNew, setIsNew] = useState(false);
    const onOk = (): Promise<void> => {
        setOpen(false);
        return Promise.resolve();
    };
    const onCancel = () => {
        setOpen(false);
        return Promise.resolve();
    };

    return (
        <>
            <SearchForm></SearchForm>
            <Card>
                <Space
                    style={{
                        textAlign: 'right',
                        width: '100%',
                        justifyContent: 'flex-end',
                        marginBottom: '15px',
                    }}
                >
                    <Button type='primary' onClick={onAddData}>
                        <PlusOutlined />
                        {t('addData')}
                    </Button>
                </Space>
                <DataTable></DataTable>
            </Card>
            <DataEditModal
                open={open}
                isNew={isNew}
                onOk={onOk}
                onCancel={onCancel}
            ></DataEditModal>
        </>
    );
};

export default App;
