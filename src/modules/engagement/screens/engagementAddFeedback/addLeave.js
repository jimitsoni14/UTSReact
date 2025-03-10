import { Radio, Select, Skeleton, message } from "antd";
import { InputType, GoogleDriveCredentials } from "constants/application";
import HRInputField from "modules/hiring request/components/hrInputFields/hrInputFields";
import React, { useCallback, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import allengagementAddFeedbackStyles from "../engagementBillAndPayRate/engagementBillRate.module.css";

import "react-datepicker/dist/react-datepicker.css";

import moment from "moment";
import { amDashboardDAO } from "core/amdashboard/amDashboardDAO";
import HRSelectField from "modules/hiring request/components/hrSelectField/hrSelectField";

const AddLeaveModal = ({
  editLeaveData,
  talentID,
  getcalendarLeaveDetails,
  getFeedbackFormContent,
  getOnboardFormDetails,
  onCancel,
  register,
  setValue,
  watch,
  reset,
  errors,
  leaveTypes
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [startDateRadio, setStartDateRadio] = useState("Full Day");
  const [endDate, setEndDate] = useState(null);
  const [controlledLeaveType, setControlledLeaveType] = useState('')
  const [formError, SetFormError] = useState(false);

  useEffect(() => {
    if (editLeaveData?.leaveID) {
      setValue("comment", editLeaveData?.leaveReason);
      setValue('leaveType', editLeaveData?.leaveTypeID)
      setControlledLeaveType(editLeaveData?.leaveType)
      setStartDateRadio(editLeaveData?.leaveDuration)
      let dates = editLeaveData?.leaveDate.split("/");
      setStartDate(new Date(dates[0]));
      // setStartDate(moment(dates[0]).format() )
      dates[1] ? setEndDate(new Date(dates[1])) : setEndDate(new Date(dates[0])) ;
    }
  }, [editLeaveData]);

  const submitLeaveReqHandler = async () => {
    setIsLoading(true);
    let isformvalid = true;

    if (startDate === null) {
      isformvalid = false;
    }

    if (startDate !== null && endDate === null) {
      isformvalid = false;
    }

    if (watch("comment") === "" || watch("comment") === undefined || watch('leaveType')=== "" || watch("leaveType") === undefined) {
      isformvalid = false;
    }

    if (isformvalid) {
      let payload = {
        leaveID: editLeaveData?.leaveID ?? "",
        talentID: talentID,
        leaveDate: moment(startDate).format(),
        leaveEndDate: moment(endDate).format(),
        leaveTypeID: watch('leaveType'),
        leaveDuration:
          moment(startDate).format("yyyy-MM-DD") !==
          moment(endDate).format("yyyy-MM-DD")
            ? "Full Day"
            : startDateRadio,
        leaveReason: watch("comment"),
        noOfDays:
          moment(startDate).format("yyyy-MM-DD") ===
          moment(endDate).format("yyyy-MM-DD")
            ? 1
            : (new Date(moment(endDate).format("yyyy-MM-DD")) - new Date(moment(startDate).format("yyyy-MM-DD"))) / (1000 * 60 * 60 * 24) + 1,
        companyId:getOnboardFormDetails.onboardContractDetails.companyID
      };
      let result = await amDashboardDAO.updateLeaveRequestDAO(payload);
      setIsLoading(false);
      if(result.statusCode === 200){
         getcalendarLeaveDetails(talentID);
          reset();
          onCancel();
      }
     

    } else {
      SetFormError(true);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    setValue("feedBackDate", new Date());
  }, [getFeedbackFormContent]);

  const isWeekday = (date) => {
    const day = date.getDay(); // Get the day of the week (0 = Sunday, 6 = Saturday)
    return day !== 0 && day !== 6; // Return true for weekdays (Monday to Friday)
  };

  return (
    <div className={allengagementAddFeedbackStyles.engagementModalWrap}>
      <div
        className={`${allengagementAddFeedbackStyles.headingContainer} ${allengagementAddFeedbackStyles.addFeebackContainer}`}
      >
        <h1>{editLeaveData?.leaveID ? "Edit" : "Apply"} Leave</h1>
      </div>
      {isLoading ? (
        <Skeleton />
      ) : (
        <div>
          <div
            className={allengagementAddFeedbackStyles.row}
            style={{ marginBottom: "10px" }}
          >
            <div className={allengagementAddFeedbackStyles.colMd6}>
              <div className={`form-group`}>
                <label>
                  From Date{" "}
                  <span className={allengagementAddFeedbackStyles.labelReq}>
                    *
                  </span>
                </label>
                <div
                  className={allengagementAddFeedbackStyles.calendarFilter}
                  style={{ marginBottom: "5px" }}
                >
                  <DatePicker
                    style={{ backgroundColor: "red" }}
                    onKeyDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    className={allengagementAddFeedbackStyles.dateFilter}
                    placeholderText="From date"
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    startDate={startDate}
                    // minDate={new Date()}
                    // filterDate={isWeekday}
                    //   endDate={endDate}
                    //   selectsRange
                  />
                </div>

                {formError && startDate === null && (
                  <span className={allengagementAddFeedbackStyles.error}>
                    please select
                  </span>
                )}
              </div>
            </div>
            <div className={allengagementAddFeedbackStyles.colMd6}>
              <div className={`form-group`}>
                <label>
                  To Date{" "}
                  <span className={allengagementAddFeedbackStyles.labelReq}>
                    *
                  </span>
                </label>
                <div
                  className={allengagementAddFeedbackStyles.calendarFilter}
                  style={{ marginBottom: "5px" }}
                >
                  <DatePicker
                    style={{ backgroundColor: "red" }}
                    onKeyDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    className={allengagementAddFeedbackStyles.dateFilter}
                    placeholderText="To date"
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    startDate={endDate}
                    minDate={startDate}
                    // filterDate={isWeekday}
                    //   endDate={endDate}
                    //   selectsRange
                  />
                </div>
                {formError && endDate === null && (
                  <span className={allengagementAddFeedbackStyles.error}>
                    please select
                  </span>
                )}
              </div>
            </div>
          </div>

         
              {startDate ? (
                moment(startDate).format("DD-MM-yyyy") ===
                moment(endDate).format("DD-MM-yyyy") ? ( <div className={allengagementAddFeedbackStyles.row} style={{marginBottom:'10px'}}>
            <div className={allengagementAddFeedbackStyles.colMd12}>
                  <Radio.Group
                    onChange={(e) => {
                      setStartDateRadio(e.target.value);
                      //  setEngagementType(e.target.value);
                    }}
                    value={startDateRadio}
                  >
                    <Radio value={"Full Day"}>Full Day</Radio>
                    <Radio value={"Half Day"}>Half Day</Radio>
                  </Radio.Group>
                   </div>
          </div>
                ) : null
              ) : null}
           
           <div  className={allengagementAddFeedbackStyles.row}
            >  
            <div className={allengagementAddFeedbackStyles.colMd12}>
            <HRSelectField 
            isControlled={true}
            controlledValue={controlledLeaveType}
            setControlledValue={setControlledLeaveType} 
            mode={'id'}
            setValue={setValue}
            register={register}
            name="leaveType"
            label="Leave Type"
            defaultValue="Select"
            compStyles={{marginBottom:'10px'}}
            options={leaveTypes.map(itm=> ({id:itm.id, value:itm.leaveType}))}
            />
           {formError && !watch("leaveType") && (
                <span className={allengagementAddFeedbackStyles.error}>
                  please select leave type
                </span>
              )}
             </div>
            </div>

          <div
            className={allengagementAddFeedbackStyles.row}
            style={{ marginBottom: "10px",marginTop:'10px' }}
          >
            <div className={allengagementAddFeedbackStyles.colMd12}>
              <HRInputField
                label={"Comments"}
                register={register}
                name={"comment"}
                type={InputType.TEXT}
                placeholder="Enter Note/Comment"
                isTextArea
                rows={5}
                required
                validationSchema={{
                  required: "please enter Comments.",
                }}
                isError={errors["comment"] && errors["comment"]}
                errorMsg="Please Enter comments."
              />
              {formError && !watch("comment") && (
                <span className={allengagementAddFeedbackStyles.error}>
                  please enter comment
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      <div
        className={allengagementAddFeedbackStyles.formPanelAction}
        style={{ marginTop: "20px" }}
      >
        <button
          // disabled={isLoading}
          type="submit"
          onClick={submitLeaveReqHandler}
          className={allengagementAddFeedbackStyles.btnPrimary}
          disabled={isLoading}
        >
          Save
        </button>
        <button
          onClick={() => {
            onCancel();
            reset();
          }}
          className={allengagementAddFeedbackStyles.btn}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddLeaveModal;
