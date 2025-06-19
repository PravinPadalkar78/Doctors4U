import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Button, Drawer } from "antd";
import dayjs from "dayjs";
import { Dayjs } from "dayjs";
import AvailabilityDrawer from "./AvailabilityDrawer";
import AppointmentDrawer from "./AppointmentDrawer";
import { useDoctorDetails } from "../hooks/useDoctorDetails";
import DrawerFooter from "./DrawerFooter";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { RoleEnum } from "../Helper/types";

type CalenderHeaderProps = {
  value: Dayjs;
  onChange: (date: Dayjs) => void;
};
const CalenderHeader = ({ value, onChange }: CalenderHeaderProps) => {
  const { loggedInUserDetails } = useAuth();
  const { isAvailabilityDrawerOpen, setIsAvailabilityDrawerOpen, isAppointmentDrawerOpen, setIsAppointmentDrawerOpen } =
    useDoctorDetails();
  const [selectedSlot, setSelectedSlot] = useState<string | undefined>(undefined);
  const handleLeftArrow = () => {
    onChange(value.subtract(1, "month"));
  };
  const handleRightArrow = () => {
    onChange(value.add(1, "month"));
  };

  // Used For Appointment Drawer
  const [current, setCurrent] = useState<number>(0);
  return (
    <section className="flex  justify-between px-4">
      <div className="p-6  flex gap-8 ">
        <Button type="primary" onClick={() => onChange(dayjs())}>
          Today
        </Button>
        <div className="flex items-center gap-16">
          <Button type="default" shape="circle" icon={<LeftOutlined />} onClick={handleLeftArrow} />
          <p className="text-xl">{value.format("MMM YYYY")}</p>
          <Button type="default" shape="circle" icon={<RightOutlined />} onClick={handleRightArrow} />
        </div>
      </div>
      <div className="flex gap-4 items-center">
        <Button
          type="primary"
          onClick={() => setIsAvailabilityDrawerOpen(true)}
          hidden={loggedInUserDetails?.userRole !== RoleEnum.doctor}
        >
          Set Availability
        </Button>

        <Button
          type="primary"
          onClick={() => setIsAppointmentDrawerOpen(true)}
          hidden={loggedInUserDetails?.userRole !== RoleEnum.nurse}
        >
          New Appointment
        </Button>

        {/* Availability Drawer */}
        <Drawer
          title={<h1 className="text-xl font-bold">Set Availability</h1>}
          width={600}
          onClose={() => setIsAvailabilityDrawerOpen(false)}
          open={isAvailabilityDrawerOpen}
        >
          <AvailabilityDrawer />
        </Drawer>

        {/* Appointment Drawer */}

        <Drawer
          closable
          title="New Appointment"
          onClose={() => setIsAppointmentDrawerOpen(false)}
          width={600}
          open={isAppointmentDrawerOpen}
          footer={<DrawerFooter current={current} setCurrent={setCurrent} selectedSlot={selectedSlot} />}
        >
          <AppointmentDrawer
            current={current}
            setCurrent={setCurrent}
            selectedSlot={selectedSlot}
            setSelectedSlot={setSelectedSlot}
          />
        </Drawer>
      </div>
    </section>
  );
};

export default CalenderHeader;
