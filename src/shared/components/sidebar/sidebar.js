import { Link, useLocation } from 'react-router-dom';
import GridSVG from 'assets/svg/grid.svg';

import HR from 'assets/svg/hr.svg';
import Briefcase from 'assets/svg/briefcase.svg';
import Handshake from 'assets/svg/handshake.svg';

import SideBarModels from 'models/sidebar.model';
import sideBarStyles from './sidebar.module.css';
import UTSRoutes from 'constants/routes';
import { Tooltip } from 'antd';

const Sidebar = () => {
	const sidebarDataSets = getSideBar();
	const switchLocation = useLocation();

	let urlSplitter = `/${switchLocation.pathname.split('/')[1]}`;

	return (
		<div className={sideBarStyles.sidebar}>
			<div className={sideBarStyles.sidebarBody}>
				{sidebarDataSets?.map(({ navigateTo, icon, title }, index) => {
					return (
						<Tooltip
							placement="right"
							title={title}>
							<div
								className={sideBarStyles.sidebarItem}
								key={index}>
								<Link to={navigateTo}>
									<div className={sideBarStyles.iconSet}>
										<div
											className={`${sideBarStyles.sidebarIcon} ${
												switchLocation.pathname === navigateTo
													? sideBarStyles.active
													: ''
											}`}>
											<img
												src={icon}
												alt="mySvgImage"
											/>
										</div>
									</div>
								</Link>
								<div
									className={`${
										urlSplitter === navigateTo ? sideBarStyles.indicator : null
									}`}></div>
							</div>
						</Tooltip>
					);
				})}
			</div>
		</div>
	);
};

const getSideBar = () => {
	let dataList = [
		new SideBarModels({
			id: 'UTS_dashboard',
			title: 'Dashboard',
			isActive: true,
			icon: GridSVG,
			navigateTo: UTSRoutes.HOMEROUTE,
		}),
		new SideBarModels({
			id: 'UTS_DealList',
			title: 'Deal',
			isActive: false,
			icon: Handshake,
			navigateTo: UTSRoutes.DEALLISTROUTE,
		}),
		new SideBarModels({
			id: 'UTS_UserList',
			title: 'Users',
			isActive: false,
			icon: HR,
			navigateTo: UTSRoutes.USERLISTROUTE,
		}),
		new SideBarModels({
			id: 'UTS_all_hiring_request',
			title: 'HR',
			isActive: false,
			icon: Briefcase,
			navigateTo: UTSRoutes.ALLHIRINGREQUESTROUTE,
		}),

		new SideBarModels({
			id: 'UTS_Onboard',
			title: 'Onboard',
			isActive: false,
			icon: HR,
			navigateTo: UTSRoutes.ONBOARDROUTE,
		}),
	];
	return dataList;
};

export default Sidebar;
