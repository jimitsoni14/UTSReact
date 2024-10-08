import { Checkbox, Empty, Skeleton, Tooltip } from 'antd';
import MatchMakingStyle from './matchmaking.module.css';
import { useMemo, useState } from 'react';
import { All_Hiring_Request_Utils } from 'shared/utils/all_hiring_request_util';
import { ReactComponent as ArrowRightSVG } from 'assets/svg/arrowRightLight.svg';
import { ReactComponent as ArrowDownSVG } from 'assets/svg/arrowDownLight.svg';

const MatchMakingTable = ({
	matchMakingData,
	setTalentCost,
	setTalentID,
	allSelected,
	toggleRowSelection,
	expandedRows,
	handleExpandRow,
	selectedRows,
	currentExpandedCell,
	componentToRender,
	apiData,
	handleUserValueChange
}) => {
	const [disableAll, setDisableAll] = useState(false);
	return (
		<table className={MatchMakingStyle.matchmakingTable}>
			<Thead
				disableAll={disableAll}
				setDisableAll={setDisableAll}
				allSelected={allSelected}
				toggleRowSelection={toggleRowSelection}
				apiData={apiData}
			/>
			<tbody>
				{matchMakingData?.length > 0 ? (
					matchMakingData.map((user) => (
						<TrAPIData
							disableAll={disableAll}
							setTalentCost={setTalentCost}
							setTalentID={setTalentID}
							key={user.id}
							user={user}
							expandedRows={expandedRows}
							toggleRowSelection={toggleRowSelection}
							handleExpandRow={handleExpandRow}
							selectedRows={selectedRows}
							currentExpandedCell={currentExpandedCell}
							componentToRender={componentToRender}
							apiData={apiData}
							handleUserValueChange={handleUserValueChange}
						/>
					))
				) : (
					<tr>
						<td colSpan={12}>
							<Empty />
						</td>
					</tr>
				)}
			</tbody>
		</table>
	);
};

export default MatchMakingTable;

const Thead = ({
	allSelected,
	toggleRowSelection,
	setDisableAll,
	disableAll,
	apiData
}) => {
	return (
		<thead className={MatchMakingStyle.thead}>
			<tr>
				<th className={MatchMakingStyle.th}></th>
				<th className={MatchMakingStyle.th}>
					{/* <Checkbox
						id="selectAll"
						checked={allSelected}
						onClick={() => {
							toggleRowSelection('selectAll');
							setDisableAll(!disableAll);
						}}
					/> */}
				</th>
				<th className={MatchMakingStyle.th}>Name</th>
				{/* <th className={MatchMakingStyle.th}>Talent Cost</th> */}
				<th className={MatchMakingStyle.th}>Expected Cost</th>
			
				{apiData?.Is_HRTypeDP && <>
						<th className={MatchMakingStyle.th}>Current CTC</th>
						<th className={MatchMakingStyle.th}>DP</th>
				</>}
				
				<th className={MatchMakingStyle.th}>Role</th>
				<th className={MatchMakingStyle.th}>Email ID</th>
				<th className={MatchMakingStyle.th}>Status</th>
				<th className={MatchMakingStyle.th}>Tech Score</th>
				<th className={MatchMakingStyle.th}>Versant Score</th>
				<th className={MatchMakingStyle.th}>Profile Log</th>
			</tr>
		</thead>
	);
};

const TrAPIData = ({
	key,
	setTalentCost,
	setTalentID,
	user,
	expandedRows,
	disableAll,
	toggleRowSelection,
	handleExpandRow,
	selectedRows,
	currentExpandedCell,
	componentToRender,
	apiData,
	handleUserValueChange
}) => {
	const [activeCellMemo, expandedIconMemo] = useMemo(() => {
		let iconObj = {
			talentCost: <ArrowRightSVG style={{ marginLeft: '8px' }} />,
			techScore: <ArrowRightSVG style={{ marginLeft: '8px' }} />,
			versantScore: <ArrowRightSVG style={{ marginLeft: '8px' }} />,
			profileLog: <ArrowRightSVG style={{ marginLeft: '8px' }} />,
			showAll: <ArrowRightSVG style={{ marginLeft: '8px' }} />,
		};
		let obj = {
			talentCost: false,
			techScore: false,
			versantScore: false,
			profileLog: false,
		};
		const columnValue = currentExpandedCell.split('_')[0];

		if (expandedRows.includes(user.id)) {
			iconObj[columnValue] = <ArrowDownSVG style={{ marginLeft: '8px' }} />;
			iconObj['showAll'] = <ArrowDownSVG style={{ marginLeft: '8px' }} />;
			obj[columnValue] = true;
		}
		return [obj, iconObj];
	}, [user.id, currentExpandedCell, expandedRows]);

	return (
		<>
			<tr
				key={key}
				className={
					expandedRows.includes(user.id) &&
					MatchMakingStyle.isSelectedBackground
				}>
				<td
					className={MatchMakingStyle.td}
					onClick={(e) => {
						handleExpandRow(
							e,
							user.id,
							`talentCost_${user.id}`,
							'talentCost',
							user.talentCost,
						);
						setTalentCost(user.talentCost.split('.')[0]);
					}}>
					{expandedIconMemo.showAll}
				</td>
				<td className={MatchMakingStyle.td}>
					<Checkbox
						disabled={disableAll}
						id={user.id}
						checked={selectedRows.includes(user.id)}
						onClick={() => toggleRowSelection(user.id)}
					/>
				</td>
				<td
					className={`${MatchMakingStyle.td}
								${MatchMakingStyle.ellipsis}
								 ${MatchMakingStyle.maxWidth164}`}>
					<Tooltip
						placement="bottom"
						title={user.name}>
						{user.name}
					</Tooltip>
				</td>
				{/* <td
					className={
						activeCellMemo.talentCost
							? `${MatchMakingStyle.selectedCell}`
							: `${MatchMakingStyle.td}`
					}
					id={`talentCost_${user.id}`}
					onClick={(e) => {
						handleExpandRow(
							e,
							user.id,
							`talentCost_${user.id}`,
							'talentCost',
							user.talentCost,
						);
						setTalentCost(user.talentCost.split('.')[0]);
					}}>
					<span style={{ fontWeight: 600 }}>
						{user ? user.talentCost.split('.')[0] : <Skeleton />}
					</span>{' '}
					/ Month
					{expandedIconMemo.talentCost}
				</td> */}
                {/* Expected  */}
				<td>
               <input className={MatchMakingStyle.userInput} type='number' value={user.expectedCost} 
			   		onChange={(e)=>{
					handleUserValueChange(user?.id,{expectedCost: e.target.value})
			   }} />
					</td>

					{/* CTC */}
				{apiData?.Is_HRTypeDP && <td>
					<input className={MatchMakingStyle.userInput} type='number' value={user?.currentCTC} onChange={(e)=>{
					handleUserValueChange(user?.id,{currentCTC: e.target.value})
							   }}  />
					</td> }
				{/* DP */}
				{apiData?.Is_HRTypeDP && <td>
					<input className={MatchMakingStyle.userInput} type='number' value={user?.dpPercentage} onChange={(e)=>{
					handleUserValueChange(user?.id,{dpPercentage: e.target.value})
							   }} />
					</td> }
						
				<td
					className={`${MatchMakingStyle.td} ${MatchMakingStyle.ellipsis} ${MatchMakingStyle.maxWidth134}`}>
					<Tooltip
						placement="bottom"
						title={user.talentRole}>
						{user.talentRole}
					</Tooltip>
				</td>
				<td
					className={`${MatchMakingStyle.td} ${MatchMakingStyle.ellipsis} ${MatchMakingStyle.maxWidth170}`}>
					<Tooltip
						placement="bottom"
						title={user.emailID}>
						{user.emailID}
					</Tooltip>
				</td>
				<td className={MatchMakingStyle.td}>
					{All_Hiring_Request_Utils.GETTALENTSTATUS(
						user.frontStatusID,
						user.talentStatus,
					)}
				</td>
				<td
					className={
						activeCellMemo.techScore
							? `${MatchMakingStyle.selectedCell}`
							: `${MatchMakingStyle.td}`
					}
					id={`techScore_${user.id}`}
					onClick={(e) => {
						handleExpandRow(
							e,
							user.id,
							`techScore_${user.id}`,
							'techScore',
							user.techScore,
						);
						setTalentID(user.id);
					}}>
					{user.techScore}
					{expandedIconMemo.techScore}
				</td>
				<td
					className={
						activeCellMemo.versantScore
							? `${MatchMakingStyle.selectedCell}`
							: `${MatchMakingStyle.td}`
					}
					id={`versantScore_${user.id}`}
					onClick={(e) => {
						return handleExpandRow(
							e,
							user.id,
							`versantScore_${user.id}`,
							'versantScore',
							user.versantScore,
						);
					}}>
					{user.versantScore}
					{expandedIconMemo.versantScore}
				</td>
				<td
					className={
						activeCellMemo.profileLog
							? `${MatchMakingStyle.selectedCell}`
							: `${MatchMakingStyle.td}`
					}
					id={`profileLog_${user.id}`}
					onClick={(e) => {
						handleExpandRow(
							e,
							user.id,
							`profileLog_${user.id}`,
							'profileLog',
							user.profileLog,
						);
						setTalentID(user.id);
					}}>
					View
					{expandedIconMemo.profileLog}
				</td>
			</tr>
			<>
				{expandedRows.includes(user.id) ? (
					<tr className={MatchMakingStyle.isSelectedBackground}>
						<td
							colSpan="12"
							className={MatchMakingStyle.td}>
							<div>{componentToRender}</div>
						</td>
					</tr>
				) : null}
			</>
		</>
	);
};
