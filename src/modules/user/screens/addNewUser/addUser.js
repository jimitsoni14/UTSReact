import AddNewUserStyle from './add_new_user.module.css';
import UsersFields from 'modules/user/components/userFIelds/userfields';
import { ReactComponent as ArrowLeftSVG } from 'assets/svg/arrowLeft.svg';
import { Link, useLocation } from 'react-router-dom';
import UTSRoutes from 'constants/routes';

const AddNewUser = () => {
	const switchLocation = useLocation();
	let urlSplitter = switchLocation.pathname.split('/')[2];

	return (
		<div className={AddNewUserStyle.addNewContainer}>
			<Link to={UTSRoutes.USERLISTROUTE}>
				<div className={AddNewUserStyle.goBack}>
					<ArrowLeftSVG style={{ width: '16px' }} />
					<span>Go Back</span>
				</div>
			</Link>
			<UsersFields id={urlSplitter === 'addnewuser' ? 0 : urlSplitter} />
		</div>
	);
};

export default AddNewUser;
