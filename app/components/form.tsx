import { useState, useRef, useEffect } from "react";
import { createHash } from "crypto";

export default function ContactForm({ data, onUpdate }) {
  const formRef = useRef(null);
  const [formData, setFormData] = useState({
    id: null,
    uname: "",
    password: "",
    role: false,
  });

  useEffect(() => {
    data.role = data.role == "1" ? true : false;
    setFormData(data);
  }, [data]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const reset = (e = null) => {
    e && e.preventDefault();
    setFormData({
      id: null,
      uname: "",
      password: "",
      role: false,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.uname) return;
    formData.role = formData.role ? "1" : "0";

    if (formData.password) {
      formData.password = createHash("md5")
        .update(formData.password)
        .digest("hex");
    }

    if (!formData.id) {
      if (!formData.password) return;
      fetch("/api/users", {
        body: JSON.stringify(formData),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }).then(() => {
        reset();
      });
    } else {
      fetch("/api/users/" + formData.id, {
        body: JSON.stringify(formData),
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }).then(() => {
        reset();
        onUpdate();
      });
    }
  };

  return (
    <form
      className="flex justify-between items-center border-[1px] border-[#ccc] border-solid rounded-sm h-10 p-2"
      onSubmit={handleSubmit}
      ref={formRef}
    >
      <div>
        <label className="mr-1">账号:</label>
        <input
          type="text"
          name="uname"
          value={formData.uname}
          onChange={handleChange}
        />
      </div>
      <div>
        <label className="mr-1">密码:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
      </div>
      <div>
        <label className="mr-1">管理员:</label>
        <input
          type="checkbox"
          name="role"
          checked={formData.role}
          onChange={handleChange}
        />
      </div>
      <div>
        <button className="mr-1" type="button" onClick={reset}>
          重置
        </button>
        <button type="submit">提交</button>
      </div>
    </form>
  );
}
