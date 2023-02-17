
import React, {
    useState,
    useEffect,
    Suspense,
    useMemo,
    useCallback,
} from 'react';
import { Dropdown, Menu, message, Skeleton, Table, Tooltip } from 'antd';
import { Navigate, useNavigate } from 'react-router-dom';
import { AddNewType, DayName, InputType } from 'constants/application';
import { ReactComponent as CalenderSVG } from 'assets/svg/calender.svg';
import { ReactComponent as ArrowDownSVG } from 'assets/svg/arrowDown.svg';
import { ReactComponent as FunnelSVG } from 'assets/svg/funnel.svg';
import { ReactComponent as SearchSVG } from 'assets/svg/search.svg';
import { ReactComponent as LockSVG } from 'assets/svg/lock.svg';
import { ReactComponent as UnlockSVG } from 'assets/svg/unlock.svg';
import { hiringRequestDAO } from 'core/hiringRequest/hiringRequestDAO';
import { useAllHRQuery } from 'shared/hooks/useAllHRQuery';
import { hrUtils } from 'modules/hiring request/hrUtils';
import { IoChevronDownOutline } from 'react-icons/io5';
import allUserStyles from './user_list.module.css';
import UTSRoutes from 'constants/routes';
import HROperator from 'modules/hiring request/components/hroperator/hroperator';
import { allHRConfig } from '../../../hiring request/screens/allHiringRequest/allHR.config';
import WithLoader from 'shared/components/loader/loader';
import { UserRequestDAO } from 'core/users/users';
import { UserUtils } from 'modules/users/userUtils';

/** Importing Lazy components using Suspense */
const HiringFiltersLazyComponent = React.lazy(() =>
    import('modules/hiring request/components/hiringFilter/hiringFilters'),
);

const UserList = () => {
    const pageSizeOptions = [100, 200, 300, 500, 1000];
    const hrQueryData = useAllHRQuery();
    const [totalRecords, setTotalRecords] = useState(0);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(100);
    const [isAllowFilters, setIsAllowFilters] = useState(false);
    const [filtersList, setFiltersList] = useState([]);
    const [apiData, setAPIdata] = useState([]);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState(search);
    const navigate = useNavigate();

    const onRemoveHRFilters = () => {
        setIsAllowFilters(false);
    };
    const [messageAPI, contextHolder] = message.useMessage();
    const togglePriority = useCallback(
        async (payload) => {
            let response = await hiringRequestDAO.sendHRPriorityForNextWeekRequestDAO(
                payload,
            );
            const { tempdata, index } = hrUtils.hrTogglePriority(response, apiData);
            setAPIdata([
                ...apiData.slice(0, index),
                tempdata,
                ...apiData.slice(index + 1),
            ]);

            messageAPI.open({
                type: 'success',
                content: `${tempdata.HR_ID} priority has been changed.`,
            });
        },
        [apiData, messageAPI],
    );

    const tableColumnsMemo = useMemo(
        () => allHRConfig.tableConfig(togglePriority),
        [togglePriority],
    );

    const handleHRRequest = async (pageData) => {
        let response = await hiringRequestDAO.getPaginatedHiringRequestDAO(
            pageData
                ? pageData
                : {
                    pagesize: 100,
                    pagenum: 1,
                },
        );
        setAPIdata(hrUtils.modifyHRRequestData(response && response));
        setTotalRecords(response.responseBody.TotalRecords);
    };

    const userListRequestHandler = async () => {
        const listData = {
            totalrecord: 10,
            pagenumber: 1,
        }
        let response = await UserRequestDAO.getUserList(listData);
        setAPIdata(UserUtils.userList(response && response));
        setTotalRecords(300);
    };

    useEffect(() => {
        const timer = setTimeout(() => setSearch(debouncedSearch), 1000);
        return () => clearTimeout(timer);
    }, [debouncedSearch]);

    useEffect(() => {
        handleHRRequest({
            pagesize: 100,
            pagenum: 1,
        });

    }, [hrQueryData?.data]);

    useEffect(() => {
        userListRequestHandler({ pageSize: pageSize, pageNum: pageIndex });
    }, [])


    const getHRFilterRequest = useCallback(async () => {
        const response = await hiringRequestDAO.getAllFilterDataForHRRequestDAO();
        setFiltersList(response && response?.responseBody?.details?.Data);
    }, []);

    const toggleHRFilter = useCallback(() => {
        getHRFilterRequest();
        setIsAllowFilters(!isAllowFilters);
    }, [getHRFilterRequest, isAllowFilters]);



    return (
        <div className={allUserStyles.hiringRequestContainer}>
            {contextHolder}
            <div className={allUserStyles.addnewHR}>
                <div className={allUserStyles.hiringRequest}>Users</div>

                <HROperator
                    title="Add New User"
                    icon={<ArrowDownSVG style={{ width: '16px' }} />}
                    backgroundColor={`var(--color-sunlight)`}
                    iconBorder={`1px solid var(--color-sunlight)`}
                    isDropdown={true}
                    listItem={[
                        {
                            label: 'Add New HR',
                            key: AddNewType.HR,
                        },
                        {
                            label: 'Add New Client',
                            key: AddNewType.CLIENT,
                        },
                    ]}
                    menuAction={(item) => {
                        switch (item.key) {
                            case AddNewType.HR: {
                                navigate(UTSRoutes.ADDNEWHR);
                                break;
                            }
                            case AddNewType.CLIENT: {
                                navigate(UTSRoutes.ADDNEWCLIENT);
                                break;
                            }
                            default:
                                break;
                        }
                    }}
                />
            </div>
            {/*
			 * --------- Filter Component Starts ---------
			 * @Filter Part
			 */}
            <div className={allUserStyles.filterContainer}>
                <div className={allUserStyles.filterSets}>
                    <div
                        className={allUserStyles.addFilter}
                        onClick={toggleHRFilter}>
                        <FunnelSVG style={{ width: '16px', height: '16px' }} />

                        <div className={allUserStyles.filterLabel}>Add Filters</div>
                        <div className={allUserStyles.filterCount}>7</div>
                    </div>
                    <div className={allUserStyles.filterRight}>
                        <div className={allUserStyles.searchFilterSet}>
                            <SearchSVG style={{ width: '16px', height: '16px' }} />
                            <input
                                type={InputType.TEXT}
                                className={allUserStyles.searchInput}
                                placeholder="Search Table"
                                onChange={(e) => {
                                    return setDebouncedSearch(
                                        hrUtils.allHiringRequestSearch(e, apiData),
                                    );
                                }}
                            />
                        </div>
                        <div className={allUserStyles.calendarFilterSet}>

                        </div>

                        <div className={allUserStyles.priorityFilterSet}>
                            <div className={allUserStyles.label}>Showing</div>
                            <div className={allUserStyles.paginationFilter}>
                                <Dropdown
                                    trigger={['click']}
                                    placement="bottom"
                                    overlay={
                                        <Menu
                                            onClick={(e) => {
                                                setPageSize(parseInt(e.key));
                                                if (pageSize !== parseInt(e.key)) {
                                                    handleHRRequest({
                                                        pagesize: parseInt(e.key),
                                                        pagenum: pageIndex,
                                                    });
                                                }
                                            }}>
                                            {pageSizeOptions.map((item) => {
                                                return <Menu.Item key={item}>{item}</Menu.Item>;
                                            })}
                                        </Menu>
                                    }>
                                    <span>
                                        {pageSize}
                                        <IoChevronDownOutline
                                            style={{ paddingTop: '5px', fontSize: '16px' }}
                                        />
                                    </span>
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/*
			 * ------------ Table Starts-----------
			 * @Table Part
			 */}
            <div className={allUserStyles.tableDetails}>
                {
                    <WithLoader>
                        <Table
                            locale={{
                                emptyText: (
                                    <>
                                        <Skeleton />
                                        <Skeleton />
                                        <Skeleton />
                                    </>
                                ),
                            }}
                            id="hrListingTable"
                            columns={tableColumnsMemo}
                            bordered={false}
                            dataSource={
                                search && search.length > 0 ? [...search] : [...apiData]
                            }
                            pagination={{
                                onChange: (pageNum, pageSize) => {
                                    setPageIndex(pageNum);
                                    setPageSize(pageSize);
                                    handleHRRequest({ pageSize: pageSize, pageNum: pageNum });
                                },
                                size: 'small',
                                pageSize: pageSize,
                                pageSizeOptions: pageSizeOptions,
                                total: totalRecords,
                                showTotal: (total, range) =>
                                    `${range[0]}-${range[1]} of ${totalRecords} items`,
                                defaultCurrent: pageIndex,
                            }}
                        />
                    </WithLoader>
                }
            </div>

            {isAllowFilters && (
                <Suspense fallback={<div>Loading...</div>}>
                    <HiringFiltersLazyComponent
                        onRemoveHRFilters={onRemoveHRFilters}
                        hrFilterList={allHRConfig.hrFilterListConfig()}
                        filtersType={allHRConfig.hrFilterTypeConfig(
                            filtersList && filtersList,
                        )}
                    />
                </Suspense>
            )}
        </div>
    );
};

export default UserList;
