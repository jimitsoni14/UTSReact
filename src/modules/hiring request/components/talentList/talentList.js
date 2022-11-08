import { Dropdown, Menu, Divider, List, Modal } from 'antd';
import { hiringRequestHRStatus } from 'constants/application';
import { BsThreeDots } from 'react-icons/bs';
import { All_Hiring_Request_Utils } from 'shared/utils/all_hiring_request_util';
import { RiArrowDropDownLine } from 'react-icons/ri';
import TalentListStyle from './talentList.module.css';
import HROperator from '../hroperator/hroperator';
import { AiOutlineDown } from 'react-icons/ai';
import { useState } from 'react';

const TalentList = ({ talentDetail }) => {
	const [showVersantModal, setVersantModal] = useState(false);

	return (
		<div>
			<List
				grid={{ gutter: 16, column: 2 }}
				size="default"
				dataSource={talentDetail && talentDetail}
				pagination={{
					className: TalentListStyle.paginate,
					size: 'small',
					pageSize: 2,
					position: 'top',
				}}
				renderItem={(item) => (
					<div className={TalentListStyle.talentCard}>
						<div className={TalentListStyle.talentCardBody}>
							<div className={TalentListStyle.partWise}>
								<div
									style={{
										marginBottom: '10px',
										display: 'flex',
									}}>
									<div
										style={{
											display: 'flex',
											justifyContent: 'space-between',
											alignItems: 'center',
										}}>
										<img
											src={
												!item?.ProfileURL
													? item?.ProfileURL
													: 'https://www.w3schools.com/howto/img_avatar.png'
											}
											className={TalentListStyle.avatar}
											alt="avatar"
										/>
										<div
											style={{
												position: 'absolute',
												marginLeft: '60px',
												top: '-35px',
											}}>
											{All_Hiring_Request_Utils.GETHRSTATUS(
												hiringRequestHRStatus.IN_PROCESS,
												item?.RequestStatus ? item?.RequestStatus : 'Hired',
											)}
										</div>
										<div
											style={{
												marginLeft: '50px',
												marginTop: '20px',
												fontSize: '.7vw',
											}}>
											<div
												style={{
													textDecoration: 'underline',
													fontWeight: '600',
												}}>
												{item?.Name}
											</div>
											<div>{item?.TalentRole}</div>
										</div>
									</div>
								</div>
								<div style={{ cursor: 'pointer' }}>
									<Dropdown
										trigger={['click']}
										placement="bottom"
										overlay={
											<Menu>
												<Menu.Item key={0}>View Profile Log</Menu.Item>
												<Divider
													style={{
														margin: '3px 0',
													}}
												/>
												<Menu.Item key={1}>Remove Profile</Menu.Item>
											</Menu>
										}>
										<BsThreeDots style={{ fontSize: '1.5rem' }} />
									</Dropdown>
								</div>
							</div>
							<div className={TalentListStyle.profileURL}>
								<span>profile URL:</span>&nbsp;&nbsp;
								<span style={{ fontWeight: '500' }}>
									<a
										style={{ textDecoration: 'underline' }}
										href={item?.ProfileURL}
										target="_blank">
										Click here
									</a>
								</span>
							</div>
							<div className={TalentListStyle.experience}>
								<span>Experience:</span>&nbsp;&nbsp;
								<span style={{ fontWeight: '500' }}>
									{item?.TotalExpYears} years
								</span>
							</div>
							<div className={TalentListStyle.noticePeriod}>
								<span>Notice Period:</span>&nbsp;&nbsp;
								<span style={{ fontWeight: '500' }}>{item?.NoticePeriod}</span>
							</div>
							<div className={TalentListStyle.agreedShift}>
								<span>Agreed Shift:</span>&nbsp;&nbsp;
								<span style={{ fontWeight: '500' }}>
									{item?.TalentTimeZone}
								</span>
							</div>
							<div className={TalentListStyle.availability}>
								<span>Preferred Availability:</span>&nbsp;&nbsp;
								<span style={{ fontWeight: '500' }}>
									{item?.PreferredAvailability}
								</span>
							</div>
							<div className={TalentListStyle.profileSource}>
								<span>Profile Source:</span>&nbsp;&nbsp;
								<span style={{ fontWeight: '500' }}>{item?.TalentSource}</span>
							</div>
							<Divider
								style={{
									margin: '10px 0',
									// border: `1px solid var(--uplers-border-color)`,
								}}
							/>
							<div className={TalentListStyle.interviewStatus}>
								<span>Interview Status:</span>&nbsp;&nbsp;
								<span style={{ fontWeight: '500' }}>
									{item?.InterviewStatus}
								</span>
							</div>
							<Divider
								style={{
									margin: '10px 0',
									// border: `1px solid var(--uplers-border-color)`,
								}}
							/>
							<div className={TalentListStyle.billRate}>
								<span>Bill Rate:</span>&nbsp;&nbsp;
								<span style={{ fontWeight: '500' }}>{item?.BillRate}</span>
							</div>
							<div className={TalentListStyle.payRate}>
								<div>
									<span>Pay Rate:</span>&nbsp;&nbsp;
									<span style={{ fontWeight: '500' }}>{item?.PayRate}</span>
								</div>
								<span
									style={{
										textDecoration: 'underline',
										color: `var(--background-color-ebony)`,
										cursor: 'pointer',
									}}>
									edit
								</span>
							</div>
							<div className={TalentListStyle.nr}>
								<div>
									<span>NR:</span>&nbsp;&nbsp;
									<span style={{ fontWeight: '500' }}>{item?.NR}</span>
								</div>
								<span
									style={{
										textDecoration: 'underline',
										color: `var(--background-color-ebony)`,
										cursor: 'pointer',
									}}>
									edit
								</span>
							</div>
							<Divider
								style={{
									margin: '10px 0',
									// border: `1px solid var(--uplers-border-color)`,
								}}
							/>
							<div className={TalentListStyle.interviewSlots}>
								<span>Available Interview Slots:</span>&nbsp;&nbsp;
								<span style={{ fontWeight: '500' }}>
									{item?.Slotconfirmed
										? item?.Slotconfirmed.split(' ')[0]
										: 'not scheduled'}
								</span>
								<RiArrowDropDownLine />
							</div>
							<div className={TalentListStyle.time}>
								<span>Time:</span>&nbsp;&nbsp;
								<span style={{ fontWeight: '500' }}>
									{item?.Slotconfirmed
										? item?.Slotconfirmed.split(' ')[1] +
										  ' - ' +
										  item?.Slotconfirmed.split(' ')[3]
										: 'not scheduled'}
								</span>
							</div>
							<Divider
								style={{
									margin: '10px 0',
									// border: `1px solid var(--uplers-border-color)`,
								}}
							/>
							<div
								style={{
									padding: '2px 0',
									textDecoration: 'underline',
									cursor: 'pointer',
								}}
								onClick={() => setVersantModal(true)}>
								Versant Test Results
							</div>
							<Modal
								width="50%"
								centered
								footer={null}
								open={showVersantModal}
								// onOk={() => setVersantModal(false)}
								onCancel={() => setVersantModal(false)}>
								<p>some contents...</p>
								<p>some contents...</p>
							</Modal>
							<div style={{ padding: '2px 0', textDecoration: 'underline' }}>
								Skill Test Results
							</div>
							<Divider
								style={{
									margin: '10px 0',
									// border: `1px solid var(--uplers-border-color)`,
								}}
							/>
							<div style={{ position: 'absolute', marginTop: '10px' }}>
								<HROperator
									title="Onboard Talent"
									icon={<AiOutlineDown />}
									backgroundColor={`var(--color-sunlight)`}
									iconBorder={`1px solid var(--color-sunlight)`}
									isDropdown={true}
								/>
							</div>
						</div>
					</div>
				)}
			/>
		</div>
	);
};

export default TalentList;
