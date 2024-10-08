import navbarStyles from './navbar.module.css';
import { userDAO } from 'core/user/userDAO';
import { Link, useNavigate } from 'react-router-dom';
import UTSRoutes from 'constants/routes';
import { Badge, Dropdown, Tooltip } from 'antd';
import { ReactComponent as BellSVG } from 'assets/svg/bell.svg';
import { ReactComponent as LogoutSVG } from 'assets/svg/logout.svg';
import  UTSLogoSVG  from 'assets/svg/UTSLogo.svg'
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import { MasterDAO } from 'core/master/masterDAO';

const Navbar = ({ fullName }) => {
	const navigation = useNavigate();
	// const [dashboardCount, setDashboardCount] = useState(null);
	const queryClient = useQueryClient();
	const onLogoutHandler = async () => {
		const res = await userDAO.logoutDAO();
		queryClient.removeQueries();		
		localStorage.clear();
		// if (res) navigation(UTSRoutes.LOGINROUTE);	
		window.location.reload()
	};

	// const getDashboardCountHandler = useCallback(async () => {
	// 	const response = await MasterDAO.getDashboardCountForEngagementDAO();
	// 	setDashboardCount(response && response.responseBody?.details);
	// }, []);

	// useEffect(() => {
	// 	getDashboardCountHandler();
	// }, [getDashboardCountHandler]);


	const items = [
		{
		  key: '1',
		  label: (
			<Link  to="/changepassword">
			  Change Password
			</Link>
		  ),
		},
	
		
	  ];
	return (
		<div className={navbarStyles.navbarContainer}>
			<nav className={navbarStyles.nav}>
				<div
					id="logo"
					className={navbarStyles.navHeading}>
					<Link to={UTSRoutes.ALLHIRINGREQUESTROUTE}>
						<img
							alt="logo"
							className={navbarStyles.uplersTalentLogo}
							// src="https://staging.project-progress.net/html/uplers-talent-solutions/images/login-logo.svg"
							src={UTSLogoSVG}
						/>
					</Link>
					{/* <div className={navbarStyles.activeTalent}>
						<span className={navbarStyles.talentIndicator}></span>
						<div>
							<b>
								{dashboardCount?.totalActiveEngagement}
								{dashboardCount && '/'}
								{dashboardCount?.totalEnagagement}
							</b>{' '}
							Opportunities Captured
						</div>
					</div> */}
				</div>
				<div className={navbarStyles.navlink}>
					{/* <Badge count={4}>
						<BellSVG
							style={{
								width: '30px',
								height: '30px',
								cursor: 'pointer',
							}}
						/>
					</Badge> */}
					<Dropdown menu={{ items }} placement="bottomLeft" arrow>
					<img
						src="https://www.w3schools.com/howto/img_avatar.png"
						className={navbarStyles.avatar}
						alt="avatar"
						style={{
							cursor: 'pointer',
						}}
					/>
					</Dropdown>
					<div className={navbarStyles.avatarDetails}>{fullName}</div>
					<Tooltip
						placement="bottom"
						// title="Logout"
						title={<span style={{ color: '#232323', fontWeight: '500' }}>Logout</span>}
						color={`var(--color-sunlight)`}>
						<LogoutSVG
							onClick={onLogoutHandler}
							style={{
								width: '24px',
								height: '24px',
								cursor: 'pointer',
							}}
						/>
					</Tooltip>
				</div>
			</nav>
		</div>
	);
};

export default Navbar;
