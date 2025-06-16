import { useState } from "react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    uname: "",
    password: "",
    isAdmin: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    fetch("/api/users", {
      body: JSON.stringify(formData),
      method: "POST",
      headers: {
        "Content-Type": "application/json", // 设置请求头，指定发送的数据格式
      },
    });
  };

  return (
    <form
      className="flex justify-between items-center border-[1px] border-[#ccc] border-solid rounded-sm h-10 p-2"
      onSubmit={handleSubmit}
    >
      <div>
        <label htmlFor="uname" className="mr-1">
          账号:
        </label>
        <input
          type="text"
          name="uname"
          value={formData.uname}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="password" className="mr-1">
          密码:
        </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="role" className="mr-1">
          管理员:
        </label>
        <input
          type="checkbox"
          name="role"
          value={formData.isAdmin}
          onChange={handleChange}
        />
      </div>
      <button type="submit">提交</button>
    </form>
  );
}
