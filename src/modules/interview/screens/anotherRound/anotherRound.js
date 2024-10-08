import { Radio, message } from 'antd';
import HRInputField from 'modules/hiring request/components/hrInputFields/hrInputFields';
import InterviewScheduleStyle from '../../interviewStyle.module.css';
import { EmailRegEx, InputType } from 'constants/application';
import { useFieldArray, useForm } from 'react-hook-form';
import HRSelectField from 'modules/hiring request/components/hrSelectField/hrSelectField';
import { useCallback, useEffect, useState } from 'react';
import { InterviewDAO } from 'core/interview/interviewDAO';
import { useParams } from 'react-router-dom';
import { ReactComponent as CalenderSVG } from 'assets/svg/calender.svg';
import DatePicker from 'react-datepicker';
import { ReactComponent as ClockIconSVG } from 'assets/svg/clock-icon.svg';
import {
	AnotherRoundInterviewOption,
	AnotherRoundTimeSlotOption,
} from 'constants/application';
import { HTTPStatusCode } from 'constants/network';
import { addHours, disabledWeekend } from 'shared/utils/basic_utils';
import SpinLoader from 'shared/components/spinLoader/spinLoader';
import { interviewUtils } from 'modules/interview/interviewUtils';
import moment from 'moment';

export const otherInterviewer = {
	interviewerName: '',
	interviewerEmailID: '',
	interviewLinkedin: '',
	interviewerDesignation: '',
	typeofInterviewer: '',
	interviewerYearofExperience: '',
};
const AnotherRound = ({
	talentInfo,
	getScheduleSlotDate,
	setScheduleSlotDate,
	callAPI,
	getHrUserData,
	hrId,
	closeModal,
}) => {
	const {
		register,
		handleSubmit,
		setValue,
		control,
		watch,
		unregister,
		clearErrors,
		reset,
		formState: { errors },
	} = useForm({
		defaultValues: {
			otherInterviewer: [],
		},
	});

	const [isLoading, setIsLoading] = useState(false);

	const { fields, append, remove } = useFieldArray({
		control,
		name: 'otherInterviewer',
	});
	const onAddSecondaryInterviewer = useCallback(
		(e) => {
			e.preventDefault();
			append({ ...otherInterviewer });
		},
		[append],
	);
	const onRemoveSecondaryInterviewer = useCallback(
		(e, index) => {
			e.preventDefault();
			remove(index);
		},
		[remove],
	);
	const [messageAPI, contextHolder] = message.useMessage();
	const [radioValue, setRadioValue] = useState(AnotherRoundInterviewOption.YES);
	const [slotLater, setSlotLater] = useState(AnotherRoundTimeSlotOption.NOW);
	const param = useParams();

	const [slot1Timematch, setSlot1timematch] = useState(false);
	const [slot2Timematch, setSlot2timematch] = useState(false);
	const [slot3Timematch, setSlot3timematch] = useState(false);
	const [timeErrorMessage,setTimeErrorMessage] = useState('');
	const [interviewTimezone,setInterviewTimezone] = useState('');
	const [clientDetailsForAnotherRound, setClientDetailsForAnotherRound] =
		useState(null);
	const onChangeRadioBtn = useCallback(
		(e) => {
			setRadioValue(e.target.value);
			remove();
			clearErrors();
			reset();
		},
		[clearErrors, remove, reset],
	);
	const slotLaterOnChange = useCallback(
		(e) => {
			setSlotLater(e.target.value);
			clearErrors('interviewTimezone');
		},
		[clearErrors],
	);

	useEffect(() => {
		if(slotLater !== AnotherRoundTimeSlotOption.NOW){
			unregister('interviewTimezone')
		}
	},[slotLater, unregister])

	const calenderDateHandler = useCallback(
		(date, index, slotField) => {
			const eleToUpdate = { ...getScheduleSlotDate[index] };
			eleToUpdate[slotField] = date;

			setScheduleSlotDate([
				...getScheduleSlotDate.slice(0, index),
				{ ...eleToUpdate },
				...getScheduleSlotDate.slice(index + 1),
			]);
		},
		[getScheduleSlotDate, setScheduleSlotDate],
	);

	const calenderTimeHandler = useCallback(
		(date, index, slotField) => {
			const eleToUpdate = { ...getScheduleSlotDate[index] };
			eleToUpdate[slotField] = date;

			if (slotField === 'slot2') {
				eleToUpdate['slot3'] = addHours(date, 1);
			}

			setScheduleSlotDate([
				...getScheduleSlotDate.slice(0, index),
				{ ...eleToUpdate },
				...getScheduleSlotDate.slice(index + 1),
			]);
		},
		[getScheduleSlotDate, setScheduleSlotDate],
	);

	useEffect(() => {
		//Slot 1 data
		setValue('slot1Date', getScheduleSlotDate[0].slot1)
		setValue('slot1StartTime', getScheduleSlotDate[0].slot2);
		setValue('slot1EndTime', getScheduleSlotDate[0].slot3);

		//slot 2 data

		setValue('slot2Date', getScheduleSlotDate[1].slot1)
		setValue('slot2StartTime', getScheduleSlotDate[1].slot2);
		setValue('slot2EndTime', getScheduleSlotDate[1].slot3);

		//slot 3 data	

		setValue('slot3Date', getScheduleSlotDate[2].slot1)
		setValue('slot3StartTime', getScheduleSlotDate[2].slot2);
		setValue('slot3EndTime', getScheduleSlotDate[2].slot3);

    },[getScheduleSlotDate,setValue])

	const checkDuplicateInterviewerEmailHandler = useCallback(
		async (e) => {
			const response = await InterviewDAO.CheckInterviewerEmailIdRequestDAO({
				emailID: e.target.value,
				HRDetailID: parseInt(param?.hrid),
			});
		},
		[param?.hrid],
	);

	const checkDuplicateInterviewerLinkedinHandler = useCallback(
		async (e) => {
			const response = await InterviewDAO.CheckLinkedinURLRequestDAO({
				linkedinURL: e.target.value,
				HRDetailID: parseInt(param?.hrid),
			});
		},
		[param?.hrid],
	);

	const anotherRoundHandler = useCallback(		
		async (d) => {
			setIsLoading(true);

			let timeError = false
			setSlot1timematch(false)
			setSlot2timematch(false)
			setSlot3timematch(false)

			if(radioValue !== AnotherRoundInterviewOption.YES){
				if(moment(d.slot1StartTime).format('HH mm a') === moment(d.slot1EndTime).format('HH mm a')){
					timeError = true;
					setSlot1timematch(true)
				}

			if(moment(d.slot2StartTime).format('HH mm a') === moment(d.slot2EndTime).format('HH mm a')){
					setSlot2timematch(true)
					timeError = true;
				}
				
			if(moment(d.slot3StartTime).format('HH mm a') === moment(d.slot3EndTime).format('HH mm a')){
					setSlot3timematch(true)
					timeError = true;
				}	
			}			

			if(timeError){
				setIsLoading(false);
					return
				}

				const timeResult = await InterviewDAO.CheckInterviewTimeSlotDAO(AnotherRoundTimeSlotOption.LATER === slotLater
					? []
					: interviewUtils.formatInterviewDateSlotHandler(
							getScheduleSlotDate,
					  ))	
					
					
				if (timeResult?.statusCode !== HTTPStatusCode.OK) {
						setTimeErrorMessage(timeResult.responseBody)
						setIsLoading(false);
						return
					} 

			let formattedInterviewerDetails = [
				{
					interviewerName: d?.fullName,
					interviewLinkedin: d?.linkedin,
					interviewerYearofExperience: parseInt(d?.experience),
					interviewerDesignation: d?.designation,
					typeofInterviewer: d?.typeOfPerson?.id,
					interviewerEmailID: d?.emailID,
				},
			];

			d?.otherInterviewer?.forEach((item) => {
				formattedInterviewerDetails?.push(item);
			});
			let formattedData = {
				hiringRequestID: parseInt(param?.hrid),
				hiringDetailID: talentInfo?.HiringDetailID,
				talentID: talentInfo?.TalentID,
				contactID: talentInfo?.ContactId,
				shortlistInterviewerID: talentInfo?.Shortlisted_InterviewID,
				timeZoneId: d?.interviewTimezone?.id,
				timeslot:
					AnotherRoundTimeSlotOption.LATER === slotLater
						? []
						: interviewUtils.formatInterviewDateSlotHandler(
								getScheduleSlotDate,
						  ),
				interviewerDetails:
					formattedInterviewerDetails[0]?.interviewerName === undefined
						? []
						: formattedInterviewerDetails,
				anotherRoundInterviewOption: radioValue,
				anotherRoundTimeSlotOption: slotLater,
			};

			let response = await InterviewDAO.saveAnotherRoundFeedbackRequestDAO(
				formattedData,
			);

			if (response?.statusCode === HTTPStatusCode.NOT_FOUND) {
				setIsLoading(false);
				messageAPI.open({
					type: 'error',
					content: response?.responseBody,
				});
			} else if (response?.statusCode === HTTPStatusCode.OK) {
				setIsLoading(false);
				messageAPI.open(
					{
						type: 'success',
						content: 'Second round interview scheduled successfully.',
					},
					1000,
				);
				setTimeout(() => {
					callAPI(hrId);
					getHrUserData(hrId)
					closeModal();
				}, 1000);
			}else if (response?.statusCode === HTTPStatusCode.BAD_REQUEST){
				setTimeErrorMessage(response.responseBody)
				// messageAPI.open({
				// 	type: 'error',
				// 	content: response?.responseBody ,
				// });
				setIsLoading(false);
			} else {
				setIsLoading(false);
				messageAPI.open({
					type: 'error',
					content: response?.responseBody?.message || 'Something Went Wrong',
				});
			}
		},
		[
			callAPI,
			getHrUserData,
			closeModal,
			getScheduleSlotDate,
			hrId,
			messageAPI,
			param?.hrid,
			radioValue,
			slotLater,
			talentInfo?.ContactId,
			talentInfo?.HiringDetailID,
			talentInfo?.Shortlisted_InterviewID,
			talentInfo?.TalentID,
		],
	);

	const clientCurrentDetailsForAnotherRoundHandler = useCallback(async () => {
		let response =
			await InterviewDAO.ClientCurrentDetailsForAnotherRoundRequestDAO({
				hiringRequestID: parseInt(param?.hrid),
			});

		if (response?.statusCode === HTTPStatusCode.OK)
			setClientDetailsForAnotherRound(response?.responseBody?.details);
	}, [param?.hrid]);

	useEffect(() => {
		clientCurrentDetailsForAnotherRoundHandler();
	}, [clientCurrentDetailsForAnotherRoundHandler]);

	return (
		<div className={InterviewScheduleStyle.interviewContainer}>
			{contextHolder}
			<div className={InterviewScheduleStyle.leftPane}>
				<div className={InterviewScheduleStyle.feedbackHeadWrap}>
					<h3>Thank You for Submitting your Feedback!</h3>
					<p>
						We appreciate your thought of taking a second round of interview
						with{' '}
						<b style={{ color: `var(--color-sunlight)` }}>{talentInfo?.Name}</b>{' '}
						for the{' '}
						<b style={{ color: `var(--color-sunlight)` }}>
							{talentInfo?.TalentRole}
						</b>{' '}
						position.
					</p>
					<p>
						We would need a few more details to proceed for scheduling a second
						round of interview with the selected talent. We would really
						appreciate if you could take out sometime to provide us with this
						information.
					</p>
				</div>
				{isLoading ? (
					<SpinLoader />
				) : (
					<>
						<div className={InterviewScheduleStyle.feedbackModalBody}>
							<div className={InterviewScheduleStyle.topFeedbackRadio}>
								<div className={InterviewScheduleStyle.radioFormGroup}>
									<Radio.Group
										className={InterviewScheduleStyle.radioGroup}
										onChange={onChangeRadioBtn}
										value={radioValue}>
										<Radio value={AnotherRoundInterviewOption.YES}>
											The second round of interviews will have same interviewers
										</Radio>
									</Radio.Group>
									{radioValue === AnotherRoundInterviewOption.YES && (
										<>
											<div className={InterviewScheduleStyle.radioDetailInfo}>
												<div className={InterviewScheduleStyle.row}>
													{clientDetailsForAnotherRound
														?.CurrentInterviewerDetails?.length > 0 ? (
														clientDetailsForAnotherRound?.CurrentInterviewerDetails?.map(
															(item, index) => {
																return (
																	<div
																		key={`interviwerList_${index}`}
																		className={InterviewScheduleStyle.colLg6}>
																		<div
																			className={
																				InterviewScheduleStyle.secondRoundIntBox
																			}>
																			<ul>
																				<li>
																					<span>Interviewer Name:</span>{' '}
																					{item?.interviewerName}
																				</li>
																				<li>
																					<span>Interviewer Linkedin:</span>{' '}
																					{item?.interviewLinkedin}
																				</li>
																				<li>
																					<span>
																						Interviewer Years of Experience:
																					</span>{' '}
																					{item?.interviewerYearofExperience}
																				</li>
																				<li>
																					<span>Type of Person:</span>{' '}
																					{item?.typeofInterviewer}
																				</li>
																				<li>
																					<span>Interviewer Designation:</span>{' '}
																					{item?.interviewerDesignation}
																				</li>
																				<li>
																					<span>Interviewer Email Id:</span>{' '}
																					{item?.interviewerEmailID}
																				</li>
																			</ul>
																		</div>
																	</div>
																);
															},
														)
													) : (
														<b>No Interviewer Found</b>
													)}
												</div>
											</div>
										</>
									)}

									<Radio.Group
										className={InterviewScheduleStyle.radioGroup}
										onChange={onChangeRadioBtn}
										value={radioValue}>
										<Radio value={AnotherRoundInterviewOption.APPEND}>
											I want to add more people to the current interview list
										</Radio>
									</Radio.Group>

									{radioValue === AnotherRoundInterviewOption.APPEND && (
										<>
											<div className={InterviewScheduleStyle.radioDetailInfo}>
												<div className={InterviewScheduleStyle.row}>
													{clientDetailsForAnotherRound
														?.CurrentInterviewerDetails?.length > 0 ? (
														clientDetailsForAnotherRound?.CurrentInterviewerDetails?.map(
															(item, index) => {
																return (
																	<div
																		key={`interviwerList_${index}`}
																		className={InterviewScheduleStyle.colLg6}>
																		<div
																			className={
																				InterviewScheduleStyle.secondRoundIntBox
																			}>
																			<ul>
																				<li>
																					<span>Interviewer Name:</span>{' '}
																					{item?.interviewerName}
																				</li>
																				<li>
																					<span>Interviewer Linkedin:</span>{' '}
																					{item?.interviewLinkedin}
																				</li>
																				<li>
																					<span>
																						Interviewer Years of Experience:
																					</span>{' '}
																					{item?.interviewerYearofExperience}
																				</li>
																				<li>
																					<span>Type of Person:</span>{' '}
																					{item?.typeofInterviewer}
																				</li>
																				<li>
																					<span>Interviewer Designation:</span>{' '}
																					{item?.interviewerDesignation}
																				</li>
																				<li>
																					<span>Interviewer Email Id:</span>{' '}
																					{item?.interviewerEmailID}
																				</li>
																			</ul>
																		</div>
																	</div>
																);
															},
														)
													) : (
														<b>No Interviewer Found</b>
													)}
												</div>

												<div
													className={InterviewScheduleStyle.secondRoundIntForm}>
													<div className={InterviewScheduleStyle.row}>
														<div className={InterviewScheduleStyle.colMd6}>
															<HRInputField
																label="Interviewer Full Name"
																name="fullName"
																type={InputType.TEXT}
																register={register}
																placeholder="Enter full name"
																errors={errors}
																validationSchema={{
																	required:
																		'please enter the interviewer full name.',
																}}
																required
															/>
														</div>
														<div className={InterviewScheduleStyle.colMd6}>
															<HRInputField
																label="Interviewer Email"
																name={`emailID`}
																type={InputType.TEXT}
																register={register}
																placeholder="Enter emailID"
																errors={errors}
																onBlurHandler={
																	checkDuplicateInterviewerEmailHandler
																}
																validationSchema={{
																	required:
																		'please enter the primary interviewer email ID.',
																	pattern: {
																		value: EmailRegEx.email,
																		message:
																			'Entered value does not match email format',
																	},
																}}
																required
															/>
														</div>
														<div className={InterviewScheduleStyle.colMd6}>
															<HRInputField
																label="Interviewer Linkedin"
																name="linkedin"
																type={InputType.TEXT}
																register={register}
																placeholder="Enter linkedin URL"
																errors={errors}
																onBlurHandler={
																	checkDuplicateInterviewerLinkedinHandler
																}
																validationSchema={{
																	required:
																		'please enter the interviewer linkedin.',
																}}
																required
															/>
														</div>
														<div className={InterviewScheduleStyle.colMd6}>
															<HRInputField
																label="Interviewer Years of Experience"
																name="experience"
																type={InputType.NUMBER}
																register={register}
																placeholder="Enter experience"
																errors={errors}
																validationSchema={{
																	required:
																		'please enter the interviewer experience.',
																}}
																required
															/>
														</div>
														<div className={InterviewScheduleStyle.colMd6}>
															<HRSelectField
																mode={'id/value'}
																setValue={setValue}
																register={register}
																name="typeOfPerson"
																label="Type of Person"
																defaultValue="Please Select"
																options={
																	clientDetailsForAnotherRound?.TypeOfInterview
																}
																required
																isError={
																	errors['typeOfPerson'] &&
																	errors['typeOfPerson']
																}
																errorMsg="Please select a type of person."
															/>
														</div>
														<div className={InterviewScheduleStyle.colMd6}>
															<HRInputField
																label="Interviewer Designation"
																name="interviewerDesignation"
																type={InputType.TEXT}
																register={register}
																errors={errors}
																validationSchema={{
																	required:
																		'please enter the interviewer designation.',
																}}
																required
																placeholder="Enter designation"
															/>
														</div>
													</div>
												</div>
												{fields?.map((_, index) => {
													return (
														<div
															className={
																InterviewScheduleStyle.secondRoundIntForm
															}>
															<div className={InterviewScheduleStyle.row}>
																<div className={InterviewScheduleStyle.colMd6}>
																	<HRInputField
																		label="Interviewer Full Name"
																		// name="interviewerFullName"
																		name={`otherInterviewer.[${index}].interviewerName`}
																		type={InputType.TEXT}
																		register={register}
																		placeholder="Enter full name"
																		isError={
																			!!errors?.otherInterviewer?.[index]
																				?.interviewerName
																		}
																		errorMsg="please enter the interviewer full name."
																		validationSchema={{
																			required:
																				'please enter the interviewer full name.',
																		}}
																		required
																	/>
																</div>
																<div className={InterviewScheduleStyle.colMd6}>
																	<HRInputField
																		label="Interviewer Email"
																		name={`otherInterviewer.[${index}].interviewerEmailID`}
																		type={InputType.TEXT}
																		register={register}
																		placeholder="Enter emailID"
																		isError={
																			!!errors?.otherInterviewer?.[index]
																				?.interviewerEmailID
																		}
																		errorMsg="please enter the interviewer email ID."
																		onBlurHandler={
																			checkDuplicateInterviewerEmailHandler
																		}
																		validationSchema={{
																			required:
																				'please enter the primary interviewer email ID.',
																			pattern: {
																				value: EmailRegEx.email,
																				message:
																					'Entered value does not match email format',
																			},
																		}}
																		required
																	/>
																</div>
																<div className={InterviewScheduleStyle.colMd6}>
																	<HRInputField
																		label="Interviewer Linkedin"
																		// name="interviewerLinkedin"
																		name={`otherInterviewer.[${index}].interviewLinkedin`}
																		type={InputType.TEXT}
																		register={register}
																		placeholder="Enter linkedin"
																		onBlurHandler={
																			checkDuplicateInterviewerLinkedinHandler
																		}
																		isError={
																			!!errors?.otherInterviewer?.[index]
																				?.interviewLinkedin
																		}
																		errorMsg="please enter the interviewer linkedin."
																		validationSchema={{
																			required:
																				'please enter the interviewer linkedin.',
																		}}
																		required
																	/>
																</div>
																<div className={InterviewScheduleStyle.colMd6}>
																	<HRInputField
																		label="Interviewer Years of Experience"
																		// name="interviewerYearsOfExperience"
																		name={`otherInterviewer.[${index}].interviewerYearofExperience`}
																		type={InputType.TEXT}
																		register={register}
																		placeholder="Enter experience"
																		isError={
																			!!errors?.otherInterviewer?.[index]
																				?.interviewerYearofExperience
																		}
																		errorMsg="please enter the interviewer experience."
																		validationSchema={{
																			required:
																				'please enter the interviewer experience.',
																		}}
																		required
																	/>
																</div>
																<div className={InterviewScheduleStyle.colMd6}>
																	<HRSelectField
																		mode={'id/value'}
																		setValue={setValue}
																		register={register}
																		name={`otherInterviewer.[${index}].typeofInterviewer`}
																		label="Type of Person"
																		defaultValue="Please Select"
																		options={
																			clientDetailsForAnotherRound?.TypeOfInterview
																		}
																		required
																		isError={
																			!!errors?.otherInterviewer?.[index]
																				?.typeofInterviewer
																		}
																		errorMsg="Please select type of person."
																	/>
																</div>
																<div className={InterviewScheduleStyle.colMd6}>
																	<HRInputField
																		label="Interviewer Designation"
																		// name="interviewerDesignation"
																		name={`otherInterviewer.[${index}].interviewerDesignation`}
																		type={InputType.TEXT}
																		register={register}
																		placeholder="Enter designation"
																		isError={
																			!!errors?.otherInterviewer?.[index]
																				?.interviewerDesignation
																		}
																		errorMsg="please enter the interviewer designation."
																		validationSchema={{
																			required:
																				'please enter the interviewer designation.',
																		}}
																		required
																	/>
																</div>
															</div>
														</div>
													);
												})}
												<div className={InterviewScheduleStyle.row}>
													<div className={InterviewScheduleStyle.colMd6}>
														<div
															style={{
																display: 'flex',
																gap: '10px',
																alignItems: 'center',
															}}>
															{fields?.length < 2 && (
																<div
																	className={
																		InterviewScheduleStyle.secondRoundIntFormAction
																	}>
																	<button
																		onClick={onAddSecondaryInterviewer}
																		type="submit"
																		className={
																			InterviewScheduleStyle.btnPrimary
																		}>
																		Add More
																	</button>
																</div>
															)}
															{fields?.length > 0 && (
																<div
																	className={
																		InterviewScheduleStyle.secondRoundIntFormAction
																	}>
																	<button
																		onClick={(e) =>
																			onRemoveSecondaryInterviewer(
																				e,
																				fields.length - 1,
																			)
																		}
																		type="submit"
																		className={
																			InterviewScheduleStyle.btnPrimary
																		}>
																		Remove
																	</button>
																</div>
															)}
														</div>
													</div>
												</div>
											</div>
										</>
									)}

									<Radio.Group
										className={InterviewScheduleStyle.radioGroup}
										onChange={onChangeRadioBtn}
										value={radioValue}>
										<Radio value={AnotherRoundInterviewOption.ADD}>
											Want to change the interviewers for the second round if
											interview
										</Radio>
									</Radio.Group>

									{radioValue === AnotherRoundInterviewOption.ADD && (
										<>
											<div
												className={InterviewScheduleStyle.secondRoundIntForm}>
												<div className={InterviewScheduleStyle.row}>
													<div className={InterviewScheduleStyle.colMd6}>
														<HRInputField
															label="Interviewer Full Name"
															name="fullName"
															type={InputType.TEXT}
															register={register}
															placeholder="Enter full name"
															errors={errors}
															validationSchema={{
																required:
																	'please enter the interviewer full name.',
															}}
															required
														/>
													</div>
													<div className={InterviewScheduleStyle.colMd6}>
														<HRInputField
															label="Interviewer Email"
															name={`emailID`}
															type={InputType.TEXT}
															register={register}
															placeholder="Enter emailID"
															errors={errors}
															validationSchema={{
																required:
																	'please enter the primary interviewer email ID.',
																pattern: {
																	value: EmailRegEx.email,
																	message:
																		'Entered value does not match email format',
																},
															}}
															required
														/>
													</div>
													<div className={InterviewScheduleStyle.colMd6}>
														<HRInputField
															label="Interviewer Linkedin"
															name="linkedin"
															type={InputType.TEXT}
															register={register}
															placeholder="Enter linkedin URL"
															onBlurHandler={
																checkDuplicateInterviewerLinkedinHandler
															}
															errors={errors}
															validationSchema={{
																required:
																	'please enter the interviewer linkedin.',
															}}
															required
														/>
													</div>
													<div className={InterviewScheduleStyle.colMd6}>
														<HRInputField
															label="Interviewer Years of Experience"
															name="experience"
															type={InputType.NUMBER}
															register={register}
															placeholder="Enter experience"
															errors={errors}
															validationSchema={{
																required:
																	'please enter the interviewer experience.',
															}}
															required
														/>
													</div>
													<div className={InterviewScheduleStyle.colMd6}>
														<HRSelectField
															mode={'id/value'}
															setValue={setValue}
															register={register}
															name="typeOfPerson"
															label="Type of Person"
															defaultValue="Please Select"
															options={
																clientDetailsForAnotherRound?.TypeOfInterview
															}
															required
															isError={
																errors['typeOfPerson'] && errors['typeOfPerson']
															}
															errorMsg="Please select a type of person."
														/>
													</div>
													<div className={InterviewScheduleStyle.colMd6}>
														<HRInputField
															label="Interviewer Designation"
															name="designation"
															type={InputType.TEXT}
															register={register}
															errors={errors}
															validationSchema={{
																required:
																	'please enter the interviewer designation.',
															}}
															required
															placeholder="Enter designation"
														/>
													</div>
												</div>
											</div>
											{fields?.map((_, index) => {
												return (
													<div
														className={
															InterviewScheduleStyle.secondRoundIntForm
														}>
														<div className={InterviewScheduleStyle.row}>
															<div className={InterviewScheduleStyle.colMd6}>
																<HRInputField
																	label="Interviewer Full Name"
																	// name="interviewerFullName"
																	name={`otherInterviewer.[${index}].interviewerName`}
																	type={InputType.TEXT}
																	register={register}
																	placeholder="Enter full name"
																	isError={
																		!!errors?.otherInterviewer?.[index]
																			?.interviewerName
																	}
																	errorMsg="please enter the interviewer full name."
																	validationSchema={{
																		required:
																			'please enter the interviewer full name.',
																	}}
																	required
																/>
															</div>
															<div className={InterviewScheduleStyle.colMd6}>
																<HRInputField
																	label="Interviewer Email"
																	name={`otherInterviewer.[${index}].interviewerEmailID`}
																	type={InputType.TEXT}
																	register={register}
																	placeholder="Enter emailID"
																	isError={
																		!!errors?.otherInterviewer?.[index]
																			?.interviewerEmailID
																	}
																	errorMsg="please enter the interviewer email ID."
																	validationSchema={{
																		required:
																			'please enter the primary interviewer email ID.',
																		pattern: {
																			value: EmailRegEx.email,
																			message:
																				'Entered value does not match email format',
																		},
																	}}
																	required
																/>
															</div>
															<div className={InterviewScheduleStyle.colMd6}>
																<HRInputField
																	label="Interviewer Linkedin"
																	// name="interviewerLinkedin"
																	name={`otherInterviewer.[${index}].interviewLinkedin`}
																	type={InputType.TEXT}
																	register={register}
																	placeholder="Enter linkedin"
																	onBlurHandler={
																		checkDuplicateInterviewerLinkedinHandler
																	}
																	isError={
																		!!errors?.otherInterviewer?.[index]
																			?.interviewLinkedin
																	}
																	errorMsg="please enter the interviewer linkedin."
																	validationSchema={{
																		required:
																			'please enter the interviewer linkedin.',
																	}}
																	required
																/>
															</div>
															<div className={InterviewScheduleStyle.colMd6}>
																<HRInputField
																	label="Interviewer Years of Experience"
																	// name="interviewerYearsOfExperience"
																	name={`otherInterviewer.[${index}].interviewerYearofExperience`}
																	type={InputType.NUMBER}
																	register={register}
																	placeholder="Enter experience"
																	isError={
																		!!errors?.otherInterviewer?.[index]
																			?.interviewerYearofExperience
																	}
																	errorMsg="please enter the interviewer experience."
																	validationSchema={{
																		required:
																			'please enter the interviewer experience.',
																	}}
																	required
																/>
															</div>
															<div className={InterviewScheduleStyle.colMd6}>
																<HRSelectField
																	mode={'id/value'}
																	setValue={setValue}
																	register={register}
																	name={`otherInterviewer.[${index}].typeofInterviewer`}
																	label="Type of Person"
																	defaultValue="Please Select"
																	options={
																		clientDetailsForAnotherRound?.TypeOfInterview
																	}
																	required
																	isError={
																		!!errors?.otherInterviewer?.[index]
																			?.typeofInterviewer
																	}
																	errorMsg="Please select type of person."
																/>
															</div>
															<div className={InterviewScheduleStyle.colMd6}>
																<HRInputField
																	label="Interviewer Designation"
																	name={`otherInterviewer.[${index}].interviewerDesignation`}
																	type={InputType.TEXT}
																	register={register}
																	placeholder="Enter designation"
																	isError={
																		!!errors?.otherInterviewer?.[index]
																			?.interviewerDesignation
																	}
																	errorMsg="please enter the interviewer designation."
																	validationSchema={{
																		required:
																			'please enter the interviewer designation.',
																	}}
																	required
																/>
															</div>
														</div>
													</div>
												);
											})}
											<div className={InterviewScheduleStyle.row}>
												<div className={InterviewScheduleStyle.colMd6}>
													<div
														style={{
															display: 'flex',
															gap: '10px',
															alignItems: 'center',
														}}>
														{fields?.length < 2 && (
															<div
																className={
																	InterviewScheduleStyle.secondRoundIntFormAction
																}>
																<button
																	onClick={onAddSecondaryInterviewer}
																	type="submit"
																	className={InterviewScheduleStyle.btnPrimary}>
																	Add More
																</button>
															</div>
														)}
														{fields?.length > 0 && (
															<div
																className={
																	InterviewScheduleStyle.secondRoundIntFormAction
																}>
																<button
																	onClick={(e) =>
																		onRemoveSecondaryInterviewer(
																			e,
																			fields.length - 1,
																		)
																	}
																	type="submit"
																	className={InterviewScheduleStyle.btnPrimary}>
																	Remove
																</button>
															</div>
														)}
													</div>
												</div>
											</div>
										</>
									)}
								</div>
							</div>

							<div className={InterviewScheduleStyle.bottomFeedbackRadio}>
								<div className={InterviewScheduleStyle.radioFormGroup}>
									<Radio.Group
										className={InterviewScheduleStyle.radioGroup}
										onChange={slotLaterOnChange}
										value={slotLater}>
										<Radio value={AnotherRoundTimeSlotOption.NOW}>
											Share Interview Time Slots
										</Radio>
									</Radio.Group>

									{slotLater === AnotherRoundTimeSlotOption.NOW && (
										<>
											<div className={InterviewScheduleStyle.radioDetailInfo}>
												<div className={InterviewScheduleStyle.row}>
													<div className={InterviewScheduleStyle.colMd12}>
														<HRSelectField
															controlledValue={interviewTimezone}
															setControlledValue={setInterviewTimezone}
															isControlled={true}
															mode={'id/value'}
															setValue={setValue}
															searchable={true}
															register={register}
															name="interviewTimezone"
															label="Time Zone"
															defaultValue="Select Timezone"
															options={
																clientDetailsForAnotherRound?.TimeZoneData
															}
															required
															isError={
																errors['interviewTimezone'] &&
																errors['interviewTimezone']
															}
															errorMsg="Please select a timezone."
														/>
													</div>
												</div>

												<div className={InterviewScheduleStyle.timeSlotRow}>
													<div className={InterviewScheduleStyle.timeSlotLabel}>
														<label>Slot 1*</label>
													</div>
													<div className={InterviewScheduleStyle.timeSlotItem}>
														<CalenderSVG />
														<DatePicker
															name="slot1Date"
															required
															{...register('slot1Date')}
															// filterDate={disabledWeekend}
															selected={getScheduleSlotDate?.[0]?.slot1}
															placeholderText="Select Date"
															onChange={(date) => {
																setValue('slot1Date', date);
																calenderDateHandler(date, 0, 'slot1');
															}}
														/>
														{errors.slot1Date && (
															<div className={InterviewScheduleStyle.error}>
																Please select slot1 date
															</div>
														)}
													</div>
													<div
														className={`${InterviewScheduleStyle.timeSlotItem} ${InterviewScheduleStyle.timePickerItem}`}>
														<ClockIconSVG />

														<DatePicker
															required
															{...register('slot1StartTime')}
															selected={getScheduleSlotDate?.[0]?.slot2}
															onChange={(date) => {
																setValue('slot1StartTime', date);
																calenderTimeHandler(date, 0, 'slot2');
															}}
															showTimeSelect
															showTimeSelectOnly
															timeIntervals={60}
															timeCaption="Time"
															timeFormat="h:mm a"
															dateFormat="h:mm a"
															placeholderText="Start Time"
															name="slot1StartTime"
														/>
														{errors.slot1StartTime && (
															<div className={InterviewScheduleStyle.error}>
																Please select start time
															</div>
														)}
														{slot1Timematch && <div className={InterviewScheduleStyle.error}>
													* Same times are given. Kindly update any one of these times.
													</div>}
													</div>
													<div
														className={`${InterviewScheduleStyle.timeSlotItem} ${InterviewScheduleStyle.timePickerItem}`}>
														<ClockIconSVG />
														<DatePicker
															required
															{...register('slot1EndTime')}
															selected={getScheduleSlotDate?.[0]?.slot3}
															onChange={(date) => {
																setValue('slot1EndTime', date);
																calenderTimeHandler(date, 0, 'slot3');
															}}
															showTimeSelect
															showTimeSelectOnly
															timeIntervals={60}
															timeCaption="Time"
															dateFormat="h:mm a"
															timeFormat="h:mm a"
															placeholderText="End Time"
															name="slot1EndTime"
														/>
														{errors.slot1EndTime && (
															<div className={InterviewScheduleStyle.error}>
																Please select end time
															</div>
														)}
													</div>
												</div>

												<div className={InterviewScheduleStyle.timeSlotRow}>
													<div className={InterviewScheduleStyle.timeSlotLabel}>
														<label>Slot 2*</label>
													</div>
													<div className={InterviewScheduleStyle.timeSlotItem}>
														<CalenderSVG />

														<DatePicker
															name="slot2Date"
															required
															{...register('slot2Date')}
															// filterDate={disabledWeekend}
															selected={getScheduleSlotDate?.[1]?.slot1}
															placeholderText="Select Date"
															onChange={(date) => {
																setValue('slot2Date', date);
																calenderDateHandler(date, 1, 'slot1');
															}}
														/>
														{errors.slot2Date && (
															<div className={InterviewScheduleStyle.error}>
																Please select slot1 date
															</div>
														)}
													</div>
													<div
														className={`${InterviewScheduleStyle.timeSlotItem} ${InterviewScheduleStyle.timePickerItem}`}>
														<ClockIconSVG />

														<DatePicker
															required
															{...register('slot2StartTime')}
															selected={getScheduleSlotDate?.[1]?.slot2}
															onChange={(date) => {
																setValue('slot2StartTime', date);
																calenderTimeHandler(date, 1, 'slot2');
															}}
															showTimeSelect
															showTimeSelectOnly
															timeIntervals={60}
															timeCaption="Time"
															timeFormat="h:mm a"
															dateFormat="h:mm a"
															placeholderText="Start Time"
															name="slot2StartTime"
														/>
														{errors.slot2StartTime && (
															<div className={InterviewScheduleStyle.error}>
																Please select start time
															</div>
														)}
														{slot2Timematch && <div className={InterviewScheduleStyle.error}>
													* Same times are given. Kindly update any one of these times.
													</div>}
													</div>
													<div
														className={`${InterviewScheduleStyle.timeSlotItem} ${InterviewScheduleStyle.timePickerItem}`}>
														<ClockIconSVG />
														<DatePicker
															required
															{...register('slot2EndTime')}
															selected={getScheduleSlotDate?.[1]?.slot3}
															onChange={(date) => {
																setValue('slot2EndTime', date);
																calenderTimeHandler(date, 1, 'slot3');
															}}
															showTimeSelect
															showTimeSelectOnly
															timeIntervals={60}
															timeCaption="Time"
															dateFormat="h:mm a"
															timeFormat="h:mm a"
															placeholderText="End Time"
															name="slot2EndTime"
														/>
														{errors.slot2EndTime && (
															<div className={InterviewScheduleStyle.error}>
																Please select end time
															</div>
														)}
													</div>
												</div>

												<div className={InterviewScheduleStyle.timeSlotRow}>
													<div className={InterviewScheduleStyle.timeSlotLabel}>
														<label>Slot 3*</label>
													</div>
													<div className={InterviewScheduleStyle.timeSlotItem}>
														<CalenderSVG />

														<DatePicker
															name="slot3Date"
															required
															{...register('slot3Date')}
															// filterDate={disabledWeekend}
															selected={getScheduleSlotDate?.[2]?.slot1}
															placeholderText="Select Date"
															onChange={(date) => {
																setValue('slot3Date', date);
																calenderDateHandler(date, 2, 'slot1');
															}}
														/>
														{errors.slot3Date && (
															<div className={InterviewScheduleStyle.error}>
																Please select slot1 date
															</div>
														)}
													</div>
													<div
														className={`${InterviewScheduleStyle.timeSlotItem} ${InterviewScheduleStyle.timePickerItem}`}>
														<ClockIconSVG />

														<DatePicker
															required
															{...register('slot3StartTime')}
															selected={getScheduleSlotDate?.[2]?.slot2}
															onChange={(date) => {
																setValue('slot3StartTime', date);
																calenderTimeHandler(date, 2, 'slot2');
															}}
															showTimeSelect
															showTimeSelectOnly
															timeIntervals={60}
															timeCaption="Time"
															timeFormat="h:mm a"
															dateFormat="h:mm a"
															placeholderText="Start Time"
															name="slot3StartTime"
														/>
														{errors.slot3StartTime && (
															<div className={InterviewScheduleStyle.error}>
																Please select start time
															</div>
														)}
														{slot3Timematch && <div className={InterviewScheduleStyle.error}>
													* Same times are given. Kindly update any one of these times.
													</div>}
													</div>
													<div
														className={`${InterviewScheduleStyle.timeSlotItem} ${InterviewScheduleStyle.timePickerItem}`}>
														<ClockIconSVG />
														<DatePicker
															required
															{...register('slot3EndTime')}
															selected={getScheduleSlotDate?.[2]?.slot3}
															onChange={(date) => {
																setValue('slot3EndTime', date);
																calenderTimeHandler(date, 2, 'slot3');
															}}
															showTimeSelect
															showTimeSelectOnly
															timeIntervals={60}
															timeCaption="Time"
															dateFormat="h:mm a"
															timeFormat="h:mm a"
															placeholderText="End Time"
															name="slot3EndTime"
														/>
														{errors.slot3EndTime && (
															<div className={InterviewScheduleStyle.error}>
																Please select end time
															</div>
														)}
													</div>
												</div>
											</div>
										</>
									)}

									<Radio.Group
										className={InterviewScheduleStyle.radioGroup}
										onChange={slotLaterOnChange}
										value={slotLater}>
										<Radio value={AnotherRoundTimeSlotOption.LATER}>
											I will add Time Slots Later
										</Radio>
									</Radio.Group>
								</div>
							</div>
						</div>
						{timeErrorMessage && <p className={InterviewScheduleStyle.error}>{timeErrorMessage}</p>}
						<div className={InterviewScheduleStyle.formPanelAction}>
							<button
								type="submit"
								onClick={handleSubmit(anotherRoundHandler)}
								className={InterviewScheduleStyle.btnPrimary}>
								Save
							</button>
							<button
								onClick={() => closeModal()}
								className={InterviewScheduleStyle.btn}>
								Cancel
							</button>
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default AnotherRound;
