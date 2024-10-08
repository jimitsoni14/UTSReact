import { EmailRegEx, InputType, URLRegEx, ValidateFieldURL } from 'constants/application';
import { ValidateInput } from 'constants/inputValidators';
import { HTTPStatusCode } from 'constants/network';
import { ClientDAO } from 'core/client/clientDAO';
import HRInputField from 'modules/hiring request/components/hrInputFields/hrInputFields';
import HRSelectField from 'modules/hiring request/components/hrSelectField/hrSelectField';
import React, { useCallback, useState } from 'react';
import { _isNull } from 'shared/utils/basic_utils';
import { secondaryClient } from '../clientField/clientField';
import AddClientStyle from './addClient.module.css';
import { Checkbox } from 'antd'
const AddNewClient = ({
	setError,
	watch,
	fields,
	append,
	remove,
	register,
	setValue,
	errors,
	setPrimaryClientFullName,
	flagAndCodeMemo,
	setPrimaryClientEmail,
	primaryClientEmail,
	clientDetailCheckList
}) => {
	const [isLoading, setIsLoading] = useState(false);
	const [ checkedClients, setCheckedClients] = useState([])
	const onAddNewClient = useCallback(
		(e) => {
			e.preventDefault();
			append({ ...secondaryClient });
		},
		[append],
	);
	const onRemoveAddedClient = useCallback(
		(e, index) => {
			setCheckedClients(prev=>{
				let newClients = [...prev]
				newClients.pop()
				return newClients
			})
			e.preventDefault();
			remove(index);
		},
		[remove],
	);

	/** To check Duplicate email exists Start */

	// const watchPrimaryEmail = watch('primaryClientEmailID');
	const getEmailALreadyExist = useCallback(
		async (data) => {
			let emailDuplicate = await ClientDAO.getDuplicateEmailRequestDAO(data);
			setError('primaryClientEmailID', {
				type: 'duplicateEmail',
				message:
					emailDuplicate?.statusCode === HTTPStatusCode.DUPLICATE_RECORD &&
					'This email already exists. Please enter another email.',
			});
			emailDuplicate.statusCode === HTTPStatusCode.DUPLICATE_RECORD &&
			//	setValue('primaryClientEmailID', '');
			setIsLoading(false);
		},
		[setError, setValue],
	);

	const debounceDuplicateEmailCheckHandler = useCallback(
		(email) => {
			let timer;
			if (!_isNull(email) && !ValidateInput.email(email).isError) {
				timer = setTimeout(() => {
					setIsLoading(true);
					getEmailALreadyExist(email);
				}, 2000);
			}
			return () => clearTimeout(timer);
		},
		[getEmailALreadyExist],
	);
	// useEffect(() => {
	// 	let timer;
	// 	if (
	// 		!_isNull(watchPrimaryEmail) &&
	// 		!ValidateInput.email(watchPrimaryEmail).isError
	// 	) {
	// 		timer = setTimeout(() => {
	// 			setIsLoading(true);
	// 			getEmailALreadyExist(watchPrimaryEmail);
	// 		}, 2000);
	// 	}
	// 	return () => clearTimeout(timer);
	// }, [getEmailALreadyExist, watchPrimaryEmail]);

	/** To check Duplicate email exists End */

	return (
		<div className={AddClientStyle.tabsFormItem}>
			<div className={AddClientStyle.tabsFormItemInner}>
				<div className={AddClientStyle.tabsLeftPanel}>
					<h3>Client Details</h3>
					<p>Please provide the necessary details</p>

					<div className={AddClientStyle.leftPanelAction}>
						{fields.length === 0 && (
							<button
								type="button"
								className={AddClientStyle.btn}
								onClick={onAddNewClient}>
								Add Secondary Client Details
							</button>
						)}
					</div>
				</div>
				<div className={AddClientStyle.tabsRightPanel}>
					{clientDetailCheckList.length > 0 && <div className={AddClientStyle.row} style={{marginBottom:'15px'}}>
					<div className={AddClientStyle.colMd12}>
						{clientDetailCheckList.map((list, index) => <Checkbox checked={index === 0 ? true : checkedClients.includes(list.id)}  
							onClick={()=> {
								if(index === 0) {
									return
								}
								if(checkedClients.includes(list.id)){
									setCheckedClients(prev=>(prev.filter(item => item !== list.id)))
									let index = fields.findIndex(field => field.en_Id === list.en_Id);
									remove(index)
								}else{
									setCheckedClients(prev=> ([...prev,list.id]));
									
									append({ ...secondaryClient, ...{
										en_Id: list.en_Id,
										fullName: list.fullName,
										emailID: list.emailID,
										id: list.id,
										phoneNumber: list.contactNo,
										designation: list.designation,
										linkedinProfile: list.linkedIn,
									} })
								}
								
								}}>
						  {list.emailID}
						</Checkbox>	)}
						</div>
						</div>}
					<div className={AddClientStyle.row}>
						<div className={AddClientStyle.colMd6}>
							<HRInputField
								register={register}
								errors={errors}
								validationSchema={{
									required: 'please enter the primary client name',
								}}
								label="HS Client Full Name (Primary)"
								name={'primaryClientName'}
								type={InputType.TEXT}
								placeholder="Enter full name "
								required
								onChangeHandler={(e) => {
									setPrimaryClientFullName(e.target.value);
								}}
							/>
						</div>

						<div className={AddClientStyle.colMd6}>
							<HRInputField
//								disabled={isLoading}
								register={register}
								errors={errors}
								validationSchema={{
									required: 'please enter the primary client email ID.',
									pattern: {
										value: EmailRegEx.email,
										message: 'Entered value does not match email format',
									},
								}}
								label="HS Client Email ID (Primary)"
								name={'primaryClientEmailID'}
								type={InputType.EMAIL}
								placeholder="Enter Email ID "
								onChangeHandler={(e) => {
									setPrimaryClientEmail(e.target.value);
									debounceDuplicateEmailCheckHandler(e.target.value);
								}}
								required
							/>
						</div>
					</div>

					<div className={AddClientStyle.row}>
						<div className={AddClientStyle.colMd6}>
							<div
								className={`${AddClientStyle.formGroup} ${AddClientStyle.phoneNoGroup}`}>
								<label>Client's Phone Number (Primary)</label>
								<div className={AddClientStyle.phoneNoCode}>
									<HRSelectField
										searchable={true}
										setValue={setValue}
										register={register}
										name="primaryClientCountryCode"
										defaultValue="+91"
										options={flagAndCodeMemo}
									/>
								</div>
								<div className={AddClientStyle.phoneNoInput}>
									<HRInputField
										register={register}
										name={'primaryClientPhoneNumber'}
										type={InputType.NUMBER}
										placeholder="Enter Phone number"
									/>
								</div>
							</div>
						</div>

						<div className={AddClientStyle.colMd6}>
							<HRInputField
								register={register}
								label="Designation (Primary)"
								name={'primaryDesignation'}
								type={InputType.TEXT}
								placeholder="Enter client designation"
								errors={errors}
								required
								validationSchema={{
									required: 'please enter the primary client designation.',
								}}
							/>
						</div>
					</div>

					<div className={AddClientStyle.row}>
						<div className={AddClientStyle.colMd12}>
							<HRInputField
								register={register}
								errors={errors}
								validationSchema={{
									required:
										'please enter the primary client linkedin profile URL.',
									// pattern: {
									// 		value: URLRegEx.url,
									// 		message: 'Entered value does not match url format',
									// 	},
									validate: value => {
										try {
											
											if(ValidateFieldURL(value,"linkedin")){
												return true
											}else{
												return 'Entered value does not match linkedin url format';
											}
											} catch (error) {
											return 'Entered value does not match url format';
											}											
									}
								}}
								label="HS Client Linkedin Profile (Primary)"
								name={'PrimaryClientLinkedinProfile'}
								type={InputType.TEXT}
								placeholder="Add Linkedin profile link"
								required
							/>
						</div>
					</div>
				</div>
			</div>
			{fields?.map((item, index) => {
				return (
					<div
						className={AddClientStyle.tabsFormItemInner}
						key={`countClient_${index}`}>
						<div className={AddClientStyle.tabsLeftPanel}>
							<h3>Secondary Client Details - {index + 1}</h3>
							<p>Please provide the necessary details</p>
							{fields.length - 1 === index && (
								<div className={AddClientStyle.leftPanelAction}>
									{fields.length < 3 && (
										<button
											type="button"
											className={AddClientStyle.btnPrimary}
											onClick={onAddNewClient}>
											Add More
										</button>
									)}
									<button
										type="button"
										className={AddClientStyle.btn}
										onClick={(e) => onRemoveAddedClient(e, index)}>
										Remove
									</button>
								</div>
							)}
						</div>
						<div className={AddClientStyle.tabsRightPanel}>
							<div className={AddClientStyle.row}>
								<div className={AddClientStyle.colMd6}>
									<HRInputField
										register={register}
										validationSchema={{
											required: true,
										}}
										label="HS Client Full Name (Secondary)"
										name={`secondaryClient.[${index}].fullName`}
										type={InputType.TEXT}
										placeholder="Enter full name"
										isError={!!errors?.secondaryClient?.[index]?.fullName}
										errorMsg="please enter the secondary client name."
										required
									/>
								</div>

								<div className={AddClientStyle.colMd6}>
									<HRInputField
										register={register}
										validationSchema={{
											required: 'please enter the secondary client email ID.',
											pattern: {
												value: EmailRegEx.email,
												message: 'please enter a valid email.',
											},
										}}
										label="HS ClientEmail ID (Secondary)"
										name={`secondaryClient.[${index}].emailID`}
										type={InputType.EMAIL}
										isError={!!errors?.secondaryClient?.[index]?.emailID}
										errorMsg="please enter the secondary client email."
										placeholder="Enter Email ID"
										required
									/>
								</div>
							</div>

							<div className={AddClientStyle.row}>
								<div className={AddClientStyle.colMd6}>
									<div
										className={`${AddClientStyle.formGroup} ${AddClientStyle.phoneNoGroup}`}>
										<label>
											Client's Phone Number (Secondary)
											{/* <span className={AddClientStyle.reqField}>*</span> */}
										</label>
										<div className={AddClientStyle.phoneNoCode}>
											<HRSelectField
												searchable={true}
												setValue={setValue}
												register={register}
												name={`secondaryClient.[${index}].countryCode`}
												defaultValue="+91"
												options={flagAndCodeMemo}
											/>
										</div>
										<div className={AddClientStyle.phoneNoInput}>
											<HRInputField
												register={register}
												name={`secondaryClient.[${index}].phoneNumber`}
												type={InputType.NUMBER}
												placeholder="Enter Phone number"
											/>
										</div>
									</div>
								</div>

								<div className={AddClientStyle.colMd6}>
									<HRInputField
										register={register}
										label="Designation (Secondary)"
										name={`secondaryClient[${index}].designation`}
										type={InputType.TEXT}
										placeholder="Enter client designation"
									/>
								</div>
							</div>

							<div className={AddClientStyle.row}>
								<div className={AddClientStyle.colMd12}>
									<HRInputField
										register={register}
										validationSchema={{
											required: true,
											validate: value => {
												try {
													
													if(ValidateFieldURL(value,"linkedin")){
														return true
													}else{
														return 'Entered value does not match linkedin url format';
													}
													} catch (error) {
													return 'Entered value does not match url format';
													}											
											}
										}}
										label="HS Client Linkedin Profile (Secondary)"
										name={`secondaryClient.[${index}].linkedinProfile`}
										type={InputType.TEXT}
										isError={!!errors?.secondaryClient?.[index]?.linkedinProfile}
										errorMsg="please enter the secondary client linkedin profile URL."
										placeholder="Add Linkedin profile link  "
										required
									/>
								</div>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default AddNewClient;
