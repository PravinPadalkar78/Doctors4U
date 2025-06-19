import { Layout } from "antd";
import MenuBar from "./MenuBar";
import { Outlet, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";

const AppLayout = () => {
  const { Sider } = Layout;
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated]);
  return (
    <>
      <Layout className="0 text-white min-h-screen hidden sm:flex">
        <Sider className="bg-[#3DBCA2]" width={"250px"}>
          <MenuBar />
        </Sider>
        <Outlet />
      </Layout>
      <div className="min-h-[calc(100vh-96px)]  flex sm:hidden items-center justify-center font-bold text-xl">
        Please Login Through Computer To Access
      </div>
    </>
  );
};

export default AppLayout;
