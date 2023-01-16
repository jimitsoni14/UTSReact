import { useState, useEffect, useCallback } from 'react';
import { Checkbox, message } from 'antd';
import { EmailRegEx, InputType, SubmitType } from 'constants/application';
import ClientFieldStyle from './clientField.module.css';
import HRInputField from 'modules/hiring request/components/hrInputFields/hrInputFields';
import AddNewClient from '../addClient/addClient';
import { MasterDAO } from 'core/master/masterDAO';
import HRSelectField from 'modules/hiring request/components/hrSelectField/hrSelectField';
import { useFieldArray, useForm } from 'react-hook-form';
import AddNewPOC from '../addPOC/addPOC';
import { useMemo } from 'react';
import {
	clientFormDataFormatter,
	getFlagAndCodeOptions,
} from 'modules/client/clientUtils';
import { ClientDAO } from 'core/client/clientDAO';
import { HTTPStatusCode } from 'constants/network';
import CompanyDetails from '../companyDetails/companyDetails';
import { _isNull } from 'shared/utils/basic_utils';

export const secondaryClient = {
	en_Id: '',
	fullName: '',
	emailID: '',
	countryCode: '',
	phoneNumber: '',
	designation: '',
	linkedinProfile: '',
};
export const poc = {
	contactName: '',
};

const ClientField = ({
	setTitle,
	tabFieldDisabled,
	setTabFieldDisabled,
	setClientDetails,
}) => {
	const [messageAPI, contextHolder] = message.useMessage();
	/** ---- Useform()  Starts here --------- */
	const {
		register,
		handleSubmit,
		setValue,
		control,
		setError,
		getValues,
		watch,
		formState: { errors },
	} = useForm({
		defaultValues: {
			secondaryClient: [],
			pocList: [],
		},
	});
	const [isLoading, setIsLoading] = useState(false);
	const [type, setType] = useState('');
	const [addClientResponse, setAddClientResponse] = useState(null);
	const [addClientResponseID, setAddClientResponseID] = useState(0);
	const [controlledLegalCountryCode, setControlledLegalCountryCode] =
		useState('+91');
	const { fields, append, remove } = useFieldArray({
		control,
		name: 'secondaryClient',
	});

	const {
		fields: pocFields,
		append: appendPOC,
		remove: removePOC,
	} = useFieldArray({
		control,
		name: 'pocList',
	});
	const watchFields = watch([
		'primaryClientName',
		'primaryClientEmailID',
		'primaryClientPhoneNumber',
		'primaryDesignation',
		'companyName',
		'companyAddress',
		'primaryClientCountryCode',
	]);
	/** -------- UseForm Ends here --------------- */

	const [isSameAsPrimaryPOC, setSameAsPrimaryPOC] = useState(false);

	const [flagAndCode, setFlagAndCode] = useState([]);

	const SameASPrimaryPOCHandler = useCallback((e) => {
		// e.preventDefault();
		setSameAsPrimaryPOC(e.target.checked);
	}, []);

	/** -------- Masters API Starts here-------------- */

	const getCodeAndFlag = async () => {
		const getCodeAndFlagResponse = await MasterDAO.getCodeAndFlagRequestDAO();
		setFlagAndCode(
			getCodeAndFlagResponse && getCodeAndFlagResponse.responseBody,
		);
	};
	const flagAndCodeMemo = useMemo(
		() => getFlagAndCodeOptions(flagAndCode),
		[flagAndCode],
	);

	/** -------- Masters API Ends here-------------- */
	/** Submit the client form Starts */
	const clientSubmitHandler = async (d, type = SubmitType.SAVE_AS_DRAFT) => {
		// setIsLoading(true);
		let clientFormDetails = clientFormDataFormatter(
			d,
			type,
			addClientResponseID,
			watch,
			addClientResponse,
		);
		console.log(clientFormDetails, '-clientFormDetails');
		if (type === SubmitType.SAVE_AS_DRAFT) {
			if (_isNull(watch('companyName'))) {
				return setError('companyName', {
					type: 'emptyCompanyName',
					message: 'please enter the company name.',
				});
			} else if (_isNull(watch('primaryClientName'))) {
				return setError('primaryClientName', {
					type: 'emptyprimaryClientName',
					message: 'please enter the client name.',
				});
			} else {
				setError('primaryClientName', {
					type: 'emptyprimaryClientName',
					message: '',
				});
			}
		} else if (type !== SubmitType.SAVE_AS_DRAFT) {
			setType(SubmitType.SAVE_AS_DRAFT);
		}
		const addClientResult = await ClientDAO.createClientDAO(clientFormDetails);

		if (addClientResult.statusCode === HTTPStatusCode.OK) {
			setAddClientResponse(addClientResult?.responseBody?.details);
			type !== SubmitType.SAVE_AS_DRAFT && setTitle('Add New Hiring Requests');
			type !== SubmitType.SAVE_AS_DRAFT &&
				setAddClientResponseID(
					addClientResult?.responseBody?.details?.contactId,
				);

			type !== SubmitType.SAVE_AS_DRAFT &&
				setTabFieldDisabled({
					...tabFieldDisabled,
					addNewHiringRequest: false,
				});
			type !== SubmitType.SAVE_AS_DRAFT &&
				setClientDetails(addClientResult?.responseBody?.details);

			type === SubmitType.SAVE_AS_DRAFT &&
				messageAPI.open({
					type: 'success',
					content: 'Client details has been saved to draft.',
				});
		}
		setIsLoading(false);
	};
	/** Submit the client form Ends */
	// console.log(addClientResponse, '--addClientResponse');
	useEffect(() => {
		getCodeAndFlag();
	}, []);

	useEffect(() => {
		if (isSameAsPrimaryPOC) {
			setValue('legalClientFullName', watchFields[0]);
			setValue('legalClientEmailID', watchFields[1]);
			setValue('legalClientPhoneNumber', watchFields[2]);
			setValue('legalClientDesignation', watchFields[3]);
			setValue('legalCompanyFullName', watchFields[4]);
			setValue('legalCompanyAddress', watchFields[5]);
			//setValue('legalCompanyAddress', watchFields[6]);
			setControlledLegalCountryCode(watchFields[6]);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isSameAsPrimaryPOC]);

	return (
		<div className={ClientFieldStyle.tabsBody}>
			{contextHolder}
			<CompanyDetails
				flagAndCodeMemo={flagAndCodeMemo}
				setError={setError}
				setValue={setValue}
				register={register}
				errors={errors}
				watch={watch}
			/>
			<AddNewClient
				setError={setError}
				watch={watch}
				setValue={setValue}
				fields={fields}
				append={append}
				remove={remove}
				register={register}
				errors={errors}
				flagAndCodeMemo={flagAndCodeMemo}
			/>
			<div className={ClientFieldStyle.tabsFormItem}>
				<div className={ClientFieldStyle.tabsFormItemInner}>
					<div className={ClientFieldStyle.tabsLeftPanel}>
						<h3>Legal Information</h3>
						<p>
							Please provide the necessary information
							<br />
							for the signing authority
						</p>
					</div>

					<div className={ClientFieldStyle.tabsRightPanel}>
						<div className={ClientFieldStyle.row}>
							<div className={ClientFieldStyle.colMd12}>
								<div className={ClientFieldStyle.checkBoxGroup}>
									<Checkbox onClick={SameASPrimaryPOCHandler}>
										Same as primary client details
									</Checkbox>
								</div>
							</div>
						</div>

						<div className={ClientFieldStyle.row}>
							<div className={ClientFieldStyle.colMd6}>
								<HRInputField
									register={register}
									errors={errors}
									validationSchema={{
										required: 'please enter the client name.',
									}}
									label="HS Client Full Name"
									name="legalClientFullName"
									type={InputType.TEXT}
									placeholder="Enter full name"
									// required
									disabled={isSameAsPrimaryPOC}
								/>
							</div>

							<div className={ClientFieldStyle.colMd6}>
								<HRInputField
									register={register}
									errors={errors}
									validationSchema={{
										required: 'please enter the client email ID.',
										pattern: {
											value: EmailRegEx.email,
											message: 'please enter a valid email.',
										},
									}}
									label="HS Client Email ID"
									name={'legalClientEmailID'}
									type={InputType.EMAIL}
									placeholder="Enter Email ID"
									disabled={isSameAsPrimaryPOC}
									// required
								/>
							</div>
						</div>

						<div className={ClientFieldStyle.row}>
							<div className={ClientFieldStyle.colMd6}>
								<div
									className={`${ClientFieldStyle.formGroup} ${ClientFieldStyle.phoneNoGroup}`}>
									<label>Client's Phone Number</label>
									<div className={ClientFieldStyle.phoneNoCode}>
										<HRSelectField
											setControlledValue={setControlledLegalCountryCode}
											controlledValue={controlledLegalCountryCode}
											isControlled={true}
											searchable={true}
											setValue={setValue}
											register={register}
											name="legalClientCountryCode"
											defaultValue="+91"
											options={flagAndCodeMemo}
											disabled={isSameAsPrimaryPOC}
										/>
									</div>
									<div className={ClientFieldStyle.phoneNoInput}>
										<HRInputField
											register={register}
											name={'legalClientPhoneNumber'}
											type={InputType.NUMBER}
											placeholder="Enter Phone number"
											disabled={isSameAsPrimaryPOC}
										/>
									</div>
								</div>
							</div>

							<div className={ClientFieldStyle.colMd6}>
								<HRInputField
									register={register}
									label="Designation"
									name={'legalClientDesignation'}
									type={InputType.TEXT}
									placeholder="Enter designation"
									disabled={isSameAsPrimaryPOC}
								/>
							</div>
						</div>

						<div className={ClientFieldStyle.row}>
							<div className={ClientFieldStyle.colMd6}>
								<HRInputField
									register={register}
									errors={errors}
									validationSchema={{
										required: 'please enter the legal company name.',
									}}
									label="Legal Company Name"
									name={'legalCompanyFullName'}
									type={InputType.TEXT}
									placeholder="Enter legal name"
									disabled={isSameAsPrimaryPOC}
									// required
								/>
							</div>

							<div className={ClientFieldStyle.colMd6}>
								<HRInputField
									register={register}
									errors={errors}
									validationSchema={{
										required: 'please enter the legal company address.',
									}}
									label="Legal Company Address"
									name={'legalCompanyAddress'}
									type={InputType.TEXT}
									placeholder="Enter legal address"
									disabled={isSameAsPrimaryPOC}
									// required
								/>
							</div>
						</div>
					</div>
				</div>
			</div>

			<AddNewPOC
				setValue={setValue}
				fields={pocFields}
				append={appendPOC}
				remove={removePOC}
				register={register}
				errors={errors}
			/>
			<div className={ClientFieldStyle.formPanelAction}>
				<button
					style={{
						cursor: type === SubmitType.SAVE_AS_DRAFT ? 'no-drop' : 'pointer',
					}}
					disabled={type === SubmitType.SAVE_AS_DRAFT}
					onClick={clientSubmitHandler}
					className={ClientFieldStyle.btn}>
					Save as Draft
				</button>
				<button
					// disabled={isLoading}
					type="submit"
					onClick={handleSubmit(clientSubmitHandler)}
					className={ClientFieldStyle.btnPrimary}>
					Next Page
				</button>
			</div>
		</div>
	);
};

export default ClientField;
