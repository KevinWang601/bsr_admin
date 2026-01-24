import { loadPrivilege } from '@/services/role';
import { getQueryString } from '@/util';
import type { ProFormInstance } from '@ant-design/pro-components';
import { DrawerForm, ProFormField } from '@ant-design/pro-components';
import { message, Tree } from 'antd';
import type { DataNode } from 'antd/es/tree';
import { useRef, useState } from 'react';
import { request } from 'umi';

const RoleAuthorizeEdit: React.FC<EditType> = (props) => {
  const { trigger, record, actionRef, url } = props;
  const formRef = useRef<ProFormInstance>();

  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);

  const onCheck = (checkedKeysValue: React.Key[]) => {
    console.log(checkedKeysValue);
    setCheckedKeys(checkedKeysValue);
    formRef.current?.setFieldsValue({
      roleId: record.id,
      privilegeIds: [...checkedKeysValue.checked],
    });
  };

  const visibleChange = async (visible: boolean) => {
    if (record && visible) {
      const resp = await loadPrivilege(record.id);
      if (resp.result === 'success') {
        setTreeData(resp.model.treeData);
        setSelectedKeys(resp.model.selectedKeys);
        setCheckedKeys(resp.model.checkedKeys);
        formRef.current?.setFieldsValue({
          roleId: record.id,
          privilegeIds: resp.model.checkedKeys,
        });
      }
    }
  };

  return (
    <DrawerForm
      key={url + (record === undefined ? '' : record.id)}
      formRef={formRef}
      trigger={trigger}
      onVisibleChange={visibleChange}
      onFinish={async (values) => {
        console.log(values);
        const resp = await request<DTO.Resp<any>>(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          data: getQueryString(values),
          processData: false,
        });

        if (resp.result === 'success') {
          message.success('操作成功');
          if (actionRef && actionRef.current) {
            actionRef.current.reload();
          }
          return true;
        } else {
          message.error(resp.msg);
          return false;
        }
      }}
    >
      <ProFormField hidden={true} name="roleId" />
      <ProFormField hidden={true} name="privilegeIds" />
      <Tree
        checkable
        checkStrictly={true}
        selectedKeys={selectedKeys}
        checkedKeys={checkedKeys}
        onCheck={onCheck}
        treeData={treeData}
      />
    </DrawerForm>
  );
};
export default RoleAuthorizeEdit;
