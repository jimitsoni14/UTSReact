import TeamDemandFunnelStyle from './teamDemandFunnel.module.css';
import { ReactComponent as FunnelSVG } from 'assets/svg/funnel.svg';
import { Modal, Switch, Table, Tooltip, Tree } from 'antd';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import React, {
	Suspense,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from 'react';
import { ReportDAO } from 'core/report/reportDAO';
import { HTTPStatusCode } from 'constants/network';
import TableSkeleton from 'shared/components/tableSkeleton/tableSkeleton';
import { reportConfig } from 'modules/report/report.config';
import { ReactComponent as CalenderSVG } from 'assets/svg/calender.svg';
import { useForm } from 'react-hook-form';
import Column from 'antd/lib/table/Column';
import ColumnGroup from 'antd/lib/table/ColumnGroup';
import HRSelectField from 'modules/hiring request/components/hrSelectField/hrSelectField';
import { MasterDAO } from 'core/master/masterDAO';
import TeamDemandFunnelModal from 'modules/report/components/teamDemandFunnelModal/teamDemandFunnelModal';
import WithLoader from 'shared/components/loader/loader';
import {
	insertUser,
	transformTeamDemandHierarchy,
} from 'modules/report/reportUtils';
import { useNavigate } from 'react-router-dom';
import SpinLoader from 'shared/components/spinLoader/spinLoader';
const TeamDemandFunnelFilterLazyComponent = React.lazy(() =>
	import(
		'modules/report/components/teamDemandFunnelFilter/teamDemandFunnelFilter'
	),
);

const TeamDemandFunnelScreen = () => {
	const [selectedHierarchy, setSelectedHierarchy] = useState();
	const [isActionWise, setActionWise] = useState(false);
	const [showSelectedHierarchyModal, setShowSelectedHierarchyModal] =
		useState(false);
	const {
		register,
		handleSubmit,
		setValue,
		unregister,
		watch,
		control,
		formState: { errors },
	} = useForm({});
	const [tableFilteredState, setTableFilteredState] = useState({
		startDate: '',
		endDate: '',
		salesManagerID: '',
		isHiringNeedTemp: '',
		modeOfWork: '',
		typeOfHR: '-1',
		companyCategory: '',
		isActionWise: false,
	});

	const [teamDemandValue, setTeamDemandValue] = useState({});

	const [teamDemandFunnelHRDetailsState, setTeamDemandFunnelHRDetailsState] =
		useState({
			adhocType: '',
			selectedRow_SalesUserName: '',
			currentStage: '',
			IsExport: false,
			hrFilter: {
				hR_No: '',
				salesPerson: '',
				compnayName: '',
				role: '',
				managed_Self: '',
				talentName: '',
				availability: '',
			},
			funnelFilter: { ...tableFilteredState },
		});

	const [teamDemandFunnelModal, setTeamDemandFunnelModal] = useState(true);
	const [teamDemandHRDetailsModal, setTeamDemandHRDetailsModal] =
		useState(false);
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
	const navigate = useNavigate();
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);
	const [selectedHierarchyTree, setSelectedHierarchyTree] = useState([]);
	const getTeamDemandFunnelListingHandler = useCallback(async (tableData) => {
		setLoading(true);
		let response = await ReportDAO.teamDemandFunnelListingRequestDAO(tableData);

		if (response?.statusCode === HTTPStatusCode.OK) {
			setLoading(false);
			setApiData(response?.responseBody);
		} else {
			setLoading(false);
			setApiData([]);
		}
	}, []);

	const unGroupedColumnDataMemo = useMemo(() => {
		let tableHeader = Object?.keys(apiData?.[0] || {});
		let tempArray = [];

		tableHeader?.forEach((item) => {
			if (
				item === 'Stage' ||
				item === 'Duration' ||
				item === 'Final Total' ||
				item === 'Pool Total' ||
				item === 'Odr Total'
			) {
				tempArray.push(item);
			}
		});
		return tempArray;
	}, [apiData]);

	const groupedColumnDataMemo = useMemo(() => {
		let tableHeader = Object?.keys(apiData?.[0] || {});
		let tempArray = [];
		let finalArray = [[]];

		tableHeader?.forEach((item) => {
			if (
				item !== 'Stage' &&
				item !== 'Duration' &&
				item !== 'Final Total' &&
				item !== 'Pool Total' &&
				item !== 'Odr Total'
			) {
				tempArray.push(item);
			}
		});

		// for (let i = tempArray.length - 1; i >= 1; i = i - 3) {
		// 	finalArray.push(tempArray[i]);
		// 	finalArray.push(tempArray.slice(i - 2, i))
		// 	//  tempArray.slice(i - 2, i).length && finalArray.push(tempArray.slice(i - 2, i)) ;
		// }
		// return finalArray.slice(1);
		return tempArray.slice(1)
	}, [apiData]);

	/** Grouped Column Table */
	const GroupedColumn = useCallback(() => {
		// let ColumnData = [];
		// for (let i = 0; i < groupedColumnDataMemo?.length ; i = i + 2) {
		// 	let comp = groupedColumnDataMemo.map(title => (
		// 		<Column
		// 				title={title}
		// 				dataIndex={title}
		// 				key={title}
		// 				render={(text, param) => {
							
		// 					return (
		// 					<Tooltip
		// 						placement="bottomLeft"
		// 						title={text}>
		// 						<p
		// 							style={{
		// 								textDecoration: 'underline',
		// 								cursor: text === 0 ? 'no-drop' : 'pointer',
		// 							}}
		// 							onClick={
		// 								text === 0
		// 									? null
		// 									: () => {
		// 											setTeamDemandHRDetailsModal(true);
		// 											setTeamDemandValue({
		// 												stage: param?.Stage,
		// 												count: text,
		// 											});
		// 											setTeamDemandFunnelHRDetailsState({
		// 												...teamDemandFunnelHRDetailsState,
		// 												adhocType: 'Odr',
		// 												currentStage: param.Stage,
		// 												selectedRow_SalesUserName: groupedColumnDataMemo[i],
		// 											});
		// 									  }
		// 							}>
		// 							{text}
		// 						</p>
		// 					</Tooltip>
		// 				)}}
		// 			/>
		// 		// <ColumnGroup title={groupedColumnDataMemo[i]}>
		// 		// 	{/* <Column
		// 		// 		title="Odr"
		// 		// 		dataIndex={groupedColumnDataMemo[i + 1][0]}
		// 		// 		key={groupedColumnDataMemo[i + 1][0]?groupedColumnDataMemo[i + 1][0] : "Additional Info" }
		// 		// 		render={(text, param) => {
		// 		// 			return (
		// 		// 			<Tooltip
		// 		// 				placement="bottomLeft"
		// 		// 				title={text}>
		// 		// 				<p
		// 		// 					style={{
		// 		// 						textDecoration: 'underline',
		// 		// 						cursor: text === 0 ? 'no-drop' : 'pointer',
		// 		// 					}}
		// 		// 					onClick={
		// 		// 						text === 0
		// 		// 							? null
		// 		// 							: () => {
		// 		// 									setTeamDemandHRDetailsModal(true);
		// 		// 									setTeamDemandValue({
		// 		// 										stage: param?.Stage,
		// 		// 										count: text,
		// 		// 									});
		// 		// 									setTeamDemandFunnelHRDetailsState({
		// 		// 										...teamDemandFunnelHRDetailsState,
		// 		// 										adhocType: 'Odr',
		// 		// 										currentStage: param.Stage,
		// 		// 										selectedRow_SalesUserName: groupedColumnDataMemo[i],
		// 		// 									});
		// 		// 							  }
		// 		// 					}>
		// 		// 					{text}
		// 		// 				</p>
		// 		// 			</Tooltip>
		// 		// 		)}}
		// 		// 	/>
		// 		// 	<Column
		// 		// 		title="Pool"
		// 		// 		dataIndex={groupedColumnDataMemo[i + 1][1]}
		// 		// 		key={groupedColumnDataMemo[i + 1][1]}
		// 		// 		render={(text, param) => {
		// 		// 			return (
		// 		// 			<Tooltip
		// 		// 				placement="bottomLeft"
		// 		// 				title={text}>
		// 		// 				<p
		// 		// 					style={{
		// 		// 						textDecoration: 'underline',
		// 		// 						cursor: text === 0 ? 'no-drop' : 'pointer',
		// 		// 					}}
		// 		// 					onClick={
		// 		// 						text === 0
		// 		// 							? null
		// 		// 							: () => {
		// 		// 									setTeamDemandHRDetailsModal(true);
		// 		// 									setTeamDemandValue({
		// 		// 										stage: param?.Stage,
		// 		// 										count: text,
		// 		// 									});
		// 		// 									setTeamDemandFunnelHRDetailsState({
		// 		// 										...teamDemandFunnelHRDetailsState,
		// 		// 										adhocType: 'Pool',
		// 		// 										currentStage: param.Stage,
		// 		// 										selectedRow_SalesUserName: groupedColumnDataMemo[i],
		// 		// 									});
		// 		// 							  }
		// 		// 					}>
		// 		// 					{text}
		// 		// 				</p>
		// 		// 			</Tooltip>
		// 		// 		)}}
		// 		// 	/>
		// 		// 	<Column
		// 		// 		title="Total"
		// 		// 		dataIndex={groupedColumnDataMemo[i]}
		// 		// 		key={groupedColumnDataMemo[i]}
		// 		// 		render={(text, param) => {
		// 		// 			return (
		// 		// 			<Tooltip
		// 		// 				placement="bottomLeft"
		// 		// 				title={text}>
		// 		// 				<p
		// 		// 					style={{
		// 		// 						textDecoration: 'underline',
		// 		// 						cursor: text === 0 ? 'no-drop' : 'pointer',
		// 		// 					}}
		// 		// 					onClick={
		// 		// 						text === 0
		// 		// 							? null
		// 		// 							: () => {
		// 		// 									setTeamDemandHRDetailsModal(true);
		// 		// 									setTeamDemandValue({
		// 		// 										stage: param?.Stage,
		// 		// 										count: text,
		// 		// 									});
		// 		// 									setTeamDemandFunnelHRDetailsState({
		// 		// 										...teamDemandFunnelHRDetailsState,
		// 		// 										adhocType: 'Total',
		// 		// 										currentStage: param.Stage,
		// 		// 										selectedRow_SalesUserName: groupedColumnDataMemo[i],
		// 		// 									});
		// 		// 							  }
		// 		// 					}>
		// 		// 					{text}
		// 		// 				</p>
		// 		// 			</Tooltip>
		// 		// 		)}}
		// 		// 	/> */}
		// 		// </ColumnGroup>
		// 	)) 
		// 	ColumnData.push(comp);
		// }
		// return ColumnData;
		let comp = groupedColumnDataMemo.map(title => (
			<Column
					title={title}
					dataIndex={title}
					key={title}
					render={(text, param) => {
						
						return (
						<Tooltip
							placement="bottomLeft"
							title={text}>
							<p
								style={{
									textDecoration: 'underline',
									cursor: text === 0 ? 'no-drop' : 'pointer',
								}}
								onClick={
									text === 0
										? null
										: () => {
												setTeamDemandHRDetailsModal(true);
												setTeamDemandValue({
													stage: param?.Stage,
													count: text,
												});
												setTeamDemandFunnelHRDetailsState({
													...teamDemandFunnelHRDetailsState,
													adhocType: 'Odr',
													currentStage: param.Stage,
													selectedRow_SalesUserName: title,
												});
										  }
								}>
								{text}
							</p>
						</Tooltip>
					)}}
				/>
			
		)) 
		return comp
	}, [groupedColumnDataMemo, teamDemandFunnelHRDetailsState]);

	const onCalenderFilter = (dates) => {
		const [start, end] = dates;

		setStartDate(start);
		setEndDate(end);

		if (start && end) {
			setTableFilteredState({
				...tableFilteredState,
				startDate: new Date(start)
					.toLocaleDateString('en-UK')
					.split('/')
					.reverse()
					.join('-'),
				endDate: new Date(end)
					.toLocaleDateString('en-UK')
					.split('/')
					.reverse()
					.join('-'),
			});
			setTeamDemandFunnelHRDetailsState({
				...teamDemandFunnelHRDetailsState,
				funnelFilter: {
					startDate: new Date(start)
						.toLocaleDateString('en-UK')
						.split('/')
						.reverse()
						.join('-'),
					endDate: new Date(end)
						.toLocaleDateString('en-UK')
						.split('/')
						.reverse()
						.join('-'),
				},
			});
			getTeamDemandFunnelListingHandler({
				...tableFilteredState,
				startDate: new Date(start)
					.toLocaleDateString('en-UK')
					.split('/')
					.reverse()
					.join('-'),
				endDate: new Date(end)
					.toLocaleDateString('en-UK')
					.split('/')
					.reverse()
					.join('-'),
			});
		}
	};
	const onRemoveFilters = () => {
		setTimeout(() => {
			setIsAllowFilters(false);
		}, 300);
		setHTMLFilter(false);
	};

	const viewSupplyFunnelSummaryHandler = useCallback(async () => {
		setIsSummary(true);
		setSummaryLoading(true);
		let response = await ReportDAO.teamDemandFunnelSummaryRequestDAO(
			tableFilteredState,
		);
		if (response?.statusCode === HTTPStatusCode.OK) {
			setSummaryData(response?.responseBody);
			setSummaryLoading(false);
		} else {
			setSummaryData([]);
			setSummaryLoading(false);
		}
	}, [tableFilteredState]);

	const unGroupedViewSummaryColumnDataMemo = useMemo(() => {
		let tableHeader = Object?.keys(viewSummaryData?.[0] || {});
		let tempArray = [];

		tableHeader?.forEach((item) => {
			if (
				item === 'Stage' ||
				item === 'Duration' ||
				item === 'Final Total' ||
				item === 'Pool Total' ||
				item === 'Odr Total'
			) {
				tempArray.push(item);
			}
		});
		return tempArray;
	}, [viewSummaryData]);
	const ViewSummaryGroupedColumnDataMemo = useMemo(() => {
		let tableHeader = Object?.keys(viewSummaryData?.[0] || {});
		let tempArray = [];
		let finalArray = [[]];

		tableHeader?.forEach((item) => {
			if (
				item !== 'Stage' &&
				item !== 'Duration' &&
				item !== 'Final Total' &&
				item !== 'Pool Total' &&
				item !== 'Odr Total'
			) {
				tempArray.push(item);
			}
		});

		for (let i = tempArray.length - 1; i >= 1; i = i - 3) {
			finalArray.push(tempArray[i]);
			finalArray.push(tempArray.slice(i - 2, i));
		}
		return finalArray.slice(1);
	}, [viewSummaryData]);
	const ViewSummaryGroupedColumn = useCallback(() => {
		let ColumnData = [];
		for (
			let i = 0;
			i < ViewSummaryGroupedColumnDataMemo?.length - 1;
			i = i + 2
		) {
			let comp = (
						<Column
						title={ViewSummaryGroupedColumnDataMemo[i]}
						dataIndex={ViewSummaryGroupedColumnDataMemo[i]}
						key={ViewSummaryGroupedColumnDataMemo[i]}
						render={(text, param) => (
							<Tooltip
								placement="bottomLeft"
								title={text}>
								<p>{text}</p>
							</Tooltip>
						)}
					/>
				// <ColumnGroup title={ViewSummaryGroupedColumnDataMemo[i]}>
				// 	<Column
				// 		title="Exist"
				// 		dataIndex={ViewSummaryGroupedColumnDataMemo[i + 1][0]}
				// 		key={ViewSummaryGroupedColumnDataMemo[i + 1][0]}
				// 		render={(text, param) => (
				// 			<Tooltip
				// 				placement="bottomLeft"
				// 				title={text}>
				// 				<p>{text}</p>
				// 			</Tooltip>
				// 		)}
				// 	/>
				// 	<Column
				// 		title="New"
				// 		dataIndex={ViewSummaryGroupedColumnDataMemo[i + 1][1]}
				// 		key={ViewSummaryGroupedColumnDataMemo[i + 1][1]}
				// 		render={(text, param) => (
				// 			<Tooltip
				// 				placement="bottomLeft"
				// 				title={text}>
				// 				<p>{text}</p>
				// 			</Tooltip>
				// 		)}
				// 	/>
				// 	<Column
				// 		title="Total"
				// 		dataIndex={ViewSummaryGroupedColumnDataMemo[i]}
				// 		key={ViewSummaryGroupedColumnDataMemo[i]}
				// 		render={(text, param) => (
				// 			<Tooltip
				// 				placement="bottomLeft"
				// 				title={text}>
				// 				<p>{text}</p>
				// 			</Tooltip>
				// 		)}
				// 	/>
				// </ColumnGroup>
			);
			ColumnData.push(comp);
		}
		return ColumnData;
	}, [ViewSummaryGroupedColumnDataMemo]);

	const getReportFilterHandler = useCallback(async () => {
		const response = await ReportDAO.teamDemandFunnelFiltersRequestDAO();
		if (response?.statusCode === HTTPStatusCode.OK) {
			setFiltersList(response && response?.responseBody?.Data);
			setStartDate(new Date(response?.responseBody?.Data?.StartDate));
			setEndDate(new Date(response?.responseBody?.Data?.EndDate));
			setTableFilteredState({
				...tableFilteredState,
				startDate: response?.responseBody?.Data?.StartDate,
				endDate: response?.responseBody?.Data?.EndDate,
			});
			setTeamDemandFunnelHRDetailsState({
				...teamDemandFunnelHRDetailsState,

				funnelFilter: {
					startDate: response?.responseBody?.Data?.StartDate,
					endDate: response?.responseBody?.Data?.EndDate,
				},
			});
		} else {
			setFiltersList([]);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const toggleDemandReportFilter = useCallback(() => {
		!getHTMLFilter
			? setIsAllowFilters(!isAllowFilters)
			: setTimeout(() => {
					setIsAllowFilters(!isAllowFilters);
			  }, 300);
		setHTMLFilter(!getHTMLFilter);
	}, [getHTMLFilter, isAllowFilters]);

	const onHierarchySelect = async (selectedKeys, info) => {
		const response = await MasterDAO.getUsersHierarchyRequestDAO({
			parentID: selectedKeys?.[0],
		});

		let res = insertUser(
			response?.responseBody?.[0]?.undeR_PARENT,
			response?.responseBody,
			selectedHierarchyTree,
		);
		setSelectedHierarchyTree(res);
	};
	const viewActionWiseHandler = useCallback(
		async (d) => {
			setLoading(true);
			setSummaryData([]);
			setIsSummary(false);
			const actionWiseFormatter = {
				...tableFilteredState,
				salesManagerID: d.salesManager?.id,
				isActionWise: true,
			};
			setActionWise(true);
			setTableFilteredState({
				...tableFilteredState,
				salesManagerID: d.salesManager?.id,
				isActionWise: true,
			});
			setTeamDemandFunnelHRDetailsState({
				...teamDemandFunnelHRDetailsState,
				funnelFilter: {
					...teamDemandFunnelHRDetailsState?.funnelFilter,
					salesManagerID: d.salesManager?.id,
					isActionWise: true,
				},
			});
			setSelectedHierarchy(d.salesManager);

			const response = await ReportDAO.teamDemandFunnelListingRequestDAO(
				actionWiseFormatter,
			);

			const hierarchyResponse = await MasterDAO.getUsersHierarchyRequestDAO({
				parentID: d.salesManager?.id,
			});

			const transformedResult = transformTeamDemandHierarchy(
				hierarchyResponse?.responseBody,
			);

			const temp = [
				{
					title: hierarchyResponse?.responseBody?.[0]?.parent,
					key: '0',
					children: [...transformedResult],
				},
			];
			setSelectedHierarchyTree(temp);

			if (response?.statusCode === HTTPStatusCode.OK) {
				setApiData(response?.responseBody);
				setTeamDemandFunnelModal(false);
				setLoading(false);
			}
		},
		[tableFilteredState, teamDemandFunnelHRDetailsState],
	);

	const hrWiseHandler = useCallback(
		async (d) => {
			setLoading(true);
			setSummaryData([]);
			setIsSummary(false);
			const actionWiseFormatter = {
				...tableFilteredState,
				salesManagerID: d.salesManager?.id,
				isActionWise: false,
			};
			setTableFilteredState({
				...tableFilteredState,
				salesManagerID: d.salesManager?.id,
				isActionWise: false,
			});
			setActionWise(false);
			setTeamDemandFunnelHRDetailsState({
				...teamDemandFunnelHRDetailsState,
				funnelFilter: {
					...teamDemandFunnelHRDetailsState?.funnelFilter,
					salesManagerID: d.salesManager?.id,
					isActionWise: false,
				},
			});
			setSelectedHierarchy(d.salesManager);

			const response = await ReportDAO.teamDemandFunnelListingRequestDAO(
				actionWiseFormatter,
			);
			const hierarchyResponse = await MasterDAO.getUsersHierarchyRequestDAO({
				parentID: d.salesManager?.id,
			});
			const transformedResult = transformTeamDemandHierarchy(
				hierarchyResponse?.responseBody,
				'0',
			);
			const temp = [
				{
					title: hierarchyResponse?.responseBody?.[0]?.parent,
					key: '0',
					children: [...transformedResult],
				},
			];
			setSelectedHierarchyTree(temp);

			if (response?.statusCode === HTTPStatusCode.OK) {
				setApiData(response?.responseBody);
				setTeamDemandFunnelModal(false);
				setLoading(false);
			}
		},
		[tableFilteredState, teamDemandFunnelHRDetailsState],
	);

	const onChange = useCallback(() => {
		setTeamDemandFunnelModal(true);
	}, []);

	useEffect(() => {
		getReportFilterHandler();
	}, [getReportFilterHandler]);

	return (
		<>
			{apiData?.length > 0 && selectedHierarchy && (
				<div className={TeamDemandFunnelStyle.hiringRequestContainer}>
					<div className={TeamDemandFunnelStyle.addnewHR}>
						<div className={TeamDemandFunnelStyle.hiringRequest}>
							Team Demand Funnel Report
						</div>
					</div>
					{/*
					 * --------- Filter Component Starts ---------
					 * @Filter Part
					 */}
					<div className={TeamDemandFunnelStyle.filterContainer}>
						<div className={TeamDemandFunnelStyle.filterSets}>
							<div
								className={TeamDemandFunnelStyle.addFilter}
								onClick={toggleDemandReportFilter}>
								<FunnelSVG style={{ width: '16px', height: '16px' }} />

								<div className={TeamDemandFunnelStyle.filterLabel}>
									Add Filters
								</div>
								<div className={TeamDemandFunnelStyle.filterCount}>
									{filteredTagLength}
								</div>
							</div>
							<div className={TeamDemandFunnelStyle.filterRight}>
							<div className={TeamDemandFunnelStyle.actionTab_Exceeded} style={{display:'flex',alignItems:'center'}}>
							{/* <span className={DemandFunnelStyle.actionTab_Exceeded}></span> */}
							Stage Count without Dates Filter
						</div>
								{selectedHierarchy && (
									<div style={{ display: 'flex', alignItems: 'center' }}>
										<div className={TeamDemandFunnelStyle.label}>
											Sales Manager :
										</div>
										&nbsp;
										<Switch
											checked={teamDemandFunnelModal}
											// defaultChecked
											onChange={onChange}
										/>
									</div>
								)}
								{selectedHierarchy && (
									<div
										style={{ display: 'flex', alignItems: 'center' }}
										onClick={() => setShowSelectedHierarchyModal(true)}>
										<div className={TeamDemandFunnelStyle.label}>
											Selected Hierarchy :
										</div>
										&nbsp;
										<div className={TeamDemandFunnelStyle.btnPrimary}>
											{selectedHierarchy?.value}
										</div>
									</div>
								)}
								<div className={TeamDemandFunnelStyle.calendarFilterSet}>
									<div className={TeamDemandFunnelStyle.label}>Date</div>

									<div className={TeamDemandFunnelStyle.calendarFilter}>
										<CalenderSVG
											style={{ height: '16px', marginRight: '16px' }}
										/>
										<DatePicker
											className={TeamDemandFunnelStyle.dateFilter}
											onKeyDown={(e) => {
												e.preventDefault();
												e.stopPropagation();
											}}
											placeholderText="Start date - End date"
											selected={startDate}
											onChange={onCalenderFilter}
											startDate={startDate}
											endDate={endDate}
											selectsRange
										/>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/*
					 * ------------ Table Starts-----------
					 * @Table Part
					 */}
					<div className={TeamDemandFunnelStyle.tableDetails}>
						{isLoading ? (
							<TableSkeleton />
						) : (
							<>
								<Table
									scroll={{ x: '70vw', y: '100vh' }}
									id="supplyFunnelListing"
									bordered={false}
									dataSource={[...apiData?.slice(1)]}
									pagination={{
										size: 'small',
										pageSize: apiData?.length,
									}}>
									{unGroupedColumnDataMemo?.map((item) => (
										<Column
											title={item}
											dataIndex={item}
											key={item}
											render={(text, param) => {

												if(text === "TR Active" || text === "HR Active" || text === "Profile Feedback Pending"|| text === 'Interview Feedback Pending'){
													return <Tooltip
													placement="bottomLeft"
													title={text}>
													
														<p style={{ fontWeight: '550', padding: '5px', marginBottom: '0px',
														// , borderBottom: '4px solid #6DBAFF',
														textDecoration: "underline",
														textDecorationColor: "#6DBAFF",
														textDecorationThickness:"4px"
														}}>{text}</p>
													
													</Tooltip>
												}
												return (
													<Tooltip
														placement="bottomLeft"
														title={text}>
														{item === 'Stage' || item === 'Duration' ? (
															<p style={{ fontWeight: '550', marginBottom:'0' }}>{text}</p>
														) : (
															<p
																style={{
																	textDecoration: 'underline',
																	marginBottom:'0',
																	cursor: text === 0 ? 'no-drop' : 'pointer',
																}}
																onClick={
																	text === 0
																		? null
																		: () => {
																				setTeamDemandHRDetailsModal(true);
																				setTeamDemandValue({
																					stage: param?.Stage,
																					count: text,
																				});
																				setTeamDemandFunnelHRDetailsState({
																					...teamDemandFunnelHRDetailsState,
																					currentStage: param.Stage,
																					adhocType: param.adhocType,
																				});
																		  }
																}>
																{text}
															</p>
														)}
													</Tooltip>
												);
											}}
										/>
									))}
									{GroupedColumn()}
								</Table>
								<div className={TeamDemandFunnelStyle.formPanelAction}>
									<button
										type="submit"
										onClick={viewSupplyFunnelSummaryHandler}
										className={TeamDemandFunnelStyle.btnPrimary}>
										View Summary
									</button>
								</div>
							</>
						)}
					</div>
					{isSummary && (
						<div className={TeamDemandFunnelStyle.tableDetails} style={{marginTop: '0'}}>
							{isSummaryLoading ? (
								<TableSkeleton />
							) : (
								<>
									<Table
										scroll={{ x: '100vw', y: '100vh' }}
										id="supplyFunnelViewSummary"
										bordered={false}
										dataSource={[...viewSummaryData?.slice(1)]}
										pagination={{
											size: 'small',
											pageSize: viewSummaryData?.length,
										}}>
										{unGroupedViewSummaryColumnDataMemo?.map((item) => (
											<Column
												title={item}
												dataIndex={item}
												key={item}
												render={(text, param) => (
													<Tooltip
														placement="bottomLeft"
														title={text}>
														{item === 'Stage' || item === 'Duration' ? (
															<p style={{ fontWeight: '550', marginBottom:'0' }}>{text}</p>
														) : (
															<p style={{marginBottom:'0'}}>{text}</p>
														)}
													</Tooltip>
												)}
											/>
										))}
										{ViewSummaryGroupedColumn()}
									</Table>
								</>
							)}
						</div>
					)}

					{isAllowFilters && (
						<Suspense fallback={<div>Loading...</div>}>
							<TeamDemandFunnelFilterLazyComponent
								setAppliedFilters={setAppliedFilters}
								appliedFilter={appliedFilter}
								setCheckedState={setCheckedState}
								checkedState={checkedState}
								handleHRRequest={getTeamDemandFunnelListingHandler}
								setTableFilteredState={setTableFilteredState}
								tableFilteredState={tableFilteredState}
								setFilteredTagLength={setFilteredTagLength}
								onRemoveHRFilters={onRemoveFilters}
								getHTMLFilter={getHTMLFilter}
								hrFilterList={reportConfig.TeamDemandReportFilterListConfig()}
								filtersType={reportConfig.TeamDemandReportFilterTypeConfig(
									filtersList && filtersList,
								)}
								selectedHierarchy={selectedHierarchy}
								setTeamDemandFunnelHRDetailsState={
									setTeamDemandFunnelHRDetailsState
								}
								isActionWise={isActionWise}
								teamDemandFunnelHRDetailsState={teamDemandFunnelHRDetailsState}
							/>
						</Suspense>
					)}
					{teamDemandHRDetailsModal && (
						<TeamDemandFunnelModal
							supplyFunnelModal={teamDemandHRDetailsModal}
							setSupplyFunnelModal={setTeamDemandHRDetailsModal}
							demandFunnelHRDetailsState={teamDemandFunnelHRDetailsState}
							setDemandFunnelHRDetailsState={setTeamDemandFunnelHRDetailsState}
							demandFunnelValue={teamDemandValue}
						/>
					)}
				</div>
			)}
			{teamDemandFunnelModal && (
				<WithLoader className="mainLoader">
					<Modal
						width="1000px"
						centered
						footer={null}
						open={teamDemandFunnelModal}
						// className={TeamDemandFunnelStyle.selectSalesManagerModal}
						// className={!selectedHierarchy && 'selectSalesManagerModal'}
						// onOk={() => setTeamDemandFunnelModal(false)}
						onCancel={
							selectedHierarchy
								? () => setTeamDemandFunnelModal(false)
								: () => {
										setTeamDemandFunnelModal(false);
										navigate(-1);
								  }
						}>
						<div className={TeamDemandFunnelStyle.container}>
							<div className={TeamDemandFunnelStyle.modalTitle}>
								<h2>Team Demand Funnel</h2>
							</div>
							<div className={TeamDemandFunnelStyle.transparent}>
								<div className={TeamDemandFunnelStyle.colMd12}>
									<HRSelectField
										mode={'id/value'}
										setValue={setValue}
										register={register}
										name="salesManager"
										label="Select Sales Manager"
										defaultValue="Please Select"
										options={filtersList?.SalesManager}
										required
										isError={errors['salesManager'] && errors['salesManager']}
										errorMsg="Please select sales manager."
									/>
								</div>

								{isLoading ? (
									<SpinLoader className="mainLoaderPopup" />
								) : (
									<div className={TeamDemandFunnelStyle.formPanelAction}>
										<button
											onClick={handleSubmit(viewActionWiseHandler)}
											className={TeamDemandFunnelStyle.btnPrimary}>
											View Action Wise Data
										</button>
										<button
											onClick={handleSubmit(hrWiseHandler)}
											className={TeamDemandFunnelStyle.btn}>
											View HR Wise Data
										</button>
									</div>
								)}
							</div>
						</div>
					</Modal>
				</WithLoader>
			)}
			{showSelectedHierarchyModal && (
				<Modal
					width="800px"
					centered
					footer={null}
					open={showSelectedHierarchyModal}
					onOk={() => setShowSelectedHierarchyModal(false)}
					onCancel={() => setShowSelectedHierarchyModal(false)}>
					<div className={TeamDemandFunnelStyle.container}>
						<div className={TeamDemandFunnelStyle.modalTitle}>
							<h2>{selectedHierarchy?.value} Hierarchy</h2>

							<div
								className="teamDemandFunnelReport"
								style={{ marginTop: '30px' }}>
								<Tree
									defaultExpandAll
									onSelect={onHierarchySelect}
									showLine={true}
									showIcon={true}
									treeData={selectedHierarchyTree}
								/>
							</div>
						</div>
					</div>
				</Modal>
			)}
		</>
	);
};

export default TeamDemandFunnelScreen;
