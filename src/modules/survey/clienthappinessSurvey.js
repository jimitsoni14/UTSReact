import React, {
	useState,
	useEffect,
	Suspense,
	useCallback,
    useMemo,
} from 'react';
import { Dropdown, Menu, Table, Modal,Select, AutoComplete } from 'antd';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
	InputType,
} from 'constants/application';
import UTSRoutes from 'constants/routes';

import { IoChevronDownOutline } from 'react-icons/io5';
import _debounce from 'lodash/debounce';
import TableSkeleton from 'shared/components/tableSkeleton/tableSkeleton';
import WithLoader from 'shared/components/loader/loader';
import clienthappinessSurveyStyles from './client_happiness_survey.module.css';

import { ReactComponent as FunnelSVG } from 'assets/svg/funnel.svg';
import { ReactComponent as SearchSVG } from 'assets/svg/search.svg';
import { ReactComponent as CalenderSVG } from 'assets/svg/calender.svg';
import { Controller, useForm } from 'react-hook-form';
import HRInputField from 'modules/hiring request/components/hrInputFields/hrInputFields';
import { useNavigate } from 'react-router-dom';
import { clientHappinessSurveyRequestDAO } from 'core/clientHappinessSurvey/clientHappinessSurveyDAO';
import { HTTPStatusCode } from 'constants/network';
import { downloadToExcel } from 'modules/report/reportUtils';
import { clientHappinessSurveyConfig } from 'modules/hiring request/screens/clientHappinessSurvey/clientHappinessSurvey.config';
import { Radio } from 'antd';

const SurveyFiltersLazyComponent = React.lazy(() =>
	import('modules/survey/components/surveyFilter/surveyfilters'),
);

 const ClienthappinessSurvey =()=> {
    const navigate = useNavigate();
    const[selecteDateOption,setSelectDateOption] = useState(true);
    const [generateLink, setGenerateLink] = useState(false);
    const {
		register,
		setValue,
		control,
		watch,		
		formState: { errors },
	} = useForm();   

    const pageSizeOptions = [100, 200, 300, 500, 1000,5000];
    const [tableFilteredState, setTableFilteredState] = useState({       
        pagenumber:1,
        totalrecord:100,
        filterFields_HappinessSurvey:{
            RatingFrom : 0,
            RatingTo :10,
        }
	});
    const [totalRecords, setTotalRecords] = useState(0);
    const [pageSize, setPageSize] = useState(100);    
	const [pageIndex, setPageIndex] = useState(1);
	const [isLoading, setLoading] = useState(false);
    /*--------- React DatePicker ---------------- */
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);
    const [search, setSearch] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState(search);

    const [filteredTagLength, setFilteredTagLength] = useState(0);
    const [filtersList, setFiltersList] = useState([]);
    const [getHTMLFilter, setHTMLFilter] = useState(false);
    const [isAllowFilters, setIsAllowFilters] = useState(false);
    const [appliedFilter, setAppliedFilters] = useState(new Map());
    const [checkedState, setCheckedState] = useState(new Map());
    const [clientHappinessSurveyList,setClientHappinessSurveyList] = useState([]);
    const [autoCompleteCompanyList,setAutoCompleteCompanyList] = useState([]);

    const watchCompany = watch('company');
    const watchClient = watch('client');
    const watchEmail = watch('email');

    const [generateLinkData,setGenerateLinkData ] = useState({company: '',client: "",email: ""});

    useEffect(() => {
        let _generateLinkData = {...generateLinkData};
        if (watchCompany) {
            _generateLinkData.company = watchCompany;
            getAutoCompleteComapany(watchCompany);
        }
        if(watchClient){
            _generateLinkData.client = watchClient;
        }
        if(watchEmail) {
            _generateLinkData.email = watchEmail;
        }   
        setGenerateLinkData(_generateLinkData);
    },[watchCompany,watchClient,watchEmail])
    

    const getClientHappinessSurveysOption = useCallback(async () => {
		const response = await clientHappinessSurveyRequestDAO.ClientHappinessSurveysOptionDAO();
		if (response?.statusCode === HTTPStatusCode.OK) {
            let _modifyList = [];
            for (let val of response?.responseBody) {
                let modifyObj = {};
                modifyObj.label = val.happynessSurvay_Option;
                modifyObj.value = val.id;
                modifyObj.selected = false;
                modifyObj.text = val.id;
                _modifyList.push(modifyObj);
            }
			setFiltersList(_modifyList);
		} else if (response?.statusCode === HTTPStatusCode.UNAUTHORIZED) {
			return navigate(UTSRoutes.LOGINROUTE);
		} else if (response?.statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR) {
			return navigate(UTSRoutes.SOMETHINGWENTWRONG);
		} else {
			return 'NO DATA FOUND';
		}
	}, [navigate]);

	useEffect(()=>{
		getClientHappinessSurveysOption();
	},[getClientHappinessSurveysOption])


    // const getAutoCompleteComapany = useCallback(
	// 	async (watchCompany) => {
	// 		let response = await clientHappinessSurveyRequestDAO.getAutoCompleteCompanyDAO(watchCompany);
	// 		if (response?.statusCode === HTTPStatusCode.OK) {		
    //             let _modifyData = [];
    //             for (let val of response?.responseBody) {
    //                 val.value = val.company;
    //                 _modifyData.push(val);
    //             }		
    //             setAutoCompleteCompanyList(_modifyData);				
	// 		} else if (
	// 			response?.statusCode === HTTPStatusCode.BAD_REQUEST ||
	// 			response?.statusCode === HTTPStatusCode.NOT_FOUND
	// 		) {			
	// 			setAutoCompleteCompanyList([]);
	// 		}
	// 	},
	// 	[],
	// ); 

    const getAutoCompleteComapany = async (watchCompany) => {
        let response = await clientHappinessSurveyRequestDAO.getAutoCompleteCompanyDAO(watchCompany);
        		if (response?.statusCode === HTTPStatusCode.OK) {		
                    let _modifyData = [];
                    for (let val of response?.responseBody) {
                        val.value = val.company;
                        _modifyData.push(val);
                    }		
                    setAutoCompleteCompanyList(_modifyData);				
        		} else if (
        			response?.statusCode === HTTPStatusCode.BAD_REQUEST ||
        			response?.statusCode === HTTPStatusCode.NOT_FOUND
        		) {			
        			setAutoCompleteCompanyList([]);
        		}
    }

    const onEmailSend = useCallback(
		async (id) => {
			let response = await clientHappinessSurveyRequestDAO.SendEmailForFeedbackDAO(id);
			if (response?.statusCode === HTTPStatusCode.OK) {
                alert("Email sent successfully");
                getClientHappinessSurveyList(tableFilteredState);
			} else if (
				response?.statusCode === HTTPStatusCode.BAD_REQUEST ||
				response?.statusCode === HTTPStatusCode.NOT_FOUND
			) {			

			}
		},
		[],
	);   
    const surveyColumnsMemo = useMemo(
		() => clientHappinessSurveyConfig.tableConfig(onEmailSend),
		[],
	); 
        
    useEffect(() => {
        getClientHappinessSurveyList(tableFilteredState);
    },[tableFilteredState]);

    const modifyResponseData = (data) => {
    return data.map((item) => ({...item,
        addedDate:item.addedDate.split(' ')[0],
        feedbackDate:item.feedbackDate.split(' ')[0]
    }))
    }
   
    const getClientHappinessSurveyList = useCallback(async (requestData) => {
        setLoading(true);
        let response = await clientHappinessSurveyRequestDAO.getClientHappinessSurveyListDAO(requestData);
        if (response?.statusCode === HTTPStatusCode.OK) {                 
            setClientHappinessSurveyList(modifyResponseData(response?.responseBody?.rows));
            setTotalRecords(response?.responseBody?.totalrows);
            setLoading(false);
          
        } else if (response?.statusCode === HTTPStatusCode.NOT_FOUND) {
            setLoading(false);
            setTotalRecords(0);
            setClientHappinessSurveyList([]);
        } else if (response?.statusCode === HTTPStatusCode.UNAUTHORIZED) {
            setLoading(false);
            return navigate(UTSRoutes.LOGINROUTE);
        } else if (
            response?.statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
        ) {
            setLoading(false);
            return navigate(UTSRoutes.SOMETHINGWENTWRONG);
        } else {
            setLoading(false);
            setClientHappinessSurveyList([]);
            return 'NO DATA FOUND';
        }
	}, [navigate]); 

    const onCalenderFilter = (dates) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);  
        if (start && end) {
            const startDate_parts = new Date(start).toLocaleDateString('en-US').split('/'); 
            const sDate = `${startDate_parts[2]}-${startDate_parts[0].padStart(2, '0')}-${startDate_parts[1].padStart(2, '0')}`;
            const endDate_parts = new Date(end).toLocaleDateString('en-US').split('/'); 
            const eDate = `${endDate_parts[2]}-${endDate_parts[0].padStart(2, '0')}-${endDate_parts[1].padStart(2, '0')}`;
            setTableFilteredState(prevState => ({
                ...prevState,
                filterFields_HappinessSurvey: {
                  ...prevState.filterFields_HappinessSurvey,
                  StartDate: sDate,
                  EndDate: eDate,
                }
              }));			
		}
    };

    const debouncedSearchHandler = (e) => {
        setTableFilteredState(prevState => ({
            ...prevState,
            pagenumber:1,
            filterFields_HappinessSurvey: {
              ...prevState.filterFields_HappinessSurvey,
              search: e.target.value,
            }
          }));       
        setDebouncedSearch(e.target.value)
        setPageIndex(1); 
    };

    // const submitGenerateLinkData = () => {
    //     console.log("handleSubmit");
    //     // submitGenerateLink();
    // }

    const submitGenerateLink = useCallback(async (requestData) => {
        setLoading(true);
        let response = await clientHappinessSurveyRequestDAO.SaveClientHappinessSurveysDAO(requestData);
        if (response?.statusCode === HTTPStatusCode.OK) {                 
            setGenerateLink(false);
            setLoading(false);          
        } else if (response?.statusCode === HTTPStatusCode.NOT_FOUND) {
            setLoading(false);          
        } else if (response?.statusCode === HTTPStatusCode.UNAUTHORIZED) {
            setLoading(false);
            return navigate(UTSRoutes.LOGINROUTE);
        } else if (
            response?.statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
        ) {
            setLoading(false);
            return navigate(UTSRoutes.SOMETHINGWENTWRONG);
        } else {
            setLoading(false);
            return 'NO DATA FOUND';
        }
	}, []);
  
	const clearFilters = useCallback(() => {
		setAppliedFilters(new Map());
		setCheckedState(new Map());
		setFilteredTagLength(0);
		setTableFilteredState({       
            pagenumber:1,
            totalrecord:100,
            filterFields_HappinessSurvey:{
                RatingFrom : 1,
                RatingTo :10,
            }
        });
		// const reqFilter = {
		// 	tableFilteredState:{...tableFilteredState,...{
		// 		pagesize: 100,
		// 		pagenum: 1,
		// 		sortdatafield: 'CreatedDateTime',
		// 		sortorder: 'desc',
		// 		searchText: '',
		// 	}},
		// 	filterFields_ViewAllHRs: {},
		// };
		// handleHRRequest(reqFilter);
		setIsAllowFilters(false);
		setEndDate(null)
		setStartDate(null)
		// setDebouncedSearch('')
		// setIsFocusedRole(false)
		// setPageIndex(1);
		// setPageSize(100);
	}, [
		// handleHRRequest,
		// setAppliedFilters,
		// setCheckedState,
		// setFilteredTagLength,
		// setIsAllowFilters,
		// setTableFilteredState,
		// tableFilteredState,
	]);

    const onRemoveSurveyFilters = () => {
		setIsAllowFilters(false);
	};

    const toggleSurveyFilter = useCallback(() => {		
        !getHTMLFilter
            ? setIsAllowFilters(true)
            : setTimeout(() => {
                    setIsAllowFilters(true);
            }, 300);
        setHTMLFilter(!getHTMLFilter);
    }, [getHTMLFilter]);

    const handleExport = () => {
		 downloadToExcel(clientHappinessSurveyList)
	}

    const getClientNameValue = (name) => {
        console.log(name,"nameee");
    }
  return (
    <>
    <div className={clienthappinessSurveyStyles.hiringRequestContainer}>
        <div className={clienthappinessSurveyStyles.addnewHR}>
            <div className={clienthappinessSurveyStyles.hiringRequest}>Client Happiness Survey</div>
            <div className={clienthappinessSurveyStyles.btn_wrap}>
                <div className={clienthappinessSurveyStyles.priorities_drop_custom}>
                    {/* {priorityCount?.length === 1 ? (
                        <button className={clienthappinessSurveyStyles.togglebtn}>
                            <span className={clienthappinessSurveyStyles.blank_btn}>
                                <img
                                    src={Prioritycount}
                                    alt="assignedCount"
                                />{' '}
                                Priority Count: <b>{`${priorityCount[0].assignedCount}`}</b>{' '}
                            </span>
                            <span className={clienthappinessSurveyStyles.blank_btn}>
                                <img
                                    src={Remainingcount}
                                    alt="remainingCount"
                                />{' '}
                                Remaining Count: <b>{`${priorityCount[0].remainingCount}`}</b>{' '}
                            </span>
                        </button>
                    ) : (
                        <button
                            className={clienthappinessSurveyStyles.togglebtn}
                            onBlur={() => setIsOpen(false)}
                            onClick={() => {
                                setIsOpen(!isOpen);
                            }}>
                            Priorities{' '}
                            <img
                                src={DownArrow}
                                alt="icon"
                            />
                        </button>
                    )} */}
                    {/* {isOpen && (
                        <div className={clienthappinessSurveyStyles.toggle_content}>
                            <table>
                                <thead>
                                    <tr>
                                        <th>User</th>
                                        <th>Priority Count</th>
                                        <th>Remaining Count</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {priorityCount?.map((data, index) => {
                                        return (
                                            <tr key={`Priorities_${index}`}>
                                                <td>{data.fullName}</td>
                                                <td>{data.assignedCount}</td>
                                                <td>{data.remainingCount}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )} */}
                </div>
                <button type="button" className={clienthappinessSurveyStyles.btnPrimary}	
                    onClick={() => {
                        setGenerateLink(true);
                    }}>
                    Generate Link
                </button>
                <button className={clienthappinessSurveyStyles.btnwhite} onClick={() => handleExport()}>Export</button>
            </div>
		</div>

        <div className={clienthappinessSurveyStyles.filterContainer}>
				<div className={clienthappinessSurveyStyles.filterSets}>
                    <div className={clienthappinessSurveyStyles.filterSetsInner} >
                        <div className={clienthappinessSurveyStyles.addFilter} onClick={toggleSurveyFilter}>
                            <FunnelSVG style={{ width: '16px', height: '16px' }} />

                            <div className={clienthappinessSurveyStyles.filterLabel}>Add Filters</div>
                            <div className={clienthappinessSurveyStyles.filterCount}>{filteredTagLength}</div>                            
                        </div>
                         <p onClick={()=> clearFilters() }>Reset Filters</p>                        
                    </div>
                   
					<div className={clienthappinessSurveyStyles.filterRight}>

						<div className={clienthappinessSurveyStyles.searchFilterSet}>
							<SearchSVG style={{ width: '16px', height: '16px' }} />
							<input
								type={InputType.TEXT}
								className={clienthappinessSurveyStyles.searchInput}
								placeholder="Search Table"
								onChange={debouncedSearchHandler}
								value={debouncedSearch}
							/>
						</div>

                        <div className={clienthappinessSurveyStyles.ratingFilterWrap}>
                            <div className={clienthappinessSurveyStyles.label}>Rating</div>
                            <div className={clienthappinessSurveyStyles.ratingFilter}>
                                <Select
                                    defaultValue={0}
                                    style={{ width: 42 }}
                                    dropdownMatchSelectWidth={false}
                                    // placement={placement}
                                    className="ratingNumber"
                                    options={clientHappinessSurveyConfig.ratingOptions()}
                                    onChange={(value, option) => {
                                        setTableFilteredState(prevState => ({
                                            ...prevState,                                            
                                            filterFields_HappinessSurvey: {
                                              ...prevState.filterFields_HappinessSurvey,
                                              RatingFrom : value,
                                            }
                                          }));
                                    }}
                                />  
                                <Select
                                    defaultValue={10}
                                    style={{ width: 42 }}
                                    dropdownMatchSelectWidth={false}
                                    className="ratingNumber"
                                    options={clientHappinessSurveyConfig.ratingOptions()}
                                    onChange={(value, option) => {
                                        setTableFilteredState(prevState => ({
                                            ...prevState,                                            
                                            filterFields_HappinessSurvey: {
                                              ...prevState.filterFields_HappinessSurvey,
                                              RatingTo : value,
                                            }
                                          }));
                                    }}
                                />
                            </div>
                        </div>
                       

						<div className={clienthappinessSurveyStyles.calendarFilterSet}>
							<div className={clienthappinessSurveyStyles.label}>Date</div>
							<div className={clienthappinessSurveyStyles.calendarFilter}>
								<CalenderSVG style={{ height: '16px', marginRight: '16px' }} />
							    <DatePicker
									style={{ backgroundColor: 'red' }}
									onKeyDown={(e) => {
										e.preventDefault();
										e.stopPropagation();
									}}
									className={clienthappinessSurveyStyles.dateFilter}
									placeholderText="Start date - End date"
									selected={startDate}
									onChange={onCalenderFilter}
									startDate={startDate}
									endDate={endDate}
									selectsRange
								/>
							</div>
						</div>
						{/* <div className={clienthappinessSurveyStyles.priorityFilterSet}>
							<div className={clienthappinessSurveyStyles.label}>Set Priority</div>
							<div
								className={clienthappinessSurveyStyles.priorityFilter}
								style={{
									cursor:
										DateTimeUtils.getTodaysDay() === DayName.FRIDAY
											? 'not-allowed'
											: 'pointer',
								}}>
								{DateTimeUtils.getTodaysDay() === DayName.FRIDAY ? (
									<Tooltip
										placement="bottom"
										title="Locked">
										<LockSVG
											style={{
												width: '18px',
												height: '18px',
												cursor:
													DateTimeUtils.getTodaysDay() === DayName.FRIDAY
														? 'not-allowed'
														: 'pointer',
											}}
										/>
									</Tooltip>
								) : (
									<Tooltip
										placement="bottom"
										title="Unlocked">
										<UnlockSVG style={{ width: '18px', height: '18px' }} />
									</Tooltip>
								)}
							</div>
						</div> */}
						<div className={clienthappinessSurveyStyles.priorityFilterSet}>
							<div className={clienthappinessSurveyStyles.label}>Showing</div>

							<div className={clienthappinessSurveyStyles.paginationFilter}>
								<Dropdown
									trigger={['click']}
									placement="bottom"
									overlay={
										<Menu onClick={(e) => {
                                            setPageSize(parseInt(e.key));                                           
                                            if (pageSize !== parseInt(e.key)) {
                                                setTableFilteredState(prevState => ({
                                                    ...prevState,
                                                    totalrecord: parseInt(e.key),
                                                    pagenumber: pageIndex,
                                                  }));                                             
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

         <div className={clienthappinessSurveyStyles.tableDetails}>
                        {isLoading ? (
                            <TableSkeleton />
                        ) : (
                            <WithLoader className="mainLoader">                              
                                <Table  
                                scroll={{ x: '100vw', y: '100vh' }} 
                                bordered={false} 
                                dataSource={clientHappinessSurveyList} 
                                columns={surveyColumnsMemo} 
                                pagination={
                                    search && search?.length === 0
                                        ? null
                                        : {
                                                onChange: (pageNum, pageSize) => {
                                                    setPageIndex(pageNum);
                                                    setPageSize(pageSize);
                                                    setTableFilteredState(prevState => ({
                                                        ...prevState,                                                        
                                                        pagenumber: pageNum,
                                                      }));
                                                },
                                                size: 'small',
                                                pageSize: pageSize,
                                                pageSizeOptions: pageSizeOptions,
                                                total: totalRecords,
                                                showTotal: (total, range) =>
                                                    `${range[0]}-${range[1]} of ${totalRecords} items`,
                                                defaultCurrent: pageIndex,
                                          }
                                }                                
                                />
                            </WithLoader>
                       )} 
         </div>
    </div>

    {isAllowFilters && (
				<Suspense fallback={<div>Loading...</div>}>
					<SurveyFiltersLazyComponent						
						setIsAllowFilters={setIsAllowFilters}						
						setFilteredTagLength={setFilteredTagLength}
						getHTMLFilter={getHTMLFilter}
                        filtersType={clientHappinessSurveyConfig.clientSurveyFilterTypeConfig(filtersList && filtersList)}
						clearFilters={clearFilters}
                        onRemoveSurveyFilters={onRemoveSurveyFilters}
                        setAppliedFilters={setAppliedFilters}
						appliedFilter={appliedFilter}
                        setCheckedState={setCheckedState}
						checkedState={checkedState}
                        setTableFilteredState={setTableFilteredState}
                        tableFilteredState={tableFilteredState}                        
					/>
				</Suspense>
			)}
    <Modal 
        transitionName=""
        className="commonModalWrap"
        centered
        open={generateLink}
        width="904px"
        footer={null}
        onCancel={() => {
            setGenerateLink(false);
        }}>

        <div className={`${clienthappinessSurveyStyles.engagementModalWrap} ${clienthappinessSurveyStyles.generateLinkModal}`}>
			<div className={`${clienthappinessSurveyStyles.headingContainer} ${clienthappinessSurveyStyles.addFeebackContainer}`}>
				<h1>Generate Link</h1>
			</div>

			<div className={clienthappinessSurveyStyles.row}>
				<div className={clienthappinessSurveyStyles.colMd12}>
                    <div className={clienthappinessSurveyStyles.InputGroup}>
                                <label>Company</label>
								<Controller
									render={({ ...props }) => (                                        
										<AutoComplete
											options={autoCompleteCompanyList}
											onSelect={(clientName) => getClientNameValue(clientName)}
											filterOption={true}	
                                            dropdownClassName={clienthappinessSurveyStyles.autocompletecustom}
                                            // className={clienthappinessSurveyStyles.autocompletecustom}										
											onChange={(company) => {
												setValue('company', company);
											}}
                                            getOptionLabel={(option) => (
                                                <div className={clienthappinessSurveyStyles.autocompletecustom}>{option}</div>
                                            )}                                          
										/>
									)}
									// {...register('clientName', {
									// 	validate,
									// })}
                                    value={watchCompany}
									name="company"
									control={control}									
								/>                    
                    </div>
				</div>
                <div className={clienthappinessSurveyStyles.colMd12}>
                    <div className={clienthappinessSurveyStyles.InputGroup}>
                        <HRInputField
                            register={register}
                            label={'Client'}
                            name="client"
                            type={InputType.TEXT}
                            placeholder="Velma Balaji Reddy"
                            errors={errors}
                            validationSchema={{
                                required: 'please select client name',
                            }}
                            required
                        />
                    </div>
				</div>

                <div className={clienthappinessSurveyStyles.colMd12}>
                    <div className={clienthappinessSurveyStyles.InputGroup}>
                        <HRInputField
                            register={register}
                            label={'Email'}
                            name="email"
                            errors={errors}
                            type={InputType.TEXT}
                            placeholder="sv@nuecluesx.io"     
                            required
                            validationSchema={{
                                required: 'please enter email',
                            }}                   
                        />
                    </div>
				</div>
			</div>
			<div className={clienthappinessSurveyStyles.formPanelAction}>
				<button
					className={clienthappinessSurveyStyles.btn} 
                    onClick={() => setGenerateLink(false)}
                    >
					Cancel
				</button>
                <button
					type="submit"
					// onClick={submitGenerateLinkData}
					className={clienthappinessSurveyStyles.btnPrimary}>
					Generate Link
				</button>
			</div>
		</div>
    </Modal>
    <Modal 
        transitionName=""
        className="commonModalWrap"
        centered
        open={selecteDateOption}
        width="904px"
        footer={null}
        onCancel={() => {
            setSelectDateOption(false);
        }}>

        <div className={`${clienthappinessSurveyStyles.engagementModalWrap} ${clienthappinessSurveyStyles.generateLinkModal}`}>
			<div className={`${clienthappinessSurveyStyles.headingContainer} ${clienthappinessSurveyStyles.addFeebackContainer}`}>
				<h1>Select Date Type</h1>
			</div>

			<div className={clienthappinessSurveyStyles.row}>
            <Radio.Group
                    defaultValue={1}
                    // className={InterviewScheduleStyle.radioGroup}
                    // onChange={onSlotChange}
                   >
                    <Radio value={1}>
                    Created date
                    </Radio>
                    <Radio value={2}>Feedback date</Radio>                    
            </Radio.Group>
			</div>
			
		</div>
    </Modal>
    </>
  )
}
export default ClienthappinessSurvey