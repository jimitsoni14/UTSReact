import React, { useEffect } from 'react'
import { Dropdown, Menu, Divider, List, Modal, message, Space } from 'antd';
import AlertIcon from 'assets/alertIcon.png'
import AddNotesStyle from './addNotes.module.css';
import { InputType } from 'constants/application';
import HRInputField from '../hrInputFields/hrInputFields';
import { useForm } from 'react-hook-form';
import { hiringRequestDAO } from 'core/hiringRequest/hiringRequestDAO';

function EditNotes({onClose,viewNoteData,apiData,setAllNotes,item}) {
    const {
        register,
        handleSubmit,
        setValue,
        control,
        watch,
        resetField,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        if(viewNoteData.Notes){
            setValue('addNoteForTalent',viewNoteData.Notes)
        }
    },[viewNoteData,setValue])

    const editNoteDetails = async (d) => {
        let payload = {
            ...viewNoteData,
            "Notes": d.addNoteForTalent,
            "CompanyId":apiData?.ClientDetail?.CompanyId,
            "ContactName" : apiData?.ClientDetail?.ClientName,
            "ContactEmail" : apiData?.ClientDetail?.ClientEmail,
            "HiringRequest_ID": apiData?.HR_Id,
            "ATS_TalentID": item?.ATSTalentID,
            "EmployeeID": localStorage.getItem('EmployeeID'),
            "EmployeeName": localStorage.getItem('FullName')
    }

    
    let result = await hiringRequestDAO.saveTalentNotesDAO(payload)
    
    if(result.statusCode === 200) {
        setAllNotes(prev => {
            let newArr = [...prev]
            let index = newArr.findIndex(item=> item.Note_Id === viewNoteData.Note_Id)
            newArr.splice(index, 1,payload)
            return newArr
        })
            onClose()
    }else{
        message.error('Not able to add Note Something went Wrong. Please try again')
    }
        }


    return (<>
        <div className={AddNotesStyle.addNotesModal}>
        <div className={AddNotesStyle.addNotesTitle}>
                <h2>Edit note</h2>
            </div>

        <HRInputField
                isTextArea={true}
                rows={4}
                // errors={errors}
                label={'Add note for talent'}
                register={register}
                name="addNoteForTalent"
                type={InputType.TEXT}
                placeholder="Type here..."
                required={true}
                errors={errors}
                validationSchema={{
                    required: "please enter a note for talent.",
                }}
            />

            <div className={AddNotesStyle.addNotesAlert}>
                <img src={AlertIcon} alt='alert-icon' />
                Please note that any notes you add here will also be accessible to the client.
            </div>

            <div className={AddNotesStyle.formPanelAction}>
                <button className={AddNotesStyle.btn} type='button' onClick={onClose}>Cancel</button>
                <button type="submit" className={AddNotesStyle.btnPrimary} onClick={handleSubmit(editNoteDetails)}>Save</button>
            </div>
        </div>
    </>
    )
}

export default EditNotes