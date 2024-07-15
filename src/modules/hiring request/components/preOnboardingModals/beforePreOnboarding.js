import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Skeleton,
  Tooltip,
  Modal,
  Checkbox,
  DatePicker,
  Radio,
  message,
  TimePicker,
} from "antd";
import HRDetailStyle from "../../screens/hrdetail/hrdetail.module.css";
import HRSelectField from "modules/hiring request/components/hrSelectField/hrSelectField";
import HRInputField from "modules/hiring request/components/hrInputFields/hrInputFields";
import { Controller, useForm } from "react-hook-form";
import {
  HRDeleteType,
  HiringRequestHRStatus,
  InputType,
} from "constants/application";
import { OnboardDAO } from "core/onboard/onboardDAO";
import { MasterDAO } from "core/master/masterDAO";
import { HTTPStatusCode } from "constants/network";
import "react-datepicker/dist/react-datepicker.css";
import { NetworkInfo } from "constants/network";

import { ReactComponent as GeneralInformationSVG } from "assets/svg/generalInformation.svg";
import { ReactComponent as DownloadJDSVG } from "assets/svg/downloadJD.svg";
import { ReactComponent as HireingRequestDetailSVG } from "assets/svg/HireingRequestDetail.svg";
import { ReactComponent as CurrentHrsSVG } from "assets/svg/CurrentHrs.svg";
import { ReactComponent as TelentDetailSVG } from "assets/svg/TelentDetail.svg";
import { ReactComponent as EditFieldSVG } from "assets/svg/EditField.svg";
import { ReactComponent as ClockIconSVG } from "assets/svg/clock-icon.svg";
import moment from "moment";
import { ReactComponent as CalenderSVG } from "assets/svg/calender.svg";
import { isNull } from "lodash";
import { _isNull } from "shared/utils/basic_utils";
import dayjs from "dayjs";
import { ReactComponent as UploadSVG } from "assets/svg/upload.svg";
import { ReactComponent as CloseSVG } from "assets/svg/close.svg";
import UploadModal from "shared/components/uploadModal/uploadModal";
import { ReactComponent as ClientTeamMemberSVG } from 'assets/svg/clientTeammember.svg';
import { ReactComponent as LinkedinClientSVG } from 'assets/svg/LinkedinClient.svg';
import { ReactComponent as AboutCompanySVG } from 'assets/svg/aboutCompany.svg';

export default function BeforePreOnboarding({
  talentDeteils,
  HRID,
  setShowAMModal,
  callAPI,
  EnableNextTab,
  actionType,
  setMessage,
}) {
  const {
    watch,
    register,
    setValue,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({});
  const {
		watch : memberWatch,
		register:memberregister,
		setValue:memberSetValue,
		handleSubmit:memberHandleSubmit,
        unregister: memberUnregister,
		control: memberControl,
		formState: { errors : memberErrors},
	} = useForm({});
  const uploadFile = useRef(null);
  const [editNetTerm, setEditNetTerm] = useState(false);
  const [editPayRate, setEditPayRate] = useState(false);
  const [editBillRate, setEditBillRate] = useState(false);
  const [editAcceptHR, setEditAcceptHR] = useState(false);
  const [editMOF, setEditMOF] = useState(false);
  const [editCity, setEditCity] = useState(false);
  const [editState, setEditSate] = useState(false);
  const [editDesignation, setEditDesignation] = useState(false);
  const [editNR, setEditNR] = useState(false);
  const [addMoreTeamMember, setAddMoreTeamMember] = useState(false)
  const [clientTeamMembers, setClientTeamMembers] = useState([])
  const [controlledReportingTo, setControlledReportingTo] = useState('Please Select');

  const [preONBoardingData, setPreONBoardingData] = useState({});
  const [
    preOnboardingDetailsForAMAssignment,
    setPreOnboardingDetailsForAMAssignment,
  ] = useState({});
  const [dealSource, setDealSource] = useState([]);
  const [dealOwner, setDealowner] = useState([]);
  const [netTerms, setNetTerms] = useState([]);
  const [currentHRs, setCurrentHRs] = useState([]);
  const [hrAcceptedBys, setHrAcceptedBys] = useState([]);
  const [workManagement, setWorkManagement] = useState("");

  const [controlledDealOwner, setControlledDealOwner] = useState();
  const [controlledDealSource, setControlledDealSource] = useState();
  const [controlledEngRep, setControlledEngRep] = useState();

  const [isLoading, setIsLoading] = useState(false);
  const [isTabDisabled, setTabDisabled] = useState(false);
  const [isTransparentPricing, setIsTransparentPricing] = useState(false);
  const [engagementReplacement, setEngagementReplacement] = useState({
    replacementData: false,
  });
  const [addLatter, setAddLetter] = useState(false);
  const [replacementEngHr, setReplacementEngHr] = useState([]);
  const loggedInUserID = JSON.parse(
    localStorage.getItem("userSessionInfo")
  ).LoggedInUserTypeID;

  const [getStartEndTimes, setStaryEndTimes] = useState([]);
  const [controlledFromTimeValue, setControlledFromTimeValue] =
    useState("Select From Time");
  const [controlledEndTimeValue, setControlledEndTimeValue] =
    useState("Select End Time");
  const [controlledDevicePolicy, setControlledDevicePolicy] =
    useState("Please Select");
  const devicePolices = [
    { id: 1, value: "Talent to bring his own devices" },
    { id: 2, value: "Client to buy a device and Uplers to Facilitate" },
    {
      id: 3,
      value:
        " Client can use remote desktop security option facilitated by Uplers (At additional cost of $100 per month)",
    },
    { id: 4, value: "Add This Later" },
  ];
  const watchDevicePolicy = watch("devicePolicy");
  const [controlledDeviceType, setControlledDeviceType] =
    useState("Please Select");
  const [deviceMasters, setDeviceMasters] = useState([]);
  const [controlledLeavePolicy, setControlledLeavePolicy] =
    useState("Please Select");
  const leavePolices = [
    { id: 1, value: "Proceed with Uplers Policies" },
    { id: 2, value: "Upload Your Policies" },
  ];
  const [uplersLeavePolicyLink, setUplersLeavePolicyLink] = useState("");
  const [getUploadFileData, setUploadFileData] = useState("");
  const [showUploadModal, setUploadModal] = useState(false);
  const [getValidation, setValidation] = useState({
    systemFileUpload: "",
    googleDriveFileUpload: "",
    linkValidation: "",
  });
  const [amUsers,setAMUsers] = useState([]);
  const [workingMode, setWorkingMode] = useState([]);
  const [stateList,setStateList] = useState([]);
  const [reportingTo, setReportingTo] = useState([]);
  const [controlledBuddy, setControlledBuddy] = useState('Please Select');
  const [buddy, setBuddy] = useState([]);

  const getStartEndTimeHandler = useCallback(async () => {
    const durationTypes = await MasterDAO.getStartEndTimeDAO();
    setStaryEndTimes(durationTypes && durationTypes?.responseBody);
  }, []);

  useEffect(() => {
    getStartEndTimeHandler();
    getAMusersData();
    getWorkingMode();
    getStateData();
    getReportingToHandler();
    getBuddyHandler();
  }, []);

  const getAMusersData = async () =>{
    const res = await OnboardDAO.getAMUsersDAO();
    setAMUsers(res?.responseBody?.details?.map(item=>({
      id:item?.id,
      value:item?.value
    })))
  }

  const getReportingToHandler = useCallback(async () => {
    const response = await MasterDAO.getYesNoOptionRequestDAO();
    setReportingTo(response && response?.responseBody?.details);
}, []);
const getBuddyHandler = useCallback(async () => {
    const response = await MasterDAO.getBuddyRequestDAO();
    setBuddy(response && response?.responseBody?.details);
}, []);

  const getStateData = async () =>{
    const res = await OnboardDAO.getStateListDAO();
    setStateList(res?.responseBody?.details?.map(item=>({
      id:item?.id,
      value:item?.value
    })))
  }

  const getWorkingMode = useCallback(async () => {
    const workingModeResponse = await MasterDAO.getModeOfWorkDAO();
    setWorkingMode(
      workingModeResponse && workingModeResponse?.responseBody?.details
    );
  }, []);

  function convertToValidDate(timeString, currentDate = new Date()) {
    // Step 1: Parse the time string into separate components
    const [time, period] = timeString.split(" ");
    const [hourString, minuteString] = time.split(":");

    // Step 2: Convert the hour to 24-hour format if it's in PM
    let hour = parseInt(hourString, 10);
    if (period === "PM" && hour < 12) {
      hour += 12;
    }

    // Step 3: Set the time components to the current date
    currentDate.setHours(hour);
    currentDate.setMinutes(parseInt(minuteString, 10));

    // Step 4: Format the resulting Date object as a valid date string
    // const formattedDate = currentDate.toLocaleString([], {
    //   year: "numeric",
    //   month: "2-digit",
    //   day: "2-digit",
    //   hour: "2-digit",
    //   minute: "2-digit",
    // });
    // const formattedDate = currentDate.toLocaleString();
    // return formattedDate;
    return currentDate;
  }

  function extractNumberFromString(inputString) {
    // const regex = /\d+/;
    const match = inputString.match(/\d+\.\d+/);
    // const match = inputString.match(regex);
    if (match && match.length > 0) {
      // const number = parseInt(match[0], 10);
      const extractedNumber = parseFloat(match[0]);
      // return number;
      return extractedNumber;
    }
    return null;
  }

  const fatchpreOnBoardInfo = useCallback(
    async (req) => {
      let result = await OnboardDAO.getBeforeOnBoardInfoDAO(req);
      if (result?.statusCode === HTTPStatusCode.OK) {
        setReplacementEngHr(result.responseBody.details?.replacementEngAndHR);
        setIsTransparentPricing(
          result.responseBody.details?.isTransparentPricing
        );
        setTabDisabled(result.responseBody.details?.isFirstTabReadOnly);
        setPreONBoardingData(result.responseBody.details);
        setPreOnboardingDetailsForAMAssignment(
          result.responseBody.details?.preOnboardingDetailsForAMAssignment
        );
        setEngagementReplacement({
          ...engagementReplacement,
          replacementData:
            result.responseBody.details.replacementDetail !== null
              ? true
              : false,
        });
        setWorkManagement(
          result.responseBody.details.preOnboardingDetailsForAMAssignment
            ?.workForceManagement
        );
        setNetTerms(result.responseBody.details?.drpNetPaymentDays);
        setCurrentHRs(result.responseBody.details?.currentHRs);

        setValue(
          "netTerm",
          result.responseBody.details?.preOnboardingDetailsForAMAssignment
            ?.payementNetTerm
        );
        setValue(
          "payRate",
          result.responseBody.details?.preOnboardingDetailsForAMAssignment
            ?.talentCost
        );
        setValue(
          "billRate",
          result.responseBody.details?.preOnboardingDetailsForAMAssignment
            ?.finalHrCost
        );
        setValue(
          "hrAcceptedBy",
          result.responseBody.details?.preOnboardingDetailsForAMAssignment
            ?.utS_HRAcceptedBy
        );
        setValue(
          "lwd",
          dayjs(
            result.responseBody.details?.replacementDetail?.lastWorkingDay
          ).toDate()
        );
        setValue(
          "modeOfWorking",
            result.responseBody.details?.replacementDetail?.modeOfWork
        );
        setValue(
          "city",
            result.responseBody.details?.replacementDetail?.cityName
        );
        setValue(
          "state",
            result.responseBody.details?.replacementDetail?.stateID
        );
        setValue(
          "designation",
            result.responseBody.details?.replacementDetail?.talent_Designation
        );
        setValue('aboutCompany',result?.responseBody?.details.secondTabAMAssignmentOnBoardingDetails.company_Description)
        setValue('firstWeek',result?.responseBody?.details.secondTabAMAssignmentOnBoardingDetails.talent_FirstWeek)
        setValue('firstMonth',result?.responseBody?.details.secondTabAMAssignmentOnBoardingDetails.talent_FirstMonth)
        setValue('softwareToolsRequired',result?.responseBody?.details.secondTabAMAssignmentOnBoardingDetails.softwareToolsRequired)
        setValue('exitPolicy',result?.responseBody?.details.exit_Policy)
        setValue('feedbackProcess', result?.responseBody?.details.feedback_Process)
        setValue('policyLink',result?.responseBody?.details?.secondTabAMAssignmentOnBoardingDetails.proceedWithClient_LeavePolicyLink)
        setDeviceMasters(result?.responseBody?.details?.deviceMaster)
        setClientTeamMembers(result?.responseBody?.details?.onBoardClientTeam)
        let preOnboardDetail =
          result.responseBody.details?.preOnboardingDetailsForAMAssignment;

        preOnboardDetail?.dpAmount &&
          setValue("dpAmount", preOnboardDetail?.dpAmount);
        preOnboardDetail?.currentCTC &&
          setValue("currentCTC", preOnboardDetail?.currentCTC);
        preOnboardDetail?.nrPercentage &&
          setValue("nrPercent", preOnboardDetail?.nrPercentage);

        let { drpLeadTypes, drpLeadUsers } = result.responseBody.details;
        setDealowner(
          drpLeadUsers
            .filter((item) => item.value !== "0")
            .map((item) => ({ ...item, text: item.value, value: item.text }))
        );
        setDealSource(drpLeadTypes);
        let dealOwnerOBJ = drpLeadUsers
          ?.filter(
            (item) =>
              item.text ===
              result.responseBody.details.preOnboardingDetailsForAMAssignment
                .deal_Owner
          )
          .map((item) => ({ ...item, text: item.value, value: item.text }));
        let dealSourceObj = drpLeadTypes.filter(
          (item) =>
            item.value ===
            result.responseBody.details.preOnboardingDetailsForAMAssignment
              .dealSource
        );

        if (dealOwnerOBJ.length) {
          setControlledDealOwner(dealOwnerOBJ[0].value);
          setValue("dealOwner", dealOwnerOBJ[0]);
        }
        if (dealSourceObj.length) {
          setControlledDealSource(dealSourceObj[0].value);
          setValue("dealSource", dealSourceObj[0]);
        }
        const _filterData =
          result.responseBody.details.replacementEngAndHR?.filter(
            (e) =>
              e.id === result.responseBody.details.replacementDetail.newHrid ||
              result.responseBody.details.replacementDetail.newOnBoardId
          );
        setControlledEngRep(_filterData[0]?.value);
        setValue("engagementreplacement", _filterData[0]);
      }
    },
    [setValue]
  );

  useEffect(() => {
    if (
      preONBoardingData?.preOnboardingDetailsForAMAssignment?.shiftStartTime
    ) {
      const findFromTime = getStartEndTimes.filter(
        (item) =>
          item?.value ===
          preONBoardingData?.preOnboardingDetailsForAMAssignment.shiftStartTime
      );
      const findEndTime = getStartEndTimes.filter(
        (item) =>
          item?.value ===
          preONBoardingData?.preOnboardingDetailsForAMAssignment?.shiftEndTime
      );
      setValue("shiftStartTime", findFromTime[0]);
      setControlledFromTimeValue(findFromTime[0]?.value);
      setValue("shiftEndTime", findEndTime[0]);
      setControlledEndTimeValue(findEndTime[0]?.value);
      // setControlledDurationTypeValue(findDurationMode[0]?.value);
    }
  }, [preONBoardingData, getStartEndTimes, setValue]);

  useEffect(() => {
    if (talentDeteils?.OnBoardId) {
      let req = {
        OnboardID: talentDeteils?.OnBoardId,
        HRID: HRID,
        // actionName: actionType ? actionType : "GotoOnboard",
      };
      fatchpreOnBoardInfo(req);
    }
  }, [talentDeteils, HRID, fatchpreOnBoardInfo]);

  const watchDealSource = watch("dealSource");

  const getLeadOwnerBytype = async (type) => {
    let result = await MasterDAO.getLeadTypeDAO(
      type,
      preOnboardingDetailsForAMAssignment.hR_ID
    );
    // console.log("fatchpreOnBoardInfo", result.responseBody.details);

    if (result?.statusCode === HTTPStatusCode.OK) {
      setDealowner(
        result.responseBody.details.Data.LeadTypeList.filter(
          (item) => item.value !== "0"
        ).map((item) => ({ ...item, text: item.value, value: item.text }))
      );
    }
  };

  useEffect(() => {
    if (watchDealSource?.value) {
      getLeadOwnerBytype(watchDealSource.value);
    }
  }, [watchDealSource, setValue]);

  useEffect(() => {
    //     BR (Client Pay ) = select 2200 * 100 /(100-35) : Nontranspernt Modell
    //     BR (Client Pay ) = select 2200 *( 100+35) /100 : Transpernt Model
    let billRate = (watch("payRate") * 100) / (100 - watch("nrPercent"));
    if (isTransparentPricing) {
      billRate = (+watch("payRate") * (100 + +watch("nrPercent"))) / 100;
    }

    billRate && setValue("billRate", billRate.toFixed(2));
  }, [
    watch("payRate"),
    preOnboardingDetailsForAMAssignment,
    watch("nrPercent"),
  ]);

  const saveMember = (d) =>{
    // console.log("member data", d, watch('reportingTo'), watch('memberBuddy'))
    let newMember = {
    "name": d.memberName,
    "designation": d.memberDesignation,
    "reportingTo": watch('reportingTo')? watch('reportingTo').value : '',
    "linkedin": d.linkedinLink,
    "email": d.memberEmail,
    "buddy": watch('memberBuddy') ? watch('memberBuddy').value : ''
  }

  setAddMoreTeamMember(false)
  setClientTeamMembers(prev=> ([...prev, newMember]))
  memberUnregister('reportingTo')
  memberUnregister('memberName')
  memberUnregister('memberEmail')
  memberUnregister('memberDesignation')
  memberUnregister('memberBuddy')
  memberUnregister('linkedinLink')

}

const calcelMember = () =>{
  setAddMoreTeamMember(false)
  memberUnregister('reportingTo')
  memberUnregister('memberName')
  memberUnregister('memberEmail')
  memberUnregister('memberDesignation')
  memberUnregister('memberBuddy')
  memberUnregister('linkedinLink')
}

  // const handleComplete = useCallback(
  //   async (d) => {
  //     setIsLoading(true);
  //     let payload = {
  //       hR_ID: HRID,
  //       companyID: preOnboardingDetailsForAMAssignment?.companyID,
  //       deal_Owner: d?.dealOwner?.value, //Update
  //       deal_Source: d?.dealSource?.value, //Update
  //       onboard_ID: talentDeteils?.OnBoardId,
  //       engagemenID: preOnboardingDetailsForAMAssignment?.engagemenID,
  //       assignAM: preONBoardingData.assignAM, // when clicked from AMAssignment button pass this as true, you will get this value from 1st API’s response.
  //       talentID: talentDeteils?.TalentID,
  //       talentShiftStartTime: d.shiftStartTime?.value, //Update
  //       talentShiftEndTime: d.shiftEndTime?.value, //Update
  //       payRate: preOnboardingDetailsForAMAssignment?.isHRTypeDP
  //         ? 0
  //         : parseFloat(d.payRate), // pass as null if DP HR  // send numeric value //Update
  //       // billRate: preOnboardingDetailsForAMAssignment?.isHRTypeDP
  //       //   ? null
  //       //   : `${preOnboardingDetailsForAMAssignment?.currencySign + extractNumberFromString(d.billRate)} ${preOnboardingDetailsForAMAssignment?.talent_CurrencyCode}` , // pass as null if DP HR  //send value with currency and symbol  //Update
  //       billRate: preOnboardingDetailsForAMAssignment?.isHRTypeDP
  //         ? null
  //         : parseFloat(d.billRate), //,
  //       netPaymentDays: parseInt(d.netTerm.value), //Update
  //       nrMargin: !preOnboardingDetailsForAMAssignment?.isHRTypeDP
  //         ? d.nrPercent
  //         : null,
  //       isReplacement: engagementReplacement?.replacementData,
  //       talentReplacement: {
  //         onboardId: talentDeteils?.OnBoardId,
  //         lastWorkingDay: addLatter === false ? d.lwd : "",
  //         replacementInitiatedby: loggedInUserID.toString(),
  //         engHRReplacement:
  //           addLatter === true || d.engagementreplacement === undefined
  //             ? ""
  //             : d.engagementreplacement.id,
  //       },
  //     };

  //     let result = await OnboardDAO.updateBeforeOnBoardInfoDAO(payload);
  //     if (result?.statusCode === HTTPStatusCode.OK) {
  //       if (result?.responseBody.details.IsAMAssigned) {
  //         EnableNextTab(talentDeteils, HRID, "During Pre-Onboarding");
  //       }

  //       // callAPI(HRID)
  //       setMessage(result?.responseBody.details);
  //       setIsLoading(false);
  //       setEditBillRate(false);
  //       setEditPayRate(false);
  //       setEditNetTerm(false);

  //       let req = {
  //         OnboardID: talentDeteils?.OnBoardId,
  //         HRID: HRID,
  //         // actionName: actionType ? actionType : "GotoOnboard",
  //       };
  //       fatchpreOnBoardInfo(req);
  //     }
  //     setIsLoading(false);
  //   },
  //   [
  //     talentDeteils,
  //     HRID,
  //     preONBoardingData,
  //     preOnboardingDetailsForAMAssignment,
  //     EnableNextTab,
  //     actionType,
  //     editPayRate,
  //     engagementReplacement?.replacementData,
  //     addLatter,
  //   ]
  // );

  const handleComplete = () =>{
    EnableNextTab(talentDeteils, HRID, "Legal");
  }
  const disabledDate = (current) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return current && current < today;
  };

  function isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (err) {
      return false;
    }
  }

  const uploadFileHandler = useCallback(
    async (fileData) => {
      setIsLoading(true);
      if (
        fileData?.type !== "application/pdf" &&
        fileData?.type !== "application/docs" &&
        fileData?.type !== "application/msword" &&
        fileData?.type !== "text/plain" &&
        fileData?.type !==
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        setValidation({
          ...getValidation,
          systemFileUpload:
            "Uploaded file is not a valid, Only pdf, docs, text and rtf files are allowed",
        });
        setIsLoading(false);
      } else if (fileData?.size >= 500000) {
        setValidation({
          ...getValidation,
          systemFileUpload:
            "Upload file size more than 500kb, Please Upload file upto 500kb",
        });
        setIsLoading(false);
      } else {
        let formData = new FormData();
        formData.append("File", fileData);
        let uploadFileResponse = await OnboardDAO.uploadPolicyDAO(
          formData,
          talentDeteils?.OnBoardId
        );
        if (uploadFileResponse.statusCode === 400) {
          setValidation({
            ...getValidation,
            systemFileUpload: uploadFileResponse?.responseBody,
          });
        }
        if (uploadFileResponse.statusCode === HTTPStatusCode.OK) {
          if (
            fileData?.type === "image/png" ||
            fileData?.type === "image/jpeg"
          ) {
            setUploadFileData(fileData?.name);
            setUploadModal(false);
            setValidation({
              ...getValidation,
              systemFileUpload: "",
            });
            message.success("File uploaded successfully");
          } else if (
            fileData?.type === "application/pdf" ||
            fileData?.type === "application/docs" ||
            fileData?.type === "application/msword" ||
            fileData?.type === "text/plain" ||
            fileData?.type ===
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          ) {
            setUploadFileData(fileData?.name);
            // setJDParsedSkills(
            //   uploadFileResponse && uploadFileResponse?.responseBody?.details
            // );
            // setJDDumpID(
            //                 uploadFileResponse &&
            //                     uploadFileResponse?.responseBody?.details?.JDDumpID,
            //             );
            setUploadModal(false);
            setValidation({
              ...getValidation,
              systemFileUpload: "",
            });
            message.success("File uploaded successfully");
          }
        }
        setIsLoading(false);
      }
      //   uploadFile.current.value = "";
    },
    [getValidation]
  );

  //  console.log("form error", errors);
  return (
    <div className={HRDetailStyle.onboardingProcesswrap}>
      <div className={HRDetailStyle.onboardingProcesspart}>
        {isLoading ? (
          <Skeleton />
        ) : (
          <>
            <div className={HRDetailStyle.onboardingProcesBox}>
              <div className={HRDetailStyle.onboardingProcessLeft}>
                <div>
                  <GeneralInformationSVG width="27" height="32" />
                </div>
                <h3 className={HRDetailStyle.titleLeft}>General Information</h3>
              </div>

              <div className={HRDetailStyle.onboardingProcessMid}>
                <div className={HRDetailStyle.onboardingDetailText}>
                  <span>Company Name</span>
                  <span className={HRDetailStyle.onboardingTextBold}>
                    {preOnboardingDetailsForAMAssignment?.companyName
                      ? preOnboardingDetailsForAMAssignment?.companyName
                      : "NA"}
                  </span>
                </div>
                <div className={HRDetailStyle.onboardingDetailText}>
                  <span>Client Email/Name</span>
                  <span className={HRDetailStyle.onboardingTextBold}>
                    {preOnboardingDetailsForAMAssignment?.client
                      ? preOnboardingDetailsForAMAssignment?.client
                      : "NA"}
                  </span>
                </div>
                <div className={HRDetailStyle.onboardingDetailText}>
                  <span>HR ID</span>
                  <a
                    target="_blank"
                    href={`/allhiringrequest/${HRID}`}
                    rel="noreferrer"
                    className={HRDetailStyle.onboardingTextUnderline}
                  >
                    {preOnboardingDetailsForAMAssignment?.hrNumber
                      ? preOnboardingDetailsForAMAssignment?.hrNumber
                      : "NA"}
                  </a>
                </div>
                {/* <div className={HRDetailStyle.onboardingDetailText}>
                  <span>Country</span>
                  <span className={HRDetailStyle.onboardingTextBold}>
                    {preOnboardingDetailsForAMAssignment?.geo
                      ? preOnboardingDetailsForAMAssignment?.geo
                      : "NA"}
                  </span>
                </div> */}
                <div className={HRDetailStyle.onboardingDetailText}>
                  <span>No. of Employees</span>
                  <span className={HRDetailStyle.onboardingTextBold}>
                    {preOnboardingDetailsForAMAssignment?.noOfEmployee
                      ? preOnboardingDetailsForAMAssignment?.noOfEmployee
                      : "NA"}
                  </span>
                </div>
                <div className={HRDetailStyle.onboardingDetailText}>
                  <span>Client POC Name</span>
                  <span className={HRDetailStyle.onboardingTextBold}>
                    {preOnboardingDetailsForAMAssignment?.client_POC_Name
                      ? preOnboardingDetailsForAMAssignment?.client_POC_Name
                      : "NA"}
                  </span>
                </div>
                <div className={HRDetailStyle.onboardingDetailText}>
                  <span>Client POC Email</span>
                  <span className={HRDetailStyle.onboardingTextBold}>
                    {preOnboardingDetailsForAMAssignment?.client_POC_Email
                      ? preOnboardingDetailsForAMAssignment?.client_POC_Email
                      : "NA"}
                  </span>
                </div>
                <div className={HRDetailStyle.onboardingDetailText}>
                  <span>Industry</span>
                  <span className={HRDetailStyle.onboardingTextBold}>
                    {preOnboardingDetailsForAMAssignment?.industry
                      ? preOnboardingDetailsForAMAssignment?.industry
                      : "NA"}
                  </span>
                </div>
                <div className={HRDetailStyle.onboardingDetailText}>
                  <span>Discovery Call Link</span>
                  { preONBoardingData?.preOnboardingDetailsForAMAssignment
                        ?.discovery_Link ?<a
                    target="_blank"
                    href={
                      preONBoardingData?.preOnboardingDetailsForAMAssignment
                        ?.discovery_Link
                    }
                    rel="noreferrer"
                    className={HRDetailStyle.onboardingTextUnderline}
                  >
                    {
                      preONBoardingData?.preOnboardingDetailsForAMAssignment
                        ?.discovery_Link
                    }
                  </a>:"NA"}
                </div>
                <div className={HRDetailStyle.onboardingDetailText}>
                  <span>Job Description</span>
                  {/* <button className={HRDetailStyle.onboardingDownload}><DownloadJDSVG/>Download JD</button> */}

                  {preOnboardingDetailsForAMAssignment?.jobDescription?.split(
                    ":"
                  )[0] === "http" ||
                  preOnboardingDetailsForAMAssignment?.jobDescription?.split(
                    ":"
                  )[0] === "https" ? (
                    <a
                      className={HRDetailStyle.onboardingDownload}
                      rel="noreferrer"
                      href={preOnboardingDetailsForAMAssignment?.jobDescription}
                      style={{ textDecoration: "underline" }}
                      target="_blank"
                    >
                      <DownloadJDSVG />
                      Download JD
                    </a>
                  ) : (
                    <a
                      className={HRDetailStyle.onboardingDownload}
                      rel="noreferrer"
                      href={
                        NetworkInfo.PROTOCOL +
                        NetworkInfo.DOMAIN +
                        "Media/JDParsing/JDfiles/" +
                        preOnboardingDetailsForAMAssignment?.jobDescription
                      }
                      style={{ textDecoration: "underline" }}
                      target="_blank"
                    >
                      <DownloadJDSVG />
                      Download JD
                    </a>
                  )}
                </div>
                {/* Hide deal source and owner */}
                {/* <div className={HRDetailStyle.modalFormWrapper}>
                  <div className={HRDetailStyle.modalFormCol}>
                    <HRSelectField
                    controlledValue={controlledDealSource}
                    setControlledValue={setControlledDealSource}
                    isControlled={true}
                      mode="id/value"
                      setValue={setValue}
                      register={register}
                      label={"Deal Source"}
                      extraAction={()=>{setValue('dealOwner','');
                      setControlledDealOwner()}}
                      defaultValue={"Select Deal Source"}
                      name="dealSource"
                      options={dealSource && dealSource}
                      isError={errors["dealSource"] && errors["dealSource"]}
                      required
                      errorMsg={"Please select Deal Source"}
                      disabled={isTabDisabled}
                    />
                  </div>
                  <div className={HRDetailStyle.modalFormCol}>
                    <HRSelectField
                     controlledValue={controlledDealOwner}
                     setControlledValue={setControlledDealOwner}
                     isControlled={true}
                      mode="id/value"
                      setValue={setValue}
                      register={register}
                      label={"Deal Owner"}
                      defaultValue={"Select Deal Owner"}
                      name="dealOwner"
                      options={dealOwner && dealOwner}
                      isError={errors["dealOwner"] && errors["dealOwner"]}
                      required
                      errorMsg={"Please select Deal Owner"}
                      disabled={isTabDisabled}
                    />
                  </div>
                </div> */}

                {/* <div className={HRDetailStyle.onboardingCondition}>
                    <h5>Is this an Existing Client?</h5>

                    <label className={HRDetailStyle.radioCheck_Mark}>
                        <p>Yes</p>
                        <input
                            // {...register('remote')}
                            value={0}
                            type="radio"
                            // checked={checkednoValue}
                            // onChange={(e) => {
                            // 	checkedNo(e);
                            // }}
                            id="remote"
                            name="remote"
                        />
                        <span className={HRDetailStyle.customCheck_Mark}></span>
                    </label>
                    <label className={HRDetailStyle.radioCheck_Mark}>
                        <p>No</p>
                        <input
                            // {...register('remote')}
                            value={0}
                            type="radio"
                            // checked={checkednoValue}
                            // onChange={(e) => {
                            // 	checkedNo(e);
                            // }}
                            id="remote"
                            name="remote"
                        />
                        <span className={HRDetailStyle.customCheck_Mark}></span>
                    </label>

                </div> */}
              </div>
            </div>

            <div className={HRDetailStyle.onboardingProcesBox}>
              <div className={HRDetailStyle.onboardingProcessLeft}>
                <div>
                  <CurrentHrsSVG width="27" height="32" />
                </div>
                <h3 className={HRDetailStyle.titleLeft}>AM Assignment</h3>
              </div>
              <div className={HRDetailStyle.onboardingProcessMid}>
                <div className={HRDetailStyle.modalFormWrapper}>
                  <div className={HRDetailStyle.onboardingCurrentText}>
                    <span>Do you want to assign an AM?</span>
                    <span>
                      <Radio.Group>
                        <Radio value={true}>Yes</Radio>
                        <Radio value={false}>No</Radio>
                      </Radio.Group>
                    </span>
                  </div>
                  <HRSelectField
                    // isControlled={true}
                    mode="id/value"
                    setValue={setValue}
                    register={register}
                    label={"Select AM"}
                    defaultValue={"Select AM"}
                    name="selectAM"
                    options={amUsers && amUsers}
                    isError={errors["selectAM"] && errors["selectAM"]}
                    required
                    errorMsg={"Please select AM"}
                  />

                  <div className={HRDetailStyle.onboardingCurrentText}>
                    <span>
                      Following HRs will be assigned to the selected AM
                    </span>
                  </div>
                  {currentHRs?.length > 0 ? (
                    currentHRs
                      ?.map((HR) => (
                        <div className={HRDetailStyle.modalFormCol}>
                          <div
                            className={HRDetailStyle.onboardingCurrentTextWrap}
                            key={HR.hrNumber}
                          >
                            <div
                              className={HRDetailStyle.onboardingCurrentText}
                            >
                              <span>Open HR ID :</span>
                              <a
                                target="_blank"
                                href={`/allhiringrequest/${HR.hrid}`}
                                rel="noreferrer"
                                className={
                                  HRDetailStyle.onboardingTextUnderline
                                }
                              >
                                {HR.hrNumber}
                              </a>
                            </div>
                            <div
                              className={HRDetailStyle.onboardingCurrentText}
                            >
                              <span>Open HR Status :</span>
                              <span
                                className={HRDetailStyle.onboardingTextBold}
                              >
                                {HR.hrStatus}
                              </span>
                            </div>
                            <div
                              className={HRDetailStyle.onboardingCurrentText}
                            >
                              <span>Open TR of HR :</span>
                              <span
                                className={HRDetailStyle.onboardingTextBold}
                              >
                                {HR.noofTalents}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                      .slice(0, 10)
                  ) : (
                    <h3 className={HRDetailStyle.titleLeft}>
                      No HR Found for Handover
                    </h3>
                  )}
                </div>
              </div>
            </div>

            <div className={HRDetailStyle.onboardingProcesBox}>
              <div className={HRDetailStyle.onboardingProcessLeft}>
                <div>
                  <HireingRequestDetailSVG width="27" height="32" />
                </div>
                <h3 className={HRDetailStyle.titleLeft}>Engagement Terms</h3>
              </div>
              <div className={HRDetailStyle.onboardingProcessMid}>
                <div className={HRDetailStyle.modalFormWrapper}>
                  <div className={HRDetailStyle.onboardingDetailText}>
                    <span>Talent Name</span>
                    <span className={HRDetailStyle.onboardingTextBold}>
                      {preOnboardingDetailsForAMAssignment?.talentName
                        ? preOnboardingDetailsForAMAssignment?.talentName
                        : "NA"}
                    </span>
                  </div>

                  <div className={HRDetailStyle.onboardingDetailText}>
                    <span>Talent Profile Link</span>
                    <span className={HRDetailStyle.onboardingTextBold}>
                      <a
                      target="_blank"
                      href={preOnboardingDetailsForAMAssignment?.talentProfileLink}
                      rel="noreferrer"
                      className={HRDetailStyle.onboardingTextUnderline}
                    >
                      {preOnboardingDetailsForAMAssignment?.talentProfileLink
                        ? preOnboardingDetailsForAMAssignment?.talentProfileLink
                        : "NA"}
                    </a>
                    </span>
                  </div>

                  <div className={HRDetailStyle.onboardingDetailText}>
                    <span>Availability</span>
                    <span className={HRDetailStyle.onboardingTextBold}>
                      {preOnboardingDetailsForAMAssignment?.availability
                        ? preOnboardingDetailsForAMAssignment?.availability
                        : "NA"}
                    </span>
                  </div>

                  <div className={HRDetailStyle.colMd6}>
                    <div className={HRDetailStyle.timeSlotItemField}>
                      <div className={HRDetailStyle.timeSlotLabel}>
                        Talent Shift Start Time <span>*</span>
                      </div>
                      <div className={`${HRDetailStyle.timeSlotItem} ${HRDetailStyle.formGroup}`}>
                        {/* <ClockIconSVG /> */}
                        <HRSelectField
                    controlledValue={controlledFromTimeValue}
                    setControlledValue={val=> {setControlledFromTimeValue(val);
                      let index = getStartEndTimes.findIndex(item=> item.value === val)
                      if(index >= getStartEndTimes.length -18){         
                          let newInd =   index - (getStartEndTimes.length -18)
                          let endtime = getStartEndTimes[newInd]
                          setControlledEndTimeValue(
                            endtime.value
                          );
                          setValue(
                            "endTime",{id: "", value: endtime.value}  
                          );
                      }else{
                          let endtime = getStartEndTimes[index + 18]
                          setControlledEndTimeValue(
                            endtime.value
                          );
                          setValue(
                            "endTime",{id: "", value: endtime.value}  
                          );
                      };
                    }}
                    isControlled={true}
                    mode={"id/value"}
                    setValue={setValue}
                    register={register}
                    searchable={true}
                    defaultValue="Select From Time"
                    options={getStartEndTimes.map((item) => ({
                      id: item.id,
                      label: item.text,
                      value: item.value,
                    }))}
                    name="shiftStartTime"
                    isError={errors["shiftStartTime"] && errors["shiftStartTime"]}
                    required={true}
                    disabled={isTabDisabled}
                    errorMsg={errors["shiftStartTime"] ? errors["shiftStartTime"].message.length > 0 ? errors["fromTime"].message : "Please select from time." : "Please select from time."}
                  />
                        {errors.shiftStartTime && (
                          <div className={HRDetailStyle.error}>
                            Please enter start time
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className={HRDetailStyle.colMd6}>
                    <div className={HRDetailStyle.timeSlotItemField}>
                      <div className={HRDetailStyle.timeSlotLabel}>
                        Talent Shift End Time <span>*</span>
                      </div>
                      <div className={`${HRDetailStyle.timeSlotItem} ${HRDetailStyle.formGroup}`}>
                        {/* <ClockIconSVG /> */}
                        <HRSelectField
                    controlledValue={controlledEndTimeValue}
                    setControlledValue={setControlledEndTimeValue}
                    isControlled={true}
                    mode={"id/value"}
                    setValue={setValue}
                    register={register}
                    searchable={true}
                    defaultValue="Select End Time"
                    options={getStartEndTimes.map((item) => ({
                      id: item.id,
                      label: item.text,
                      value: item.value,
                    }))}
                    disabled={isTabDisabled}
                    name="shiftEndTime"
                    isError={errors["shiftEndTime"] && errors["shiftEndTime"]}
                    required={true}
                    errorMsg={"Please select end time."}
                  />
                        {errors.shiftEndTime && (
                          <div className={HRDetailStyle.error}>
                            Please enter end time
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className={HRDetailStyle.modalFormCol}>
                    {editNetTerm ? (
                      <HRInputField
                      register={register}
                      errors={errors}
                      label="Payment Net Term"
                      name="netTerm"
                      type={InputType.TEXT}
                      placeholder="Payment Net Term"
                      validationSchema={{
                        required: "please select Payment Net Term.",
                        min: 1,
                      }}
                      isError={errors["netTerm"] && errors["netTerm"]}
                      errorMsg={"Please select Payment Net Term"}
                      required
                    />
                    ) : (
                      <HRInputField
                        register={register}
                        errors={errors}
                        label="Payment Net Term"
                        name="netTerm"
                        type={InputType.TEXT}
                        placeholder="Payment Net Term"
                        validationSchema={{
                          required: "please select Payment Net Term.",
                          min: 1,
                        }}
                        isError={errors["netTerm"] && errors["netTerm"]}
                        errorMsg={"Please select Payment Net Term"}
                        required
                        disabled
                        trailingIcon={
                          !isTabDisabled && (
                            <EditFieldSVG
                              width="16"
                              height="16"
                              onClick={() => setEditNetTerm(true)}
                            />
                          )
                        }
                      />
                    )}
                  </div>

                  <div className={HRDetailStyle.modalFormCol}>
                    {/* {preOnboardingDetailsForAMAssignment?.isHRTypeDP ? (
                      <HRInputField
                        register={register}
                        errors={errors}
                        // validationSchema={{
                        //   required: "please enter the Current CTC.",
                        // }}
                        // required
                        label="CurrentCTC"
                        name="currentCTC"
                        type={InputType.TEXT}
                        placeholder="USD 4000/Month"
                        // value={watch('billRate')}
                        disabled
                      />
                    ) : ( */}
                    <>
                      {editBillRate ? (
                        <HRInputField
                          register={register}
                          errors={errors}
                          validationSchema={{
                            required: "please enter the Bill Rate.",
                          }}
                          required
                          label="Bill Rate"
                          name="billRate"
                          type={InputType.NUMBER}
                          placeholder="USD 4000/Month"
                          // value={watch('billRate')}
                          leadingIcon={
                            preONBoardingData
                              ?.preOnboardingDetailsForAMAssignment
                              ?.currencySign
                          }
                          trailingIcon={
                            <EditFieldSVG
                              width="16"
                              height="16"
                              onClick={() => setEditBillRate(false)}
                            />
                          }
                        />
                      ) : (
                        <HRInputField
                          register={register}
                          errors={errors}
                          validationSchema={{
                            required: "please enter the Bill Rate.",
                          }}
                          required
                          label="Bill Rate"
                          name="billRate"
                          type={InputType.TEXT}
                          placeholder="USD 4000/Month"
                          // value={watch('billRate')}
                          leadingIcon={
                            preONBoardingData
                              ?.preOnboardingDetailsForAMAssignment
                              ?.currencySign
                          }
                          disabled
                          // trailingIcon={
                          //  !isTabDisabled && <EditFieldSVG
                          //     width="16"
                          //     height="16"
                          //     onClick={() => {
                          //       setEditBillRate(true);
                          //       setValue(
                          //         "billRate",
                          //         extractNumberFromString(watch("billRate"))
                          //       );
                          //     }}
                          //   />
                          // }
                          trailingIcon={
                            <div>{`${preONBoardingData?.preOnboardingDetailsForAMAssignment?.talent_CurrencyCode} / Month`}</div>
                          }
                        />
                      )}
                    </>
                    {/* )} */}
                  </div>

                  {/* {preOnboardingDetailsForAMAssignment?.isHRTypeDP ? (
                    <div className={HRDetailStyle.modalFormCol}>
                      <HRInputField
                        register={register}
                        errors={errors}
                        // validationSchema={{
                        //   required: "please enter the DP Amount.",
                        // }}
                        // required
                        label="DP amount"
                        name="dpAmount"
                        type={InputType.TEXT}
                        placeholder="USD 4000/Month"
                        disabled
                      />
                    </div>
                  ) : ( */}
                  <div className={HRDetailStyle.modalFormCol}>
                    {editPayRate ? (
                      <HRInputField
                        register={register}
                        errors={errors}
                        validationSchema={{
                          required: "please enter the Pay Rate.",
                          min: {
                            value: 0,
                            message: "Please enter greter then 0",
                          },
                        }}
                        label="Pay Rate"
                        required
                        name="payRate"
                        type={InputType.NUMBER}
                        placeholder="USD 4000/Month"
                        leadingIcon={
                          preONBoardingData?.preOnboardingDetailsForAMAssignment
                            ?.currencySign
                        }
                        // value="USD 4000/Month"
                        trailingIcon={
                          <div className={HRDetailStyle.infotextWrapper}>
                            {`${preONBoardingData?.preOnboardingDetailsForAMAssignment?.talent_CurrencyCode} / Month`}
                            <EditFieldSVG
                              width="16"
                              height="16"
                              onClick={() => {
                                setEditPayRate(false);
                                // console.log({nt:watch('netTerm') , num: extractNumberFromString(watch('netTerm'))});
                                // setValue('netTerm',extractNumberFromString(watch('netTerm')))
                              }}
                            />
                          </div>
                        }
                      />
                    ) : (
                      <HRInputField
                        register={register}
                        errors={errors}
                        validationSchema={{
                          required: "please enter the Pay Rate.",
                        }}
                        required
                        label="Pay Rate"
                        name="payRate"
                        type={InputType.TEXT}
                        placeholder="USD 4000/Month"
                        // value="USD 4000/Month"
                        disabled
                        leadingIcon={
                          preONBoardingData?.preOnboardingDetailsForAMAssignment
                            ?.currencySign
                        }
                        trailingIcon={
                          <div className={HRDetailStyle.infotextWrapper}>
                            {`${preONBoardingData?.preOnboardingDetailsForAMAssignment?.talent_CurrencyCode} / Month`}
                            {!isTabDisabled && (
                              <EditFieldSVG
                                width="16"
                                height="16"
                                onClick={() => {
                                  setEditPayRate(true);
                                  // setValue(
                                  //   "payRate",
                                  //   extractNumberFromString(watch("payRate"))
                                  // );
                                  // console.log(" extractNumberFromString(watch(payRate))", extractNumberFromString(watch("payRate")))
                                }}
                              />
                            )}
                          </div>
                        }
                      />
                    )}
                  </div>
                  {/* // )} */}

                  <div className={HRDetailStyle.onboardingDetailText}>
                    <span>Uplers Fees</span>
                    <span className={HRDetailStyle.onboardingTextBold}>
                      {/* {preOnboardingDetailsForAMAssignment?.talentRole
                        ? preOnboardingDetailsForAMAssignment?.talentRole
                        : "NA"} */}
                      35 %
                    </span>
                  </div>

                  <div className={HRDetailStyle.modalFormCol}>
                    {editMOF ? (
                      <HRSelectField
                        // isControlled={true}
                        mode="id/value"
                        setValue={setValue}
                        register={register}
                        label={"Mode of  Working"}
                        defaultValue={"Select Mode of  Working"}
                        name="modeOfWorking"
                        options={workingMode && workingMode}
                        isError={errors["modeOfWorking"] && errors["modeOfWorking"]}
                        required
                        errorMsg={"Please select Mode of  Working"}
                      />
                    ) : (
                      <HRInputField
                        register={register}
                        errors={errors}
                        label="Mode of  Working"
                        name="modeOfWorking"
                        type={InputType.TEXT}
                        placeholder="Mode of  Working"
                        validationSchema={{
                          required: "please select Mode of  Working.",
                          min: 1,
                        }}
                        isError={errors["modeOfWorking"] && errors["modeOfWorking"]}
                        errorMsg={"Please select Mode of  Working"}
                        required
                        disabled
                        trailingIcon={
                          !isTabDisabled && (
                            <EditFieldSVG
                              width="16"
                              height="16"
                              onClick={() => setEditMOF(true)}
                            />
                          )
                        }
                      />
                    )}
                  </div>

                  <div className={HRDetailStyle.modalFormCol}>
                    {editCity ? (
                      <HRInputField
                      register={register}
                      errors={errors}
                      label="City"
                      name="city"
                      type={InputType.TEXT}
                      placeholder="City"
                      validationSchema={{
                        required: "please enter City.",
                        min: 1,
                      }}
                      isError={errors["city"] && errors["city"]}
                      errorMsg={"Please enter City"}
                      required
                    />
                    ) : (
                      <HRInputField
                        register={register}
                        errors={errors}
                        label="City"
                        name="city"
                        type={InputType.TEXT}
                        placeholder="City"
                        validationSchema={{
                          required: "please enter City.",
                          min: 1,
                        }}
                        isError={errors["city"] && errors["city"]}
                        errorMsg={"Please enter City"}
                        required
                        disabled
                        trailingIcon={
                          !isTabDisabled && (
                            <EditFieldSVG
                              width="16"
                              height="16"
                              onClick={() => setEditCity(true)}
                            />
                          )
                        }
                      />
                    )}
                  </div>

                  <div className={HRDetailStyle.modalFormCol}>
                    {editState ? (
                      <HRSelectField
                        // isControlled={true}
                        mode="id/value"
                        setValue={setValue}
                        register={register}
                        label={"State"}
                        defaultValue={"Select State"}
                        name="state"
                        options={stateList && stateList}
                        isError={errors["state"] && errors["state"]}
                        required
                        errorMsg={"Please select State"}
                      />
                    ) : (
                      <HRInputField
                        register={register}
                        errors={errors}
                        label="State"
                        name="state"
                        type={InputType.TEXT}
                        placeholder="State"
                        validationSchema={{
                          required: "please select State.",
                          min: 1,
                        }}
                        isError={errors["state"] && errors["state"]}
                        errorMsg={"Please select State"}
                        required
                        disabled
                        trailingIcon={
                          !isTabDisabled && (
                            <EditFieldSVG
                              width="16"
                              height="16"
                              onClick={() => setEditSate(true)}
                            />
                          )
                        }
                      />
                    )}
                  </div>

                  <div className={HRDetailStyle.modalFormCol}>
                    {editDesignation ? (
                     <HRInputField
                     register={register}
                     errors={errors}
                     label="Talent’s Designation"
                     name="designation"
                     type={InputType.TEXT}
                     placeholder="Talent’s Designation"
                     validationSchema={{
                       required: "please enter Talent’s Designation.",
                       min: 1,
                     }}
                     isError={errors["designation"] && errors["designation"]}
                     errorMsg={"Please enter Talent’s Designation"}
                     required
                    
                   />
                    ) : (
                      <HRInputField
                        register={register}
                        errors={errors}
                        label="Talent’s Designation"
                        name="designation"
                        type={InputType.TEXT}
                        placeholder="Talent’s Designation"
                        validationSchema={{
                          required: "please enter Talent’s Designation.",
                          min: 1,
                        }}
                        isError={errors["designation"] && errors["designation"]}
                        errorMsg={"Please enter Talent’s Designation"}
                        required
                        disabled
                        trailingIcon={
                          !isTabDisabled && (
                            <EditFieldSVG
                              width="16"
                              height="16"
                              onClick={() => setEditDesignation(true)}
                            />
                          )
                        }
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className={HRDetailStyle.onboardingProcesBox}>
              <div className={HRDetailStyle.onboardingProcessLeft}>
                <div><AboutCompanySVG width="30" height="32" /></div>
                <h3 className={HRDetailStyle.titleLeft}>About Company</h3>
              </div>
              <div className={HRDetailStyle.onboardingProcessMid}>
                <div className={HRDetailStyle.modalFormWrapper}>
                  <div className={HRDetailStyle.colMd12}>
                    <HRInputField
                      isTextArea={true}
                      errors={errors}
                      className="TextAreaCustom"
                      label={"A bit about company culture "}
                      register={register}
                      name="aboutCompany"
                      type={InputType.TEXT}
                      placeholder="Enter here"
                      required
                      validationSchema={{
                        required: "please enter a bit about company culture.",
                      }}
                      disabled={isTabDisabled}
                    />
                  </div>
                  <div className={HRDetailStyle.colMd12}>
                    <HRInputField
                      isTextArea={true}
                      errors={errors}
                      label={"How does the first week look like"}
                      register={register}
                      name="firstWeek"
                      type={InputType.TEXT}
                      placeholder="Enter here"
                      required
                      validationSchema={{
                        required:
                          "please enter how does the first week look like.",
                      }}
                      disabled={isTabDisabled}
                    />
                  </div>
                  <div className={HRDetailStyle.colMd12}>
                    <HRInputField
                      isTextArea={true}
                      errors={errors}
                      label={"How does the first month look like"}
                      register={register}
                      name="firstMonth"
                      type={InputType.TEXT}
                      placeholder="Enter here"
                      required
                      validationSchema={{
                        required:
                          "please enter how does the first month look like.",
                      }}
                      disabled={isTabDisabled}
                    />
                  </div>

                  {/* {!talentDeteils?.IsHRTypeDP && ( */}
                    <>
                      <div className={HRDetailStyle.colMd12}>
                        <HRInputField
                          isTextArea={true}
                          errors={errors}
                          label={"Softwares & Tools Required"}
                          register={register}
                          name="softwareToolsRequired"
                          type={InputType.TEXT}
                          placeholder="Enter Softwares and Tools which will be required"
                          required={!talentDeteils?.IsHRTypeDP}
                          validationSchema={{
                            required:
                              "please enter softwares and tools which will be required.",
                          }}
                          disabled={isTabDisabled}
                        />
                        {/* <HRSelectField
                            isControlled={true}
                            mode="id/value"
                            setValue={setValue}
                            register={register}
                            label={'Softwares & Tools Required'}
                            // defaultValue={'Enter Softwares and Tools which will be required'}
                            placeholder={'Enter Softwares and Tools which will be required'}
                            name="Mode of Working"
                            isError={errors['departMent'] && errors['departMent']}
                            required
                            errorMsg={'Please select department'}
                        /> */}
                      </div>
                      <div className={HRDetailStyle.colMd12}>
                        <HRInputField
                          isTextArea={true}
                          errors={errors}
                          label={"Feedback Process"}
                          register={register}
                          name="firstMonth"
                          type={InputType.TEXT}
                          placeholder="Enter here"
                          required
                          validationSchema={{
                            required: "please enter Feedback Process.",
                          }}
                          disabled={isTabDisabled}
                        />
                      </div>
                      <div className={HRDetailStyle.colMd12}>
                        <HRSelectField
                          controlledValue={controlledDevicePolicy}
                          setControlledValue={setControlledDevicePolicy}
                          isControlled={true}
                          mode="id/value"
                          setValue={setValue}
                          register={register}
                          label={"Device Policy"}
                          // defaultValue={'Enter Device Policy'}
                          options={devicePolices}
                          placeholder={"Select Device Policy"}
                          name="devicePolicy"
                          isError={
                            errors["devicePolicy"] && errors["devicePolicy"]
                          }
                          required={!talentDeteils?.IsHRTypeDP}
                          errorMsg={"please select device policy."}
                          disabled={isTabDisabled}
                        />
                      </div>

                      {watchDevicePolicy?.id === 1 && (
                        <div className={HRDetailStyle.colMd12}>
                          <HRInputField
                            isTextArea={true}
                            errors={errors}
                            // label={'Softwares & Tools Required'}
                            register={register}
                            name="standerdSpecifications"
                            type={InputType.TEXT}
                            placeholder="Specify standard specifications, If any"
                            required={watchDevicePolicy?.id === 1}
                            disabled={isTabDisabled}
                          />
                        </div>
                      )}

                      {watchDevicePolicy?.id === 2 && (
                        <div className={HRDetailStyle.colMd12}>
                          <HRSelectField
                            controlledValue={controlledDeviceType}
                            setControlledValue={setControlledDeviceType}
                            isControlled={true}
                            mode="id/value"
                            setValue={setValue}
                            register={register}
                            className="leavePolicylabel"
                            // label={'Leave Polices'}
                            options={
                              deviceMasters.length
                                ? deviceMasters.map((device) => {
                                    if (device.id !== 3) {
                                      return {
                                        id: device.id,
                                        value: `${device.deviceName} $ ${device.deviceCost} USD `,
                                      };
                                    }
                                    return {
                                      id: device.id,
                                      value: device.deviceName,
                                    };
                                  })
                                : []
                            }
                            defaultValue={"Select Device"}
                            name="deviceType"
                            isError={
                              errors["deviceType"] && errors["deviceType"]
                            }
                            required={
                              watchDevicePolicy?.id === 2 ? true : false
                            }
                            errorMsg={"please select device."}
                            disabled={isTabDisabled}
                          />
                        </div>
                      )} 

                      {watchDevicePolicy?.id === 2 &&
                        watch("deviceType")?.id === 3 && (
                          <div className={HRDetailStyle.colMd12}>
                            <HRInputField
                              isTextArea={true}
                              errors={errors}
                              // label={'Softwares & Tools Required'}
                              register={register}
                              name="otherDevice"
                              type={InputType.TEXT}
                              placeholder=""
                              disabled={isTabDisabled}
                            />
                          </div>
                        )}

                      <div className={HRDetailStyle.modalFormCol}>
                        <div className={HRDetailStyle.modalFormLeaveUnderLine}>
                          <HRSelectField
                            controlledValue={controlledLeavePolicy}
                            setControlledValue={setControlledLeavePolicy}
                            isControlled={true}
                            mode="id/value"
                            setValue={setValue}
                            register={register}
                            className="leavePolicylabel"
                            label={"Leave Polices"}
                            placeholder={"Select Leave Polices"}
                            options={leavePolices}
                            // defaultValue={'Proceed with Uplers Policies'}
                            name="leavePolicie"
                            isError={
                              errors["leavePolicie"] && errors["leavePolicie"]
                            }
                            required={!talentDeteils?.IsHRTypeDP}
                            errorMsg={"please select leave policy."}
                            disabled={isTabDisabled}
                          />
                        </div>
                      </div>

                      <div className={HRDetailStyle.modalFormCol}>
                        <div className={HRDetailStyle.modalFormEdited}>
                          <HRInputField
                            register={register}
                            errors={errors}
                            label="Exit Policy"
                            name="exitPolicy"
                            type={InputType.TEXT}
                            placeholder="First Month"
                            // value="First Month - 7 Days Second Month Onwards - 30 Days"
                            disabled
                            required={!talentDeteils?.IsHRTypeDP}
                            validationSchema={{
                              required: "please enter Exit Policy.",
                            }}
                            // trailingIcon= {<EditFieldSVG width="16" height="16" />}
                          />
                        </div>
                      </div>
                    </>
                  {/* )} */}
                  {watch("leavePolicie")?.id === 1 && (
                    <a
                      href={uplersLeavePolicyLink}
                      target="_blank"
                      rel="noreferrer"
                      style={{ padding: "0px 10px 20px 10px" }}
                    >
                      {uplersLeavePolicyLink}
                    </a>
                  )}

                  {watch("leavePolicie")?.id === 2 && (
                  <>
                    <div className={HRDetailStyle.colMd12}>
                      <div className={HRDetailStyle.modalFormEdited}>
                        <HRInputField
                          register={register}
                          errors={errors}
                          validationSchema={{
                            // required: 'please enter Link URL.',
                            validate: (value) => {
                              if (!isValidUrl(value)) {
                                return "Please Enter valid URL";
                              }
                            },
                          }}
                          errorMsg={"please enter Link URL."}
                          label="Leave Polices Link"
                          name="policyLink"
                          type={InputType.TEXT}
                          placeholder="Enter Policy Link"
                          required={getUploadFileData ? false : true}
                          disabled={
                            isTabDisabled === true
                              ? isTabDisabled
                              : getUploadFileData
                              ? true
                              : false
                          }
                        />
                      </div>
                      <h5
                        style={{
                          textAlign: "center",
                          fontSize: "18px",
                          fontWeight: 600,
                        }}
                      >
                        OR
                      </h5>
                    </div>
                    <div className={HRDetailStyle.colMd12}>
                      <div className={HRDetailStyle.modalFormEdited}>
                        {!getUploadFileData ? (
                          <HRInputField
                            disabled={
                              isTabDisabled === true
                                ? isTabDisabled
                                : watch("policyLink")
                                ? true
                                : false
                            }
                            register={register}
                            leadingIcon={<UploadSVG />}
                            label="Upload Polices"
                            name="policyFile"
                            type={InputType.BUTTON}
                            buttonLabel="Upload Polices"
                            setValue={setValue}
                            required={watch("policyLink") ? false : true}
                            onClickHandler={() => setUploadModal(true)}
                            //   validationSchema={{
                            //     required: "please select a file.",
                            //   }}
                            errorMsg={"please select a file."}
                            errors={errors}
                          />
                        ) : (
                          <div className={HRDetailStyle.uploadedJDWrap}>
                            <label>Upload Policy *</label>
                            <div className={HRDetailStyle.uploadedJDName}>
                              {getUploadFileData}{" "}
                              {!isTabDisabled && (
                                <CloseSVG
                                  className={HRDetailStyle.uploadedJDClose}
                                  onClick={() => {
                                    // setJDParsedSkills({});
                                    setUploadFileData("");
                                    setValue("jdExport", "");
                                  }}
                                />
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      <UploadModal
                        isGoogleDriveUpload={false}
                        isLoading={isLoading}
                        uploadFileRef={uploadFile}
                        uploadFileHandler={(e) =>
                          uploadFileHandler(e.target.files[0])
                        }
                        //   googleDriveFileUploader={() => googleDriveFileUploader()}
                        //   uploadFileFromGoogleDriveLink={uploadFileFromGoogleDriveLink}
                        modalTitle={"Upload Leave Polices"}
                        isFooter={false}
                        modalSubtitle={" "}
                        openModal={showUploadModal}
                        setUploadModal={setUploadModal}
                        cancelModal={() => setUploadModal(false)}
                        setValidation={setValidation}
                        getValidation={getValidation}
                        //   getGoogleDriveLink={getGoogleDriveLink}
                        //   setGoogleDriveLink={setGoogleDriveLink}
                        setUploadFileData={setUploadFileData}
                      />
                    </div>
                  </>
                 )}

                  <div className={HRDetailStyle.colMd12}>
                    <div className={HRDetailStyle.modalFormEdited}>
                      <HRInputField
                        register={register}
                        errors={errors}
                        label="Feedback Process"
                        name="feedbackProcess"
                        type={InputType.TEXT}
                        placeholder="Weekly"
                        // value="Weekly during the first 2 weeks | Fortnightly for the next 2 months | Monthly / Quarterly feedback thereafter"
                        disabled
                        required
                        validationSchema={{
                          required: "please enter Feedback Process.",
                        }}
                        // trailingIcon= {<EditFieldSVG width="16" height="16" />}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={HRDetailStyle.onboardingProcesBox}>
            <div className={HRDetailStyle.onboardingProcessLeft}>
                <div><ClientTeamMemberSVG width="51" height="26" /></div>
                <h3 className={HRDetailStyle.titleLeft}>Client’s Team Members</h3>
                {!isTabDisabled && <div className={HRDetailStyle.modalBtnWrap}>
                    <button type="btn" className={HRDetailStyle.btnPrimary} onClick={()=> setAddMoreTeamMember(true)} disabled={isTabDisabled}  >Add More</button>
                </div>}
            </div>

            <div className={HRDetailStyle.onboardingProcessMid}>
                <div className={HRDetailStyle.modalFormWrapper}>
                    {clientTeamMembers.length > 0 ? <>
                    {clientTeamMembers.map(member=>  <div className={HRDetailStyle.modalFormCol}>
                        <div className={HRDetailStyle.onboardingCurrentTextWrap}>
                            <div className={HRDetailStyle.onboardingCurrentText}>
                                <span>Name: </span>
                                <span className={HRDetailStyle.onboardingTextBold}>{member.name}</span>
                            </div>
                            <div className={HRDetailStyle.onboardingCurrentText}>
                                <span>Designation: </span>
                                <span className={HRDetailStyle.onboardingTextBold}>{member.designation}</span>
                            </div>
                            <div className={HRDetailStyle.onboardingCurrentText}>
                                <span>Reporting To:</span>
                                <span className={HRDetailStyle.onboardingTextBold}>{member.reportingTo}</span>
                            </div>
                            <div className={HRDetailStyle.onboardingCurrentText}>
                                <span>LinkedIn :</span>
                                <span className={HRDetailStyle.onboardingTextBold}> {member.linkedin} <LinkedinClientSVG width="16" height="16"/></span>
                            </div> 
                            <div className={HRDetailStyle.onboardingCurrentText}>
                                <span>Email:</span>
                                <span className={HRDetailStyle.onboardingTextBold}>{member.email}</span>
                            </div> 
                            <div className={HRDetailStyle.onboardingCurrentText}>
                                <span>Buddy:</span>
                                <span className={HRDetailStyle.onboardingTextBold}>{member.buddy}</span>
                            </div>
                        </div>
                    </div>)}
                    </> :  <h3 className={HRDetailStyle.titleLeft}>No Client’s Team Members Availability</h3> }
                    
                </div>


                {addMoreTeamMember && <div className={HRDetailStyle.modalFormHide}>
                    <div className={HRDetailStyle.modalFormWrapper}>
                        <div className={HRDetailStyle.modalFormCol}>
                            <HRInputField
                                register={memberregister}
                                errors={memberErrors}
                                validationSchema={{
                                    required: 'please enter the name.',
                                }}
                                // required
                                label="Name"
                                name="memberName"
                                type={InputType.TEXT}
                                placeholder="Enter Name"
                            />
                        </div>
                        <div className={HRDetailStyle.modalFormCol}>
                            <HRInputField
                                 register={memberregister}
                                 errors={memberErrors}
                                //  required
                                validationSchema={{
                                    required: 'please enter the designation .',
                                }}
                                label="Designation"
                                name="memberDesignation"
                                type={InputType.TEXT}
                                placeholder="Enter Designation"
                            />
                        </div>
                        <div className={HRDetailStyle.modalFormCol}>
                            {/* <HRInputField
                                 register={memberregister}
                                 errors={memberErrors}
                                 required
                                validationSchema={{
                                    required: 'please enter the Reporting name.',
                                }}
                                label="Reporting to"
                                name="reportingTo"
                                type={InputType.TEXT}
                                placeholder="Enter Name"
                            /> */}
                            <HRSelectField
									controlledValue={controlledReportingTo}
									isControlled={true}
									setControlledValue={setControlledReportingTo}
									mode={'id/value'}
									setValue={setValue}
									register={register}
									label={'Reporting To'}
									defaultValue={'Reporting To'}
									options={reportingTo}
									name="reportingTo"
									isError={
										memberErrors['reportingTo'] &&
										memberErrors['reportingTo']
									}
									// required
									errorMsg={'Please select reporting to'}
								/>
                        </div>
                        <div className={HRDetailStyle.modalFormCol}>
                            <HRInputField
                                register={memberregister}
                                errors={memberErrors}
                                // required
                                // validationSchema={{
                                //     required: 'please enter the Link.',
                                // }}
                                label="Linkedin"
                                name="linkedinLink"
                                type={InputType.TEXT}
                                placeholder="Enter Link"
                            />
                        </div>
                        <div className={HRDetailStyle.modalFormCol}>
                            <HRInputField
                                register={memberregister}
                                errors={memberErrors}
                                // required
                                validationSchema={{
                                    required: 'please enter the Email.',
                                }}
                                label="Email"
                                name="memberEmail"
                                type={InputType.TEXT}
                                placeholder="Enter Email"
                            />
                        </div>
                        <div className={HRDetailStyle.modalFormCol}>
                            {/* <HRInputField
                                 register={memberregister}
                                 errors={memberErrors}
                                 required
                                validationSchema={{
                                    required: 'please enter the buddy name.',
                                }}
                                label="Buddy"
                                name="memberBuddy"
                                type={InputType.TEXT}
                                placeholder="Enter Name"
                            /> */}
                            	<HRSelectField
									controlledValue={controlledBuddy}
									isControlled={true}
									setControlledValue={setControlledBuddy}
									mode={'id/value'}
									setValue={setValue}
									register={register}
									label={'Buddy'}
									defaultValue={'Select Buddy'}
									options={buddy}
									name="memberBuddy"
									isError={
										memberErrors['memberBuddy'] && memberErrors['memberBuddy']
									}
									// required
									errorMsg={'Please select buddy'}
								/>
                        </div>

                        {/* <div className={HRDetailStyle.modalFormCol}>
                            <div className={HRDetailStyle.modalBtnWrap}>
                                <button type="submit" className={HRDetailStyle.btnPrimary} onClick={memberHandleSubmit(saveMember)}>Save</button>
                                <button className={HRDetailStyle.btnPrimaryOutline} onClick={()=> calcelMember()}>Cancel</button>
                            </div>
                        </div> */}
                    </div>		
                </div> }
               		

            </div>
        </div>

            <div className={HRDetailStyle.onboardingProcesBox}>
              <div className={HRDetailStyle.onboardingProcessLeft}>
                <div>
                  <TelentDetailSVG width="27" height="32" />
                </div>
                <h3 className={HRDetailStyle.titleLeft}>Replacement Details</h3>
              </div>

              <div className={HRDetailStyle.onboardingProcessMid}>
                <div className={`${HRDetailStyle.labelreplacement}`}>
                  <Checkbox
                    disabled={isTabDisabled}
                    name="PayPerCredit"
                    checked={engagementReplacement?.replacementData}
                    onChange={(e) => {
                      setEngagementReplacement({
                        ...engagementReplacement,
                        replacementData: e.target.checked,
                      });
                      if (e.target.checked === false) {
                        setAddLetter(false);
                        setValue("lwd", "");
                        setValue("engagementreplacement", "");
                      }
                    }}
                  >
                    Is this engagement going under replacement?
                  </Checkbox>
                </div>
                <div className={`${HRDetailStyle.labelreplacement}`}>
                  <div className={HRDetailStyle.colMd6}>
                    {engagementReplacement?.replacementData && (
                      <div className={HRDetailStyle.timeSlotItemField}>
                        <div className={HRDetailStyle.timeLabel}>
                          Last Working Day
                        </div>
                        <div className={HRDetailStyle.timeSlotItem}>
                          <CalenderSVG />
                          {isTabDisabled ? (
                            <Controller
                              render={({ ...props }) => (
                                <DatePicker
                                  {...props}
                                  disabled={isTabDisabled}
                                  selected={dayjs(watch("lwd"))}
                                  onChange={(date) => {
                                    setValue("lwd", date);
                                  }}
                                  placeholderText="Last Working Day"
                                  dateFormat="dd/MM/yyyy"
                                  disabledDate={disabledDate}
                                  value={dayjs(watch("lwd"))}
                                  control={control}
                                />
                              )}
                              name="lwd"
                              rules={{ required: true }}
                              control={control}
                            />
                          ) : (
                            <Controller
                              render={({ ...props }) => (
                                <DatePicker
                                  {...props}
                                  disabled={isTabDisabled}
                                  selected={dayjs(watch("lwd"))}
                                  onChange={(date) => {
                                    setValue("lwd", date);
                                  }}
                                  placeholderText="Last Working Day"
                                  dateFormat="dd/MM/yyyy"
                                  disabledDate={disabledDate}
                                  // value={dayjs(watch('lwd'))}
                                  control={control}
                                />
                              )}
                              name="lwd"
                              rules={{ required: true }}
                              control={control}
                            />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className={HRDetailStyle.labelreplacement}>
                  {engagementReplacement?.replacementData && (
                    <div className={HRDetailStyle.colMd6}>
                      <HRSelectField
                        controlledValue={controlledEngRep}
                        setControlledValue={setControlledEngRep}
                        isControlled={true}
                        disabled={addLatter || isTabDisabled}
                        setValue={setValue}
                        mode={"id/value"}
                        register={register}
                        name="engagementreplacement"
                        label="Select HR ID/Eng ID created to replace this engagement"
                        defaultValue="Select HR ID/Eng ID"
                        options={
                          replacementEngHr
                            ? replacementEngHr.map((item) => ({
                                id: item.stringIdValue,
                                value: item.value,
                              }))
                            : []
                        }
                      />
                    </div>
                  )}
                </div>
                <div
                  className={`${HRDetailStyle.labelreplacement} ${HRDetailStyle.mb32}`}
                >
                  {engagementReplacement?.replacementData && (
                    <div className={HRDetailStyle.colMd12}>
                      <Checkbox
                        disabled={isTabDisabled}
                        name="PayPerCredit"
                        checked={addLatter}
                        onChange={(e) => {
                          setAddLetter(e.target.checked);
                        }}
                      >
                        Will add this later, by doing this you understand that
                        replacement will not be tracked correctly.
                      </Checkbox>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className={HRDetailStyle.formPanelAction}>
      <button
          type="submit"
          className={HRDetailStyle.btnPrimaryOutline}
          onClick={() => setShowAMModal(false)}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={HRDetailStyle.btnPrimary}
          // onClick={handleSubmit(handleComplete)}
          onClick={handleComplete}
          disabled={isTabDisabled ? isTabDisabled : isLoading}
        >
          {/* {preONBoardingData?.dynamicOnBoardCTA?.gotoOnboard
            ? `${preONBoardingData?.dynamicOnBoardCTA?.gotoOnboard?.label}`
            : `${preONBoardingData?.dynamicOnBoardCTA?.amAssignment?.label}`} */}
            Continue
        </button>
      </div>
    </div>
  );
}
