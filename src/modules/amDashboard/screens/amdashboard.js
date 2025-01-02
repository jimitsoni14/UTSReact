import React, { useEffect, useMemo, useState } from 'react'
import amStyles from './amdashboard.module.css'
import { ReactComponent as SearchSVG } from 'assets/svg/search.svg';
import TicketImg from "assets/tickiteheader.png";
import Handshake from 'assets/svg/handshake.svg';
import RenewEng from 'assets/svg/renewEng.png'
import SparkIcon from 'assets/svg/sparkIcon.png'
import { InputType } from 'constants/application';
import { Tabs, Select, Table, Modal } from 'antd';
import HRSelectField from 'modules/hiring request/components/hrSelectField/hrSelectField';
import { amDashboardDAO } from 'core/amdashboard/amDashboardDAO';
import { UserSessionManagementController } from 'modules/user/services/user_session_services';
import { Link, useNavigate } from 'react-router-dom';
import LogoLoader from 'shared/components/loader/logoLoader';
import TicketModal from '../ticketModal/ticketModal';
import moment from 'moment';
import UTSRoutes from 'constants/routes';

function AMDashboard() {
    const navigate = useNavigate()
    const [ searchText , setSearchText] = useState('');
    const [title, setTitle] = useState("Active");
    const [dashboardTabTitle, setDashboardTabTitle] = useState("Tickets");
    const [ticketTabTitle, setTicketTabTitle] = useState("Open");
    const [renewalTabTitle, setRenewalTabTitle] = useState("Upcoming Renewal");
    const [selectedAM, setSelectedAM] = useState([])
    const [userData, setUserData] = useState({});
    const [summaryCount, setSummaryCount] = useState({});
    const [amList,setAMList] = useState([])
    const [isLoading, setLoading] = useState(false);
    const [engagementList, setEngagementList] = useState([])
    const [zohoTicketList, setzohoTicketList] = useState([])
    const [renewalList,setRenewalList] = useState([]);
    const [showTimeline,setShowTimeLine] = useState(false)
    const [historyData,setHistoryData] = useState({})
    const [HistoryInfo, setHistoryInfo] = useState([])
    const [conversationInfo,setConversationInfo] = useState([])
    const [historyLoading,  setHistoryloading] = useState(false)

	useEffect(() => {
		const getUserResult = async () => {
			let userData = UserSessionManagementController.getUserSession();
			if (userData) setUserData(userData);
		};
		getUserResult();
	}, []);

    const getHistory = async (id) => {
        setHistoryloading(true)
        const historyResult = await amDashboardDAO.getTicketHistoryDAO(id)
        const conversationResult = await amDashboardDAO.getTicketConversationDAO(id)
        setHistoryloading(false)
        if(historyResult.statusCode === 200){
            setHistoryInfo(historyResult.responseBody)
        }else{
            setHistoryInfo([])
        }

        if( conversationResult.statusCode === 200){
          setConversationInfo(conversationResult.responseBody)
        }else{
          setConversationInfo([])
        }
    }

    const openHistory =  (data)=>{
        setShowTimeLine(true)
        setHistoryData(data)
        getHistory(data.zohoTicketId) 
    }

    const ActiveEngagementList = ({data, columns}) =>{
        return <div className={amStyles.engagementListContainer}>
            <Table
            scroll={{ y: '480px'}}
            id={"EngagementActiveListingTable" }
            columns={columns}
            bordered={false}
            dataSource={data}
            pagination={false} 
            />
        {/* {data.map(item=>{
            return <div className={amStyles.engagementList}>
                <span className={amStyles.amName}>{item.talentName}</span>
                <ul>
                    <li>Email ID: <span>{item.emailID}</span></li>
                    <li>Engagement ID: <span> <Link to={`/viewOnboardDetails/${item.onBoardID}/${item.enggementStatus === "Ongoing" ? true : false }`} target='_blank'  style={{
            color: `var(--uplers-black)`,
            textDecoration: 'underline',
        }}>{item.engagementID}</Link> </span></li>
                    <li>HR Number: <span><Link
							to={`/allhiringrequest/${item.hrid}`}
							target='_blank'
							style={{ color: '#006699', textDecoration: 'underline' }}>
							{item.hR_Number}
						</Link></span></li>
                </ul>
            </div>
        })} */}
        </div>
    }
    const getFilters = async ()=>{
        const result = await amDashboardDAO.getFiltersDAO()
        if(result.statusCode === 200){
            setAMList(result.responseBody.amName.map(val=> ({ value: val.text, label: val.value })))
        }
    }

    const getDashboardData = async ()=>{
        if(userData?.UserId){
            setLoading(true)
             let payload = {
                "FilterFields_AMDashboard": {
                    amName:selectedAM.join(","),
                    userID: userData?.UserId,
                    EngType: title[0] 
                }
               
        } 
        let renewalPayload = {
            "FilterFields_AMDashboard": {
                amName:selectedAM.join(","),
                userID: userData?.UserId,
                EngType: renewalTabTitle[0] === 'U' ? 'A' : renewalTabTitle[0]
            }
           
    }
        let zohoPayload = {"userId":  userData?.UserId , status: ticketTabTitle[0] === 'O' ? 'A' : ticketTabTitle[0] ,amNameIds:selectedAM.join(","), }
        let summaryPayload = {"userId":  userData?.UserId,amNameIds:selectedAM.join(",") }
        const result = await amDashboardDAO.getDashboardDAO(payload)  
        const renewalResult = await amDashboardDAO.getRenewalDAO(renewalPayload)   
        const zohoResult = await amDashboardDAO.getZohoTicketsDAO(zohoPayload)
        const summaryResult = await amDashboardDAO.getSummaryDAO(summaryPayload)

        setLoading(false)
        // console.log('"zohoResult ', zohoResult)
        if(zohoResult?.statusCode === 200){
            setzohoTicketList(zohoResult.responseBody)
        }else if(zohoResult?.statusCode === 404){
            setzohoTicketList([])
        }


        if(renewalResult?.statusCode === 200){
            setRenewalList(renewalResult.responseBody)
        }
        else if(renewalResult?.statusCode === 404){
            setRenewalList([])
        }
        // console.log('"dd ', result)
        if(result?.statusCode === 200){
            setEngagementList(result.responseBody)
        }
        else if(result?.statusCode === 404){
            setEngagementList([])
        }
        // console.log('summaryResult', summaryResult)
        if(summaryResult?.statusCode=== 200){
            setSummaryCount(summaryResult.responseBody)
        }
        else if(summaryResult?.statusCode === 404){
            setSummaryCount({})
        }
        }
       
    }

    const engColumnsMemo = useMemo(()=>{
        return [{
            title: 'Client ( Email )',
            dataIndex: 'client',
            key: 'client',
            align: 'left',
            width: '100px',
        },
        {
            title: 'Talent ( Email )',
            dataIndex: 'talentName',
            key: 'talentName',
            align: 'left',
            width: '100px',
            render:(text,result)=>{
                return `${text ? text : ''} ${result.emailID ? `( ${result.emailID} )` : ''}`;
            }
        },
        {
            title: 'Engagent ID',
            dataIndex: 'engagementID',
            key: 'engagementID',
            align: 'left',
            width: '100px',
            render:(text,item)=>{
                return <Link to={`/viewOnboardDetails/${item.onBoardID}/${item.isOngoing === "Ongoing" ? true : false }`} target='_blank'  style={{
                    color: `var(--uplers-black)`,
                    textDecoration: 'underline',
                }}>{item.engagementID}</Link>
            }
        },
        {
            title: 'HR #',
            dataIndex: 'hR_Number',
            key: 'hR_Number',
            align: 'left',
            width: '100px',
            render:(text,item)=>{
                return <Link
                to={`/allhiringrequest/${item.hrid}`}
                target='_blank'
                style={{ color: '#006699', textDecoration: 'underline' }}>
                {item.hR_Number}
            </Link>
            }
        },
        {
            title: 'End Date',
            dataIndex: 'enggementEndate',
            key: 'enggementEndate',
            align: 'left',
            width: '100px',
        },
        {
            title: 'Status',
            dataIndex: 'enggementStatus',
            key: 'enggementStatus',
            align: 'left',
            width: '100px',
        },
       

    ]
    },[renewalList])

    const engActiveColumnsMemo = useMemo(()=>{
        return [
            {
                title: 'Engagement ID/ HR #',
                dataIndex: 'engagementID',
                key: 'engagementID',
                align: 'left',
                width: '100px',
                render:(text,item)=>{
                    return <>
                    <Link to={`/viewOnboardDetails/${item.onBoardID}/${item.isOngoing === "Ongoing" ? true : false }`} target='_blank'  style={{
                        color: `var(--uplers-black)`,
                        textDecoration: 'underline',
                    }}>{item.engagementID}</Link> <br/>
                    / <Link
                    to={`/allhiringrequest/${item.hrid}`}
                    target='_blank'
                    style={{ color: '#006699', textDecoration: 'underline' }}>
                    {item.hR_Number}
                </Link>
                    </>
                }
            },
            {
            title: 'Client',
            dataIndex: 'client',
            key: 'client',
            align: 'left',
            width: '100px',
        },
        {
            title: 'Talent',
            dataIndex: 'talentName',
            key: 'talentName',
            align: 'left',
            width: '100px',
            render:(text,result)=>{
                return `${text ? text : ''} ${result.emailID ? `( ${result.emailID} )` : ''}`;
            }
        },
        
        // {
        //     title: 'HR #',
        //     dataIndex: 'hR_Number',
        //     key: 'hR_Number',
        //     align: 'left',
        //     width: '100px',
        //     render:(text,item)=>{
        //         return <Link
        //         to={`/allhiringrequest/${item.hrid}`}
        //         target='_blank'
        //         style={{ color: '#006699', textDecoration: 'underline' }}>
        //         {item.hR_Number}
        //     </Link>
        //     }
        // },
        {
            title: 'Eng. Type',
            dataIndex: 'engType',
            key: 'engType',
            align: 'left',
            width: '100px',
        },
        {
            title: 'Start Date',
            dataIndex: 'contractStartDate',
            key: 'contractStartDate',
            align: 'left',
            width: '100px',
        },
        {
            title: 'End Date',
            dataIndex: 'contractEndDate',
            key: 'contractEndDate',
            align: 'left',
            width: '100px',
        },
        {
            title: 'Status',
            dataIndex: 'enggementStatus',
            key: 'enggementStatus',
            align: 'left',
            width: '100px',
        },
       

    ]
    },[engagementList])
    const engClosedColumnsMemo = useMemo(()=>{
        return [
            {
                title: 'Engagement ID/ HR #',
                dataIndex: 'engagementID',
                key: 'engagementID',
                align: 'left',
                width: '100px',
                render:(text,item)=>{                  
                    return <>
                    <Link to={`/viewOnboardDetails/${item.onBoardID}/${item.isOngoing === "Ongoing" ? true : false }`} target='_blank'  style={{
                        color: `var(--uplers-black)`,
                        textDecoration: 'underline',
                    }}>{item.engagementID}</Link> <br/>
                    / <Link
                    to={`/allhiringrequest/${item.hrid}`}
                    target='_blank'
                    style={{ color: '#006699', textDecoration: 'underline' }}>
                    {item.hR_Number}
                </Link>
                    </>
                }
            },
            {
            title: 'Client',
            dataIndex: 'client',
            key: 'client',
            align: 'left',
            width: '100px',
        },
        {
            title: 'Talent',
            dataIndex: 'talentName',
            key: 'talentName',
            align: 'left',
            width: '100px',
            render:(text,result)=>{
                return `${text ? text : ''} ${result.emailID ? `( ${result.emailID} )` : ''}`;
            }
        },
        
        // {
        //     title: 'HR #',
        //     dataIndex: 'hR_Number',
        //     key: 'hR_Number',
        //     align: 'left',
        //     width: '100px',
        //     render:(text,item)=>{
        //         return <Link
        //         to={`/allhiringrequest/${item.hrid}`}
        //         target='_blank'
        //         style={{ color: '#006699', textDecoration: 'underline' }}>
        //         {item.hR_Number}
        //     </Link>
        //     }
        // },
        {
            title: 'Eng. Type',
            dataIndex: 'engType',
            key: 'engType',
            align: 'left',
            width: '100px',
        },
        {
            title: 'Start Date',
            dataIndex: 'contractStartDate',
            key: 'contractStartDate',
            align: 'left',
            width: '100px',
        },
        {
            title: 'Actual End Date / End Date',
            dataIndex: 'contractEndDate',
            key: 'contractEndDate',
            align: 'left',
            width: '200px',
            render:(text , item)=>{
                return `${item.actualEndDate ? `${item.actualEndDate}` : ''} ${text ?  `/ ${text}` : ''}`
            }
        },
        {
            title: 'Status',
            dataIndex: 'enggementStatus',
            key: 'enggementStatus',
            align: 'left',
            width: '100px',
        },
       

    ]
    },[engagementList])

    const tableColumnsMemo=  useMemo(()=>{
        return [{
            title: 'Ticket #',
            dataIndex: 'ticketNumber',
            key: 'ticketNumber',
            align: 'left',
            width: '60px',
            render:(text,item)=>{
                return <a href={item.webUrl} target='_blank' rel="noreferrer"  style={{
                    color: `var(--uplers-black)`,
                    textDecoration: 'underline',
                }}>{text}</a>
            }
        },
        {
            title: 'Subjects',
            dataIndex: 'subject',
            key: 'subject',
            align: 'left',
            width: '120px',
            render:(text,item)=>{
                return  <p onClick={()=> openHistory(item)} style={{
                    color: `var(--uplers-black)`,
                    textDecoration: 'underline',
                    cursor:'pointer',
                }}>{text}</p>
            }
        },
        {
            title: 'Contact',
            dataIndex: 'contactName',
            key: 'contactName',
            align: 'left',
            width: '120px',
            render:(text,result)=>{
                return `${text ? text : ''} ${result.email ? `- ${result.email}` : ''}`;
            }
        },
        {
            title: 'Talent',
            dataIndex: 'talentName',
            key: 'talentName',
            align: 'left',
            width: '120px',
            render:(text,result)=>{
                return `${text ? text : ''} ${result.talentEmail ? `- ${result.talentEmail}` : ''}`;
            }
        },
      
        // {
        //     title: 'Description',
        //     dataIndex: 'description',
        //     key: 'description',
        //     align: 'left',
        //     width: '120px',
        // },
        {
            title: 'Priority',
            dataIndex: 'priority',
            key: 'priority',
            align: 'left',
            width: '60px',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            align: 'left',
            width: '60px',
        },      
        {
            title: 'Created Date',
            dataIndex: 'createdTime',
            key: 'createdTime',
            align: 'left',
            width: '100px',
            render:(text)=>{
                return moment(text).format('DD-MM-YYYY');
            }
        },
        {
            title: 'Last Updated Date',
            dataIndex: 'modifiedTime',
            key: 'modifiedTime',
            align: 'left',
            width: '100px',
            render:(text)=>{
                return text ? moment(text).format('DD-MM-YYYY') : '';
            }
        },
    ]
    },[zohoTicketList])

    useEffect(()=>{
        getFilters()
    },[])

    useEffect(()=>{
        getDashboardData()
    },[userData,selectedAM, title,ticketTabTitle,renewalTabTitle])

    let isAdmin = userData.LoggedInUserTypeID !==  4  //  AM

  return (
    <div className={amStyles.hiringRequestContainer}>
        <LogoLoader visible={isLoading} />

        <div className={amStyles.addnewHR} style={{ margin: '0px 0 12px 0'}}>
				<div className={amStyles.hiringRequest} onClick={()=>setShowTimeLine(true)}>
					 Dashboard 
				</div>
				<LogoLoader visible={isLoading} />
			</div>

            {isAdmin &&    <div className={amStyles.filterContainer}>
            <div className={amStyles.filterSets} style={{justifyContent:'left', background:'none'}}>
                Select AM
				<div className={amStyles.filterSetsInner}  style={{width:'40%', marginLeft:'10px'}}>
                  <Select
					id="selectedValue"
					placeholder="select AM" 
					mode="multiple"
					value={selectedAM}
					showSearch={true}
					onChange={(value, option) => {console.log({value, option}); setSelectedAM(value )}}
					options={amList}
                    optionFilterProp="label"
					getPopupContainer={(trigger) => trigger.parentElement}
				/>

               

					</div> <p className={amStyles.resetText} onClick={()=> setSelectedAM([])}>Reset Filter</p>
					{/* <div className={amStyles.filterRight}>
						<div className={amStyles.searchFilterSet}>
							<SearchSVG style={{ width: '16px', height: '16px' }} />
							<input
								type={InputType.TEXT}
								className={amStyles.searchInput}
								placeholder="Search Table"
								value={searchText}
								onChange={(e) => {
									 setSearchText(e.target.value)
									// return setDebouncedSearch(
									// 	engagementUtils.engagementListSearch(e, apiData),
									// );
								}}
							/>
						</div>
					</div> */}
				</div>
            </div>}

            <div className={amStyles.filterSets} style={{ marginBottom:'20px'}} >
                        <div className={amStyles.ticketInfoDash}>
                            <img
                            src={TicketImg}
                            alt="Ticket"
                            />
                            <h5>Active Tickets - </h5>
                            <p>{summaryCount?.activeTickets ?? 0}</p>
                        </div>

                        <div className={amStyles.ticketInfoDash}>
                        <img
                            src={SparkIcon}
                            alt="SparkIcon"
                            />
                            <h5>Closed Tickets - </h5>
                            <p>{summaryCount?.closedTickets ?? 0}</p>
                        </div>

                        <div className={amStyles.ticketInfoDash}>
                        <img
                            src={RenewEng}
                            alt="renewEngng"
                            />
                            <h5>Upcoming Renewals - </h5>
                            <p>{summaryCount?.upcomingRenewals ?? 0}</p>
                        </div>

                        <div className={amStyles.ticketInfoDash}>
                        <img
                            src={Handshake}
                            alt="handshaker"
                          />
                            <h5>Total Clients - </h5>
                            <p>{summaryCount?.totalClients ?? 0}</p>
                        </div>
            </div>



            <Tabs 
              onChange={(e) => setDashboardTabTitle(e)}
              defaultActiveKey="1"
              activeKey={dashboardTabTitle}
              animated={true}
              tabBarGutter={50}
              tabBarStyle={{ borderBottom: `1px solid var(--uplers-border-color)` }}
              items={[
                {
                    label: "Tickets",
                    key: "Tickets",
                    children: <>
                        {/* <div className={amStyles.addnewHR} style={{margin:'20px 0'}}>
                            <div className={amStyles.hiringRequest}  >
                                Tickets
                            </div>
                        </div> */}
                        <div style={{marginTop:'20px'}}>
                        <Tabs
                                    onChange={(e) => setTicketTabTitle(e)}
                                    defaultActiveKey="1"
                                    activeKey={ticketTabTitle}
                                    animated={true}
                                    tabBarGutter={50}
                                    tabBarStyle={{ borderBottom: `1px solid var(--uplers-border-color)` }}
                                    items={[
                                        {
                                        label: "Open",
                                        key: "Open",
                                        children: <Table
                                        scroll={{ y: '480px'}}
                                        id="TicketsOpenListingTable"
                                        columns={tableColumnsMemo}
                                        bordered={false}
                                        dataSource={zohoTicketList}
                                        pagination={false} 
                                        />,
                                        },
                                            {
                                            label: "Closed",
                                            key: "Closed",
                                            children: <Table
                                            scroll={{ y: '480px'}}
                                            id="TicketsClosedListingTable"
                                            columns={tableColumnsMemo}
                                            bordered={false}
                                            dataSource={zohoTicketList}
                                            pagination={false} 
                                            />,
                                            },
                                        // {
                                        // label: "Closed engagement",
                                        // key: "Closed engagement",
                                        // children: <ActiveEngagementList />,
                                        // },
                                    ]}
                                    />
                        </div>
                    </>
                },
                
                {
                        label: "Engagement Renewal",
                        key: "Engagement Renewal",
                        children:<>
                         {/* <div className={amStyles.addnewHR} style={{margin:'20px 0'}}>
				<div className={amStyles.hiringRequest}  >
                    Client Renewals
				</div>
			</div> */}

            {renewalList[0]?.upcomingRenewalText &&      <div className={amStyles.clientRenewalsWarning} style={{marginTop:'20px'}}>
                {renewalList[0]?.upcomingRenewalText}
            </div>}
       
<div style={{marginTop:'20px'}}>
 <Tabs
                                    onChange={(e) => setRenewalTabTitle(e)}
                                    defaultActiveKey="1"
                                    activeKey={renewalTabTitle}
                                    animated={true}
                                    tabBarGutter={50}
                                    tabBarStyle={{ borderBottom: `1px solid var(--uplers-border-color)` }}
                                    items={[
                                        {
                                        label: "Upcoming Renewal",
                                        key: "Upcoming Renewal",
                                        children:  <Table
                                        scroll={{ y: '480px'}}
                                        id="RenewalsActiveListingTable"
                                        columns={engColumnsMemo}
                                        bordered={false}
                                        dataSource={renewalList}
                                        pagination={false} 
                                        />,
                                        },
                                        {
                                            label: "Closed Engagements",
                                            key: "Closed Engagements",
                                            children:  <Table
                                            scroll={{ y: '480px'}}
                                            id="RenewalsClosedListingTable"
                                            columns={engColumnsMemo}
                                            bordered={false}
                                            dataSource={renewalList}
                                            pagination={false} 
                                            />,
                                            },
                                        // {
                                        // label: "Closed engagement",
                                        // key: "Closed engagement",
                                        // children: <ActiveEngagementList />,
                                        // },
                                    ]}
                                    />
</div>
           
                        </>
                },
                {
                    label: "Engagements",
                    key: "Engagements",
                    children:<>
                                   
            {/* <div className={amStyles.addnewHR} style={{margin:'20px 0'}}>
				<div className={amStyles.hiringRequest}  >
					Engagements
				</div>
			</div> */}
      

            <div className={amStyles.mainContainer} style={{marginTop:'20px'}}>
                                <div className={amStyles.mainContainerInner}>
                                <Tabs
                                    onChange={(e) => setTitle(e)}
                                    defaultActiveKey="1"
                                    activeKey={title}
                                    animated={true}
                                    tabBarGutter={50}
                                    tabBarStyle={{ borderBottom: `1px solid var(--uplers-border-color)` }}
                                    items={[
                                        {
                                        label: "Active",
                                        key: "Active",
                                        children: <ActiveEngagementList data={engagementList} columns={engActiveColumnsMemo} />,
                                        },
                                        {
                                        label: "Closed",
                                        key: "Closed",
                                        children: <ActiveEngagementList data={engagementList} columns={engClosedColumnsMemo} />,
                                        },
                                    ]}
                                    />


                                </div>
                                {/* <div className={amStyles.mainContainerInner}>
                                    <div className={amStyles.zohoMain}>
                                        <h4>Zoho Tickets</h4>

                                        {zohoTicketList.map(ticket=> <div>
                                            <div >
                                                <p>{ticket.subject}</p> <p>{ticket.status}</p>
                                            </div>
                                             </div>)}
                                    </div>
                                </div> */}


            </div>
                    </>
                }
              ]}
            />
       




                <Modal
                width="930px"
						centered
						footer={null}
						className="engagementAddFeedbackModal"
						open={showTimeline}
						onCancel={() =>
							setShowTimeLine(false)
						}>
                <TicketModal historyLoading={historyLoading} historyData={historyData} HistoryInfo={HistoryInfo} conversationInfo={conversationInfo} setShowTimeLine={setShowTimeLine} />
                </Modal>

    </div>
  )
}

export default AMDashboard