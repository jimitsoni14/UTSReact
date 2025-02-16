import { Table, Tag } from 'antd';
import dealDetailsStyles from './dealDetailsStyle.module.css';
import arrow from '../../../../assets/svg/trending.svg';
import { useCallback, useEffect, useState } from 'react';
import { DealDAO } from 'core/deal/dealDAO';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import UTSRoutes from 'constants/routes';
import { ReactComponent as ArrowLeftSVG } from 'assets/svg/arrowLeft.svg';
import { ReactComponent as DeleteLightSVG } from 'assets/svg/deleteLight.svg';
import { HTTPStatusCode } from 'constants/network';
import WithLoader from 'shared/components/loader/loader';
import moment from 'moment';
import {NetworkInfo} from 'constants/network'

const columns = [
	{
		title: '',
		dataIndex: '',
		key: '',
		width: '55px',
		render: () => (
			<svg
				width="17"
				height="16"
				viewBox="0 0 17 16"
				fill="none"
				xmlns="http://www.w3.org/2000/svg">
				{' '}
				<path
					d="M8.5 0.560127L10.9028 5.37762C10.9394 5.45097 11.0096 5.50173 11.0907 5.51346L16.4589 6.29L12.5765 10.0324C12.5168 10.09 12.4895 10.1734 12.5037 10.2551L13.4204 15.5451L8.61542 13.0443C8.54308 13.0066 8.45692 13.0066 8.38458 13.0443L3.57956 15.5451L4.49633 10.2551C4.51049 10.1734 4.48321 10.09 4.4235 10.0324L0.541081 6.29L5.90929 5.51346C5.99042 5.50173 6.06063 5.45097 6.09722 5.37762L8.5 0.560127Z"
					stroke="#232323"
					stroke-width="0.5"
					stroke-linecap="round"
					stroke-linejoin="round"></path>
			</svg>
		),
	},
	{
		title: 'Created Date',
		dataIndex: 'createdDateTime',
		key: 'createdDateTime',
		render:(text)=>{
			return text.split(' ')[0]
		}
	},
	{
		title: 'HR ID',
		dataIndex: 'hr',
		key: 'hr',
		render: (text) => (
			<a
				href="#"
				style={{ color: 'black', textDecoration: 'underline' }}>
				{text}
			</a>
		),
	},
	{
		title: 'TR',
		dataIndex: 'tr',
		key: 'tr',
	},
	{
		title: 'Position',
		dataIndex: 'position',
		key: 'position',
	},
	{
		title: 'Budget/Mo',
		dataIndex: 'budgetmo',
		key: 'budgetmo',
	},
	{
		title: 'Notice',
		dataIndex: 'notice',
		key: 'notice',
	},
	{
		title: 'FTE/PTE',
		dataIndex: 'typeOfEmployee',
		key: 'typeOfEmployee',
	},
	// {
	// 	title: 'HR Status',
	// 	key: 'tags',
	// 	dataIndex: 'tags',
	// 	render: (_, { tags }) => (
	// 		<>
	// 			{tags.map((tag) => {
	// 				let color = tag.length > 5 ? 'geekblue' : 'green';
	// 				if (tag === 'loser') {
	// 					color = 'volcano';
	// 				}
	// 				return (
	// 					<Tag
	// 						color={color}
	// 						key={tag}>
	// 						{tag.toUpperCase()}
	// 					</Tag>
	// 				);
	// 			})}
	// 		</>
	// 	),
	// },
];


const DealDetails = () => {
	const navigate = useNavigate();
	const [isLoading, setLoading] = useState(false);
	const [dealDetails, setDealDetails] = useState(null);
	const { dealID} = useParams()

	const getDealDetails = useCallback(async (dealID) => {
		setLoading(true);
		const response = await DealDAO.getDealDetailRequestDAO({
			dealID: dealID,
		});
		if (response?.statusCode === HTTPStatusCode.OK) {
			setDealDetails(response && response?.responseBody?.details);
			setLoading(false);
		} else if (response.statusCode === HTTPStatusCode.NOT_FOUND) {
			//navigate(UTSRoutes.PAGENOTFOUNDROUTE);
			setLoading(false);
		}
	}, [navigate, dealID]);

	useEffect(() => {
		getDealDetails(dealID);
	}, [getDealDetails,dealID]);

	return (
		<WithLoader
			showLoader={isLoading}
			className="mainLoader">
			<div className={dealDetailsStyles.dealDetailsWrap}>
				<div className={dealDetailsStyles.dealDetailsBack}>
					<Link to={UTSRoutes.DEALLISTROUTE}>
						<div className={dealDetailsStyles.goback}>
							<ArrowLeftSVG style={{ width: '16px' }} />
							<span>Go Back</span>
						</div>
					</Link>
				</div>
				<div className={dealDetailsStyles.dealDetailsTitle}>
					<h1>
						<img
							src={dealDetails?.getDealCompanydetails[0]?.companylogo ? `${dealDetails?.getDealCompanydetails[0]?.companylogo}` : "https://www.w3schools.com/howto/img_avatar.png"}
							alt="companylogo"
						/>
						{dealDetails?.getDealCompanydetails[0]?.company}
						
					</h1>
					<div className={dealDetailsStyles.dealDetailsRight}>
						{/* <button  className={dealDetailsStyles.yellowOutlinedButton} type="button">View HR Form</button> */}

						{ dealDetails?.dealStage === "SAL Achieved" && 	<button type="button" onClick={()=>{
							localStorage.setItem('dealID',dealID)
							localStorage.removeItem('hrID')
							navigate(UTSRoutes.ADDNEWHR)
						}}>Create HR</button>}
					
						{/* <div className={dealDetailsStyles.deleteButton}>
							<DeleteLightSVG width="24" />
						</div> */}
					</div>
				</div>

				<div className={dealDetailsStyles.dealDetailsTopCard}>
					<ul>
						<li>
							<div className={dealDetailsStyles.topCardItem}>
								<span>Stage</span>
								{dealDetails?.dealStage ? dealDetails?.dealStage : 'NA'}
							</div>
						</li>
						<li>
							<div className={dealDetailsStyles.topCardItem}>
								<span>Deal Owner</span>
								{dealDetails?.dealOwner ? dealDetails?.dealOwner : 'NA'}
							</div>
						</li>
						<li>
							<div className={dealDetailsStyles.topCardItem}>
								<span>Deal Type</span>
								{dealDetails?.dealType ? dealDetails?.dealType : 'NA'}
							</div>
						</li>
						<li>
							<div className={dealDetailsStyles.topCardItem}>
								<span>POC</span>
								{dealDetails?.poc ? dealDetails?.poc : 'NA'}
							</div>
						</li>
					</ul>
				</div>

				<div className={dealDetailsStyles.dealDetailsCard}>
					<div className={dealDetailsStyles.dealLeftCard}>
						<div className={dealDetailsStyles.dealLeftItem}>
							<h2>Company Details</h2>
							<ul>
								<li>
									<span>URL:</span>
									{dealDetails?.getDealCompanydetails[0]?.url
										? dealDetails?.getDealCompanydetails[0]?.url
										: 'NA'}
								</li>
								<li>
									<span>Size:</span>
									{dealDetails?.getDealCompanydetails[0]?.size
										? dealDetails?.getDealCompanydetails[0]?.size
										: 0}
								</li>

								<li>
									<span>Location:</span>
									{dealDetails?.getDealCompanydetails[0]?.location
										? dealDetails?.getDealCompanydetails[0]?.location
										: 'NA'}
								</li>
								<li>
									<span>Address:</span>
									{dealDetails?.getDealCompanydetails[0]?.address
										? dealDetails?.getDealCompanydetails[0]?.address
										: 'NA'}
								</li>
								<li>
									<span>Linkedin:</span>
									{dealDetails?.getDealCompanydetails[0]?.linkedin
										? dealDetails?.getDealCompanydetails[0]?.linkedin
										: 'NA'}
									<a
										href="#"
										target="_blank"
										className={dealDetailsStyles.dealItemLink}>
										<svg
											width="16"
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
									</a>
								</li>
								<li>
									<span>Phone:</span>{' '}
									{dealDetails?.getDealCompanydetails[0]?.phone
										? dealDetails?.getDealCompanydetails[0]?.phone
										: 'NA'}
								</li>
								<li>
									<span>Lead Source:</span>
									{dealDetails?.getDealCompanydetails[0]?.leadSOurce
										? dealDetails?.getDealCompanydetails[0]?.leadSOurce
										: 'NA'}
								</li>
							</ul>
						</div>
						<div className={dealDetailsStyles.dealLeftItem}>
							<h2>Lead Details</h2>
							<ul>
								{/* <li>
									<span>Deal ID:</span>{' '}
									{dealDetails?.getDealLeadDetails[0]?.deal
										? dealDetails?.getDealLeadDetails[0]?.deal
										: 'NA'}
								</li> */}
								<li>
									<span>Lead Source:</span>{' '}
									{dealDetails?.getDealLeadDetails[0]?.leadSource
										? dealDetails?.getDealLeadDetails[0]?.leadSource
										: 'NA'}
								</li>
								<li>
									<span>Pipeline:</span>{' '}
									{dealDetails?.getDealLeadDetails[0]?.pipeLine
										? dealDetails?.getDealLeadDetails[0]?.pipeLine
										: 'NA'}
								</li>
								<li>
									<span>BDR:</span>{' '}
									{dealDetails?.getDealLeadDetails[0]?.bdr
										? dealDetails?.getDealLeadDetails[0]?.bdr
										: 'NA'}
								</li>
								<li>
									<span>Sales Consultant:</span>{' '}
									{dealDetails?.getDealLeadDetails[0]?.salesConsultant
										? dealDetails?.getDealLeadDetails[0]?.salesConsultant
										: 'NA'}
								</li>
							</ul>
						</div>
						<div className={dealDetailsStyles.dealLeftItem}>
							<h2>Primary Client</h2>
							<ul>
								<li>
									<span>Name:</span> {dealDetails?.getDealPrimaryClient[0]?.name
										? dealDetails?.getDealPrimaryClient[0]?.name
										: 'NA'}
								</li>
								<li>
									<span>Email:</span> {dealDetails?.getDealPrimaryClient[0]?.emaiid
										? dealDetails?.getDealPrimaryClient[0]?.emaiid
										: 'NA'}
								</li>
								<li>
									<span>Phone:</span> {dealDetails?.getDealPrimaryClient[0]?.Phone
										? dealDetails?.getDealPrimaryClient[0]?.Phone
										: 'NA'}
								</li>
								<li>
									<span>Linkedin:</span> {dealDetails?.getDealPrimaryClient[0]?.linkedin
										? dealDetails?.getDealPrimaryClient[0]?.linkedin
										: 'NA'}
								</li>
							</ul>
						</div>
						<div className={dealDetailsStyles.dealLeftItem}>
							<h2>Secondary Client</h2>
							<ul>
								<li>
									<span>Name:</span> {dealDetails?.getDealSecondaryClient[0]?.Name
										? dealDetails?.getDealSecondaryClient[0]?.Name
										: 'NA'}
								</li>
								<li>
									<span>Email:</span> {dealDetails?.getDealSecondaryClient[0]?.emaiid
										? dealDetails?.getDealSecondaryClient[0]?.emaiid
										: 'NA'}
								</li>
								<li>
									<span>Phone:</span> {dealDetails?.getDealSecondaryClient[0]?.phone
										? dealDetails?.getDealSecondaryClient[0]?.phone
										: 'NA'}
								</li>
								<li>
									<span>Linkedin:</span> {dealDetails?.getDealSecondaryClient[0]?.linkedin
										? dealDetails?.getDealSecondaryClient[0]?.linkedin
										: 'NA'}
								</li>
							</ul>
						</div>
					</div>
					<div className={dealDetailsStyles.dealRightCard}>
						<div className={dealDetailsStyles.dealActivity}>
							<h2>Deal Activity</h2>
							<ul>
								{dealDetails?.getDealActivity.map(activity => 	<li key={activity.subscriptionType + activity.createdDateTime}> 
									<div className={dealDetailsStyles.dealActivityTime}>
										<span>{  activity.createdDateTime.split(' ')[0] === moment().format('DD/MM/YYYY') ? 'Today' :  activity.createdDateTime.split(' ')[0]} </span>
										<br />
										<span>{moment(activity.createdDateTime).format('HH:MM a') !== 'Invalid date' ? moment(activity.createdDateTime).format('HH:MM a') :  activity.createdDateTime.split(' ')[1]} </span>
									</div>
									<div className={dealDetailsStyles.dealActivityInfo}>
										{/* <p>
											<span>Note from</span> <a href="#">Prerna Dham</a>
										</p> */}
										<p>
											{activity.subscriptionType}
										</p>
									</div>
								</li>)}
								

								{/* <li>
									<div className={dealDetailsStyles.dealActivityTime}>
										<span>22/06/2022</span>
										<br />
										<span>04:56 PM</span>
									</div>
									<div className={dealDetailsStyles.dealActivityInfo}>
										<p>
											<span>
												Moved deal from Discovery call Scheduled to Discover
												call Rescheduled.
											</span>
										</p>
										<p className={dealDetailsStyles.dealActivityAction}>
											<img
												src={arrow}
												alt="arrow"
											/>
											Action by: Saptarshi Banerjee
										</p>
									</div>
								</li> */}

							</ul>
						</div>
					</div>
				</div>

				{dealDetails?.getAllHRs?.length > 0 && 
				<div className={dealDetailsStyles.dealDetailsTable}>
					<Table
						columns={columns}
						dataSource={dealDetails?.getAllHRs}
						pagination={false}
					/>
				</div>
				}
			</div>
		</WithLoader>
	);
};

export default DealDetails;
