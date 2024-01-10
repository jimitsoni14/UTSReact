import HROperator from 'modules/hiring request/components/hroperator/hroperator';
import { ReactComponent as ArrowDownSVG } from 'assets/svg/arrowDown.svg';
import { Link } from 'react-router-dom';
import { engagementUtils } from './engagementUtils';
import allengagementStyles from '../engagementFeedback/engagementFeedback.module.css';
import moment from 'moment';
export const allEngagementConfig = {
	engagementFilterTypeConfig: (filterList) => {
		return [
			{
				label: 'Client Feedback',
				name: 'clientFeedback',
				child: filterList?.clientFeedback,
				isSearch: true,
			},
			// {
			// 	label: 'Hiring',
			// 	name: 'typeOfHiring',
			// 	child: filterList?.typeOfHiring,
			// 	isSearch: true,
			// },
			{
				label: 'Current Status',
				name: 'currentStatus',
				child: filterList.currentStatus,
				isSearch: false,
			},
			// {
			// 	label: 'Engagement ID',
			// 	name: 'engagementID',
			// 	child: filterList?.engagementIds,
			// 	isSearch: true,
			// },
			// {
			// 	label: 'Client',
			// 	name: 'client',
			// 	child: filterList?.clients,
			// 	isSearch: true,
			// },
			// {
			// 	label: 'Talent',
			// 	name: 'talent',
			// 	child: filterList?.talents,
			// 	isSearch: true,
			// },
			{
				label: 'TSC Name',
				name: 'TSCName',
				child: filterList.tscName,
				isSearch: true,
			},
			// {
			// 	label: 'Company',
			// 	name: 'company',
			// 	child: filterList?.company,
			// 	isSearch: true,
			// },
			{
				label: 'Geo',
				name: 'geo',
				child: filterList?.geo,
				isSearch: true,
			},
			{
				label: 'Position',
				name: 'Position',
				child: filterList?.postion,
				isSearch: true,
			},
			{
				label: 'Engagement Tenure',
				name: 'EngagementTenure',
				child: filterList?.engagementTenure,
				isSearch: true,
			},
			{
				label: 'NBD',
				name: 'nbdName',
				child: filterList?.nbdName,
				isSearch: true,
			},
			{
				label: 'AM',
				name: 'amName',
				child: filterList?.amName,
				isSearch: true,
			},

			{
				label: 'Lost',
				name: 'Islost',
				child: filterList?.lost,
				isSearch: true,
			},
			// {
			// 	label: 'Deployed Source',
			// 	name: 'DeployedSource',
			// 	child: filterList.deployedSource,
			// 	isSearch: true,
			// },
			// {
			// 	label: 'Months',
			// 	name: 'months',
			// 	child: filterList?.months,
			// 	isSearch: true,
			// },
			// {
			// 	label: 'Search',
			// 	name: 'searchType',
			// 	child: filterList?.searchType,
			// 	isSearch: true,
			// },
			// {
			// 	label: 'Years',
			// 	name: 'years',
			// 	child: filterList?.years,
			// 	isSearch: true,
			// },
		];
	},
	tableConfig: (
		getEngagementModal,
		setEngagementModal,
		setFilteredData,
		setEngagementBillAndPayRateTab,
		setOnbaordId,
		setFeedBackData,
		setHRAndEngagementId,
		setIsAddTSC,
		setTSCONBoardData,
		setISEditTSC,
		setActiveTab,
		setAllBRPRdata
	) => {
		return [
			{
				title: '    ',
				dataIndex: 'action',
				key: 'action',
				align: 'left',
				width: '180px',
				render: (_, param, index) => {
					let listItemData = [
						{
							label: param.engagementId_HRID,
							key: 'HRDetails',
							IsEnabled: false,
						},
						{
							label: 'Add Invoice Details',
							key: 'addInvoiceDetails',
							IsEnabled: true,
						},
					];
					if(param?.tscName && (param?.currentStatus !== "In Replacement")){
						listItemData.push(
							{
								label: 'Edit TSC Name',
								key: 'editTSCName',
								IsEnabled: true,
							},
						);
					}
					if (param?.typeOfHR === 'Contractual') {
						listItemData.push(
							{
								label: 'Edit Bill Rate',
								key: 'editRateBillRate',
								IsEnabled: true,
							},
							{
								label: 'Edit Pay Rate',
								key: 'editPayRate',
								IsEnabled: true,
							},
							{
								label: 'Edit All BR PR',
								key: 'editAllBRPR',
								IsEnabled: true,
							},
						);
					}
					if (param?.isRenewalAvailable === 1 && param?.isRenewalContract === 0) {
						listItemData.push({
							label: 'Renew Engagement',
							key: 'reNewEngagement',
							IsEnabled: true,
						});
					}				
					if (param?.isContractCompleted !== 1) {
						listItemData.push({
							label: 'End Engagement',
							key: 'endEngagement',
							IsEnabled: true,
						});
					}
					if (
						param?.talentLegal_StatusID === 2 &&
						param?.clientLegal_StatusID === 2 &&
						param?.isContractCompleted !== 1 &&
						param?.isHRManaged === 0 &&
						param?.currentStatus !== 'In Replacement'
					) {
						listItemData.push({
							label: 'Replace Engagement',
							key: 'replaceEngagement',
							IsEnabled: true,
						});
					}
					return (
						<HROperator
							title="Action"
							icon={<ArrowDownSVG style={{ width: '16px' }} />}
							backgroundColor={`var(--color-sunlight)`}
							iconBorder={`1px solid var(--color-sunlight)`}
							isDropdown={true}
							listItem={listItemData}
							menuAction={(item) => {
								switch (item.key) {
									case 'Replace Engagement': {
										setEngagementModal({
											...getEngagementModal,
											engagementReplaceTalent: true,
										});
										setFilteredData(param);
										break;
									}
									case 'Edit TSC Name':{
										setISEditTSC(true)
										setTSCONBoardData({onboardID :param.onboardID, engagementID:param.engagementID, talentName: param.talentName, tscName: param.tscName})
										break;
									}
									case 'Renew Engagement': {
										setEngagementModal({
											...getEngagementModal,
											engagementRenew: true,
										});
										setFilteredData(param);
										break;
									}
									case 'End Engagement': {
										setEngagementModal({
											...getEngagementModal,
											engagementEnd: true,
										});
										setFilteredData(param);
										break;
									}
									case 'Edit Bill Rate': {
										setEngagementModal({
											...getEngagementModal,
											engagementBillRateAndPayRate: true,
										});
										setEngagementBillAndPayRateTab('1');
										setActiveTab('1')
										setFilteredData(param);
										break;
									}
									case 'Edit Pay Rate': {
										setEngagementModal({
											...getEngagementModal,
											engagementBillRateAndPayRate: true,
										});
										setEngagementBillAndPayRateTab('2');
										setActiveTab('2')
										setFilteredData(param);
										break;
									}
									case 'Edit All BR PR':{
										setEngagementModal({
											...getEngagementModal,
											engagementEditAllBillRateAndPayRate: true,
										});
										setAllBRPRdata(param);
										break;
									}
									case 'Add Invoice Details': {
										setEngagementModal({
											...getEngagementModal,
											engagementInvoice: true,
										});
										setFilteredData(param);
										break;
									}
									default:
										break;
								}
							}}
						/>
					);
				},
			},
			{
				title: 'Client Feedback',
				dataIndex: 'clientFeedback',
				key: 'clientFeedback',
				align: 'left',
				width: '140px',
				render: (text, result) =>
					result?.clientFeedback === 0 && result?.onboardID && result?.hrID ? (
						<a href="javascript:void(0);"
							style={{
								color: engagementUtils.getClientFeedbackColor(
									result?.feedbackType,
								),
								textDecoration: 'underline',
							}}
							onClick={() => {
								setHRAndEngagementId({
									talentName: result?.talentName,
									engagementID: result?.engagementId_HRID.slice(
										0,
										result?.engagementId_HRID?.indexOf('/'),
									),
									hrNumber: result?.engagementId_HRID.slice(
										result?.engagementId_HRID?.indexOf('/') + 1,
									),
									onBoardId: result?.onboardID,
									hrId: result?.hrID,
								});
								setEngagementModal({
									engagementFeedback: false,
									engagementBillRate: false,
									engagementPayRate: false,
									engagementOnboard: false,
									engagementAddFeedback: true,
									engagementBillRateAndPayRate: false,
									engagementEnd: false,
									engagementInvoice: false,
									engagementReplaceTalent: false,
								});
							}}>
							{'Add'}
						</a>
					) : (
						<a href="javascript:void(0);"
							style={{
								color: engagementUtils.getClientFeedbackColor(
									result?.feedbackType,
								),
								textDecoration: 'underline',
							}}
							onClick={() => {
								setFeedBackData((prev) => ({
									...prev,
									onBoardId: result?.onboardID,
								}));
								setHRAndEngagementId({
									talentName: result?.talentName,
									engagementID: result?.engagementId_HRID.slice(
										0,
										result?.engagementId_HRID?.indexOf('/'),
									),
									hrNumber: result?.engagementId_HRID.slice(
										result?.engagementId_HRID?.indexOf('/') + 1,
									),
									onBoardId: result?.onboardID,
									hrId: result?.hrID,
								});
								setEngagementModal({
									engagementFeedback: true,
									engagementBillRate: false,
									engagementPayRate: false,
									engagementOnboard: false,
									engagementAddFeedback: false,
									engagementBillRateAndPayRate: false,
									engagementEnd: false,
									engagementInvoice: false,
									engagementReplaceTalent: false,
								});
							}}>
							{'View/Add'}
						</a>
					),
			},
			{
				title: 'Last Feedback Date',
				dataIndex: 'lastFeedbackDate',
				key: 'lastFeedbackDate',
				align: 'left',
				width: '165px',
				render:(text)=>{
					// return text ? moment(text).format('DD/MM/YYYY') : ''
					return text
				}
			},
			{
				title: 'Onboarding Form',
				dataIndex: 'ClientLegal_StatusID',
				key: 'ClientLegal_StatusID',
				align: 'left',
				width: '150px',
				render: (text, result) =>
					result?.clientLegal_StatusID === 2 && (
						<a href="javascript:void(0);"
							style={{ color: '#006699', textDecoration: 'underline' }}
							onClick={() => {
								setHRAndEngagementId({
									talentName: result?.talentName,
									engagementID: result?.engagementId_HRID.slice(
										0,
										result?.engagementId_HRID?.indexOf('/'),
									),
									hrNumber: result?.engagementId_HRID.slice(
										result?.engagementId_HRID?.indexOf('/'),
									),
									onBoardId: result?.onboardID,
									hrId: result?.hrID,
								});
								setEngagementModal({
									engagementFeedback: false,
									engagementBillRate: false,
									engagementPayRate: false,
									engagementOnboard: true,
									engagementAddFeedback: false,
									engagementBillRateAndPayRate: false,
									engagementEnd: false,
									engagementInvoice: false,
									engagementReplaceTalent: false,
								});
							}}>
							{'View'}
						</a>
					),
			},
			{
				title: 'Eng. Count',
				dataIndex: 'engagementCount',
				key: 'engagementCount',
				align: 'left',
				width:'100px'
			},
			{
				title: 'Engagement ID/HR ID',
				dataIndex: 'engagementId_HRID',
				key: 'engagementId_HRID',
				align: 'left',
				render: (text, result) => (
					<p>
						{result?.engagementId_HRID.slice(
							0,
							result?.engagementId_HRID?.indexOf('/'),
						)}
						<Link
							to={`/allhiringrequest/${result?.hrID}`}
							style={{ color: '#006699', textDecoration: 'underline' }}>
							{result?.engagementId_HRID.slice(
								result?.engagementId_HRID?.indexOf('/'),
							)}
						</Link>
					</p>
				),
			},
			{
				title: 'Engagement Type',
				dataIndex: 'engagementType',
				key: 'engagementType',
				align: 'left',
				render: (text, result) => (
					<p>
						{result?.typeOfHR}{' '}
						{result?.h_Availability && `- ${result?.h_Availability}`}
					</p>
				),
			},
			{
				title: 'Company',
				dataIndex: 'company',
				key: 'company',
				align: 'left',
			},

			{
				title: 'Client',
				dataIndex: 'clientName',
				key: 'clientName',
				align: 'left',
			},
			{
				title: 'Talent',
				dataIndex: 'talentName',
				key: 'talentName',
				align: 'left',
			},
			{
				title: 'Current Status',
				dataIndex: 'currentStatus',
				key: 'currentStatus',
				align: 'left',
			},
			// {
			// 	title: 'Deployed Source',
			// 	dataIndex: 'deployedSource',
			// 	key: 'deployedSource',
			// 	align: 'left',
			// },
			{
				title: 'TSC Name',
				dataIndex: 'tscName',
				key: 'tscName',
				align: 'left',
				render:(text, data)=>{
					if(text){
						return text
					}else{
						if(data.currentStatus !== "In Replacement"){
							return	<a href="javascript:void(0);"
							style={{ color: '#006699', textDecoration: 'underline' }}
							onClick={()=>{
								// console.log(data.onboardID)
								setIsAddTSC(true)
								setTSCONBoardData({onboardID :data.onboardID, engagementID:data.engagementID, talentName: data.talentName})
							}}
							>
								ADD
							</a>
						}
						return ''
					}
				}
			},
			{
				title: 'GEO',
				dataIndex: 'geo',
				key: 'geo',
				align: 'left',
			},
			{
				title: 'Position',
				dataIndex: 'position',
				key: 'position',
				align: 'left',
			},
			{
				title: 'Lost',
				dataIndex: 'isLost',
				key: 'isLost',
				align: 'left',
			},
			{
				title: 'Old Talent',
				dataIndex: 'oldTalent',
				key: 'oldTalent',
				align: 'left',
			},
			{
				title: 'Replacement Eng. ID',
				dataIndex: 'replacementEng',
				key: 'replacementEng',
				align: 'left',
			},
			{
				title: 'Notice Period',
				dataIndex: 'noticePeriod',
				key: 'noticePeriod',
				align: 'left',
			},
			{
				title: 'Kick Off',
				dataIndex: 'kickOff',
				key: 'kickOff',
				align: 'left',
			},
			
			{
				title: 'Actual BR & Currency',
				dataIndex: 'actualBillRate',
				key: 'actualBillRate',
				align: 'left',
			},
			{
				title: 'BR',
				dataIndex: 'payout_BillRate',
				key: 'payout_BillRate',
				align: 'left',				
			},			
			{
				title: 'Actual PR & Currency',
				dataIndex: 'actualPayRate',
				key: 'actualPayRate',
				align: 'left',
			},
			{
				title: 'PR',
				dataIndex: 'payout_PayRate',
				key: 'payout_PayRate',
				align: 'left',
			},
			{
				title: 'Engagement Start Date',
				dataIndex: 'contractStartDate',
				key: 'contractStartDate',
				align: 'left',
				render:(text)=>{
					// return text ? moment(text).format('DD/MM/YYYY') : ''
					return text
				}
			},
			{
				title: 'Engagement End Date',
				dataIndex: 'contractEndDate',
				key: 'contractEndDate',
				align: 'left',
				render:(text)=>{
					// return text ? moment(text).format('DD/MM/YYYY') : ''
					return text
				}
			},
			{
				title: 'Actual End Date',
				dataIndex: 'actualEndDate',
				key: 'actualEndDate',
				align: 'left',
				render:(text)=>{
					// return text ? moment(text).format('DD/MM/YYYY') : ''
					return text
				}
			},
			{
				title: 'NR',
				dataIndex: 'actualNR',
				key: 'actualNR',
				align: 'left',
			},
			{
				title: ' NR (%)',
				dataIndex: 'nr',
				key: 'nr',
				align: 'left',
			},
			{
				title: 'DP Amount',
				dataIndex: 'dpAmount',
				key: 'dpAmount',
				align: 'left',
			},
			{
				title: 'DP (%)',
				dataIndex: 'dP_Percentage',
				key: 'dP_Percentage',
				align: 'left',
			},
			{
				title: 'Renewal Start Date',
				dataIndex: 'renewalstartDate',
				key: 'renewalstartDate',
				align: 'left',
				render:(text)=>{
					// return text ? moment(text).format('DD/MM/YYYY') : ''
					return text
				}
			},
			{
				title: 'Renewal End Date',
				dataIndex: 'renewalendDate',
				key: 'renewalendDate',
				align: 'left',
				render:(text)=>{
					// return text ? moment(text).format('DD/MM/YYYY') : ''
					return text
				}
			},
			{
				title: 'Engagement Tenture',
				dataIndex: 'engagementTenure',
				key: 'engagementTenure',
				align: 'left',
				render: (text) => <p>{text + ' Months'}</p>,
			},
			{
				title: 'SOW Signed Date',
				dataIndex: 'sowSignedDate',
				key: 'sowSignedDate',
				align: 'left',
				render:(text)=>{
					// return text ? moment(text).format('DD/MM/YYYY') : ''
					return text
				}
			},
			{
				title: 'NBD',
				dataIndex: 'nbdName',
				key: 'nbdName',
				align: 'left',
			},
			{
				title: 'AM Name',
				dataIndex: 'amName',
				key: 'amName',
				align: 'left',
			},
			{
				title: 'Invoice Sent Date',
				dataIndex: 'invoiceSentDate',
				key: 'invoiceSentDate',
				align: 'left',
				render:(text)=>{
					// return text ? moment(text).format('DD/MM/YYYY') : ''
					return text
				}
			},
			{
				title: 'Invoice Number',
				dataIndex: 'invoiceNumber',
				key: 'invoiceNumber',
				align: 'left',
			},
			{
				title: 'Invoice Status',
				dataIndex: 'invoiceStatus',
				key: 'invoiceStatus',
				align: 'left',
			},
			{
				title: 'Date of Payment',
				dataIndex: 'dateofPayment',
				key: 'dateofPayment',
				align: 'left',
				render:(text)=>{
					// return text ? moment(text).format('DD/MM/YYYY') : ''
					return text
				}
			},
			{
				title: 'Created Date',
				dataIndex: 'createdByDatetime',
				key: 'createdByDatetime',
				align: 'left',
			},
			{
				title: 'Engagement Status',
				dataIndex: 'currentStatus',
				key: 'currentStatus',
				align: 'left',
			},
			// {
			// 	title: 'Type Of HR',
			// 	dataIndex: 'typeOfHR',
			// 	key: 'typeOfHR',
			// 	align: 'left',
			// },
			// {
			// 	title: 'Availability',
			// 	dataIndex: 'h_Availability',
			// 	key: 'h_Availability',
			// 	align: 'left',
			// },
		];
	},
	clientFeedbackTypeConfig: (filterList) => {
		return [
			{
				title: 'Last Feedback Date',
				dataIndex: 'feedbackCreatedDateTime',
				key: 'feedbackCreatedDateTime',
				align: 'left',
			},
			{
				title: 'Feedback Type',
				dataIndex: 'feedbackType',
				key: 'feedbackType',
				align: 'left',
				render: (text, result) => (
					<span
						style={{
							background: engagementUtils.getClientFeedbackColor(
								result?.feedbackType,
							),
						}}
						className={allengagementStyles.feedbackLabel}>
						{' '}
						{result?.feedbackType}
					</span>
				),
			},
			{
				title: 'Feedback Comments',
				dataIndex: 'feedbackComment',
				key: 'feedbackComment',
				align: 'left',
			},
			{
				title: 'Action To Take',
				dataIndex: 'feedbackActionToTake',
				key: 'feedbackActionToTake',
				align: 'left',
			},
		];
	},
};
