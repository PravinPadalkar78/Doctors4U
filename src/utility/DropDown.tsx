import { LogoutOutlined, MoneyCollectOutlined, UserOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Avatar, Button, Dropdown as AntdDropDown } from "antd";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import useApp from "antd/es/app/useApp";

const DropDown = () => {
  const { loggedInUserDetails, setIsAuthenticated, setLoggedInUserDetails } = useAuth();
  const { message } = useApp();
  const navigate = useNavigate();
  const handleLogout = () => {
    try {
      navigate("/login");
      setIsAuthenticated(false);
      setLoggedInUserDetails(null);
      message.info("Logout Successful!!!");
    } catch {
      message.error("Logout Failed");
    }
  };
  const items: MenuProps["items"] = [
    {
      key: "2",
      label: "Profile",
      icon: <UserOutlined />,
    },
    {
      key: "3",
      label: "Subscription",
      icon: <MoneyCollectOutlined />,
    },
    {
      key: "4",
      label: "Logout",
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

  return (
    <AntdDropDown menu={{ items }} trigger={["click"]}>
      <Link to="#" onClick={(e) => e.preventDefault()}>
        <Button
          type="text"
          color="primary"
          className="outline-none border-0 text-lg"
          icon={<Avatar icon={<UserOutlined />} />}
        >
          {loggedInUserDetails?.userFirstName + " " + loggedInUserDetails?.userLastName}
        </Button>
      </Link>
    </AntdDropDown>
  );
};

export default DropDown;
