"use client";
import { useRouter } from "next/navigation";
import { SectionHr } from "@/app/components/common/Section";
import {
  FormContainer,
  FormControl,
  FormSelect,
  FormButton,
} from "@/app/components/common/Form";

const MemberForm = ({ member = null, setIsEditing }) => {
  const router = useRouter();
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <FormContainer onSubmit={handleSubmit}>
        <FormControl
          name="number"
          labelText="背號"
          type="number"
          defaultValue={member?.number || ""}
          placeholder="請輸入背號"
          required
        />
        <FormControl
          name="name"
          labelText="姓名"
          type="text"
          defaultValue={member?.name || ""}
          placeholder="請輸入姓名"
          required
        />
        <SectionHr content="權限與邀請" />
        <FormControl
          name="email"
          labelText="信箱"
          type="email"
          defaultValue={member?.meta.email || ""}
          placeholder="請輸入信箱"
        />
        <FormSelect
          name="admin"
          labelText="權限"
          defaultValue={member?.meta.admin || false}
          options={[
            { value: false, text: "一般成員" },
            { value: true, text: "管理者" },
          ]}
        />
        <FormButton>{member ? "儲存變更" : "建立隊員"}</FormButton>
      </FormContainer>
      {member ? (
        <FormButton type="text" onClick={() => setIsEditing(false)}>
          取消編輯
        </FormButton>
      ) : (
        <FormButton type="text" onClick={() => router.push("/team")}>
          返回隊員列表
        </FormButton>
      )}
    </>
  );
};

export default MemberForm;
