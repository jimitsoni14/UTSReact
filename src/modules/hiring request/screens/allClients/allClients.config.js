import { Link } from "react-router-dom";
import clienthappinessSurveyStyles from "../../../survey/client_happiness_survey.module.css";
import { ReactComponent as PencilSVG } from 'assets/svg/pencil.svg';
export const allClientsConfig = {
    allClientsTypeConfig : (filterList) => {
        return [
			{
				label: 'Status',
				name: 'companyStatus',
				child: filterList?.ContactStatus,
				isSearch: false,
			},
			{
				label: 'GEO',
				name: 'geo',
				child: filterList?.Geo,
				isSearch: true,
			},
            {
                label: 'Adding Source',
				name: 'addingSource',
				child: filterList?.AddingSource,
				isSearch: false,
            },
            {
                label: 'Category',
				name: 'category',
				child: filterList?.CompanyCategory,
				isSearch: false,
            },
            {
                label: 'POC',
				name: 'poc',
				child: filterList?.POCList,
				isSearch: true,
            }            		
		];
    },
    tableConfig : () => {
        return [
            {
                title: '',
                dataIndex: 'Edit',
                key: 'edit',
                align: 'left',
				width: '60px',
                render:(_,result) => {
                    return (
                        <Link
                        to={`/editclient/${result.companyID}`}
                        style={{ color: 'black', textDecoration: 'underline' }}>
                        <PencilSVG />
                    </Link>
                    )
                }
            },
            
            {
                title: 'Added Date',
                dataIndex: 'addedDate',
                key: 'addedDate',
                width: '120px',
            },
            {
                title: 'Company',
                dataIndex: 'companyName',
                key: 'companyName',
                width: '210px',
                render: (text, result) => {
					return (
						<Link
							// to={`/viewClient/${result.companyID}~${result.clientID}`}
                            to={`/viewClient/${result.companyID}/${result.clientID}`}
							style={{
								color: `var(--uplers-black)`,
								textDecoration: 'underline',
							}}>
							{text}
						</Link>
					);
				},
            },
            {
                title: 'Client',
                dataIndex: 'clientName',
                key: 'clientName',
                width: '150px',
            },
            {
                title: 'Client Email',
                dataIndex: 'clientEmail',
                key: 'clientEmail',
                width: '200px',
            },
            {
                title: 'POC',
                dataIndex: 'poc',
                key: 'poc',
                width: '150px',
                // render: (text, result) => {
				// 	return (
				// 		<Link
				// 			to={`/allclients`}
				// 			style={{
				// 				color: `var(--uplers-black)`,
				// 				textDecoration: 'underline',
				// 			}}>
				// 			{text}
				// 		</Link>
				// 	);
				// },
            },
            {
                title: 'Geo',
                dataIndex: 'geo',
                key: 'geo',
                width: '100px',
            },
            {
                title: 'Status',
                dataIndex: 'status',
                key: 'status',
                width: '150px',
                render: (text,result) => {
					return (
						text && <span 
                         className={clienthappinessSurveyStyles.StatusOpportunity} 
                         style={{backgroundColor:`${result.statusColor}`}} >{text}</span>			
					);
				},
            }
          ]; 
    },
    ViewClienttableConfig : () => {
        return [
            // {
            //     title: '',
            //     dataIndex: '',
            //     key: '',
            // },
            {
                title: 'Created Date',
                dataIndex: 'createdDateTime',
                key: 'createdDateTime',
                render: (text, result) =>{                     
                    return (text.split('T')[0])
                },
            },
            {
                title: 'HR ID',
                dataIndex: 'hrNumber',
                key: 'hrNumber',
            },
            {
                title: 'TR',
                dataIndex: 'totalTR',
                key: 'totalTR',
            },
            {
                title: 'Position',
                dataIndex: 'position',
                key: 'position',
            },
            {
                title: 'Budget/Mo',
                dataIndex: 'cost',
                key: 'cost',
            },
            {
                title: 'Notice',
                dataIndex: 'notice',
                key: 'notice',
            },
            {
                title: 'FTE/PTE',
                dataIndex: 'ftE_PTE',
                key: 'ftE_PTE',
            },
            ]
    }
}