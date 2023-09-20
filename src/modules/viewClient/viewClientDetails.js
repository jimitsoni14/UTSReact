import WithLoader from "shared/components/loader/loader";
import { Button, Table, Tag } from 'antd';
// import dealDetailsStyles from './dealDetailsStyle.module.css';

import dealDetailsStyles from './viewClientDetails.module.css';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { DealDAO } from 'core/deal/dealDAO';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import UTSRoutes from 'constants/routes';
import { ReactComponent as ArrowLeftSVG } from 'assets/svg/arrowLeft.svg';
import { ReactComponent as DeleteLightSVG } from 'assets/svg/deleteLight.svg';
import viewClient from 'assets/viewClient.png'

import { ReactComponent as ArrowDownSVG } from 'assets/svg/arrowDown.svg';

import { HTTPStatusCode } from 'constants/network';
import moment from 'moment';
import {NetworkInfo} from 'constants/network'
import HROperator from "modules/hiring request/components/hroperator/hroperator";
import { allClientRequestDAO } from "core/allClients/allClientsDAO";
import { allClientsConfig } from "modules/hiring request/screens/allClients/allClients.config";

function ViewClientDetails() {
	const [isLoading, setLoading] = useState(false);
	const [viewDetails,setViewDetails] = useState({});
	const {companyID,clientID} = useParams();
	const [isExpanded, setIsExpanded] = useState(false);
	const navigate = useNavigate();
	const columns = useMemo(
		() => allClientsConfig.ViewClienttableConfig(),
		[],
	); 
	useEffect(() => {
		getDataForViewClient();
	},[]);

	const getDataForViewClient = async () => {
		setLoading(true)
		let response = await allClientRequestDAO.getClientDetailsForViewDAO(companyID,clientID);	
		setLoading(false);
		setViewDetails(response?.responseBody);	
	}
    return(
        <WithLoader
			showLoader={isLoading}
			className="mainLoader">
			<div className={dealDetailsStyles.dealDetailsWrap}>
				<div className={dealDetailsStyles.dealDetailsBack}>
					<Link to={UTSRoutes.ALLCLIENTS}>
						<div className={dealDetailsStyles.goback}>
							<ArrowLeftSVG style={{ width: '16px' }} />
							<span>Go Back</span>
						</div>
					</Link>
				</div>

				<div className={dealDetailsStyles.dealDetailsTitle}>
					<h1>
						{/* <img
							src={viewClient}
							alt={viewDetails?.clientDetails?.companyInitial}
						/> */}
						<span className={dealDetailsStyles.viewClientUser} style={{backgroundImage: viewClient}}>
							{viewDetails?.clientDetails?.companyInitial}							
						</span>
						&nbsp;{viewDetails?.clientDetails?.companyName}						
					</h1>
					<div className={dealDetailsStyles.dealDetailsRight}>
						{/* <button  className={dealDetailsStyles.yellowOutlinedButton} type="button">View BQ Form</button>  */}

                        {/* <HROperator
                            title="Edit Company"
                            icon={<ArrowDownSVG style={{ width: '16px' }} />}
                            backgroundColor={`#fff`}
                            iconBorder={`1px solid var(--color-sunlight)`}
                            isDropdown={true}
                            overlayClassName={dealDetailsStyles.viewClientdrop}
                            className={dealDetailsStyles.viewClientdrop}
                        /> */}						
						<button type="button" onClick={() => navigate(`/editclient/${companyID}`)}>Edit Company</button>
						<button type="button" onClick={() => navigate('/allhiringrequest/addnewhr')} >Create HR</button>
					
						{/* <div className={dealDetailsStyles.deleteButton}>
							<DeleteLightSVG width="24" />
						</div> */}
					</div>
				</div>

				<div className={dealDetailsStyles.dealDetailsTopCard}>
					<ul>
						<li>
							<div className={dealDetailsStyles.topCardItem}>
								<span>Client Name</span>
								{viewDetails?.clientDetails?.clientName ? viewDetails?.clientDetails?.clientName : "NA"}
							</div>
						</li>
						<li>
							<div className={dealDetailsStyles.topCardItem}>
								<span>Client Source</span>
								{viewDetails?.clientDetails?.clientSource ? viewDetails?.clientDetails?.clientSource : "NA"}
							</div>
						</li>
						<li>
							<div className={dealDetailsStyles.topCardItem}>
								<span>Status</span>
								{viewDetails?.clientDetails?.clientStatus ? viewDetails?.clientDetails?.clientStatus : "NA"}
							</div>
						</li>
						<li>
							<div className={dealDetailsStyles.topCardItem}>
								<span>Uplers POC</span>
								{viewDetails?.clientDetails?.uplersPOC ? viewDetails?.clientDetails?.uplersPOC : "NA"}
							</div>
						</li>
					</ul>
				</div>

				<div className={dealDetailsStyles.dealDetailsCard}>
					<div className={dealDetailsStyles.dealLeftCard}>
						<div className={dealDetailsStyles.dealLeftItem}>
							<h2>Client/Company Details</h2>
							<ul>
								<li>
									<span>Client Email:</span>
									{viewDetails?.clientDetails?.clientEmail ? viewDetails?.clientDetails?.clientEmail : "NA"}
								</li>
                                <li>
									<span>Lead Source : </span>
									{viewDetails?.clientDetails?.leadSource ? viewDetails?.clientDetails?.leadSource : "NA"}
								</li>
								<li>
									<span>Client Linkedin : -</span>
                                    {viewDetails?.clientDetails?.clientLinkedIn ? <a
										href={viewDetails?.clientDetails?.clientLinkedIn}
										target="_blank"
										className={dealDetailsStyles.dealItemLink}>{viewDetails?.clientDetails?.clientLinkedIn}
                                        <svg
											width="30"
											height="16"
											viewBox="0 0 16 16"
											fill="none"
											xmlns="http://www.w3.org/2000/svg">
											<path
												d="M14.8165 0H1.18016C0.529039 0 0 0.516431 0 1.15372V14.8455C0 15.4826 0.529039 16 1.18016 16H14.8165C15.4688 16 16 15.4826 16 14.8455V1.15372C16 0.516431 15.4688 0 14.8165 0Z"
												fill="#007BB6"></path>
											<path
												d="M3.55837 2.20312C4.31761 2.20312 4.93387 2.81968 4.93387 3.5792C4.93387 4.33903 4.31761 4.95558 3.55837 4.95558C2.79622 4.95558 2.18164 4.33903 2.18164 3.5792C2.18164 2.81968 2.79622 2.20312 3.55837 2.20312ZM2.37007 5.99873H4.7456V13.6342H2.37007V5.99873Z"
												fill="white"></path>
											<path
												d="M6.23438 5.99809H8.50916V7.04186H8.54172C8.85822 6.44158 9.63251 5.80859 10.787 5.80859C13.1899 5.80859 13.6339 7.38952 13.6339 9.44588V13.6335H11.2611V9.92039C11.2611 9.03495 11.2457 7.89582 10.0279 7.89582C8.79311 7.89582 8.60468 8.86096 8.60468 9.85697V13.6335H6.23438V5.99809Z"
												fill="white"></path>
										</svg>
                                        </a> : "NA"}
								</li>
                                <li>
									<span>Lead User: </span>
									{viewDetails?.clientDetails?.leadUser ? viewDetails?.clientDetails?.leadUser : "NA"}
								</li>
								<li>
									<span>Company URL : </span>
                                    {viewDetails?.clientDetails?.companyURL ? <a
										href={viewDetails?.clientDetails?.companyURL}
										target="_blank"
										className={dealDetailsStyles.dealItemLink}>{viewDetails?.clientDetails?.companyURL}</a> : "NA"}
								</li>
                                <li>
									<span>GEO: </span>
									{viewDetails?.clientDetails?.geo ? viewDetails?.clientDetails?.geo : "NA"}
								</li>
								<li>
									<span>Company Linkedin : </span>
                                    {viewDetails?.clientDetails?.companyLinkedIn ? <a
										href={viewDetails?.clientDetails?.companyLinkedIn}
										target="_blank"
										className={dealDetailsStyles.dealItemLink}>
                                        {viewDetails?.clientDetails?.companyLinkedIn}
										<svg
											width="30"
											height="16"
											viewBox="0 0 16 16"
											fill="none"
											xmlns="http://www.w3.org/2000/svg">
											<path
												d="M14.8165 0H1.18016C0.529039 0 0 0.516431 0 1.15372V14.8455C0 15.4826 0.529039 16 1.18016 16H14.8165C15.4688 16 16 15.4826 16 14.8455V1.15372C16 0.516431 15.4688 0 14.8165 0Z"
												fill="#007BB6"></path>
											<path
												d="M3.55837 2.20312C4.31761 2.20312 4.93387 2.81968 4.93387 3.5792C4.93387 4.33903 4.31761 4.95558 3.55837 4.95558C2.79622 4.95558 2.18164 4.33903 2.18164 3.5792C2.18164 2.81968 2.79622 2.20312 3.55837 2.20312ZM2.37007 5.99873H4.7456V13.6342H2.37007V5.99873Z"
												fill="white"></path>
											<path
												d="M6.23438 5.99809H8.50916V7.04186H8.54172C8.85822 6.44158 9.63251 5.80859 10.787 5.80859C13.1899 5.80859 13.6339 7.38952 13.6339 9.44588V13.6335H11.2611V9.92039C11.2611 9.03495 11.2457 7.89582 10.0279 7.89582C8.79311 7.89582 8.60468 8.86096 8.60468 9.85697V13.6335H6.23438V5.99809Z"
												fill="white"></path>
										</svg>
									</a> : "NA"}
								</li>
                                <li>
									<span>Total TR:</span>
                                    {viewDetails?.clientDetails?.tr ? viewDetails?.clientDetails?.tr : "NA"}
								</li>
							</ul>
						</div>					
					</div>
					<div className={dealDetailsStyles.dealRightCard}>
						<div className={dealDetailsStyles.dealLeftItem}>
							<h2>Additional Company Information</h2>
							<ul>
								<li>
									<span>Industry : </span>
									{viewDetails?.clientDetails?.industry ? viewDetails?.clientDetails?.industry : "NA"}
								</li>
								<li>
									<span>Company Size : </span>
									{viewDetails?.clientDetails?.companySize ? viewDetails?.clientDetails?.companySize :"NA"}
								</li>
                                <li>
									<span>Do the client have experience hiring talent outside of home country, especially from offshore locations like India?:</span>
                                    {viewDetails?.clientDetails?.allowOffshore ? 'Yes' : 'No'} 
								</li>
								<li>
									<span>About Company: </span>							
									{!isExpanded ?  (viewDetails?.clientDetails?.aboutCompany.length  > 150 ?
									<><span>{viewDetails?.clientDetails?.aboutCompany.slice(0, 150)}...</span>
									<a onClick={() => setIsExpanded(true)} className={dealDetailsStyles.viewClientReadMore}>read more</a></>
									 : viewDetails?.clientDetails?.aboutCompany.length === 0 ? "NA" : viewDetails?.clientDetails?.aboutCompany) : 

									 viewDetails?.clientDetails?.aboutCompany  ? viewDetails?.clientDetails?.aboutCompany : "NA"}
									{/* {(isExpanded) ? viewDetails?.clientDetails?.aboutCompany : <>{viewDetails?.clientDetails?.aboutCompany.slice(0, 150)}...<a onClick={() => setIsExpanded(true)} className={dealDetailsStyles.viewClientReadMore}>read more</a></>} */}
								</li>
							</ul>
						</div>
					</div>
				</div>
                <Table 
				scroll={{  y: '100vh' }}
				dataSource={viewDetails.hrList ? viewDetails?.hrList : []} 
				columns={columns} 
				pagination={false}
				/>
			</div>
		</WithLoader>
    )
}

export default ViewClientDetails;