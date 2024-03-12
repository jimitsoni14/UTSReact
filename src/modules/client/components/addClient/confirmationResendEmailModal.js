import { Modal, Table,message } from "antd";
import AddClientStyle from './addClient.module.css';
import greenArrowLeftImage from "assets/svg/greenArrowLeft.svg";
import redArrowRightImage from "assets/svg/redArrowRight.svg";
import LeavePageIcon from "../../../../assets/svg/LeavePageIcon.svg";
import { ClientDAO } from "core/client/clientDAO";
import { HTTPStatusCode } from "constants/network";
const ConfirmationModal = ({showConfirmationModal,setConfirmationModal,clientID}) =>{
	const [messageApi, contextHolder] = message.useMessage();
	const resendInviteEmailAPI = async() =>{
		const response = await ClientDAO.resendInviteEmailDAO(clientID);
		if(response?.statusCode=== HTTPStatusCode.OK){
			setConfirmationModal(false);
			messageApi.open({
				type: "success",
				content:"Email send successfully",
			});
		}else{
			setConfirmationModal(false);
			messageApi.open({
				type: "error",
				content:"Email not send successfully",
			});
		}
	  }

    return(
		<>
			{contextHolder}
			<Modal
				width={'480px'}
				centered
				footer={false}
				open={showConfirmationModal}
				className={AddClientStyle.ConfirmationEmailModal}
				onOk={() => setConfirmationModal(false)}
				onCancel={() => setConfirmationModal(false)}
			>
				<div className={AddClientStyle.ConfirmationModalContent}>
					<img src={LeavePageIcon} alt="leaveicon" />
					<h3>Are you sure you want to resend invite email?</h3>
					<div className={AddClientStyle.multiquesbtn}>
						<button className={AddClientStyle.btnPrimaryResendBtn} onClick={resendInviteEmailAPI} >Yes</button>
						<button className={`${AddClientStyle.btnPrimaryResendBtn} ${AddClientStyle.blank}`} onClick={()=>setConfirmationModal(false)}>No</button>
					</div>
				</div>
			</Modal>
		</>
    )
}

export default ConfirmationModal;