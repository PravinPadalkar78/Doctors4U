import { Button, DatePicker, Divider, Select, type DatePickerProps } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useDoctorDetails } from "../hooks/useDoctorDetails";
type StepTwoContentPropType = {
  selectedDate: Dayjs;
  setSelectedDate: React.Dispatch<React.SetStateAction<Dayjs>>;
  selectedSlot: string | undefined;
  setSelectedSlot: React.Dispatch<React.SetStateAction<string | undefined>>;
  selectedDoctorId: string;
  setSelectedDoctorId: React.Dispatch<React.SetStateAction<string>>;
};
const StepTwoContent = ({
  selectedDate,
  setSelectedDate,
  selectedSlot,
  setSelectedSlot,
  selectedDoctorId,
  setSelectedDoctorId,
}: StepTwoContentPropType) => {
  const { doctorsWeeklyScheduleList, doctersDetails, bookedSlotsDetails } = useDoctorDetails();
  const doctorsWeeklySchedule = doctorsWeeklyScheduleList.find((item) => item.doctorId == "1")!.doctorWeeklySchedule;
  const [slotArray, setSlotArray] = useState<React.ReactNode[]>();
  const onDateChange: DatePickerProps["onChange"] = (date) => {
    setSelectedDate(date);
  };
  const disablePastDates = (current: Dayjs) => {
    return current < dayjs().startOf("day");
  };
  const calculateAvailableSlots = (): string[] => {
    //match selected Date's week with the doctorScheduledWeek
    const weekData = doctorsWeeklySchedule.find(
      (weekData) => weekData.dayOfWeek.toLowerCase() == selectedDate.format("ddd").toLowerCase()
    );
    const isAvailable = weekData?.isAvailable;
    const slotStartTime = weekData?.slotStartTime;
    const slotEndTime = weekData?.slotEndTime;
    const slotDuration = doctersDetails.find((doctor) => doctor.doctorId == "1")?.slotDuration || "thirty";

    const BookedSlots: string[] =
      bookedSlotsDetails.find((item) => selectedDate?.isSame(dayjs(item.date), "date"))?.bookedSlots || [];
    //calculate total slots

    const TotalSlots: string[] = [];
    const start = dayjs(slotStartTime);
    const end = dayjs(slotEndTime);
    if (slotDuration == "thirty") {
      for (let current = start; current.isBefore(end) && isAvailable; current = current.add(30, "minute")) {
        TotalSlots.push(current.toISOString());
      }
    } else {
      for (let current = start; current.isBefore(end) && isAvailable; current = current.add(1, "hour")) {
        TotalSlots.push(current.toISOString());
      }
    }
    const formattedBookedSlots = BookedSlots.map((item) => dayjs(item).format("hh:mm:A"));
    // console.log(TotalSlots, "\n", BookedSlots);
    return TotalSlots.filter((slot) => !formattedBookedSlots.includes(dayjs(slot).format("hh:mm:A")));
  };

  useEffect(() => {
    const AvailableSlots: string[] = calculateAvailableSlots();
    setSlotArray(AvailableSlots);
  }, [selectedDate, doctersDetails, bookedSlotsDetails]);

  return (
    <>
      <div className="mb-6">
        <h1 className="text-base font-bold">
          Selected Doctor :
          {(() => {
            const doctor = doctersDetails.find((d) => d.doctorId === selectedDoctorId);
            return doctor ? `${doctor.doctorFirstName} ${doctor.doctorLastName}` : "Not found";
          })()}
        </h1>
        <Select
          showSearch
          className="w-full my-2"
          placeholder="Search to Select"
          value={selectedDoctorId}
          optionFilterProp="label"
          onChange={(e) => setSelectedDoctorId(e)}
          filterSort={(optionA, optionB) =>
            (optionA?.label ?? "").toLowerCase().localeCompare((optionB?.label ?? "").toLowerCase())
          }
          options={doctersDetails.map((doctor) => ({
            label: doctor.doctorFirstName + " " + doctor.doctorLastName,
            value: doctor.doctorId,
          }))}
        />
      </div>
      <Divider />
      <div className="flex gap-2 items-center justify-between mb-4">
        <h1 className="text-lg ">Pick A Slot</h1>
        <div className="flex items-center gap-2">
          <label className="text-sm" htmlFor="selectDate">
            Select Date:
          </label>
          <DatePicker
            id="selectDate"
            allowClear={false}
            defaultOpen
            disabledDate={disablePastDates}
            onChange={onDateChange}
          />
        </div>
      </div>
      <Divider />
      {slotArray?.length === 0 ? (
        <div className="text-center font-bold">No Available Slot</div>
      ) : (
        <div>
          <h1 className=" font-bold mb-4">Available Slots for Date: {selectedDate.format("DD/MM/YYYY")}</h1>
          <div className="flex gap-4 mt-4 flex-wrap">
            {slotArray?.map((slot, i) => (
              <Button key={i} onClick={() => setSelectedSlot(dayjs(slot as string).format("hh:mm:A"))}>
                {dayjs(slot as string).format("hh:mm:A")}
              </Button>
            ))}
          </div>

          {selectedSlot && (
            <div>
              <Divider />
              <p className="font-bold">{`Selected Slot : ${selectedSlot} / ${selectedDate.format("Do MMM YYYY")}`}</p>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default StepTwoContent;
