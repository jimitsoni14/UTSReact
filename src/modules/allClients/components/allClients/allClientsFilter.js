import { useCallback, useEffect, useMemo, useState } from 'react';
import { Checkbox, Tag } from 'antd';
import allClientsStyle from './allClientFilter.module.css'
import { AiOutlineSearch } from 'react-icons/ai';
import { All_Hiring_Request_Utils } from 'shared/utils/all_hiring_request_util';
import { ReactComponent as ArrowRightSVG } from 'assets/svg/arrowRight.svg';
import { ReactComponent as CrossSVG } from 'assets/svg/cross.svg';
import { ReactComponent as ArrowLeftSVG } from 'assets/svg/arrowLeft.svg';
import { hrUtils } from 'modules/hiring request/hrUtils';

const AllClientFilters = ({
	setAppliedFilters,
	appliedFilter,
	setCheckedState,
	setFilteredTagLength,
	onRemoveSurveyFilters,
	checkedState,
	setIsAllowFilters,
	tableFilteredState,
	setTableFilteredState,
	filtersType,
	getHTMLFilter,
	clearFilters,
	setPageIndex
}) => {
	const [toggleBack, setToggleBack] = useState(false);
	const [searchData, setSearchData] = useState([]);
	const [filterSubChild, setFilterSubChild] = useState(null);

	const toggleFilterSubChild = (item) => {
		setToggleBack(true);
		setFilterSubChild(item);
	};
	
	const handleAppliedFilters = useCallback(
		(isChecked, filterObj) => {
			let tempAppliedFilters = new Map(appliedFilter);
			let tempCheckedState = new Map(checkedState);

			if(isChecked === "numberField"){				
				if (tempAppliedFilters.has(filterObj.filterType)){
						if(!filterObj.value){
							setFilteredTagLength((prev) => prev - 1);
							tempAppliedFilters.delete(filterObj.filterType)
						}else{
							tempAppliedFilters.set(filterObj.filterType, filterObj);							
						}
				}	
				else{
					setFilteredTagLength((prev) => prev + 1);
						 tempAppliedFilters.set(filterObj.filterType, filterObj);	
				}	    		
				setAppliedFilters(tempAppliedFilters);
				setCheckedState(tempCheckedState);
				return
			}
			
			if (isChecked) {
				tempCheckedState.set(`${filterObj.filterType}${filterObj.id}`, true);
				setFilteredTagLength((prev) => prev + 1);
			} else {
				tempCheckedState.set(`${filterObj.filterType}${filterObj.id}`, false);
				setFilteredTagLength((prev) => prev - 1);
			}
			if (tempAppliedFilters.has(filterObj.filterType)) {
				let filterAddress = tempAppliedFilters.get(filterObj.filterType);
				if (isChecked) {
					filterAddress.value = filterAddress?.value + ',' + filterObj.value;
					filterAddress.id = filterAddress.id + ',' + filterObj.id;
					tempAppliedFilters.set(filterObj.filterType, filterAddress);
				} else {
					let splittedID = filterAddress.id.split(',');
					let splittedIDIndex = splittedID.indexOf(filterObj.id);
					splittedID = [
						...splittedID.slice(0, splittedIDIndex),
						...splittedID.slice(splittedIDIndex + 1),
					];

					let splittedValue = filterAddress.value.split(',');
					let splittedValueIndex = splittedValue.indexOf(filterObj.value);
					splittedValue = [
						...splittedValue.slice(0, splittedValueIndex),
						...splittedValue.slice(splittedValueIndex + 1),
					];
					filterAddress.value = splittedValue.toString();
					filterAddress.id = splittedID.toString();
					splittedID.length === 0
						? tempAppliedFilters.delete(filterObj.filterType)
						: tempAppliedFilters.set(filterObj.filterType, filterAddress);
				}
			} else {
				tempAppliedFilters.set(filterObj.filterType, filterObj);
			}
			setAppliedFilters(tempAppliedFilters);
			setCheckedState(tempCheckedState);
		},
		[appliedFilter, checkedState, setFilteredTagLength],
	);

	
	const handleFilters = useCallback(() => {
		let filters = {};
		appliedFilter.forEach((item) => {
			filters = { ...filters, [item.filterType]: item.id };
		});
		setPageIndex(1)
		setTableFilteredState({
			...tableFilteredState,
			filterFields_Client: { ...filters },
			pagenumber:1
		});		
		setIsAllowFilters(false);
	}, [
		appliedFilter,
		setIsAllowFilters,
		setTableFilteredState,
		tableFilteredState,
	]);
	const filteredTags = useMemo(() => {
		if (appliedFilter.size > 0) {
			return Array.from(appliedFilter?.values()).map((item) => {
				const splittedTags = item?.value.split(',');
				const splittedIDs = item?.id.split(',');
				if (splittedTags.length > 0) {
					return splittedTags?.map((splittedItem, index) => {
						return (
							<Tag
								key={`${item.filterType}_${splittedIDs[index]}`}
								closable={true}
								onClose={(e) => {
									e.preventDefault();
									handleAppliedFilters(false, {
										filterType: item?.filterType,
										value: splittedItem,
										id: splittedIDs[index],
									});
								}}
								style={{
									display: 'flex',
									justifyContent: 'space-around',
									alignItems: 'center',
									backgroundColor: `var(--color-sunlight)`,
									border: 'none',
									borderRadius: '10px',
									fontSize: '.8rem',
									// margin: '10px 10px 10px 0',
									margin: '4px 4px 4px 0',
									fontWeight: '600',
									padding: '10px 20px',
								}}>
								{splittedItem}&nbsp;
							</Tag>
						);
					});
				}
				return (
					<Tag
						key={`${item.filterType}_${item?.id}`}
						closable={true}
						onClose={(e) => {
							e.preventDefault();
							handleAppliedFilters(false, {
								filterType: item?.filterType,
								value: item.value,
								id: item.id,
							});
						}}
						style={{
							display: 'flex',
							justifyContent: 'space-around',
							alignItems: 'center',
							backgroundColor: `var(--color-sunlight)`,
							border: 'none',
							borderRadius: '10px',
							fontSize: '.8rem',
							margin: '4px 4px 4px 0',
							fontWeight: '600',
							padding: '10px 20px',
						}}>
						{item?.value}&nbsp;
					</Tag>
				);
			});
		}
	}, [appliedFilter, handleAppliedFilters]);

	return (
		<aside className={`${allClientsStyle.aside} ${getHTMLFilter && allClientsStyle.closeFilter }`}>
			<div className={allClientsStyle.asideBody}>
				<div className={toggleBack ? allClientsStyle.asideHead : ''}>
					{toggleBack && (
						<span
							className={allClientsStyle.goback}
							onClick={() => {
								setToggleBack(false);
							}}
                            >
							<ArrowLeftSVG />
							&nbsp;&nbsp; Go back
						</span>
					)}
					<span
						style={{
							display: 'flex',
							justifyContent: 'end',
							cursor: 'pointer',
						}}>
						<CrossSVG
							style={{ width: '26px' }}
							onClick={() => {
								onRemoveSurveyFilters();
							}}
						/>
					</span>
				</div>

				<div className={allClientsStyle.asideFilters}>
					{toggleBack ? (
						<>
							<span className={allClientsStyle.label}>
								{filterSubChild.label}
							</span>
							<br />
							{filterSubChild.isSearch && (
								<div className={allClientsStyle.searchFiltersList}>
									<AiOutlineSearch
										style={{ fontSize: '20px', fontWeight: '800' }}
									/>
									<input
										onChange={(e) => {
											return setSearchData(
												hrUtils.hrFilterSearch(e, filterSubChild.child),
											);
										}}
										className={allClientsStyle.searchInput}
										type="text"
										id="search"
										placeholder={`Search ${filterSubChild?.name}`}
									/>
								</div>
							)}

							{filterSubChild.isNumber && (
								<div className={allClientsStyle.searchFiltersList}>
									<input
										// onChange={(e) => {
										// 	if(e.target.value === '0'){
										// 		return
										// 	}
										// 	handleAppliedFilters("numberField", {
										// 		filterType: filterSubChild.name,
										// 		value: e.target.value.substring(0, 2),
										// 		id: e.target.value.substring(0, 2),
										// 	})
										// }}
										value={appliedFilter?.get(filterSubChild?.name) ? appliedFilter?.get(filterSubChild?.name).value : ''}
										className={allClientsStyle.searchInput}
										type="number"
										id="NumberInput"
										placeholder={`Enter ${filterSubChild?.name}`}
										min="1" max="99" 
									/>
								</div>
							)}

							{filterSubChild.isText && (
								<div className={allClientsStyle.searchFiltersList}>
								<input
									onChange={(e) => {										
										handleAppliedFilters("numberField", {
											filterType: filterSubChild.name,
											value: e.target.value,
											id: e.target.value,
										})
									}}
									value={appliedFilter?.get(filterSubChild?.name) ? appliedFilter?.get(filterSubChild?.name).value : ''}
									className={allClientsStyle.searchInput}
									type="text"
									id="TextInput"
									placeholder={`Enter ${filterSubChild?.name}`}									
								/>
							</div>
							)}
							<br />
							<div className={allClientsStyle.filtersListType}>
								{searchData && searchData.length > 0
									? searchData.map((item, index) => {
											return (
												<div
													className={allClientsStyle.filterItem}
													key={index}>
													<Checkbox
														checked={checkedState?.get(
															`${filterSubChild.name}${item.text}`,
														)}
														onChange={(e) =>
															handleAppliedFilters(e.target.checked, {
																filterType: filterSubChild.name,
																value: item?.value,
																id: item?.text,
															})
														}
														id={item?.value + `/${index + 1}`}
														style={{
															fontSize: `${!item.label && '1rem'}`,
															fontWeight: '500',
														}}>
														{item.label
															? All_Hiring_Request_Utils.GETHRSTATUS(
																	item.statusCode,
																	item.label,
															  )
															: item?.value}
													</Checkbox>
												</div>
											);
									  })
									:  filterSubChild.isSingleSelect ? filterSubChild?.child?.map((item, index) => {
										return (
											<div
												className={allClientsStyle.filterItem}
												key={index}>
												<Checkbox
												disabled={
													appliedFilter?.get(`${filterSubChild.name}`) &&
													!checkedState.get(
														`${filterSubChild.name}${item.text}`,
													)
												}
													checked={checkedState?.get(
														`${filterSubChild.name}${item.text}`,
													)}
													onChange={(e) =>
														handleAppliedFilters(e.target.checked, {
															filterType: filterSubChild.name,
															value: item?.value,
															id: item?.text,
														})
													}
													id={item?.value + `/${index + 1}`}
													style={{
														fontSize: `${!item.label && '1rem'}`,
														fontWeight: '500',
													}}>														
													{item.label
														? item.label
														: item?.value}
												</Checkbox>
											</div>
										);
								  }) : filterSubChild?.child?.map((item, index) => {
											return (
												<div
													className={allClientsStyle.filterItem}
													key={index}>
													<Checkbox
														checked={checkedState?.get(
															`${filterSubChild.name}${item.text}`,
														)}
														onChange={(e) =>
															handleAppliedFilters(e.target.checked, {
																filterType: filterSubChild.name,
																value: item?.value,
																id: item?.text,
															})
														}
														id={item?.value + `/${index + 1}`}
														style={{
															fontSize: `${!item.label && '1rem'}`,
															fontWeight: '500',
														}}>														
														{item.label
															? item.label
															: item?.value}
													</Checkbox>
												</div>
											);
									  })}
							</div>
						</>
					) : (
						<>
							<span className={allClientsStyle.label}>Filters</span>
							<div className={allClientsStyle.filtersChips}>
								{filteredTags}
							</div>
							<div className={allClientsStyle.filtersListType}>
								{filtersType.map((item, index) => {
									return (
										<div
											key={index}
											className={allClientsStyle.filterItem}
											onClick={() => toggleFilterSubChild(item)}>
											<span style={{ fontSize: '1rem' }}>{item.label}</span>
											<ArrowRightSVG style={{ width: '26px' }} />
										</div>
									);
								})}
							</div>
						</>
					)}
					<br />
					<hr />
					<div className={allClientsStyle.operationsFilters}>
						<button
							className={allClientsStyle.clearAll}
							onClick={clearFilters}>
							Clear All
						</button>
						<button
							className={allClientsStyle.applyFilters}
							onClick={handleFilters}
                            >
							Apply Filters
						</button>
					</div>
				</div>
			</div>
		</aside>
      
	);
};

export default AllClientFilters;
