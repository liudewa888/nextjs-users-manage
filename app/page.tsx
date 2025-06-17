"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { User } from "@prisma/client";

import Form from "./components/form";
const UsersPage = () => {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [operateFlag, setOperateFlag] = useState("add");
  const [currentUser, setCurrentUser] = useState({});
  const isLoading = status === "loading";

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!isLoading && !session) {
      signIn();
      return;
    }
    fetchUsers();
  }, [session, status, signIn]);

  const opearteHandler = async (flag, item) => {
    setOperateFlag(flag);
    setCurrentUser(item);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await fetch(`/api/users/${id}`, { method: "DELETE" });
        if (response.ok) {
          setUsers(users.filter((user) => user.id !== id));
        }
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  return (
    <div className="p-3 w-full">
      <div className="flex justify-between items-center mb-3">
        <h1 className="text-2xl font-bold my-0">
          用户管理-{session?.user.uname}
        </h1>
        {/* <button className="text-xl font-bold">添加</button> */}
        <button
          className="text-sm"
          onClick={() => signOut({ callbackUrl: "/api/auth/signin" })}
        >
          退出登录
        </button>
      </div>
      <Form data={currentUser} onUpdate={fetchUsers} />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="min-w-full divide-y divide-gray-200 mt-2">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                ID
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center"
              >
                用户名
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center"
              >
                管理员
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((item) => (
              <tr
                key={item.id}
                className={item.id % 2 === 0 ? "bg-gray-50" : ""}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                  {item.uname}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  {item.role == "1" ? "是" : ""}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                    onClick={() => {
                      opearteHandler("edit", item);
                    }}
                  >
                    编辑
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UsersPage;
