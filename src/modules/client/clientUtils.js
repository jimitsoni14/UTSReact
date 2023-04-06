import { SubmitType } from 'constants/application';
import { _isNull } from 'shared/utils/basic_utils';

export function getFlagAndCodeOptions(flagAndCode) {
	let tempArray = [];
	flagAndCode?.forEach((item) => {
		tempArray.push({
			id: item.ccode,
			value: item.ccode,
			label: getFlagLabel(item),
		});
	});
	return tempArray;
}

function getFlagLabel(item) {
	return (
		<>
			<img
				src={item?.flag}
				width="20"
				height="20"
				alt={''}
			/>
			{item?.ccode}
		</>
	);
}
export function locationFormatter(location) {
	let tempArray = [];
	location?.forEach((item) => {
		tempArray.push({
			id: item.value,
			value: item.value,
		});
	});
	return tempArray;
}
export function clientFormDataFormatter(
	d,
	draft,
	contactID,
	watch,
	addClientResponse,
	base64Image,
	getUploadFileData,
) {
	const clientFormDetails = {
		isSaveasDraft: draft === SubmitType.SAVE_AS_DRAFT && true,
		company: {
			en_Id: _isNull(addClientResponse) ? '' : addClientResponse.company.en_Id,
			company:
				draft === SubmitType.SAVE_AS_DRAFT
					? watch('companyName')
					: d.companyName,
			fileUpload: {
				base64ProfilePic: base64Image,
				extenstion: getUploadFileData?.split('.')[1],
			},
			website:
				draft === SubmitType.SAVE_AS_DRAFT
					? _isNull(watch('companyURL'))
						? null
						: watch('companyURL')
					: _isNull(d.companyURL)
					? null
					: d.companyURL,
			location:
				draft === SubmitType.SAVE_AS_DRAFT
					? _isNull(watch('companyLocation'))
						? null
						: watch('companyLocation')
					: _isNull(d.companyLocation)
					? null
					: d.companyLocation,
			companySize:
				draft === SubmitType.SAVE_AS_DRAFT
					? _isNull(watch('companySize'))
						? 0
						: parseInt(watch('companySize'))
					: _isNull(d.companySize)
					? null
					: parseInt(d.companySize),
			address:
				draft === SubmitType.SAVE_AS_DRAFT
					? _isNull(watch('companyAddress'))
						? null
						: watch('companyAddress')
					: _isNull(d.companyAddress)
					? null
					: d.companyAddress,
			linkedinProfile:
				draft === SubmitType.SAVE_AS_DRAFT
					? _isNull(watch('companyLinkedinProfile'))
						? null
						: watch('companyLinkedinProfile')
					: _isNull(d.companyLinkedinProfile)
					? null
					: d.companyLinkedinProfile,

			phone:
				draft === SubmitType.SAVE_AS_DRAFT
					? _isNull(watch('companyCountryCode'))
						? '+91' + watch('phoneNumber')
						: watch('companyCountryCode') + watch('phoneNumber')
					: _isNull(d.companyCountryCode)
					? '+91' + d.phoneNumber
					: d.companyCountryCode + d.phoneNumber,
			teamManagement:
				draft === SubmitType.SAVE_AS_DRAFT
					? parseInt(watch('remote'))
					: parseInt(d.remote),
			leadType:
				draft === SubmitType.SAVE_AS_DRAFT
					? _isNull(watch('companyLeadSource'))
						? null
						: watch('companyLeadSource')?.id === 1
						? watch('companyInboundType')?.value
						: watch('companyLeadSource')?.value
					: _isNull(d.companyLeadSource)
					? null
					: d.companyLeadSource?.id === 1
					? d.companyInboundType?.value
					: d.companyLeadSource?.value,
		},
		primaryClient: {
			en_Id: _isNull(addClientResponse)
				? ''
				: addClientResponse?.primaryClient?.en_Id,
			fullName:
				draft === SubmitType.SAVE_AS_DRAFT
					? _isNull(watch('primaryClientName'))
						? null
						: watch('primaryClientName')
					: _isNull(d.primaryClientName)
					? null
					: d.primaryClientName,
			emailId:
				draft === SubmitType.SAVE_AS_DRAFT
					? _isNull(watch('primaryClientEmailID'))
						? null
						: watch('primaryClientEmailID')
					: _isNull(d.primaryClientEmailID)
					? null
					: d.primaryClientEmailID,

			contactNo:
				draft === SubmitType.SAVE_AS_DRAFT
					? _isNull(watch('primaryClientCountryCode'))
						? '+91' + watch('primaryClientPhoneNumber')
						: watch('primaryClientCountryCode') +
						  watch('primaryClientPhoneNumber')
					: _isNull(d.primaryClientCountryCode)
					? '+91' + d.primaryClientPhoneNumber
					: d.primaryClientCountryCode + d.primaryClientPhoneNumber,
			designation:
				draft === SubmitType.SAVE_AS_DRAFT
					? _isNull(watch('primaryDesignation'))
						? null
						: watch('primaryDesignation')
					: _isNull(d.primaryDesignation)
					? null
					: d.primaryDesignation,
			linkedin:
				draft === SubmitType.SAVE_AS_DRAFT
					? _isNull(watch('PrimaryClientLinkedinProfile'))
						? null
						: watch('PrimaryClientLinkedinProfile')
					: _isNull(d.PrimaryClientLinkedinProfile)
					? null
					: d.PrimaryClientLinkedinProfile,
		},
		secondaryClients:
			draft === SubmitType.SAVE_AS_DRAFT
				? _isNull(watch('secondaryClient'))
					? []
					: watch('secondaryClient')
				: _isNull(addClientResponse)
				? d.secondaryClient
				: enIDFieldsFormatter(
						addClientResponse.secondaryClients,
						d.secondaryClient,
				  ),
		legalInfo: {
			en_Id: _isNull(addClientResponse)
				? ''
				: addClientResponse?.legalInfo?.en_Id,
			name:
				draft === SubmitType.SAVE_AS_DRAFT
					? _isNull(watch('legalClientFullName'))
						? null
						: watch('legalClientFullName')
					: _isNull(d.legalClientFullName)
					? null
					: d.legalClientFullName,
			email:
				draft === SubmitType.SAVE_AS_DRAFT
					? _isNull(watch('legalClientEmailID'))
						? null
						: watch('legalClientEmailID')
					: _isNull(d.legalClientEmailID)
					? null
					: d.legalClientEmailID,
			designation:
				draft === SubmitType.SAVE_AS_DRAFT
					? _isNull(watch('legalClientDesignation'))
						? null
						: watch('legalClientDesignation')
					: _isNull(d.legalClientDesignation)
					? null
					: d.legalClientDesignation,
			legalCompanyName:
				draft === SubmitType.SAVE_AS_DRAFT
					? _isNull(watch('legalCompanyFullName'))
						? null
						: watch('legalCompanyFullName')
					: _isNull(d.legalCompanyFullName)
					? null
					: d.legalCompanyFullName,

			phoneNumber:
				draft === SubmitType.SAVE_AS_DRAFT
					? _isNull(watch('legalClientCountryCode'))
						? '+91' + watch('legalClientPhoneNumber')
						: watch('legalClientCountryCode') + watch('legalClientPhoneNumber')
					: _isNull(d.legalClientCountryCode)
					? '+91' + d.legalClientPhoneNumber
					: d.legalClientCountryCode + d.legalClientPhoneNumber,
			legalCompanyAddress:
				draft === SubmitType.SAVE_AS_DRAFT
					? _isNull(watch('legalCompanyAddress'))
						? null
						: watch('legalCompanyAddress')
					: _isNull(d.legalCompanyAddress)
					? null
					: d.legalCompanyAddress,
			isAcceptPolicy: true,
		},
		pocList:
			draft === SubmitType.SAVE_AS_DRAFT
				? watch('pocList')
				: _isNull(addClientResponse)
				? d.pocList
				: enIDFieldsFormatter(addClientResponse.pocList, d.pocList),
		primaryContactName: _isNull(d.primaryContactName)
			? null
			: draft === SubmitType.SAVE_AS_DRAFT
			? watch('primaryContactName').toString()
			: d.primaryContactName.toString(),
		secondaryContactName: _isNull(d.secondaryContactName)
			? null
			: draft === SubmitType.SAVE_AS_DRAFT
			? watch('secondaryContactName').toString()
			: d.secondaryContactName.toString(),
	};
	return clientFormDetails;
}

function enIDFieldsFormatter(apiResponse, uiValues) {
	if (_isNull(apiResponse)) {
		return uiValues;
	} else {
		if (uiValues.length > 0) {
			apiResponse?.forEach((item, index) => {
				if (index <= uiValues.length - 1) uiValues[index].en_Id = item?.en_Id;
			});
		}
		return uiValues;
	}
}
