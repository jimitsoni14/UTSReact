import IncentiveReportStyle from "./IncentiveReport.module.css";
import { ReactComponent as CalenderSVG } from "assets/svg/calender.svg";
import { ReactComponent as ArrowDownSVG } from "assets/svg/arrowDown.svg";
import { ReactComponent as FunnelSVG } from "assets/svg/funnel.svg";
import { ReactComponent as SearchSVG } from "assets/svg/search.svg";
import { ReactComponent as LockSVG } from "assets/svg/lock.svg";
import { ReactComponent as UnlockSVG } from "assets/svg/unlock.svg";
import {
    Dropdown,
    Menu,
    message,
    Modal,
    Table,
    Tooltip,
    Select,
    Switch,
    Tree,
} from "antd";
import {
    CarryOutOutlined,
    CheckOutlined,
    FormOutlined,
} from "@ant-design/icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useForm } from "react-hook-form";
import React, {
    Suspense,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import { ReportDAO } from "core/report/reportDAO";
import { HTTPStatusCode } from "constants/network";
import TableSkeleton from "shared/components/tableSkeleton/tableSkeleton";
import { reportConfig } from "modules/report/report.config";
import DemandFunnelModal from "modules/report/components/demandFunnelModal/demandFunnelModal";
import HRSelectField from "modules/hiring request/components/hrSelectField/hrSelectField";
import { IncentiveReportDAO } from "core/IncentiveReport/IncentiveReportDAO";
import { IoLogoCss3 } from "react-icons/io5";

const DemandFunnelFilterLazyComponent = React.lazy(() =>
    import("modules/report/components/demandFunnelFilter/demandFunnelFilter")
);

const IncentiveReportScreen = () => {
    const [tableFilteredState, setTableFilteredState] = useState({
        startDate: "",
        endDate: "",
        isHiringNeedTemp: "",
        modeOfWork: "",
        typeOfHR: "",
        companyCategory: "",
        replacement: "",
        head: "",
        isActionWise: true,
    });
    const [demandFunnelHRDetailsState, setDemandFunnelHRDetailsState] = useState({
        adhocType: "",
        TeamManagerName: "",
        currentStage: "TR Accepted",
        IsExport: false,
        hrFilter: {
            hR_No: "",
            salesPerson: "",
            compnayName: "",
            role: "",
            managed_Self: "",
            talentName: "",
            availability: "",
        },
        funnelFilter: tableFilteredState,
    });

    const [apiData, setApiData] = useState([]);
    const [viewSummaryData, setSummaryData] = useState([]);
    const [isSummary, setIsSummary] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [isSummaryLoading, setSummaryLoading] = useState(false);
    const [filteredTagLength, setFilteredTagLength] = useState(0);
    const [getHTMLFilter, setHTMLFilter] = useState(false);
    const [isAllowFilters, setIsAllowFilters] = useState(false);
    const [filtersList, setFiltersList] = useState([]);
    const [appliedFilter, setAppliedFilters] = useState(new Map());
    const [checkedState, setCheckedState] = useState(new Map());
    const [demandFunnelModal, setDemandFunnelModal] = useState(false);
    const [getUserRole, setUserRole] = useState([]);
    const [getManagerList, setManagerList] = useState([]);
    const [getMonthYearFilter, setMonthYearFilter] = useState([]);
    const [getUserRoleEdit, setUserRoleEdit] = useState([
        { id: 0, value: "Select" },
    ]);
    const [getManagerEdit, setManagerEdit] = useState([
        { id: 0, value: "Select" },
    ]);
    const [getMonthYearEdit, setMonthYearEdit] = useState([
        { id: 0, value: "Select" },
    ]);
    const [getUserRoleValue, setUserRoleValue] = useState("Select");
    const [getManagerValue, setManagerValue] = useState("Select");
    const [getMonthYearValue, setMonthYearValue] = useState("Select");
    const [managerRole, setManagerRole] = useState([]);
    const [getManagerInfo, setManagerInfo] = useState([{
        id: 0, value: "Select"
    }])


    const [showLine, setShowLine] = useState(true);
    const [showIcon, setShowIcon] = useState(false);
    const [showLeafIcon, setShowLeafIcon] = useState(true);

    const treeData = [
        {
            title: "parent 1",
            key: "0-0",
            icon: <CarryOutOutlined />,
            children: [
                {
                    title: "parent 1-0",
                    key: "0-0-0",
                    icon: <CarryOutOutlined />,
                    children: [
                        {
                            title: "leaf",
                            key: "0-0-0-0",
                            icon: <CarryOutOutlined />,
                        },
                        {
                            title: (
                                <>
                                    <div>multiple line title</div>
                                    <div>multiple line title</div>
                                </>
                            ),
                            key: "0-0-0-1",
                            icon: <CarryOutOutlined />,
                        },
                        {
                            title: "leaf",
                            key: "0-0-0-2",
                            icon: <CarryOutOutlined />,
                        },
                    ],
                },
                {
                    title: "parent 1-1",
                    key: "0-0-1",
                    icon: <CarryOutOutlined />,
                    children: [
                        {
                            title: "leaf",
                            key: "0-0-1-0",
                            icon: <CarryOutOutlined />,
                        },
                    ],
                },
                {
                    title: "parent 1-2",
                    key: "0-0-2",
                    icon: <CarryOutOutlined />,
                    children: [
                        {
                            title: "leaf",
                            key: "0-0-2-0",
                            icon: <CarryOutOutlined />,
                        },
                        {
                            title: "leaf",
                            key: "0-0-2-1",
                            icon: <CarryOutOutlined />,
                            switcherIcon: <FormOutlined />,
                        },
                    ],
                },
            ],
        },
        {
            title: "parent 2",
            key: "0-1",
            icon: <CarryOutOutlined />,
            children: [
                {
                    title: "parent 2-0",
                    key: "0-1-0",
                    icon: <CarryOutOutlined />,
                    children: [
                        {
                            title: "leaf",
                            key: "0-1-0-0",
                            icon: <CarryOutOutlined />,
                        },
                        {
                            title: "leaf",
                            key: "0-1-0-1",
                            icon: <CarryOutOutlined />,
                        },
                    ],
                },
            ],
        },
    ];

    const onSelect = (selectedKeys, info) => {
        console.log("selected", selectedKeys, info);
    };

    const {
        register,
        handleSubmit,
        setValue,
        control,
        setError,
        unregister,
        getValues,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: {},
    });

    const watchValueUserRoles = watch("userRoleValue");

    console.log(watchValueUserRoles, "watchValueUserRoles");

    const onRemoveFilters = () => {
        setTimeout(() => {
            setIsAllowFilters(false);
        }, 300);
        setHTMLFilter(false);
    };
    const getDemandFunnelListingHandler = useCallback(async () => {
        setLoading(true);
        let response = await ReportDAO.demandFunnelListingRequestDAO(
            tableFilteredState
        );
        if (response?.statusCode === HTTPStatusCode.OK) {
            setLoading(false);
            setApiData(response?.responseBody);
        } else {
            setLoading(false);
            setApiData([]);
        }
    }, [tableFilteredState]);

    const viewDemandFunnelSummaryHandler = useCallback(async () => {
        setIsSummary(true);
        setSummaryLoading(true);
        let response = await ReportDAO.demandFunnelSummaryRequestDAO(
            tableFilteredState
        );
        if (response?.statusCode === HTTPStatusCode.OK) {
            setSummaryData(response?.responseBody);
            setSummaryLoading(false);
        } else {
            setSummaryData([]);
            setSummaryLoading(false);
        }
    }, [tableFilteredState]);

    const tableColumnsMemo = useMemo(
        () =>
            reportConfig.demandFunnelTable(
                apiData && apiData,
                demandFunnelModal,
                setDemandFunnelModal,
                setDemandFunnelHRDetailsState,
                demandFunnelHRDetailsState
            ),
        [apiData, demandFunnelHRDetailsState, demandFunnelModal]
    );

    const viewSummaryMemo = useMemo(
        () =>
            reportConfig.viewSummaryDemandFunnel(viewSummaryData && viewSummaryData),
        [viewSummaryData]
    );
    const getReportFilterHandler = useCallback(async () => {
        const response = await ReportDAO.demandFunnelFiltersRequestDAO();
        if (response?.statusCode === HTTPStatusCode.OK) {
            setFiltersList(response && response?.responseBody?.Data);
        } else {
            setFiltersList([]);
        }
    }, []);

    const toggleDemandReportFilter = useCallback(() => {
        getReportFilterHandler();
        !getHTMLFilter
            ? setIsAllowFilters(!isAllowFilters)
            : setTimeout(() => {
                setIsAllowFilters(!isAllowFilters);
            }, 300);
        setHTMLFilter(!getHTMLFilter);
    }, [getHTMLFilter, getReportFilterHandler, isAllowFilters]);
    useEffect(() => {
        getDemandFunnelListingHandler();
    }, [getDemandFunnelListingHandler]);

    // Incentive Report API
    const getIncentiveUserRole = async () => {
        const response = await IncentiveReportDAO.getUserRoleDAO();
        if (response.statusCode === HTTPStatusCode.OK) {
            setUserRole(response?.responseBody?.salesUserRoleDDL);
            setManagerList(response?.responseBody?.salesUserDDL);
        }
    };

    const getMonthYearFilters = async () => {
        const response = await IncentiveReportDAO.getMonthYearFilterDAO();
        if (response.statusCode === HTTPStatusCode.OK) {
            setMonthYearFilter(response?.responseBody?.MonthYear);
        }
    };

    const [managerDataInfo, setManagerDataInfo] = useState([])

    const getSalesUserBasedOnUserRole = async () => {
        const response = await IncentiveReportDAO.getSalesUsersBasedOnUserRoleDAO(watchValueUserRoles?.id);
        // setManagerRole(response?.responseBody)
        const managerData = response?.responseBody?.map((item) => ({
            id: item?.value,
            value: item?.text,
        }));
        setManagerDataInfo(managerData);
        console.log(updatedManagerData, "getManagerInfo")
    };

    useEffect(() => {
        const updatedUserRole = getUserRole.map((item) => ({
            id: item?.value,
            value: item?.text,
        }));
        setUserRoleEdit([...getUserRoleEdit, ...updatedUserRole]);
    }, [getUserRole]);

    useEffect(() => {
        const updatedManagerList = getManagerList.map((item) => ({
            id: item?.value,
            value: item?.text,
        }));
        setManagerEdit(updatedManagerList);
    }, [getManagerList]);

    useEffect(() => {
        const updatedMonthYear = getMonthYearFilter.map((item) => ({
            id: item?.value,
            value: item?.text,
        }));
        setMonthYearEdit([...getMonthYearEdit, ...updatedMonthYear]);
    }, [getMonthYearFilter]);


    useEffect(() => {
        getIncentiveUserRole();
        getMonthYearFilters();
    }, []);

    useEffect(() => {
        getSalesUserBasedOnUserRole();
    }, [watchValueUserRoles])




    return (
        <div className={IncentiveReportStyle.hiringRequestContainer}>
            <div className={IncentiveReportStyle.addnewHR}>
                <div className={IncentiveReportStyle.hiringRequest}>
                    Incentive Reports
                </div>
            </div>
            {/*
       * --------- Filter Component Starts ---------
       * @Filter Part
       */}
            <div className={IncentiveReportStyle.filterContainer}>
                <div className={IncentiveReportStyle.filterSets}>
                    <div
                        className={IncentiveReportStyle.addFilter}
                        onClick={toggleDemandReportFilter}
                    >
                        <FunnelSVG style={{ width: "16px", height: "16px" }} />

                        <div className={IncentiveReportStyle.filterLabel}>Add Filters</div>
                        <div className={IncentiveReportStyle.filterCount}>
                            {filteredTagLength}
                        </div>
                    </div>
                </div>
            </div>

            <div className={IncentiveReportStyle.row}>
                <div className={IncentiveReportStyle.colMd4}>
                    <HRSelectField
                        setControlledValue={setUserRoleValue}
                        controlledValue={getUserRoleValue}
                        isControlled={true}
                        setValue={setValue}
                        register={register}
                        name="userRoleValue"
                        mode={"id/value"}
                        options={getUserRoleEdit}
                        required
                        isError={errors["userRoleValue"] && errors["userRoleValue"]}
                        errorMsg="Please select a User Role."
                    />
                </div>
                <div className={IncentiveReportStyle.colMd4}>
                    <HRSelectField
                        controlledValue={getManagerValue}
                        setControlledValue={setManagerValue}
                        isControlled={true}
                        setValue={setValue}
                        register={register}
                        name="manager"
                        mode={"id/value"}
                        options={watchValueUserRoles === undefined ? getManagerEdit : managerDataInfo}
                        // onClick={managerData}
                        required
                        isError={errors["manager"] && errors["manager"]}
                        errorMsg="Please select a Manager."
                    />
                </div>
                <div className={IncentiveReportStyle.colMd4}>
                    <HRSelectField
                        setControlledValue={setMonthYearValue}
                        controlledValue={getMonthYearValue}
                        isControlled={true}
                        setValue={setValue}
                        register={register}
                        name="MonthYearFilter"
                        mode={"id/value"}
                        options={getMonthYearEdit}
                        required
                        isError={errors["MonthYearFilter"] && errors["MonthYearFilter"]}
                        errorMsg="Please select a month."
                    />
                </div>
            </div>
            {/*
       * ------------ Table Starts-----------
       * @Table Part
       */}

            <div className={IncentiveReportStyle.tree_custom}>
                <div>
                    <Tree
                        showLine={
                            showLine
                                ? {
                                    showLeafIcon,
                                }
                                : false
                        }
                        showIcon={showIcon}
                        defaultExpandedKeys={["0-0-0"]}
                        onSelect={onSelect}
                        treeData={treeData}
                    />
                </div>
            </div>

            <div className={IncentiveReportStyle.tableDetails}>
                {isLoading ? (
                    <TableSkeleton />
                ) : (
                    <>
                        <Table
                            id="hrListingTable"
                            columns={tableColumnsMemo}
                            bordered={false}
                            dataSource={[...apiData?.slice(1)]}
                            pagination={{
                                size: "small",
                                pageSize: apiData?.length,
                            }}
                        />
                        <div className={IncentiveReportStyle.formPanelAction}>
                            <button
                                type="submit"
                                onClick={viewDemandFunnelSummaryHandler}
                                className={IncentiveReportStyle.btnPrimary}
                            >
                                View Summary
                            </button>
                        </div>
                    </>
                )}
            </div>
            {isSummary && (
                <div className={IncentiveReportStyle.tableDetails}>
                    {isSummaryLoading ? (
                        <TableSkeleton />
                    ) : (
                        <>
                            <Table
                                id="hrListingTable"
                                columns={viewSummaryMemo}
                                bordered={false}
                                dataSource={[...viewSummaryData?.slice(1)]}
                                pagination={{
                                    size: "small",
                                    pageSize: viewSummaryData?.length,
                                }}
                            />
                        </>
                    )}
                </div>
            )}

            {isAllowFilters && (
                <Suspense fallback={<div>Loading...</div>}>
                    <DemandFunnelFilterLazyComponent
                        setAppliedFilters={setAppliedFilters}
                        appliedFilter={appliedFilter}
                        setCheckedState={setCheckedState}
                        checkedState={checkedState}
                        handleHRRequest={getDemandFunnelListingHandler}
                        setTableFilteredState={setTableFilteredState}
                        tableFilteredState={tableFilteredState}
                        setFilteredTagLength={setFilteredTagLength}
                        onRemoveHRFilters={onRemoveFilters}
                        getHTMLFilter={getHTMLFilter}
                        hrFilterList={reportConfig.demandReportFilterListConfig()}
                        filtersType={reportConfig.demandReportFilterTypeConfig(
                            filtersList && filtersList
                        )}
                    />
                </Suspense>
            )}
            {demandFunnelModal && (
                <DemandFunnelModal
                    demandFunnelModal={demandFunnelModal}
                    setDemandFunnelModal={setDemandFunnelModal}
                    demandFunnelHRDetailsState={demandFunnelHRDetailsState}
                    setDemandFunnelHRDetailsState={setDemandFunnelHRDetailsState}
                />
            )}
        </div>
    );
};

export default IncentiveReportScreen;
