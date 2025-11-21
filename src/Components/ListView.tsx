import { Button, DatePicker, Drawer, Table, type DatePickerProps } from "antd";
import { useDoctorDetails } from "../hooks/useDoctorDetails";
// import { UserOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useState } from "react";
import AppointmentDrawer from "../utility/AppointmentDrawer";
import DrawerFooter from "../utility/DrawerFooter";
import { useAuth } from "../hooks/useAuth";
import { RoleEnum } from "../Helper/types";
const ListView = () => {
  const { loggedInUserDetails } = useAuth();
  const { bookedSlotsDetails, isAppointmentDrawerOpen, setIsAppointmentDrawerOpen } = useDoctorDetails();
  const [filterDate, setFilterDate] = useState<string | undefined>(undefined); //format - > DD/MM/YYYY
  const [filterMonth, setFilterMonth] = useState<string | undefined>(undefined); //format MM/YYYY
  const [selectedSlot, setSelectedSlot] = useState<string | undefined>(undefined);
  const [current, setCurrent] = useState<number>(0);
  const handleToday = () => {
    if (!filterDate) {
      const todaysDate = dayjs().startOf("date").format("DD/MM/YYYY");
      setFilterDate(todaysDate);
    } else {
      setFilterDate(undefined);
    }
  };
  const columns = [
    {
      title: "Date & Time",
      dataIndex: "slot",
      key: "slot",
      width: "20%",
    },
    {
      title: "Doctor",
      dataIndex: "doctor",
      key: "doctor",
      width: "70%",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: "10%",
    },
  ];
  const dataSource = bookedSlotsDetails.flatMap((dateItem) => {
    return dateItem.slotInfo.map((slot) => {
      return {
        key: slot.slotTime + " " + dateItem.date,
        date: dateItem.date,
        slot: dayjs(dateItem.date).format("Do MMMM YYYY ") + " - " + dayjs(slot.slotTime).format("hh:mm:A"),
        doctor: dateItem.doctorName,
        action: (
          <Button type="primary" style={{ borderRadius: "4px" }}>
            Start Call
          </Button>
        ),
      };
    });
  });
  const onMonthChange: DatePickerProps["onChange"] = (date) => {
    if (date) {
      setFilterMonth(date.format("MM/YYYY"));
    } else {
      setFilterMonth(undefined);
    }
  };
  const filteredList = dataSource
    .filter((item) => (filterDate ? !dayjs(item.date).format("DD/MM/YYYY").localeCompare(filterDate) : true))
    .filter((item) => (filterMonth ? !dayjs(item.date).format("MM/YYYY").localeCompare(filterMonth) : true));
  return (
    <div>
      <section className="min-h-16 flex justify-between items-center mx-8 mt-4 mb-8">
        <div className="flex gap-6">
          <Button type={filterDate ? "primary" : "default"} onClick={handleToday}>
            Today
          </Button>
          <DatePicker onChange={onMonthChange} picker="month" />
        </div>

        <Button
          type="primary"
          onClick={() => setIsAppointmentDrawerOpen(true)}
          hidden={loggedInUserDetails?.userRole == RoleEnum.doctor}
        >
          New Appointment
        </Button>

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
      </section>
      <Table
        className="mx-4 "
        columns={columns}
        dataSource={filteredList}
        bordered
        scroll={{ x: true }}
        pagination={{ pageSize: 8 }}
      />
    </div>
  );
};

export default ListView;
