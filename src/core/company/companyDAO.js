import { CompanyAPI } from "apis/comanyAPI";
import { HTTPStatusCode } from "constants/network";
import UTSRoutes from "constants/routes";
import { UserSessionManagementController } from "modules/user/services/user_session_services";
import { Navigate } from "react-router-dom";
import { errorDebug } from "shared/utils/error_debug_utils";

export const allCompanyRequestDAO  = {
    getCompanyDetailDAO: async (ID) =>{
        try {            
            const allClientsResult = await CompanyAPI.getCompanyDetailsRequest(ID);
            if (allClientsResult) {
				const statusCode = allClientsResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = allClientsResult.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult.details,
					};
				} else if (
					statusCode === HTTPStatusCode.NOT_FOUND ||
					statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
				)
					return allClientsResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return allClientsResult;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					UserSessionManagementController.deleteAllSession();
					return (
						<Navigate
							replace
							to={UTSRoutes.LOGINROUTE}
						/>
					);
				}
			}
        } catch (error) {
            return errorDebug(error, 'allCompanyRequestDAO.getCompanyDetailDAO');
        }
    },
	uploadImageDAO: async (payload) =>{
        try {            
            const allClientsResult = await CompanyAPI.uploadImageRequest(payload);
            if (allClientsResult) {
				const statusCode = allClientsResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = allClientsResult.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult.details,
					};
				} else if (
					statusCode === HTTPStatusCode.NOT_FOUND ||
					statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
				)
					return allClientsResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return allClientsResult;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					UserSessionManagementController.deleteAllSession();
					return (
						<Navigate
							replace
							to={UTSRoutes.LOGINROUTE}
						/>
					);
				}
			}
        } catch (error) {
            return errorDebug(error, 'allCompanyRequestDAO.uploadImageDAO');
        }
    },
	deleteImageDAO: async (payload) =>{
        try {            
            const allClientsResult = await CompanyAPI.deleteCultureImageRequest(payload);
            if (allClientsResult) {
				const statusCode = allClientsResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = allClientsResult.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult.details,
					};
				} else if (
					statusCode === HTTPStatusCode.NOT_FOUND ||
					statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
				)
					return allClientsResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return allClientsResult;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					UserSessionManagementController.deleteAllSession();
					return (
						<Navigate
							replace
							to={UTSRoutes.LOGINROUTE}
						/>
					);
				}
			}
        } catch (error) {
            return errorDebug(error, 'allCompanyRequestDAO.deleteImageDAO');
        }
    },
	deleteYoutubeDetailsDAO: async (payload) =>{
        try {            
            const allClientsResult = await CompanyAPI.deleteYoutubeDetailsRequest(payload);
            if (allClientsResult) {
				const statusCode = allClientsResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = allClientsResult.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult.details,
					};
				} else if (
					statusCode === HTTPStatusCode.NOT_FOUND ||
					statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
				)
					return allClientsResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return allClientsResult;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					UserSessionManagementController.deleteAllSession();
					return (
						<Navigate
							replace
							to={UTSRoutes.LOGINROUTE}
						/>
					);
				}
			}
        } catch (error) {
            return errorDebug(error, 'allCompanyRequestDAO.deleteYoutubeDetailsDAO');
        }
    },
	updateCompanyDetailsDAO: async (payload) =>{
        try {            
            const allClientsResult = await CompanyAPI.updateCompanyDetailsRequest(payload);
            if (allClientsResult) {
				const statusCode = allClientsResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = allClientsResult.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult.details,
					};
				} else if (
					statusCode === HTTPStatusCode.NOT_FOUND ||
					statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
				)
					return allClientsResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return allClientsResult;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					UserSessionManagementController.deleteAllSession();
					return (
						<Navigate
							replace
							to={UTSRoutes.LOGINROUTE}
						/>
					);
				}
			}
        } catch (error) {
            return errorDebug(error, 'allCompanyRequestDAO.updateCompanyDetailsDAO');
        }
    },
	validateClientCompanyDAO: async (payload) =>{
        try {            
            const allClientsResult = await CompanyAPI.validateClientCompanyRequest(payload);
            if (allClientsResult) {
				const statusCode = allClientsResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = allClientsResult.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult.details,
					};
				} else if (
					statusCode === HTTPStatusCode.NOT_FOUND ||
					statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
				)
					return allClientsResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return allClientsResult;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					UserSessionManagementController.deleteAllSession();
					return (
						<Navigate
							replace
							to={UTSRoutes.LOGINROUTE}
						/>
					);
				}
			}
        } catch (error) {
            return errorDebug(error, 'allCompanyRequestDAO.updateCompanyDetailsDAO');
        }
    }
}