import { InputType } from 'constants/application';
import HRInputFieldStyle from './hrInputFields.module.css';
import classNames from 'classnames';

const HRInputField = ({
	isTextArea,
	onClickHandler,
	leadingIcon,
	name,
	height,
	label,
	register,
	isError,
	errorMsg,
	errors,
	placeholder,
	maxLength,
	required,
	value,
	buttonLabel,
	disabled,
	type,
	onChangeHandler,
	onBlurHandler,
	trailingIcon,
	onIconHandler,
	validationSchema,
	onKeyDownHandler,
	rows,
	forArrayFields
}) => {
	const formFieldClasses = classNames({
		[HRInputFieldStyle.inputfield]: true,
		[HRInputFieldStyle.disabled]: disabled,
	});
	const formatRegister = { ...register(name, required && validationSchema) };

	return (
		<div className={HRInputFieldStyle.formField} key={`${label}-${name}`}>
			{label && (
				<label>
					{label}
					{required && <span className={HRInputFieldStyle.reqField}>*</span>}
				</label>
			)}

			{isTextArea ? (
				<div className={HRInputFieldStyle.inputBox}>
					{leadingIcon && (
						<div className={HRInputFieldStyle.leadingIcon}>{leadingIcon}</div>
					)}
					<textarea
						style={{
							paddingLeft: leadingIcon && '40px',
							cursor: InputType.BUTTON && 'pointer',
						}}
						value={InputType.BUTTON && value}
						className={formFieldClasses}
						type={type}
						name={name}
						placeholder={placeholder}
						onClick={InputType.BUTTON && onClickHandler}
						{...register(name, required && validationSchema)}
						id={name}
						disabled={disabled}
						required={required}
						height={height && height}
						rows={rows}
					/>
				</div>
			) : (
				<div className={HRInputFieldStyle.inputBox}>
					{leadingIcon && (
						<div className={HRInputFieldStyle.leadingIcon} style={{
							cursor: InputType.BUTTON && 'pointer',
						}} onClick={InputType.BUTTON && onClickHandler}>{leadingIcon}</div>
					)}
					{InputType.BUTTON && (
						<span className={HRInputFieldStyle.btnLabel} style={{
							cursor: InputType.BUTTON && 'pointer',
						}} onClick={InputType.BUTTON && onClickHandler}>{buttonLabel}</span>
					)}
					<input
						style={{
							paddingLeft: leadingIcon && '40px',
							cursor: InputType.BUTTON && 'pointer',
						}}
						value={InputType.BUTTON && value}
						className={formFieldClasses}
						type={type}
						name={name}
						placeholder={placeholder}
						onClick={InputType.BUTTON && onClickHandler}
						{...register(name, required && validationSchema)}
						onChange={(e) => {
							formatRegister.onChange(e);
							onChangeHandler?.(e);
						}}
						onBlur={(e) => {
							formatRegister.onBlur(e);
							onBlurHandler?.(e);
						}}
						onKeyDown={(e) => {
							// formatRegister.onKeyDown(e);
							onKeyDownHandler?.(e);
						}}
						id={name}
						disabled={disabled}
						required={required}
						height={height && height}
						maxLength={maxLength}
						onWheel={(e) => e.target.blur()}
						autoComplete="off"
					/>
					{trailingIcon && (
						<div
							className={HRInputFieldStyle.trailingIcon}
							onClick={trailingIcon && onIconHandler}>
							{trailingIcon}
						</div>
					)}
				</div>
			)}
			{required && !disabled
				? errors &&
				  errors[name] && (
						<div className={HRInputFieldStyle.error}>
							{errors[name]?.message && `* ${errors[name]?.message}`}
						</div>
				  )
				: false}
			{required && disabled
				? errors &&
				  errors[name] && (
						<div className={HRInputFieldStyle.error}>
							{errors[name]?.message && `* ${errors[name]?.message}`}
						</div>
				  )
				: false}
			{forArrayFields && required && errors?.message && (
						<div className={HRInputFieldStyle.error}>
							{errors?.message && `* ${errors?.message}`}
						</div>
				  )}
			{isError && <div className={HRInputFieldStyle.error}>* {errorMsg}</div>}
		</div>
	);
};
export default HRInputField;
