import { Button, Form, Input, Radio, type FormProps } from "antd";
import background from "/background.png";
import { Link, useNavigate } from "react-router";
import type { CheckboxGroupProps } from "antd/es/checkbox";
import { useState } from "react";
import { useDoctorDetails } from "../hooks/useDoctorDetails";
import type { doctorDetailsType, IUsersList, nurseDetailsType } from "../Helper/types";
import useApp from "antd/es/app/useApp";
import { useAuth } from "../hooks/useAuth";
import bcrypt from "bcryptjs";

type FieldType = {
  email: string;
  firstName: string;
  lastName: string;
  phoneNo: string;
  password: string;
  confirmPassword: string;
};

const SignupPage = () => {
  const { setDoctersDetails, setNurseDetails } = useDoctorDetails();
  const { usersList, setUsersList } = useAuth();
  const navigate = useNavigate();
  const [form] = Form.useForm<FieldType>();
  const { message } = useApp();
  const SALT_ROUNDS = 10;
  const RadioOptions: CheckboxGroupProps<string>["options"] = [
    { label: "Doctor", value: "doctor", className: "label-1" },
    { label: "Nurse", value: "nurse", className: "label-2" },
  ];
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    if (values.password !== values.confirmPassword) {
      form.setFields([
        {
          name: "confirmPassword",
          errors: ["Password is not matching"],
        },
      ]);
      return;
    }
    try {
      let newId = (usersList.length + 1).toString();
      const hashedPassword = await bcrypt.hash(values.password, SALT_ROUNDS);
      let newUser = {
        userId: newId,
        emailId: values.email,
        password: hashedPassword,
        role: selectedRole,
      } as IUsersList;
      if (selectedRole == "doctor") {
        let newDoctorDetails = {
          doctorId: newId,
          doctorFirstName: values.firstName,
          doctorLastName: values.lastName,
          doctorPhoneNo: values.phoneNo,
          emailId: values.email,
        } as doctorDetailsType;
        setDoctersDetails((prev) => [...prev, newDoctorDetails]);
      } else if (selectedRole == "nurse") {
        let newNurseEntry = {
          nurseId: newId,
          nurseFirstName: values.firstName,
          nurseLastName: values.lastName,
          nursePhoneNo: values.phoneNo,
          emailId: values.email,
        } as nurseDetailsType;
        setNurseDetails((prev) => [...prev, newNurseEntry]);
      }
      setUsersList((prev) => [...prev, newUser]);
      message.success("Signup  Successful!!!");
      navigate("/login");
    } catch {
      message.error("Submission Failed!!!");
    }
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = () => {
    message.error("Submission Failed");
  };
  const [selectedRole, setSelectedRole] = useState<string>("doctor");
  return (
    <section className="flex">
      <img src={background} className="h-[100vh]"></img>
      <div className="flex w-full items-center justify-center">
        <Form
          form={form}
          name="Login Form"
          className="w-[500px] p-8 shadow-sm"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          title="Sign Up"
        >
          <h1 className="text-3xl font-medium mb-8">Sign Up</h1>
          <Form.Item<FieldType>
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please input your Email ID!" },
              { pattern: /^[^@]+@[^@]+\.[^@]+$/, message: "Please Enter A Valid Email" },
            ]}
          >
            <Input placeholder="Enter Email Id" />
          </Form.Item>
          <div className="flex space-x-4">
            <Form.Item<FieldType>
              label="First Name"
              name="firstName"
              className="w-full"
              rules={[{ required: true, message: "Please input your first name!" }]}
            >
              <Input placeholder="Enter Your First Name" />
            </Form.Item>
            <Form.Item<FieldType>
              label="Last Name"
              name="lastName"
              className="w-full"
              rules={[{ required: true, message: "Please input your first name!" }]}
            >
              <Input placeholder="Enter your Last Name" />
            </Form.Item>
          </div>
          <Form.Item<FieldType>
            label="Phone Number"
            name="phoneNo"
            rules={[
              { required: true, message: "Please input Valid Number!" },
              {
                pattern: /^[6-9]\d{9}$/,
                message: "Enter a valid 10-digit Indian phone number",
              },
            ]}
          >
            <Input placeholder="Enter Phone Number" />
          </Form.Item>

          <Form.Item<FieldType>
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please input your password!" },
              {
                pattern: /^(?=.*[^A-Za-z0-9]).{8,}$/,
                message: "Password Must be 8 characters long and contains atleast one special character",
              },
            ]}
          >
            <Input.Password placeholder="Enter The Password" />
          </Form.Item>
          <Form.Item<FieldType>
            label="Confirm Password"
            name="confirmPassword"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password placeholder="Confirm Password" />
          </Form.Item>
          <div className="flex gap-3 items-center my-8">
            <span className="font-medium">Sign In As :</span>
            <Radio.Group
              options={RadioOptions}
              onChange={(e) => setSelectedRole(e.target.value)}
              value={selectedRole}
            />
          </div>
          <div className="mb-8">
            <p>
              Already Have An Account ?
              <Link to="/login" className="font-bold ml-2">
                Sign In
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

export default SignupPage;
