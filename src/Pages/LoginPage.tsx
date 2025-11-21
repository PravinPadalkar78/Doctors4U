import { Button, Form, Input, type FormProps } from "antd";
import background from "/background.png";
import { Link, useNavigate } from "react-router";
import { useDoctorDetails } from "../hooks/useDoctorDetails";
import { useAuth } from "../hooks/useAuth";
import useApp from "antd/es/app/useApp";
import bcrypt from "bcryptjs";
import { RoleEnum, type doctorDetailsType, type nurseDetailsType } from "../Helper/types";

type FieldType = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const { message } = useApp();
  const { doctersDetails, nurseDetails } = useDoctorDetails();
  const { setIsAuthenticated, setLoggedInUserDetails, usersList } = useAuth();
  const navigate = useNavigate();

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    const matchedUser = usersList.find((user) => user.emailId == values.email);
    if (matchedUser) {
      // console.log("Authenticate");
      bcrypt.compare(values.password, matchedUser.password, (err, res) => {
        if (!res) {
          message.error("Invalid Credentials!!" + err);
          console.log(values.password, matchedUser.password);
          return;
        }
        if (matchedUser.role == RoleEnum.doctor) {
          const userDetails = doctersDetails.find((doctor: doctorDetailsType) => doctor.doctorId == matchedUser.userId);
          if (userDetails) {
            setIsAuthenticated(true);
            setLoggedInUserDetails({
              userId: userDetails.doctorId,
              userFirstName: userDetails.doctorFirstName,
              userLastName: userDetails.doctorLastName,
              userPhoneNo: userDetails.doctorPhoneNo,
              userRole: RoleEnum.doctor,
              userEmailId: userDetails.emailId,
            });
            message.success(`Login Successful!!! Welcome `);
            navigate("/doctor/appointment");
          } else {
            message.error("Couldn't Match Id");
          }
        } else if (matchedUser.role == RoleEnum.nurse) {
          const userDetails = nurseDetails.find((nurse: nurseDetailsType) => nurse.nurseId == matchedUser.userId);
          if (userDetails) {
            setIsAuthenticated(true);
            setLoggedInUserDetails({
              userId: userDetails.emailId,
              userFirstName: userDetails.nurseFirstName,
              userLastName: userDetails.nurseLastName,
              userPhoneNo: userDetails.nursePhoneNo,
              userRole: RoleEnum.nurse,
              userEmailId: userDetails.emailId,
            });
            message.success(`Login Successful!!! Welcome `);
            navigate("/nurse/appointment");
          } else {
            message.error("Couldn't Match Id");
          }
        }
      });
    } else {
      message.error("Invalid Credentials1");
    }
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = () => {
    message.error("Submission Failed");
  };

  return (
    <section className="flex">
      <img  src={background} className="h-[100vh] hidden lg:block"></img>
      <div className="flex w-full items-center justify-center">
        <Form
          name="Login Form"
          className="w-[500px] p-8 shadow-sm"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          title="Sign In"
        >
          <h1 className="text-3xl font-medium mb-8">Sign In</h1>
          <Form.Item<FieldType>
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input placeholder="Enter Email" />
          </Form.Item>
          <Form.Item<FieldType>
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password placeholder="Enter Password" />
          </Form.Item>
          <div className="mb-8">
            <p>
              Don't Have An Account ?
              <Link to="/signup" className="font-bold ml-2">
                SignUp
              </Link>
            </p>
          </div>
          <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </section>
  );
};

export default LoginPage;
